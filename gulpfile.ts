/// <reference path="./type/gulp.d.ts" />
/// <reference path="./type/gulp-uglify.d.ts" />
/// <reference path="./type/fs-extra.d.ts" />

import gulp = require("gulp");
import uglify = require("gulp-uglify");
import rename = require("gulp-rename");
import fs = require("fs-extra");
import concat = require("gulp-concat");
import Make = require('./tasks/Make');

gulp.task("default", ["min"]);

gulp.task("remove", function (callback) {
    fs.remove("./build", () => {
        callback();
    });
});

gulp.task("min", ['make'], function () {

    return gulp.src("build/*.js")
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = ".min.js"
        }))
        .pipe(gulp.dest("./build"));

});

gulp.task("make", ['remove'], function (callback) {

    Make.build(['dom', 'events', 'css', 'animation'], () => {
        console.log('success');
        callback();
    });

});
