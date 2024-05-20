import gulp from 'gulp';

// HTML
import fileInclude from 'gulp-file-include';
import htmlClean from 'gulp-htmlclean';
import webpHTML from 'gulp-webp-html';
import webpackConfig from '../webpack.config.js';
// SASS
import  * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sassGlob from 'gulp-sass-glob';

import clean from 'gulp-clean';
import fs from 'fs';
import sourceMaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import webpack from 'webpack-stream';
import babel from 'gulp-babel';
import changed from 'gulp-changed';

// Images
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import cssnano from 'gulp-cssnano';
import gulpIf from 'gulp-if';

gulp.task('clean:build', function (done) {
	if (fs.existsSync('./build/')) {
		return gulp
		.src('./build/', { read: false })
		.pipe(clean({ force: true }));
	}
	done();
});

const fileIncludeSetting = {
	prefix: '@@',
	basepath: '@file',
};

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
};

gulp.task('html:build', function () {
	return gulp
	.src(['./src/html/**/*.html', '!./src/html/part/*.html', '!./src/html/blocks/*.html', '!./src/html/blocks/**/*.html', '!./src/html/pages/**/*.html'])
	.pipe(changed('./build/'))
	.pipe(plumber(plumberNotify('HTML')))
	.pipe(fileInclude(fileIncludeSetting))
	.pipe(htmlClean())
	// .pipe(webpHTML())
	.pipe(gulp.dest('./build/'));
});

gulp.task('sass:build', function () {
	return gulp
	.src('./src/scss/*.scss')
	.pipe(changed('./build/css/'))
	.pipe(plumber(plumberNotify('SCSS')))
	.pipe(sourceMaps.init())
	.pipe(sassGlob())
	.pipe(sass())
	.pipe(sourceMaps.write())
	.pipe(gulpIf('*.css', cssnano()))
	.pipe(gulp.dest('./build/css/'));
});

gulp.task('images:build', function () {
	return gulp
	.src('./src/img/**/*')
	.pipe(changed('./build/img/'))
	// .pipe(webp())
	.pipe(gulp.dest('./build/img/'))
	.pipe(gulp.src('./src/img/**/*'))
	.pipe(changed('./build/img/'))
	.pipe(imagemin({ verbose: true }))
	.pipe(gulp.dest('./build/img/'));
});

gulp.task('fonts:build', function () {
	return gulp
	.src('./src/fonts/**/*')
	.pipe(changed('./build/fonts/'))
	.pipe(gulp.dest('./build/fonts/'));
});

gulp.task('pwa:build', function () {
	return gulp
	.src(['./src/*.png', './src/*.ico', './src/*.webmanifest', './src/**/*.htaccess'])
	.pipe(changed('./build/'))
	.pipe(gulp.dest('./build/'));
});

gulp.task('files:build', function () {
	return gulp
	.src('./src/files/**/*')
	.pipe(changed('./build/files/'))
	.pipe(gulp.dest('./build/files/'));
});

gulp.task('js:build', function () {
	return gulp
	.src('./src/js/*.js')
	.pipe(changed('./build/js/'))
	.pipe(plumber(plumberNotify('JS')))
	.pipe(babel())
	.pipe(webpack(webpackConfig))
	.pipe(gulp.dest('./build/js/'));
});
