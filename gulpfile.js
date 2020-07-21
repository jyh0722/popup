var gulp = require('gulp');
var babel = require('gulp-babel'); //ES6, ES5 간 변환
var concat = require('gulp-concat'); //여러 관련 파일 합치기
var uglify = require('gulp-uglify'); //js 압축
var rename = require('gulp-rename'); //파일 복사 및 파일명 변경
var cleanCSS = require('gulp-clean-css'); //CSS 삭제
var del = require('del'); //삭제
var browserSync = require('browser-sync'); //서버화 시키기, 자동 리로드

//경로 설정
var paths = {
  styles: {
    src: 'src/**/*.css',
    dest: 'dist/styles'
  },
  scripts: {
    src: 'src/**/*.js',
    dest: 'dist/script'
  },
  htmls: {
    src : 'src/**/*.html'
  }
};


function clean(done) {
  del([ 'dist' ]);
  done();
}

// 각 작업용 함수 ( gulp.task() 기능 )
function styles(done) {
  gulp.src(paths.styles.src) // 해당 경로의 파일을 참조
    .pipe(cleanCSS()) // CSS 코드 경량화
    .pipe(rename({ // main.min.* 로 rename
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(browserSync.reload({ stream : true }))
    .pipe(gulp.dest(paths.styles.dest)); //해당 경로로 dist 폴더 및 파일 생성
    done();
}

function scripts(done) {
  gulp.src(paths.scripts.src, { sourcemaps: true }) // 스크립트 문법변환, uglify시 원본 소스간 매핑
    .pipe(babel()) // ES6 -> ES5 변환
    .pipe(uglify()) // javascript 난독화 (주석, 공백 제거, 변수명 들을 짧게 바꿈)
    .pipe(concat('main.min.js')) // 참조한 javascript 파일을 합치고 이름 설정
    .pipe(browserSync.reload({ stream : true }))
    .pipe(gulp.dest(paths.scripts.dest));
    done();
}

gulp.task('browserSync', () => { 
  return new Promise( resolve => { 
    browserSync.init( null, { 
      proxy: 'http://localhost:8080' , 
      port: 8006 
    }); 
    resolve(); 
  }); 
});

function html(done){
  gulp.src(paths.htmls.src)
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.reload({ stream : true }));
  done();
}


// function browserSync(done){
//   browserSync.init({
//     port : 8080,
//     server:{
//       baseDir : 'dist/'
//     }
//   })
//   done();
// }


/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, html, browserSync,  gulp.parallel(scripts, styles));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
 

// gulp 기본 실행 옵션
exports.default = build;