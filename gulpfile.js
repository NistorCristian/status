'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
 
sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  return gulp.src('./themes/status/source/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(gulp.dest('./themes/status/source/css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./themes/status/source/scss/style.scss', ['sass']);
});

gulp.task('default', ['sass:watch'])