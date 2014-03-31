var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('minimize', function() {
    return gulp.src('limits.js')
        .pipe(uglify())
        .pipe(concat('limits.min.js'))
        .pipe(gulp.dest('build/'));
});

gulp.task('default', ['minimize']);