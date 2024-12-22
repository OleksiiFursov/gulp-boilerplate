import fs from 'fs'
import {dest, src, task} from 'gulp'
import favicons from 'favicons'
import changed from 'gulp-changed'
import clean from 'gulp-clean'

import config from '../../config.js'
import {getBuildDir, getSrcDir} from '../tools.js'


task('clean', done => {
    if (fs.existsSync(getBuildDir())) {
        return src(getBuildDir(), {read: false})
            .pipe(clean({force: true}))
    }
    done()
})
task('fonts', () => src(getSrcDir('fonts/**/*'), {encoding: false, dot: true})
    .pipe(changed(getBuildDir('fonts/')))
    .pipe(dest(getBuildDir('fonts/'))))
task('files', async () => {
    const tasks = [];
    const folders = config.FOLDER_COPY
    if (config.PWA && !fs.existsSync(getSrcDir('pwa'))) {
        folders.push('pwa');
        await new Promise((resolve, reject) => {
            task('generate-favicon')(resolve, reject);
        });
    }


    for (const folder of folders) {
        tasks.push(() => {
            return new Promise((resolve, reject) => {
                src(getSrcDir(folder + '/**/*'), {encoding: false})
                    .pipe(dest(getBuildDir(folder + '/')))
                    .on('end', resolve)
                    .on('error', reject);
            });
        });
    }
    await Promise.all(tasks.map(task => task()));
})
task('generate-favicon', async (done, reject) => {
    const logoPath = getSrcDir('img/cf-favicon.png')
    const configuration = {
        path: config.URL + '/pwa',
        appName: config.COMPANY_NAME,
        lang: config.LANG,
        appShortName: config.COMPANY_NAME_SHORT,
        appDescription: config.COMPANY_DESCRIPTION,
        background: config.THEME_BACKGROUND,
        theme_color: config.THEME_COLOR,
        display: config.PWA_DISPLAY,
        orientation: config.PWA_ORIENTATION,
        start_url: config.PWA_START_URL,
        appleStatusBarStyle: config.PWA_APPLE_STATUS_BAR,
        version: config.VERSION,
        icons: {
            android: true, appleIcon: true, favicons: true, windows: true
        },

    }
    if (fs.existsSync(logoPath)) {

        try {
            fs.mkdirSync(getSrcDir('pwa'))

            const {
                images, files, html,
            } = await favicons(logoPath, configuration)
            images.forEach(image => {
                fs.writeFileSync(`${getSrcDir('pwa')}/${image.name}`, image.contents)
            })
            files.forEach(file => {
                fs.writeFileSync(`${getSrcDir('pwa')}/${file.name}`, file.contents)
            })

            fs.writeFileSync(getSrcDir('html/part/pwa.html'), html.join('\n'))
            done();
        } catch (error) {
            reject()
            console.log(error.message)
        }

    } else {
        done()
    }
})
