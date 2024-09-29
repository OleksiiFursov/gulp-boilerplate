import gulp from "gulp";
import {generateFavicon, movePWA} from "./task.js";

gulp.task('generate-favicon', generateFavicon)


gulp.task('pwa:build', movePWA)