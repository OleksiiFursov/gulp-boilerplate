import gulp from 'gulp'
import babel from 'gulp-babel'
import changed from 'gulp-changed'
import cssnano from 'gulp-cssnano'
// HTML
import fileInclude from 'gulp-file-include'
import htmlClean from 'gulp-htmlclean'
import gulpIf from 'gulp-if'

// Images
import imagemin from 'gulp-imagemin'
import plumber from 'gulp-plumber'
import sassGlob from 'gulp-sass-glob'
import sourceMaps from 'gulp-sourcemaps'
import webp from 'gulp-webp'
import webpHTML from 'gulp-webp-html'
// SASS
import webpack from 'webpack-stream'
import webpackConfig from '../webpack.config.js'
import {
	clearBuild,
	generateFiles,
	generateFonts
} from './task.js'

import { getBuildDir, getConfig, getHtmlSrc, getSrcDir, plumberNotify } from './tools.js'

import { sassAsync  } from "gulp5-sass-plugin";
import mediaQuery from 'gulp-group-css-media-queries';


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
console.log(1, sassAsync())
gulp.task('sass:build', () =>
  gulp.src(getSrcDir('scss/*.scss'))
      .pipe(changed(getBuildDir('css/')))
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sassAsync())
	  .pipe(mediaQuery())
    //  .pipe(sourceMaps.write('.'))
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest(getBuildDir('css/')))
)

gulp.task('images:build', () =>
  gulp.src(getSrcDir('img/**/*'), { encoding: false })
      .pipe(changed(getBuildDir('img/')))
      .pipe(gulpIf(file =>  file.extname !== '.svg', webp()))
      .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest(getBuildDir('img/')))
)

gulp.task('js:build', () =>
  gulp.src(getSrcDir('js/*.js'))
      .pipe(changed(getBuildDir('js/')))
      .pipe(plumber(plumberNotify('JS')))
      .pipe(babel())
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest(getBuildDir('js/'))),
);



