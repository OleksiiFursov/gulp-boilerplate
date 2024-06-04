import gulp from 'gulp'
import Config from '../config.js'
import config from '../config.js'
// HTML
import fileInclude from 'gulp-file-include'
import htmlClean from 'gulp-htmlclean'
import webpHTML from 'gulp-webp-html'
import webpackConfig from '../webpack.config.js'
// SASS
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'

const sass = gulpSass(dartSass)
import sassGlob from 'gulp-sass-glob'

import fs from 'fs'
import sourceMaps from 'gulp-sourcemaps'
import plumber from 'gulp-plumber'
import webpack from 'webpack-stream'
import babel from 'gulp-babel'
import changed from 'gulp-changed'

// Images
import imagemin from 'gulp-imagemin'
import webp from 'gulp-webp'
import cssnano from 'gulp-cssnano'
import gulpIf from 'gulp-if'
import { getBuildDir, getConfig, getSrcDir, plumberNotify } from './tools.js'
import {
	clearBuild,
	generateFavicon,
	generateFiles,
	generateFonts,
	movePWA,
} from './task.js'

gulp.task('clean:build', clearBuild)
gulp.task('fonts:build', generateFonts)
gulp.task('pwa:build', movePWA)
gulp.task('files:build', generateFiles)
gulp.task('html:build', async () =>
  gulp.src([
	  getSrcDir('html/**/*.html'),
	  '!' + getSrcDir('/html/part/*.html'),
	  '!' + getSrcDir('html/blocks/*.html'),
	  '!' + getSrcDir('/html/blocks/**/*.html'),
	  '!' + getSrcDir('/html/pages/**/*.html'),
  ])
      .pipe(changed(getBuildDir()))
      .pipe(plumber(plumberNotify('HTML')))
      .pipe(fileInclude({ context: await getConfig() }))
      .pipe(htmlClean())
      .pipe(webpHTML())
      .pipe(gulp.dest(getBuildDir())),
)

gulp.task('sass:build', () =>
  gulp.src(getSrcDir('scss/*.scss'))
      .pipe(changed(getBuildDir('css/')))
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest(getBuildDir('css/'))),
)

gulp.task('images:build', () =>
  gulp.src(getSrcDir('img/**/*'), { encoding: false })
      .pipe(changed(getBuildDir('img/')))
      .pipe(webp())
      .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest(getBuildDir('img/'))),
)

gulp.task('js:build', () =>
  gulp.src(getSrcDir('js/*.js'))
      .pipe(changed(getBuildDir('js/')))
      .pipe(plumber(plumberNotify('JS')))
      .pipe(babel())
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest(getBuildDir('js/'))),
);

gulp.task('generate-favicon', generateFavicon)

