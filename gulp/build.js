import gulp from 'gulp'
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

import clean from 'gulp-clean'
import fs from 'fs'
import sourceMaps from 'gulp-sourcemaps'
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'
import webpack from 'webpack-stream'
import babel from 'gulp-babel'
import changed from 'gulp-changed'

// Images
import imagemin from 'gulp-imagemin'
import webp from 'gulp-webp'
import cssnano from 'gulp-cssnano'
import gulpIf from 'gulp-if'
import realFavicon from 'gulp-real-favicon'
import { clearBuild } from './task.js'
import { getBuildDir, getSrcDir, plumberNotify } from './tools.js'

gulp.task('clean:build', clearBuild)

gulp.task('html:build', function () {
	return gulp
	.src([getSrcDir('html/**/*.html'),
		...['part/*.html', 'blocks/*.html', 'blocks/**/*.html'].map(v => "!"+getSrcDir('html/'+ v))
	])
	.pipe(changed(getBuildDir()))
	.pipe(plumber(plumberNotify('HTML')))
	.pipe(fileInclude(fileIncludeSetting))
	.pipe(htmlClean())
	.pipe(webpHTML())
	.pipe(gulp.dest(getBuildDir()))
})

gulp.task('sass:build', () =>
  gulp.src('./src/scss/*.scss')
      .pipe(changed(getBuildDir('css/')))
      .pipe(plumber(plumberNotify('SCSS')))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(sourceMaps.write())
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest(getBuildDir('css/'))),
)

gulp.task('images:build', function () {
	return gulp
	.src('./src/img/**/*')
	.pipe(changed(`./${config.FOLDER_BUILD}/img/`))
	// .pipe(webp())
	.pipe(gulp.dest(`./${config.FOLDER_BUILD}/img/`))
	.pipe(gulp.src('./src/img/**/*'))
	.pipe(changed(`./${config.FOLDER_BUILD}/img/`))
	.pipe(imagemin({ verbose: true }))
	.pipe(gulp.dest(`./${config.FOLDER_BUILD}/img/`))
})

gulp.task('fonts:build', function () {
	return gulp
	.src('./src/fonts/**/*')
	.pipe(changed(`./${config.FOLDER_BUILD}/fonts/`))
	.pipe(gulp.dest(`./${config.FOLDER_BUILD}/fonts/`))
})

gulp.task('pwa:build', function () {
	return gulp
	.src(['./src/*.png', './src/*.ico', './src/*.webmanifest', './src/**/*.htaccess'])
	.pipe(changed(getBuildDir()))
	.pipe(gulp.dest(getBuildDir()))
})

gulp.task('files:build', function () {
	return gulp
	.src('./src/files/**/*')
	.pipe(changed(`./${config.FOLDER_BUILD}/files/`))
	.pipe(gulp.dest(`./${config.FOLDER_BUILD}/files/`))
})

gulp.task('generate-webmanifest', function (done) {
	const manifest = {
		'name': config.COMPANY_NAME,
		'short_name': config.COMPANY_NAME_SHORT,
		'description': config.COMPANY_DESCRIPTION,
		'start_url': '/index.html',
		'display': 'standalone',
		'background_color': config.THEME_BACKGROUND,
		'theme_color': config.THEME_COLOR,
		'icons': [
			{
				'src': '/icons/icon-192x192.png',
				'sizes': '192x192',
				'type': 'image/png',
			},
			{
				'src': '/icons/icon-512x512.png',
				'sizes': '512x512',
				'type': 'image/png',
			},
		],
	}

	fs.writeFileSync('./build/site.webmanifest', JSON.stringify(manifest, null, 2))
	done()
})

const FAVICON_DATA_FILE = 'faviconData.json'
gulp.task('generate-favicon', function (done) {
	realFavicon.generateFavicon({
		masterPicture: './src/img/logo.png', // Ваш логотип
		dest: './build/icons',
		iconsPath: '/icons',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '14%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: true,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true,
				},
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false,
					},
				},
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					name: 'My Progressive Web App',
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true,
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: true,
				},
			},
			safariPinnedTab: {
				pictureAspect: 'blackAndWhite',
				threshold: 60,
				themeColor: '#5bbad5',
			},
		},
		settings: {
			compression: 3,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false,
		},
		markupFile: FAVICON_DATA_FILE,
	}, function () {
		done()
	})
})

// Задача для вставки ссылок на favicons в HTML
gulp.task('inject-favicon-markups', function () {
	return gulp.src(['./src/html/**/*.html'])
	           .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
	           .pipe(gulp.dest(getBuildDir()))
})

// Задача для проверки обновлений у RealFaviconGenerator
gulp.task('check-for-favicon-update', function (done) {
	const currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version
	realFavicon.checkForUpdates(currentVersion, function (err) {
		if (err) {
			throw err
		}
	})
	done()
})

gulp.task('js:build', () =>
  gulp.src(getSrcDir('/js/*.js'))
      .pipe(changed(getBuildDir('js/')))
      .pipe(plumber(plumberNotify('JS')))
      .pipe(babel())
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest(getBuildDir('js/')))
)

