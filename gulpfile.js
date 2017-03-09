// gulpfile.js

const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const child = require('child_process');
const gutil = require('gulp-util');

const jsFiles = '_assets/**/*.js';

gulp.task('js', () => {
    gulp.src(jsFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('buzz.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('watch', () => {
    gulp.watch(jsFiles, ['js']);
});

gulp.task('jekyll', () => {
    const jekyll = child.spawn('jekyll', ['serve',
        '--watch',
        '--incremental',
        '--drafts'
    ]);

    const jekyllLogger = (buffer) => {
    buffer.toString()
        .split(/\n/)
        .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);

});

gulp.task('default', ['js', 'jekyll', 'watch']);

