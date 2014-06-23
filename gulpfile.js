var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var styl = require('gulp-styl');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
// var uglify = require('gulp-uglify');

var paths = {
  scripts: [
  'app/lib/jquery/dist/jquery.min.js',
  'app/lib/jquery-migrate/jquery-migrate.min.js',
  'app/lib/bootstrap/dist/js/bootstrap.min.js',
  // 'app/js/jquery-ui-1.10.3.custom.min.js',
  'app/lib/autofill-event/src/autofill-event.js', 
  'app/js/core.min.js',
  'app/lib/angular/angular.js', 
  'app/lib/angular-resource/angular-resource.min.js', 
  'app/lib/angular-route/angular-route.min.js', 
  'app/lib/angular-cookies/angular-cookies.min.js', 
  'app/lib/angular-ui-utils/ui-utils.min.js', 
  'app/lib/angular-bootstrap/ui-bootstrap-tpls.min.js', 
  'app/lib/angular-google-chart/ng-google-chart.js', 
  'app/lib/angular-animate/angular-animate.min.js', 
  'app/lib/angular-sanitize/angular-sanitize.min.js', 
  'app/lib/ng-csv/build/ng-csv.min.js', 
  'app/lib/moment/min/moment.min.js', 
  'app/lib/bootstrap-daterangepicker/daterangepicker.js', 
  'app/lib/ng-bs-daterangepicker/dist/ng-bs-daterangepicker.min.js', 
  'app/lib/momentjs/min/moment.min.js', 
  'app/lib/file-saver/FileSaver.js', 
  'app/lib/angular-local-storage/angular-local-storage.min.js', 
  'app/lib/angular-file-upload/angular-file-upload.min.js', 
  'app/js/app.js', 
  'app/js/filters.js', 
  'app/js/directives.js', 
  'app/js/services.js', 
  'app/js/services/**/*.js',
  'app/js/controllers/**/*.js',
  'app/js/directives/**/*.js',
  'app/js/crop/FileAPI.min.js',
  'app/js/crop/FileAPI.exif.js',
  'app/js/crop/jquery.fileapi.js',
  'app/js/crop/jquery.Jcrop.min.js',
  'app/js/crop/jquery.modal.js'
  ],
  css: [
  'app/css/*.css', 
  'app/lib/ionicons/css/ionicons.min.css', 
  'app/lib/bootstrap-daterangepicker/daterangepicker-bs2.css'],
  fonts: ['app/fonts/*'],
  views: ['app/views/**/*.html'],
  imgs:['app/img/*'],
  sass: ['./scss/**/*.scss']
};

gulp.task('css', function () {
  gulp.src(paths.css)
    .pipe(concat('style.css'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('build/css/'));
  
  gulp.src(paths.fonts)
    .pipe(gulp.dest('build/fonts/'));
  
  gulp.src(paths.imgs)
    .pipe(gulp.dest('build/img/'));
})

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    // .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('views', function () {
  gulp.src('app/index-build.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('build'))
  gulp.src(paths.views)
    .pipe(gulp.dest('build/views/'));
})

gulp.task('build', ['scripts', 'css', 'views'], function() {
})

gulp.task('lr-server', function() {
  require('./scripts/web-server.js')
  server.listen(35729, function(err) {
    if (err) return console.log(err);

    gulp.watch(['app/js/**/*.js', 'app/**/*.html', 'app/css/**/*.css'], function(event) {
      gulp.src('app/index.html').pipe(refresh(server))
    })
  });
})

//本地测试build版本
gulp.task('lr-server-build', function() {
  require('./scripts/web-server.js')
  server.listen(35792, function(err) {
    if (err) return console.log(err);

    gulp.watch(['build/js/**/*.js', 'build/**/*.html', 'build/css/**/*.css'], function(event) {
      gulp.src('build/index.html').pipe(refresh(server))
    })
  });
});

gulp.task('default', ['lr-server'], function() {
})