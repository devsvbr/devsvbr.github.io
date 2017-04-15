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
  return gulp.src(['css', 'img', '_includes/*.{css,js,svg}'], {read: false})
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


/* JavaScript */
gulp.task('minify-js', function() {
  return gulp.src( '_src/js/{analytics,menu}.js')
      .pipe($.uglify())
      .pipe(gulp.dest('_includes'));
});

gulp.task('loadcss-js', function() {
  return gulp.src([ '_src/js/loadCSS.js', '_src/js/cssrelpreload.js' ])
      .pipe($.concat('loadcss.js'))
      .pipe($.uglify())
      .pipe(gulp.dest('_includes'));
});


/* Images */
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

gulp.task('optimize-logo', function() {
  return gulp.src('_src/logo/logo.svg')
      .pipe($.imagemin({
          svgoPlugins: [{removeViewBox: false}]
      }))
      .pipe(gulp.dest('_includes'));
});


/* Aliases */
gulp.task('build-css', ['main-css', 'inline-css']);
gulp.task('build-js', ['loadcss-js', 'minify-js']);
gulp.task('build-img', ['optimize-logo', 'optimize-img']);
gulp.task('build', ['build-css', 'build-js', 'build-img']);
gulp.task('default', $.sequence('clean', 'copy', 'build'));
