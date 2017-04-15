var gulp = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    jpegRecompress = require('imagemin-jpeg-recompress');

var $ = require('gulp-load-plugins')();


/* Base tasks */
gulp.task('copy', function() {
  return gulp.src('_src/img/**/*')
      .pipe(gulp.dest('img'));
});

gulp.task('clean', function() {
  return gulp.src(['css', 'img'], {read: false})
      .pipe($.clean());
});


/* CSS */
gulp.task('main-css', function() {
  return gulp.src('_src/sass/main.scss')
      .pipe($.sass().on('error', $.sass.logError))
      .pipe($.cssnano({safe: true}))
      .pipe(gulp.dest('css'));
});

gulp.task('inline-css', function() {
  return gulp.src('_src/sass/inline.scss')
      .pipe($.sass().on('error', $.sass.logError))
      .pipe($.cssnano({safe: true}))
      .pipe(gulp.dest('_includes'));
});


/* Optimizations for images */
gulp.task('optimize-img', function() {
  return gulp.src('img/**/*.{svg,png,jpeg}')
      .pipe($.imagemin([
          $.imagemin.svgo({
            plugins: [{removeViewBox: false}]
          }),
          pngquant({
            quality: '65-80',
            speed: 1
          }),
          jpegRecompress({
            progressive: true,
            max: 85,
            min: 80
          })
      ]))
      .pipe(gulp.dest('img'));
});


/* Aliases */
gulp.task('build-css', ['main-css', 'inline-css']);
gulp.task('default', $.sequence('clean', 'copy', ['optimize-img', 'build-css']));
