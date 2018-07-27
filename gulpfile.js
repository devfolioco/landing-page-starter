var gulp = require("gulp");
var sass = require("gulp-sass");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var browserSync = require("browser-sync").create();

// Compile SCSS
gulp.task("css:compile", function() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(
      sass
        .sync({
          outputStyle: "expanded"
        })
        .on("error", sass.logError)
    )
    .pipe(gulp.dest("./public/css"));
});

// Minify CSS
gulp.task("css:minify", ["css:compile"], function() {
  return gulp
    .src(["./public/css/*.css", "!./public/css/*.min.css"])
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
});

// CSS
gulp.task("css", ["css:compile", "css:minify"]);

// Minify JavaScript
gulp.task("js:minify", function() {
  return gulp
    .src(["./src/js/*.js", "!./src/js/*.min.js"])
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest("./public/js"))
    .pipe(browserSync.stream());
});

// JS
gulp.task("js", ["js:minify"]);

// Task to copy files and assets
gulp.task('copy:images', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(gulp.dest('./public/img'))
})

gulp.task('copy:favicons', function () {
  return gulp
    .src('./src/favicons/*')
    .pipe(gulp.dest('./public/favicons'))
})

gulp.task('copy:files', function () {
  return gulp
    .src(['./src/*.*', './src/*/*.html', './src/*/*.min.css', './src/*/*.min.js'])
    .pipe(gulp.dest('./public/'))
})

// Files
gulp.task("copy", ["copy:images", "copy:favicons", "copy:files"]);

// Default task
gulp.task("default", ["css", "js", "copy"]);

// Configure the browserSync task
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });
});

// Dev task
gulp.task("dev", ["css", "js", "copy", "browserSync"], function() {
  gulp.watch("./src/scss/*.scss", ["css"]);
  gulp.watch("./src/js/*.js", ["js"]);
  gulp.watch("./src/**/*.html", browserSync.reload);
});
