import {parallel, task, series} from 'gulp';

import './core/gulp/dev.js';
import './core/gulp/build.js';
import './core/gulp/all.js';

const tasksHTMLCSSJS = ['html', 'sass', 'js'];
const tasks = [...tasksHTMLCSSJS, 'images', 'fonts', 'files' ];


task('init', series('generate-favicon'))
task('default', series('clean:dev', parallel(...tasks.map(v=> v+':dev')), parallel( 'serve:dev')));
task('build', series('clean:build', parallel(...tasks.map(v=> v+':build'))));
task('build-html-css-js', series('clean:build', parallel(tasksHTMLCSSJS.map(v=> v+':build'))));
