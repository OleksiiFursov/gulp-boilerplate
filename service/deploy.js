import SFTPClient from "ssh2-sftp-client";
import fs from "fs/promises";
import path from "path";
import config from "../config.js";
import {getBuildDir} from "../core/tools.js";
import {colorLog, makeSize} from "./utils.js";
import pLimit from 'p-limit';


// Конфигурация
const {HOST, USER, PASSWORD, REMOTE_DIR, PORT = 22, INCLUDED_DIR, INCLUDED_FILE, LIMIT = 3} = config.SFTP;

const limit = pLimit(LIMIT);


const stats = {
    uploaded: 0,
    uploadSize: 0,
    skip: 0
}

const FOLDER_BUILD_NORMALIZE = config.FOLDER_BUILD.replace(/^\.\//, '')

async function uploadDirectory(client, localDir, remoteDir) {

    if (INCLUDED_DIR !== 'all') {
        if (!INCLUDED_DIR(localDir.replace(FOLDER_BUILD_NORMALIZE + '\\', ''))) {
            return 0;
        }
    }
    await ensureRemoteDir(client, remoteDir);

    const files = await fs.readdir(localDir, {withFileTypes: true});

    const uploadPromises = [];

    for (const file of files) {
        const localPath = path.join(localDir, file.name);
        const remotePath = `${remoteDir}/${file.name}`;

        if (file.isDirectory()) {
            await uploadDirectory(client, localPath, remotePath);
        } else {
            if(INCLUDED_FILE !== 'all'){
                if (!INCLUDED_FILE(localPath.replace(FOLDER_BUILD_NORMALIZE + '\\', ''))) {
                    continue;
                }
            }
            const fileExists = await remoteFileExists(client, remotePath);
            if (fileExists) {

                const shouldUpload = await shouldUploadFile(client, localPath, remotePath);
                if (!shouldUpload) {
                    stats.skip++;
                    console.log(`File skipped: ${file.name}`);
                    continue;
                }
            }
            stats.uploaded++;
            colorLog('green', `Uploading file: ${file.name}`);

            // Ограничиваем параллельные загрузки
            uploadPromises.push(limit(() => client.fastPut(localPath, remotePath)));
        }
    }

    // Ждем, пока все файлы будут загружены
    await Promise.all(uploadPromises);
}

async function ensureRemoteDir(client, dir) {
    const parts = dir.split("/");
    let currentPath = "";

    for (const part of parts) {
        if (!part) continue;
        currentPath += `/${part}`;
        try {
            await client.mkdir(currentPath, true);
        } catch (err) {
            if (err.code !== 4) {
                colorLog('red', `Deployment: Error create folder ${currentPath}:`, err);
                throw err;
            }
        }
    }
}

async function remoteFileExists(client, remotePath) {
    try {
        await client.stat(remotePath);
        return true;
    } catch {
        return false;
    }
}

async function shouldUploadFile(client, localPath, remotePath) {
    try {
        const localStats = await fs.stat(localPath);
        const remoteStats = await client.stat(remotePath);
        const isNew = localStats.size !== remoteStats.size ||
            localStats.mtime > new Date(remoteStats.mtime);

        if (isNew) {
            stats.uploadSize += localStats.size;
        }
        return isNew;
    } catch (err) {
        colorLog('red', `Deployment: Error check file ${remotePath}:`, err);
        return true;
    }
}


async function main() {
    const client = new SFTPClient();
    try {


        await client.connect({
            host: HOST,
            port: PORT,
            username: USER,
            password: PASSWORD,
        });


        await uploadDirectory(client, getBuildDir(), REMOTE_DIR);

        colorLog('green', '\nUploaded files:', stats.uploaded, '(' + makeSize(stats.uploadSize) + ')');
        colorLog('cyan', `Skipped files:`, stats.skip)
        if(typeof INCLUDED_FILE === 'function'){
            colorLog('yellow', `INCLUDED FILES:`, 'use filter')
        }
        if(typeof INCLUDED_DIR === 'function'){
            colorLog('yellow', `INCLUDED DIRS:`, 'use filter')
        }

    } catch (err) {
        colorLog('red', "Deployment error:", err);
    } finally {
        await client.end();
    }
}

setTimeout(main, 10);
