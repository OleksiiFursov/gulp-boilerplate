import fs from 'fs'
import gulp from 'gulp'
import changed from 'gulp-changed'
import clean from 'gulp-clean'
import {getBuildDir, getSrcDir} from './tools.js'

export const clearBuild = done => {
    if (fs.existsSync(getBuildDir())) {
        return gulp
            .src(getBuildDir(), {read: false})
            .pipe(clean({force: true}))
    }
    done()
}
export const generateFonts = () =>
    gulp.src(getSrcDir('fonts/**/*'))
        .pipe(changed(getBuildDir('fonts/')))
        .pipe(gulp.dest(getBuildDir('fonts/')))

export const generateFiles = () =>
    gulp.src(getSrcDir('files/**/*'))
        .pipe(changed(getBuildDir('files/')))
        .pipe(gulp.dest(getBuildDir('files/')))

export const generatePWA = () =>
    gulp.src([getSrcDir('*.png'), getSrcDir('*.ico'), getSrcDir('*.webmanifest'), getSrcDir('**/*.htaccess')])
        .pipe(changed(getBuildDir()))
        .pipe(gulp.dest(getBuildDir()))

