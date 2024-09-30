import gulp from 'gulp';
//import './gulp/dev.js';
import './gulp/build.js';


const tasks = ['html', 'sass', 'js', 'images', 'fonts', 'files' ];

const devTasks = gulp.parallel(...tasks.map(v=> v+':dev'));
const buildTasksHTMLCSSJS = gulp.parallel(...tasks.slice(0,3).map(v=> v+':build'));
const buildTasks = gulp.parallel(...tasks.map(v=> v+':build'));


gulp.task('init', gulp.series('generate-favicon'));
gulp.task('default', gulp.series('clean:dev', devTasks, gulp.parallel( 'serve:dev')));
gulp.task('with-pwa', gulp.series('clean:dev', devTasks,  'generate-favicon',  gulp.parallel( 'serve:dev')));
gulp.task('build', gulp.series('clean:build', buildTasks));
gulp.task('build-html-css-js', gulp.series('clean:build', buildTasksHTMLCSSJS));
