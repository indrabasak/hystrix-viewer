// Gulp and plugins
var gulp = require('gulp'),
    closureCompiler = require('gulp-closure-compiler'),
    jsdoc = require("gulp-jsdoc"),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-sass'),
    testem = require('gulp-testem'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util'),
    umd = require('gulp-umd');

// paths
var src = './src/',
    dist = './dist/',
    doc = './doc',
    distJs = dist + 'js',
    distCss = dist + 'css',
    lib = './lib/',
    jsFiles = [src + 'js/' + 'hystrixviewer.js'],
    scssFiles = [src + 'scss/' + 'metricsviewer.scss',
        src + 'scss/' + 'metricsviewer-dark.scss'];

gulp.task('default', ['jshint', 'build:js', 'build:css']);

gulp.task('compile', ['jshint', 'compile:js', 'build:css']);

// deletes the distribution directory
gulp.task('clean', function () {
    return gulp.src([dist + '*'], {read: false})
        .pipe(rimraf());
});

// create 'hystrixviewer.js' and 'hystrixviewer.min.js' from source js
gulp.task('build:js', ['clean'], function () {
    return gulp.src(jsFiles)
        .pipe(umd(
            {
                dependencies: function () {
                    return [{
                        name: 'jquery',
                        amd: 'jquery',
                        cjs: 'jquery',
                        global: 'jQuery',
                        param: '$'
                    },
                        {
                            name: 'HV',
                            amd: 'HV',
                            cjs: 'HV',
                            global: 'HV',
                            param: 'HV'
                        },
                        {
                            name: 'd3',
                            amd: 'd3',
                            cjs: 'd3',
                            global: 'd3',
                            param: 'd3'
                        }];
                },
                exports: function () {
                    return "hystrixViewer";
                },
                namespace: function () {
                    return "hystrixViewer";
                }
            }
        ))
        .pipe(gulp.dest(distJs))
        .pipe(rename('hystrixviewer.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distJs));
});

gulp.task('compile:js', ['clean'], function () {
    return gulp.src(jsFiles)
        .pipe(gulp.dest(distJs))
        .pipe(closureCompiler({
            compilerPath: 'lib/closure/closure-compiler-v20170521.jar',
            fileName: 'hystrixviewer.min.js',
            compilation_level: 'ADVANCED_OPTIMIZATIONS',
            language_in: 'ECMASCRIPT5_STRICT',
            language_out: 'ECMASCRIPT5_STRICT',
            warning_level: 'VERBOSE',
            externs: [
                'lib/externs/jquery-3.1.js',
                'lib/externs/d3_v4.7_externs.js'
            ]
        }))
        .pipe(gulp.dest(distJs));
});

gulp.task('clean:doc', function () {
    return gulp.src([doc + '*'], {read: false})
        .pipe(rimraf());
});

gulp.task('doc', ['clean:doc'], function () {
    return gulp.src(jsFiles)
        .pipe(jsdoc(doc));
});

// build css files from scss
gulp.task('build:css', function () {
    return gulp.src(scssFiles)
        .pipe(sass())
        .pipe(gulp.dest(distCss));
});

// Check source js files with jshint
gulp.task('jshint', function () {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Run the test suite
gulp.task('test', function () {
    return gulp.src([''])
        .pipe(testem({
            configFile: 'testem.json'
        }));
});