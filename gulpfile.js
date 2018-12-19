/**
 * Created by varuzhan.harutyunyan on 5/13/2016.
 */

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify'),
    gp_sourcemaps = require('gulp-sourcemaps');

gulp.task('build:board', function(){
    return gulp.src([
        "scripts/stats.js",
        "scripts/backgammon-3d-board.js",
        "scripts/position-map-generator.js",
        "scripts/checker-manager.js",
        "scripts/dice.js",
        "scripts/dice-manager.js",
        "scripts/double-cube-manager.js",
        "scripts/movement-manager.js",
        "scripts/platform-detector.js",
        "scripts/board-loader.js",
        "scripts/picker.js",
        "scripts/double-cube-picker.js",
        "scripts/checker-picker.js",
        "scripts/text-writer.js",
        "scripts/game-helper.js",
        "scripts/optimization-manager.js",
        "scripts/manager.js",
		"scripts/module-exporter.js"
    ])
    .pipe(gp_sourcemaps.init())
    .pipe(gp_concat('backgammon.js'))
    .pipe(gulp.dest('build'))
    .pipe(gp_rename('backgammon.min.js'))
    .pipe(gp_uglify())
    .pipe(gp_sourcemaps.write('./'))
    .pipe(gulp.dest('build'));
});

gulp.task('build:vendor', function() {
    return gulp.src([
        "node_modules/three/three.js",
        "node_modules/three/examples/js/controls/OrbitControls.js",
        "node_modules/three/examples/js/geometries/TextGeometry.js",
        "node_modules/three/examples/js/utils/FontUtils.js",
        "scripts/helvetiker_regular.typeface.js",
        "node_modules/three/examples/js/libs/tween.min.js",
		"scripts/vendor-module-exporter.js"
    ])
    .pipe(gp_sourcemaps.init())
    .pipe(gp_concat('vendor.js'))
    .pipe(gulp.dest('build'))
    .pipe(gp_rename('vendor.min.js'))
    .pipe(gp_uglify())
    .pipe(gp_sourcemaps.write('./'))
    .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    // watch many files
    watch('scripts/*.js', function() {
        gulp.run('build:board');
    });
});

gulp.task('default', ['build:board', 'build:vendor', 'watch'], function(){});