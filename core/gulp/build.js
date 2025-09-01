import {task, src, dest} from 'gulp'
import changed from 'gulp-changed'
import cssnano from 'gulp-cssnano'
// HTML
import fileInclude from 'gulp-file-include'
import htmlClean from 'gulp-htmlclean'
import gulpIf from 'gulp-if'

// Images
import imagemin from 'gulp-imagemin'
import sourceMaps from 'gulp-sourcemaps'
import webp from 'imagemin-webp'
import webpHTML from 'gulp-webp-html'

// SASS
import * as sass from 'sass';
import gulpSass from 'gulp-sass'


import {
    clearHTML,
    getBuildDir,
    getConfig,
    getHtmlSrc,
    getSrcDir,
    plumberNotify,
} from '../tools.js'
import esBuild from "gulp-esbuild";


task('html:build', async () =>
    src(getHtmlSrc())
        .pipe(changed(getBuildDir()))
        .pipe(plumberNotify('HTML'))
        .pipe(fileInclude({ context: await getConfig() }))
        .pipe(htmlClean())
        .pipe(webpHTML())
        .on('data', clearHTML)
        .pipe(dest(getBuildDir())),
)
task('sass:build', () =>
    src(getSrcDir('scss/*.scss'))
        .pipe(changed(getBuildDir('css/')))
        .pipe(plumberNotify('SCSS'))
        .pipe(sourceMaps.init())
        .pipe(gulpSass(sass)({
            additionalData: `@import "${getSrcDir('scss/_variables.scss')}"; @import "${getSrcDir('scss/_mixins.scss')}";`
        }))
        .pipe(sourceMaps.write('.'))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(dest(getBuildDir('css/')))
)

task('images:build', () =>
    src(getSrcDir('img/**/*'), { encoding: false })
        .pipe(changed(getBuildDir('img/')))
        .pipe(imagemin([
            webp({ quality: 50 })
        ]))
        .pipe(dest(getBuildDir('img/')))
)

task('js:build', () =>
    src(getSrcDir('/js/index.js'))
        .pipe(plumberNotify('JS'))
        .pipe(esBuild({
            outfile: 'index.js',
            bundle: true,
            sourcemap: true,
            format: 'iife',
            target: 'es6',
            charset: 'utf8',
            define: { 'process.env.NODE_ENV': '"production"' },
            minify: true,
        }))
        .pipe(dest(getBuildDir('js/'))),
);



