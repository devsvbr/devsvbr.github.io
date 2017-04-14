var gulp = require('gulp');
var imagemin = require('gulp-imagemin');

gulp.task('optimize-img', function() {
  return gulp.src('_gulp/img/**/*')
    .pipe(imagemin([
        imagemin.svgo({
            plugins: [{removeViewBox: false}]
        })
    ]))
    .pipe(gulp.dest('img'));
});
