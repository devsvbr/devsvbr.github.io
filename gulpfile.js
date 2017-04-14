var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

gulp.task('optimize-img', function() {
  return gulp.src('_gulp/img/**/*')
    .pipe(imagemin([
        imagemin.svgo({
            plugins: [{removeViewBox: false}]
        }),
        pngquant({
            quality: '65-80',
            speed: 1
        })
    ]))
    .pipe(gulp.dest('img'));
});
