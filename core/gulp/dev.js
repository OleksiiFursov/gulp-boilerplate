import { exec } from 'child_process'
import gulpSass from 'gulp-sass'
import util from 'util'
import fs from 'fs'
import { task, src, watch, dest, series} from 'gulp'
import browserSync from 'browser-sync'
import changed from 'gulp-changed'
import fileInclude from 'gulp-file-include'
import sourceMaps from 'gulp-sourcemaps'
import config from '../../config.js'
import * as sass from 'sass'
import {
	getBuildDir,
	getConfig,
	getHtmlSrc,
	getSrcDir,
	pathSSL,
	plumberNotify,
} from '../tools.js'
import esBuild from 'gulp-esbuild'

const server = browserSync.create()

task('html:dev', async () =>
  src(getHtmlSrc())
  .pipe(plumberNotify('HTML'))
  .pipe(fileInclude({ context: await getConfig() }))
  .pipe(dest(getBuildDir()))
  .pipe(server.stream()),
)

task('sass:dev', () =>
  src(getSrcDir('scss/*.scss'))
  .pipe(plumberNotify('SCSS'))
  .pipe(sourceMaps.init())
  .pipe(gulpSass(sass))
  .pipe(sourceMaps.write('.'))
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
  src(getSrcDir('/js/index.js'))
  .pipe(plumberNotify('JS'))
  .pipe(esBuild({
	  outfile: 'index.js',
	  bundle: true,
	  sourcemap: true,
	  format: 'iife',
	  target: 'es6',
	  charset: 'utf8',
	  define: { 'process.env.NODE_ENV': '"development"' },
  }))
  .pipe(dest(getBuildDir('js/')))
  .pipe(server.stream()),
)

const execPromise = util.promisify(exec)
task('serve:dev', async () => {

	if (config.GENERATE_SSL && !fs.existsSync(pathSSL(''))) {
		try {
			await execPromise('npm run generate-certificates', { stdio: 'inherit' })
		} catch (error) {
			console.error('Error generating certificates:', error)
		}
	}

	const options = {
		server: {
			baseDir: getBuildDir(),
		},
		port: config.PORT,
		open: config.SERVER_OPEN,
		https: config.HTTPS,
		tunnel: config.TUNNEL,
		notify: false,
		logPrefix: 'СrossFoxGulp',
		ghostMode: config.GHOSTMODE,
		// rewriteRules: [
		// 	{
		// 		match: /test/g,
		// 		fn: function (req, res, match) {
		// 			console.log(req, res, match);
		// 			return 'https://google.com';
		// 		}
		// 	}
		// ],
		// callbacks: {
		// 	ready: function(err, bs) {
		//
		// 		bs.addMiddleware("*", function (req, res) {
		// 			console.log(4445);
		// 			res.end()
		// 		});
		// 	}
		// }

	}

	let attempts = 50

	const timer = setInterval(() => {

		if (config.GENERATE_SSL && !fs.existsSync(config.SSL.key)) {
			attempts--
			if (attempts > 0) return

		} else {
			if (config.HTTPS && config.SSL) {
				options.https = {
					key: config.SSL.key,
					cert: config.SSL.cert,
				}
			}
		}

		server.init(options)

		watch(getSrcDir('scss/**/*.scss'), task('sass:dev'))
		watch(getSrcDir('html/**/*.html'), task('html:dev')).on('change', server.reload)
		watch([getSrcDir('img/**/*'), `!${getSrcDir('img/cf-favicon.png')}`], task('images:dev')).on('change', server.reload)
		watch(getSrcDir('fonts/**/*'), task('fonts:dev')).on('change', server.reload)
		watch(getSrcDir('/js/**/*.js'), task('js:dev'))
		watch(getSrcDir('img/cf-favicon.png'), series('generate-favicon', 'files')).on('change', ()=>{setTimeout(server.reload, 4000)})
		watch('./config.js', task('html:dev')).on('change', server.reload)
		clearInterval(timer)
	}, 1000 / attempts)
})

