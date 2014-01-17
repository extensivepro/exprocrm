var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var styl = require('gulp-styl');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();
var nodemon = require('gulp-nodemon');

gulp.task('scripts', function() {
  gulp.src(['app/js/**/*.js'])
    .pipe(browserify())
    .pipe(concat('dest.js'))
    .pipe(gulp.dest('build'))
    .pipe(refresh(server))
})

gulp.task('styles', function() {
  gulp.src(['app/css/**/*.css'])
    .pipe(styl({
      compress: true
    }))
    .pipe(gulp.dest('build'))
    .pipe(refresh(server))
})

gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if (err) return console.log(err);

    gulp.watch(['app/js/**/*.js', 'app/**/*.html', 'app/css/**/*.css'], function(event) {
      gulp.src('app/index.html').pipe(refresh(server))
    })
  });
})

gulp.task('build', function() {
  gulp.run('lr-server', 'scripts', 'styles');
})

gulp.task('nodemon', function() {
  gulp.src('scripts/web-server.js')
    .pipe(nodemon());
})

gulp.task('default', function() {
  gulp.run('nodemon', 'lr-server');
})