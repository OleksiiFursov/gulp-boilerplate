import fs from 'fs'
import gulp from 'gulp'
import changed from 'gulp-changed'
import clean from 'gulp-clean'
import {getBuildDir} from './tools.js'

export const clearBuild = done => {
	if (fs.existsSync(getBuildDir())) {
		return gulp
		.src(getBuildDir(), { read: false })
		.pipe(clean({ force: true }))
	}
	done()
}
// '!./src/html/part/*.html', '!./src/html/blocks/*.html'


export const generateFonts = () =>
  gulp.src('./src/fonts/**/*')
      .pipe(changed(getBuildDir('fonts/')))
      .pipe(gulp.dest(getBuildDir('fonts/')))

export const generateFiles = () =>
  gulp.src('./src/files/**/*')
      .pipe(changed(getBuildDir('files/')))
      .pipe(gulp.dest(getBuildDir('files/')))

export const generatePWA = () =>
  gulp.src(['./src/*.png', './src/*.ico', './src/*.webmanifest'])
      .pipe(changed(getBuildDir()))
      .pipe(gulp.dest(getBuildDir()))

