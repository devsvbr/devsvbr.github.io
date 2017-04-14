var gulp = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    jpegRecompress = require('imagemin-jpeg-recompress');

var $ = require('gulp-load-plugins')();


/* Base tasks */
gulp.task('copy', function() {
  return gulp.src('_img/**/*')
      .pipe(gulp.dest('img'));
});

gulp.task('clean', function() {
  return gulp.src('img', {read: false})
      .pipe($.clean());
});


/* Optimizations for images */
gulp.task('optimize-img', function() {
  return gulp.src('img/**/*')
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
gulp.task('default', $.sequence('clean', 'copy', 'optimize-img'));
