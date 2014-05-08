var jshint = require('gulp-jshint'),
    gulp   = require('gulp');

gulp.task('lint', function () {
  gulp.src('app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint('c:\\.jshintrc'))
    .pipe(jshint.reporter('default'));
});