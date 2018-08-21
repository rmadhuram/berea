'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var connect = require('gulp-connect');


function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['scripts:watch', 'env', 'inject', 'html', 'sass-lint'], function () {

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject-reload']);

  gulp.watch([
    path.join(conf.paths.src, '/app/**/*.css'),
    path.join(conf.paths.src, '/app/**/*.scss')
  ], function(event) {
    if(isOnlyChange(event)) {
      gulp.start('styles-reload');
    } else {
      gulp.start('inject-reload');
    }
  });


  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function(event) {
    gulp.src('./app/*.html')
      .pipe(connect.reload());
  });
});
