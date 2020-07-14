var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var liver = require('livereload')

//경로 설정
var paths = {
  styles: {
    src: 'popup/src/**/*.css',
    dest: 'popup/dist/styles/'
  },
  scripts: {
    src: 'popup/src/**/*.js',
    dest: 'popup/dist/scripts/'
  }
};


function clean() {
  return del([ 'assets' ]);
}

// 각 작업용 함수 ( gulp.task() 기능 )
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(livereload());
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(livereload());
}

gulp.task('live', ['html', 'js:combine', 'scss:compile'], function () { 
  /** * livereload.listen() 옵션값으로 기본 경로를 지정 */ 
  livereload.listen( { basePath: dist } ); 
});

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(styles, scripts));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
 
// gulp 기본 실행 옵션
exports.default = build;