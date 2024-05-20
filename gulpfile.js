import gulp from 'gulp';
import './gulp/dev.js';
import './gulp/build.js';

const tasks = ['html', 'sass', 'images', 'fonts', 'files', 'js', 'pwa'];

const devTasks = gulp.parallel(...tasks.map(v=> v+':dev'));
const buildTasks = gulp.parallel(...tasks.map(v=> v+':build'));

gulp.task('default', gulp.series('clean:dev', devTasks, gulp.parallel('server:dev', 'watch:dev')));
gulp.task('build', gulp.series('clean:build', buildTasks));