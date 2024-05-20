import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import sass from 'gulp-sass';
import  * as dartSass from 'sass';
import sassGlob from 'gulp-sass-glob';
import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import fs from 'fs';
import sourceMaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import changed from 'gulp-changed';
import ip from 'ip';
import config from '../config.js'

//import webpack from 'webpack-stream';

const sassCompiler = sass(dartSass);

gulp.task('clean:dev', function (done) {
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
	context: config
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

gulp.task('html:dev', function () {
	return gulp
	.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
	.pipe(changed('./build/'))
	.pipe(plumber(plumberNotify('HTML')))
	.pipe(fileInclude(fileIncludeSetting))
	.pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function () {
	return gulp
	.src('./src/scss/*.scss')
	.pipe(changed('./build/css/'))
	.pipe(plumber(plumberNotify('SCSS')))
	.pipe(sourceMaps.init())
	.pipe(sassGlob())
	.pipe(sassCompiler())
	.pipe(sourceMaps.write())
	.pipe(gulp.dest('./build/css/'));
});

gulp.task('images:dev', function () {
	return gulp
	.src('./src/img/**/*')
	.pipe(changed('./build/img/'))
	.pipe(gulp.dest('./build/img/'));
});

gulp.task('fonts:dev', function () {
	return gulp
	.src('./src/fonts/**/*')
	.pipe(changed('./build/fonts/'))
	.pipe(gulp.dest('./build/fonts/'));
});

gulp.task('files:dev', function () {
	return gulp
	.src('./src/files/**/*')
	.pipe(changed('./build/files/'))
	.pipe(gulp.dest('./build/files/'));
});

gulp.task('js:dev', function () {
	return gulp
	.src('./src/js/*.js')
	.pipe(changed('./build/js/'))
	.pipe(plumber(plumberNotify('JS')))
	// .pipe(babel())
	// .pipe(webpack(require('./../webpack.config.js')))
	.pipe(gulp.dest('./build/js/'));
});

gulp.task('pwa:dev', function () {
	return gulp
	.src(['./src/*.png', './src/*.ico', './src/*.webmanifest'])
	.pipe(changed('./build/'))
	.pipe(gulp.dest('./build/'));
});

gulp.task('server:dev', function () {
	return gulp.src('./build/').pipe(server({
		host: ip.address(),
		livereload: true,
		https: true,
		open: true,
		port: 8080,
	}));
});

gulp.task('watch:dev', function () {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
	gulp.watch('./src/html/**/*.html', gulp.parallel('html:dev'));
	gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
	gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
	gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
	gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});
