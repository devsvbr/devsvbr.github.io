var gulp = require('gulp'),
    pngquant = require('imagemin-pngquant'),
    jpegRecompress = require('imagemin-jpeg-recompress');

var sass = require('gulp-sass')(require('sass'));

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
      .pipe(sass().on('error', sass.logError))
      .pipe($.autoprefixer())
      .pipe($.cssnano({safe: true}))
      .pipe(gulp.dest('css'));
});

gulp.task('inline-css', function() {
  return gulp.src('_src/sass/inline.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe($.autoprefixer())
      .pipe($.cssnano({safe: true}))
      .pipe(gulp.dest('_includes'));
});


/* JavaScript */
gulp.task('minify-js', function() {
  return gulp.src( '_src/js/{analytics,menu,languageselect,sslredirect}.js')
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
            plugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
          }),
          pngquant({
            quality: [0.65, 0.8],
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
gulp.task('build-css', gulp.series('main-css', 'inline-css'));
gulp.task('build-js', gulp.series('loadcss-js', 'minify-js'));
gulp.task('build-img', gulp.series('optimize-logo', 'optimize-img'));
gulp.task('build', gulp.series('build-css', 'build-js', 'build-img'));
gulp.task('default', gulp.series('clean', 'copy', 'build'));

