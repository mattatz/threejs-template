/*
 * gulpfile.js
 * */

var path = require("path");

var gulp = require("gulp");

var webserver = require("gulp-webserver");
var sass = require("gulp-sass");
var webpack = require("gulp-webpack");
var ejs = require("gulp-ejs");

gulp.task("webpack", function() {
    gulp.src("./source/javascripts/app.js")
        .pipe(webpack({
            entry : "./source/javascripts/main.js",
            output : {
                filename : "main.js"
            },
            resolve : {
                root : [path.join(__dirname, "bower_components")],
                extensions : ["", ".js"],

                alias : {
                    jquery : "jquery/dist/jquery.min.js",
                    threejs : "threejs/build/three.min.js",
                    "dat-gui" : "dat-gui/build/dat.gui.min.js"
                }
            },
            plugins : [
            ],
            module : {
                loaders : [
                    { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
                    { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ }
                ]
            }
        }))
        .pipe(gulp.dest("./dist/assets/javascripts/"));
});

gulp.task("webserver", function() {
    gulp.src("dist")
        .pipe(webserver({
            port: 4567,
            livereload: true,
            open: true
        }));
});

gulp.task("sass", function() {
    gulp.src("./source/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./dist/assets/css"));
});

gulp.task("ejs", function() {
    gulp.src(["./source/templates/*.ejs", "!./source/templates/common/_*.ejs"])
        .pipe(ejs({
            "asset_path" : "assets/"
        }))
        .pipe(gulp.dest("./dist"));
});

gulp.task("watch", function() {
    gulp.start(["sass"], ["webpack"], ["ejs"]);

    gulp.watch("./source/sass/*.scss", ["sass"]);
    gulp.watch(["./source/javascripts/*.js", "./source/javascripts/components/*.js", "./source/shaders/*"], ["webpack"]);
    gulp.watch(["./source/templates/*.ejs", "./source/templates/common/*.ejs"], ["ejs"]);
});

gulp.task("default", ["watch", "webserver"]);


