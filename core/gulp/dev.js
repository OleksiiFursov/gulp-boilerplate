import {task, src, watch, series, dest} from 'gulp'
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


task('clean:dev', clearBuild)

const server = browserSync.create()
task('html:dev', async () =>
  src(getHtmlSrc())
      .pipe(plumber(plumberNotify('HTML')))
      .pipe(fileInclude({ context: await getConfig() }))
      .pipe(dest(getBuildDir()))
      .pipe(server.stream())
)

task('fonts:dev', generateFonts)
task('files:dev', generateFiles)
task('sass:dev', () =>
  src(getSrcDir('scss/*.scss'))
      .pipe(changed(getBuildDir('css/')))
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
	  .pipe(sync(sass))
      .pipe(sourceMaps.write())
      .pipe(dest(getBuildDir('css/')))
      .pipe(server.stream()),
)

task('images:dev', () =>
  src(getSrcDir('img/**/*'), { encoding: false })
      .pipe(changed(getBuildDir('img/')))
      .pipe(dest(getBuildDir('img/')))
      .pipe(server.stream()),
)

task('js:dev', () =>
  src(getSrcDir('/js/*.js'))
      .pipe(changed(getBuildDir('js/')))
      .pipe(plumber(plumberNotify('JS')))
      .pipe(dest(getBuildDir('js/')))
      .pipe(esBuild({
	      outfile: 'index.js',
	      bundle: true,
	      minify: true,
	      sourcemap: true,
	      target: 'es2015',
	      outdir: getBuildDir('js')
      }))
      .pipe(server.stream()),
)

task('serve:dev', async () => {
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

	watch(getSrcDir('scss/**/*.scss'), series('sass:dev'))
	watch(getSrcDir('html/**/*.html'), series('html:dev')).on('change', server.reload)
	watch(getSrcDir('img/**/*'), series('images:dev')).on('change', server.reload)
	watch(getSrcDir('fonts/**/*'), series('fonts:dev')).on('change', server.reload)
	watch(getSrcDir('**/*.js'), series('js:dev')).on('change', server.reload)
	watch('./*.js', series('html:dev')).on('change', server.reload)
})

