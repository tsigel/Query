/// <reference path="./type/gulp.d.ts" />
/// <reference path="./type/gulp-uglify.d.ts" />
/// <reference path="./node_modules/ts-fs-promise/types/fs-extra.d.ts" />

import gulp = require("gulp");
import uglify = require("gulp-uglify");
import rename = require("gulp-rename");
import fs = require("fs-extra");
import concat = require("gulp-concat");

gulp.task("remove", function () {
    fs.removeSync("./build");
});

gulp.task("min", function () {

    gulp.src("build/*.js")
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = ".min.js"
        }))
        .pipe(gulp.dest("./build"));

});

gulp.task("make", function () {

    var concat = function (fileName, paths) {
        paths.unshift("build/Query-dom.js");
        var get = function () {
            return paths.map(function (name) {
                return fs.readFileSync(name, "utf8");
            }).join("\n")
        };
        fs.writeFileSync(fileName, get());
    };

    fs.mkdirSync("build");
    fs.copySync("src/Query-dom.js", "build/Query-dom.js");
    fs.copySync("src/Query-events.js", "build/Query-events.js");
    fs.copySync("src/Query-css.js", "build/Query-css.js");

    fs.writeFileSync("build/Query-events.js", fs.readFileSync("build/Query-events.js", "utf8")
        .replace(/\/\/\/IMPORT:src\/events\/(.+)/g, function (match, group) {
            var text = fs.readFileSync("src/events/" + group, "utf8");
            text = text.substr(text.indexOf("///---") + 6);
            return text.replace(/\n/g, "\n      ").replace("--", "");
        }));

    fs.writeFileSync("build/Query-css.js", fs.readFileSync("build/Query-css.js", "utf8")
        .replace(/\/\/\/IMPORT:src\/(.+)/g, function (match, group) {
            return fs.readFileSync("src/" + group, "utf8").replace(/\n/g, "\n      ");
        }));

    concat("build/Query.js", ["build/Query-events.js", "build/Query-css.js"]);
    concat("build/Query-events.js", ["build/Query-events.js"]);
    concat("build/Query-css.js", ["build/Query-css.js"]);
});

gulp.task("default", ["remove", "make", "min"]);