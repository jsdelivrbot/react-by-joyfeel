const gulp = require('gulp');
const jspm = require('jspm'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps');


const paths = {
  main: 'js/main.js',
  scripts: 'public/js/**',
  dest: 'public/dest/bundle.js',
  scssFiles: 'public/css/**/*.scss',
  scssSrc: 'public/css/main.scss',
  scssDest: 'public/dest/'
};

//echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

//jspm.setPackagePath('./');
gulp.task('scripts', () => {
  return jspm
    .bundleSFX(paths.main, paths.dest, {
      minify: false,
      mangle: false,
      lowResSourceMaps: true,
      sourceMaps: true
    })
    .then(() => {

    });
});

gulp.task('sass', () => {
  return gulp.src(paths.scssSrc)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.scssDest));
});

function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  return;
}

// Rerun the task when a file changes
gulp.task('watch', () => {
  gulp.watch([paths.scripts], ['scripts']).on('change', reportChange);

  gulp.watch(paths.scssFiles, ['sass']).on('change', (event) => {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
      return;
  });
});

gulp.task('default', ['watch', 'scripts', 'sass']);
