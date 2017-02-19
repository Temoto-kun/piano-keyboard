/**
 * Script description.
 * @author TheoryOfNekomata
 * @date 2017-02-19
 */

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso');

gulp.task('scripts:compress', function (cb) {
    gulp.src(['./src/**/*.js'])
        .pipe(concat('piano-keyboard.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'))
        .on('end', cb);
});

gulp.task('scripts:copy', function (cb) {
    gulp.src(['./src/**/*.js'])
        .pipe(concat('piano-keyboard.js'))
        .pipe(gulp.dest('./build'))
        .on('end', cb);
});

gulp.task('scripts', ['scripts:compress', 'scripts:copy']);

gulp.task('styles:compress', function (cb) {
    gulp.src(['./src/**/*.css'])
        .pipe(concat('piano-keyboard.css'))
        .pipe(csso())
        .pipe(gulp.dest('./build'))
        .on('end', cb);
});

gulp.task('styles:copy', function (cb) {
    gulp.src(['./src/**/*.css'])
        .pipe(concat('piano-keyboard.css'))
        .pipe(gulp.dest('./build'))
        .on('end', cb);
});

gulp.task('styles', ['styles:compress', 'styles:copy']);

gulp.task('default', ['scripts', 'styles']);
