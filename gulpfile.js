var gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jpegRecompress = require('imagemin-jpeg-recompress');

gulp.task('optimize-img', function() {
  return gulp.src('_img/**/*')
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
