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

//gulp.task("amd-min-all", function () {
//
//    setTimeout(function () {
//        var pre = "define([],function(){";
//        pre = pre + fs.readFileSync("build/Query.min.js", "utf8");
//        pre = pre + "return $});";
//        fs.writeFileSync("build/Query-amd.min.js", pre);
//    }, 10000);
//
//});
//
//gulp.task("amd-all", function () {
//
//    setTimeout(function () {
//        var pre = "define([],function(){\n";
//        pre = pre + fs.readFileSync("build/Query.js", "utf8");
//        pre = pre + "\nreturn $});";
//        fs.writeFileSync("build/Query-amd.js", pre);
//    }, 10000);
//
//});
//
//gulp.task("amd", ["amd-min-all", "amd-all"]);