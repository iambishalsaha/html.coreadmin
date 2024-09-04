import gulp from "gulp";
import * as browserSync from "browser-sync";
import {deleteAsync, deleteSync} from "del";
import sourcemaps from "gulp-sourcemaps";
import gulpAutoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename"
import npmDist from "gulp-npm-dist";
import fileinclude from "gulp-file-include";
import replace from "gulp-replace";
import cached from "gulp-cached";
import useref from "gulp-useref-plus"
import gulpif from "gulp-if"
import uglify from "gulp-uglify";

import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

const isSourceMap = true;
const sourceMapWrite = (isSourceMap) ? "./" : false;

//const assetsPath = 'https://coreadminpro.com'; // Set your live URL image path here
const assetsPath = 'assets/images'; // Set your local image path here

const paths = {
  base: {
    base: {
      dir: './'
    },
    node: {
      dir: './node_modules'
    },
    packageLock: {
      files: './package-lock.json'
    }
  },
  dist: {
    base: {
      dir: './dist',
      files: './dist/**/*'
    },
    libs: {
      dir: './dist/assets/libs'
    },
    css: {
      dir: './dist/assets/css',
    },
    js: {
      dir: './dist/assets/js',
      files: './dist/assets/js/pages',
    },
    images: {
      dir: './dist/assets/images',
    },
    fonts: {
      dir: './dist/assets/fonts',
    },
  },
  src: {
    base: {
      dir: './src',
      files: './src/**/*'
    },
    css: {
      dir: './src/assets/css',
      files: './src/assets/css/**/*'
    },
    html: {
      dir: './src',
      files: './src/**/*.html',
    },
    imgages: {
      dir: './src/assets/images',
      files: './src/assets/images/**/*',
    },
    fonts: {
      dir: './src/assets/fonts',
      files: './src/assets/fonts/**/*',
    },
    js: {
      dir: './src/assets/js',
      pages: './src/assets/js/pages',
      files: './src/assets/js/pages/*.js',
      main: './src/assets/js/*.js',
    },
    partials: {
      dir: './src/partials',
      files: './src/partials/**/*'
    },
    scss: {
      dir: './src/assets/scss',
      files: './src/assets/scss/**/*',
      main: './src/assets/scss/*.scss',
      icons: './src/assets/scss/icons.scss',
      iconsPlugin: './src/assets/scss/plugins/icons/*',
      bootstrap: './src/assets/scss/bootstrap.scss',
      vars: './src/assets/scss/*variables*.scss',
      utility: './src/assets/scss/components/_utilities.scss',
    }
  }
};

gulp.task('browserSync', (callback) => {
  browserSync.init({
    server: {
      baseDir: [paths.dist.base.dir, paths.src.base.dir]
    },
    port: 1113
  });
  callback();
});

gulp.task('browserSyncReload', (callback) => {
  browserSync.reload();
  callback();
});

// CLEAN: package-lock.json
gulp.task('clean:packageLock', async () => {
  await deleteAsync(paths.base.packageLock.files);
});
//CLEAN:
gulp.task('clean:dist', (callback) => {
  deleteSync(paths.dist.base.dir);
  callback();
});

gulp.task('copy:all', () => {
  return gulp.src([
    paths.src.base.files,
    '!' + paths.src.partials.dir, '!' + paths.src.partials.files,
    '!' + paths.src.scss.dir, '!' + paths.src.scss.files,
    '!' + paths.src.js.dir, '!' + paths.src.js.files, '!' + paths.src.js.main,
    '!' + paths.src.html.files,
  ]);
});
gulp.task('copy:libs', () => {
  return gulp
    .src(npmDist({excludes: ['*.txt'], replaceDefaultExcludes: true}), {base: paths.base.node.dir})
    .pipe(rename(function (path) {
      path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
    }))
    .pipe(gulp.dest(paths.dist.libs.dir));
});

gulp.task('copy:images', () => {
  return gulp
    .src([paths.src.imgages.files], {encoding: false})
    .pipe(gulp.dest(paths.dist.images.dir));
});

gulp.task('copy:fonts', () => {
  return gulp
    .src([paths.src.fonts.files], {encoding: false})
    .pipe(gulp.dest(paths.dist.fonts.dir));
});

gulp.task('fileInclude', function () {
  return gulp
    .src([
      paths.src.html.files,
      '!' + paths.dist.base.files,
      '!' + paths.src.partials.files
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
    }))
    .pipe(replace('##imagesPath##', assetsPath))
    .pipe(cached())
    .pipe(gulp.dest(paths.dist.base.dir));
});

gulp.task('bootstrap', function () {
  // generate rtl

  gulp
    .src([paths.src.scss.bootstrap])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpAutoprefixer())
    //.pipe(rtlcss())
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(cleanCSS())
    .pipe(rename({suffix: "-rtl.min"}))
    .pipe(sourcemaps.write(sourceMapWrite))
    .pipe(gulp.dest(paths.dist.css.dir));


  // generate ltr
  return gulp
    .src([paths.src.scss.bootstrap])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpAutoprefixer())
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(cleanCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write(sourceMapWrite))
    .pipe(gulp.dest(paths.dist.css.dir));


});

gulp.task('scss', () => {
  // generate rtl

  gulp
    .src([paths.src.scss.main, "!" + paths.src.scss.bootstrap, "!" + paths.src.scss.icons, "!" + paths.src.scss.iconsPlugin])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpAutoprefixer())
    //.pipe(rtlcss())
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(cleanCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write(sourceMapWrite))
    .pipe(gulp.dest(paths.dist.css.dir));


  // generate ltr
  return gulp
    .src([paths.src.scss.main, "!" + paths.src.scss.bootstrap, "!" + paths.src.scss.icons, "!" + paths.src.scss.iconsPlugin])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpAutoprefixer())
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(cleanCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write(sourceMapWrite))
    .pipe(gulp.dest(paths.dist.css.dir));
});

gulp.task('icons', function () {
  return gulp
    .src([paths.src.scss.icons])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulpAutoprefixer())
    .pipe(gulp.dest(paths.dist.css.dir))
    .pipe(cleanCSS())
    .pipe(rename({suffix: ".min"}))
    .pipe(sourcemaps.write(sourceMapWrite))
    .pipe(gulp.dest(paths.dist.css.dir));
});

gulp.task('js', function () {
  return gulp
    .src(paths.src.js.main)
    .pipe(replace('##imagesPath##', assetsPath))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js.dir));
});

gulp.task('jsPages', function () {
  return gulp
    .src(paths.src.js.files)
    .pipe(replace('##imagesPath##', assetsPath))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js.files));
});

gulp.task('html', function () {
  return gulp
    .src([
      paths.src.html.files,
      '!' + paths.dist.base.files,
      '!' + paths.src.partials.files
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file',
      indent: true,
      nameJudia: 'test'
    }))
    .pipe(replace(/href="(.{0,10})node_modules/g, 'href="$1assets/libs'))
    .pipe(replace(/src="(.{0,10})node_modules/g, 'src="$1assets/libs'))
    .pipe(replace('##imagesPath##', assetsPath))
    .pipe(useref())
    .pipe(cached())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', uglify()))
    .pipe(gulp.dest(paths.dist.base.dir));
});

// GULP: Watch
gulp.task('watch', () => {
  gulp.watch(
    [paths.src.scss.dir, "!" + paths.src.scss.bootstrap, "!" + paths.src.scss.icons, "!" + paths.src.scss.iconsPlugin],
    gulp.series('scss', 'browserSyncReload'));
  gulp.watch([paths.src.scss.bootstrap, paths.src.scss.vars, paths.src.scss.utility], gulp.series('bootstrap', 'browserSyncReload'));
  gulp.watch([paths.src.scss.icons, paths.src.scss.iconsPlugin], gulp.series('icons', 'browserSyncReload'));
  gulp.watch([paths.src.js.dir], gulp.series('js', 'browserSyncReload'));
  gulp.watch([paths.src.js.pages], gulp.series('jsPages', 'browserSyncReload'));
  gulp.watch([paths.src.html.files, paths.src.partials.files], gulp.series('fileInclude', 'browserSyncReload'));
});

gulp.task(
  'build',
  gulp.series(
    gulp.parallel('clean:packageLock', 'clean:dist', 'copy:all', 'copy:libs', 'copy:images', 'copy:fonts'),
    'bootstrap', 'scss', 'icons', 'html'
  )
);

gulp.task(
  'default',
  gulp.series(
    gulp.parallel(
      'clean:packageLock', 'clean:dist', 'copy:all', 'copy:libs', 'fileInclude', 'bootstrap', 'scss', 'icons',
      'js', 'jsPages', 'html', 'copy:images', 'copy:fonts'
    ),
    gulp.parallel('browserSync', 'watch')
  )
);