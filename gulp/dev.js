import gulp from 'gulp'
import fs from 'fs'
import sass from 'gulp-sass'
import path from 'path'
import * as dartSass from 'sass'
import sassGlob from 'gulp-sass-glob'
import browserSync from 'browser-sync'
import sourceMaps from 'gulp-sourcemaps'
import plumber from 'gulp-plumber'
import changed from 'gulp-changed'

import {clearBuild, generateFiles, generateFonts} from './task.js'
import { getBuildDir, plumberNotify } from './tools.js'
import fileInclude from "gulp-file-include";

const sassCompiler = sass(dartSass)
const server = browserSync.create()

gulp.task('clean:dev', clearBuild)
gulp.task('html:dev',  async ()=> {
	const {default: config} = await import(`../config.js?v=${Date.now()}`);

	return gulp.src(['./src/html/**/*.html'])
		.pipe(plumber(plumberNotify('HTML')))
		.pipe(fileInclude({context: config}))
		.pipe(gulp.dest(getBuildDir()))
		.pipe(server.stream())
});

gulp.task('fonts:dev', generateFonts)
gulp.task('files:dev', generateFiles)

gulp.task('sass:dev', () =>
  gulp.src('./src/scss/*.scss')
      .pipe(changed(getBuildDir('css/')))
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sassCompiler())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest(getBuildDir('css/')))
      .pipe(server.stream()),
)

gulp.task('images:dev', () =>
  gulp.src('./src/img/**/*')
      .pipe(changed(getBuildDir('img/')))
      .pipe(gulp.dest(getBuildDir('img/')))
      .pipe(server.stream()),
)

gulp.task('pwa:dev', () =>
  gulp.src(['./src/*.png', './src/*.ico'])
      .pipe(changed(getBuildDir()))
      .pipe(gulp.dest(getBuildDir()))
      .pipe(server.stream()),
)

gulp.task('js:dev', () =>
  gulp.src('./src/js/*.js')
      .pipe(changed(getBuildDir('js/')))
      .pipe(plumber(plumberNotify('JS')))
      .pipe(gulp.dest(getBuildDir('js/')))
      .pipe(server.stream()),
)

gulp.task('serve:dev', async  () => {

	const { default: config } = await import(`../config.js`);

	const options = {
		server: {
			baseDir: getBuildDir(),
		},
		port: config.PORT,
		open: false,//'external',
		https: config.HTTPS,
		tunnel: config.TUNNEL,
		notify: false,

	}
	const CERT_DIR = path.join(process.cwd(), 'ssl')
	if (fs.existsSync(CERT_DIR) && fs.existsSync(path.join(CERT_DIR, 'key.key')) && fs.existsSync(path.join(CERT_DIR, 'cert.crt'))) {
		options.https = {
			key: path.join(CERT_DIR, 'key.key'),
			cert: path.join(CERT_DIR, 'cert.crt'),
		}
	}

	server.init(options)

	gulp.watch('./src/scss/**/*.scss', gulp.series('sass:dev'))
	gulp.watch('./src/html/**/*.html', gulp.series('html:dev'))
	gulp.watch('./src/img/**/*', gulp.series('images:dev')).on('change', server.reload)
	gulp.watch('./src/fonts/**/*', gulp.series('fonts:dev')).on('change', server.reload)
	gulp.watch('./src/**/*.js', gulp.series('js:dev')).on('change', server.reload)
	gulp.watch('./*.js', gulp.series('html:dev')).on('change', server.reload)
})

