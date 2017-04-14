var gulp = require('gulp'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegRecompress = require('imagemin-jpeg-recompress');


gulp.task('copy', function() {
    return gulp.src('_img/**/*')
        .pipe(gulp.dest('img'));
});

gulp.task('clean', function() {
  return gulp.src('img', {read: false})
      .pipe(clean());
});

gulp.task('optimize-img', function() {
  return gulp.src('img/**/*')
      .pipe(imagemin([
          imagemin.svgo({
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
