import gulp from 'gulp'
import browserSync from 'browser-sync'
import fs from 'fs'
import changed from 'gulp-changed'
import fileInclude from 'gulp-file-include'
import plumber from 'gulp-plumber'
import sassGlob from 'gulp-sass-glob'
import sourceMaps from 'gulp-sourcemaps'
import path from 'path'
import config from '../../config.js'
import { sync } from '@lmcd/gulp-dartsass';
import {
	clearBuild,
	generateFiles,
	generateFonts,
} from './task.js'
import { getBuildDir, getConfig, getHtmlSrc, getSrcDir, plumberNotify } from '../tools.js'
import * as sass from 'sass';
import esBuild from 'gulp-esbuild';


gulp.task('clean:dev', clearBuild)

const server = browserSync.create()
gulp.task('html:dev', async () =>
  gulp.src(getHtmlSrc())
      .pipe(plumber(plumberNotify('HTML')))
      .pipe(fileInclude({ context: await getConfig() }))
      .pipe(gulp.dest(getBuildDir()))
      .pipe(server.stream())
)

gulp.task('fonts:dev', generateFonts)
gulp.task('files:dev', generateFiles)
gulp.task('sass:dev', () =>
  gulp.src(getSrcDir('scss/*.scss'))
      .pipe(changed(getBuildDir('css/')))
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
	  .pipe(sync(sass))
      .pipe(sourceMaps.write())
      .pipe(gulp.dest(getBuildDir('css/')))
      .pipe(server.stream()),
)

gulp.task('images:dev', () =>
  gulp.src(getSrcDir('img/**/*'), { encoding: false })
      .pipe(changed(getBuildDir('img/')))
      .pipe(gulp.dest(getBuildDir('img/')))
      .pipe(server.stream()),
)

gulp.task('js:dev', () =>
  gulp.src(getSrcDir('/js/*.js'))
      .pipe(changed(getBuildDir('js/')))
      .pipe(plumber(plumberNotify('JS')))
      .pipe(gulp.dest(getBuildDir('js/')))
      .pipe(esBuild({
	      outfile: 'index.js',
	      bundle: true,
	      minify: true,
	      sourcemap: true,
	      target: 'es2015'
      }))
      .pipe(server.stream()),
)

gulp.task('serve:dev', async () => {
	const options = {
		server: {
			baseDir: getBuildDir(),
		},
		port: config.PORT,
		open: config.SERVER_OPEN,
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

	gulp.watch(getSrcDir('scss/**/*.scss'), gulp.series('sass:dev'))
	gulp.watch(getSrcDir('html/**/*.html'), gulp.series('html:dev')).on('change', server.reload)
	gulp.watch(getSrcDir('img/**/*'), gulp.series('images:dev')).on('change', server.reload)
	gulp.watch(getSrcDir('fonts/**/*'), gulp.series('fonts:dev')).on('change', server.reload)
	gulp.watch(getSrcDir('**/*.js'), gulp.series('js:dev')).on('change', server.reload)
	gulp.watch('./*.js', gulp.series('html:dev')).on('change', server.reload)
})

