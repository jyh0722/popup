var gulp = require('gulp');
var babel = require('gulp-babel'); //ES6, ES5 간 변환
var concat = require('gulp-concat'); //여러 관련 파일 합치기
var uglify = require('gulp-uglify'); //js 압축
var rename = require('gulp-rename'); //파일 복사 및 파일명 변경
var cleanCSS = require('gulp-clean-css'); //CSS 삭제
var del = require('del'); //삭제
var connect = require('gulp-connect'); //서버화 시키기, 자동 리로드

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
  gulp.watch(paths.scripts.src, scripts); //watch : 변경사항 추적
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