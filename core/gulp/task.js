import fs from 'fs'
import gulp from 'gulp'
import changed from 'gulp-changed'
import clean from 'gulp-clean'
import config from '../../config.js'
import {getBuildDir, getSrcDir} from '../tools.js'

export const clearBuild = done => {
    if (fs.existsSync(getBuildDir())) {
        return gulp.src(getBuildDir(), {read: false})
            .pipe(clean({force: true}))
    }
    done()
}

export const generateFonts = () =>
    gulp.src(getSrcDir('fonts/**/*'), {encoding: false, dot: true})
        .pipe(changed(getBuildDir('fonts/')))
        .pipe(gulp.dest(getBuildDir('fonts/')))

export const generateFiles = async () => {
    const tasks = [];

    for (const folder of config.FOLDER_COPY) {
        tasks.push(async () => {
            return new Promise((resolve, reject) => {
                gulp.src(getSrcDir(folder + '/**/*'), {encoding: false})
                    .pipe(changed(getBuildDir(folder + '/')))
                    .pipe(gulp.dest(getBuildDir(folder + '/')))
                    .on('end', resolve)
                    .on('error', reject);
            });
        });
    }

    await Promise.all(tasks.map(task => task()));
}

