import {parallel, task, series} from 'gulp';

import './core/gulp/dev.js';
import './core/gulp/build.js';
import './core/gulp/all.js';

const tasksHTMLCSSJS = ['html', 'sass', 'js'];
const tasks = [...tasksHTMLCSSJS, 'images'];

const taskFirst = ['clean', 'files', 'fonts'];

task('init', series('generate-favicon'))
task('default', series(...taskFirst,  parallel(...tasks.map(v=> v+':dev')), parallel( 'serve:dev')));
task('build', series(...taskFirst, parallel(...tasks.map(v=> v+':build'))));
task('build-html-css-js', series('clean', parallel(tasksHTMLCSSJS.map(v=> v+':build'))));
