var gulp = require('gulp');
var bem = require('gulp-bem');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var del = require('del');
var jade = require('gulp-jade');
var pack = require('gulp-bem-pack');
var save = require('save-stream');
var multistream = require('multistream');
var basename = require('path').basename;

var levels = [
    'libs/pure-base',
    'libs/pure-grids',
    'blocks'
];

gulp.task('js', ['clean'], function () {
    return bem.objects(levels)
        .pipe(bem.src('{bem}.js'))
        .pipe(pack('index.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('css', ['clean'], function () {
    return bem.objects(levels)
        .pipe(bem.src('{bem}.css'))
        .pipe(concat('index.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('html', ['clean'], function () {
    var mixins = bem.objects(levels)
        .pipe(bem.src('{bem}.jade'))
        .pipe(concat('mixins.jade'))
        .pipe(save());

    return bem.objects('pages')
        .src('{bem}.jade')
        .each(function (page) {
            return multistream([mixins, [page]])
                .pipe(concat({
                    cwd: page.cwd,
                    path: page.path
                }))
                .pipe(plumber())
                .pipe(jade({pretty: true}))
                .pipe(gulp.dest('./dist'));
        });
});

gulp.task('cname', ['clean'], function () {
    return gulp.src('CNAME').pipe(gulp.dest('dist'));
});

gulp.task('assets', ['clean'], function () {
    return gulp.src('assets/**').pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
    del(['./dist'], cb);
});

gulp.task('build', ['clean', 'html', 'css', 'js', 'assets', 'cname']);

/* Some external tasks */
require('./gulpfile.ext.js');
