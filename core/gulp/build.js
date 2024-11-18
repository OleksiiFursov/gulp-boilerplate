import gulp from 'gulp'
import changed from 'gulp-changed'
import cssnano from 'gulp-cssnano'
// HTML
import fileInclude from 'gulp-file-include'
import htmlClean from 'gulp-htmlclean'
import gulpIf from 'gulp-if'

// Images
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import sourceMaps from 'gulp-sourcemaps'
import webp from 'imagemin-webp'
import webpHTML from 'gulp-webp-html'

// SASS
import * as sass from 'sass';
import { sync } from '@lmcd/gulp-dartsass';
import mediaQuery from 'gulp-group-css-media-queries';


import {
	clearBuild,
	generateFiles,
	generateFonts
} from './task.js'

import { getBuildDir, getConfig, getHtmlSrc, getSrcDir, plumberNotify } from '../tools.js'




gulp.task('clean:build', clearBuild)
gulp.task('fonts:build', generateFonts)

gulp.task('files:build', generateFiles)
gulp.task('html:build', async () =>
  gulp.src(getHtmlSrc())
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
	  .pipe(sync(sass))
	  .pipe(mediaQuery())
      .pipe(sourceMaps.write('.'))
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest(getBuildDir('css/')))
)

gulp.task('images:build', () =>
  gulp.src(getSrcDir('img/**/*'), { encoding: false })
      .pipe(changed(getBuildDir('img/')))
      .pipe(imagemin([
	      webp({ quality: 50 })
      ]))
      .pipe(gulp.dest(getBuildDir('img/')))
)

gulp.task('js:build', () =>
  gulp.src(getSrcDir('js/*.js'))
      .pipe(changed(getBuildDir('js/')))
      .pipe(plumber(plumberNotify('JS')))
      .pipe(gulp.dest(getBuildDir('js/'))),
);



