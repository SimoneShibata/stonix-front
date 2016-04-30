var gulp = require('gulp');
var inject = require('gulp-inject');

gulp.task('update', function () {
  var target = gulp.src('./src/index.html');
  var sources = gulp.src(['./src/**/*.js', './src/**/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./src'));
});
