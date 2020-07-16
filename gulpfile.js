var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var connect = require('gulp-connect');

//경로 설정
var paths = {
  styles: {
    src: 'src/**/*.css',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/**/*.js',
    dest: 'dist/scripts/'
  }
};


function clean(done) {
  del([ 'asset' ]);
  done();
}

// 각 작업용 함수 ( gulp.task() 기능 )
function styles(done) {
  gulp.src(paths.styles.src)
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
    done();
  
}

function scripts(done) {
  gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
    done();
}


function connect0(a){
  connect.server({
    root: 'dist/',
    livereload: true,
    port: 8080
});
a();
}

function html(){
  return gulp.src('src/**/*.html')
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload());
}


function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(connect0, clean, html, gulp.parallel(styles, scripts));

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