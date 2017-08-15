var gulp = require("gulp"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    tslint = require("gulp-tslint"),
    tsc = require("gulp-typescript"),
    karma = require("karma").server,
    coveralls = require('gulp-coveralls'),
    uglify = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    header = require("gulp-header"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    pkg = require(__dirname + "/package.json");

gulp.task("lint", function() {
    return gulp.src([
        "source/**/**.ts",
        "test/**/**.test.ts"
    ])
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

var tsProject = tsc.createProject({
    target : "es5",
    module : "commonjs",
    experimentalDecorators: true,
    typescript: typescript
});

gulp.task("build", function() {
    return gulp.src("src/**/**.ts")
    .pipe(tsc(tsProject))
    .js.pipe(gulp.dest("build/source/"));
});

var tsTestProject = tsc.createProject({
    target : "es5",
    module : "commonjs",
    experimentalDecorators: true,
    typescript: typescript
});

gulp.task("build-test", function() {
    return gulp.src("test/**/*.test.ts")
    .pipe(tsc(tsTestProject))
    .js.pipe(gulp.dest("/build/test/"));
});

gulp.task("bundle-source", function () {
    var b = browserify({
        standalone : 'TsStock',
        entries: "build/source/app/main.js",
        debug: true
    });
    return b.bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(gulp.dest("bundled/source/"));
});

gulp.task("bundle-unit-test", function () {
    var b = browserify({
        standalone : 'test',
        entries: "build/test/bdd.test.js",
        debug: true
    });
    return b.bundle()
    .pipe(source("bdd.test.js"))
    .pipe(buffer())
    .pipe(gulp.dest("bundled/test/"));
});

gulp.task("bundle-e2e-test", function () {
    var b = browserify({
        standalone : 'test',
        entries: "build/test/e2e.test.js",
        debug: true
    });
    return b.bundle()
    .pipe(source("e2e.test.js"))
    .pipe(buffer())
    .pipe(gulp.dest("bundled/e2e-test/"));
});