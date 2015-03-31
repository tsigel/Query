/// <reference path="./type/gulp.d.ts" />
/// <reference path="./type/gulp-uglify.d.ts" />

import gulp = require("gulp");
import uglify = require("gulp-uglify");


gulp.task("min", function () {

    gulp.src("src/Query-static.js")
        .pipe(uglify())
        .pipe(gulp.dest("./build/"));

});