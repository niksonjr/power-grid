import { argv } from 'yargs';
import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import gulpif from 'gulp-if';
import uglify from 'gulp-uglify';

const isProduction = argv.env === 'production';

gulp.task('transpile', () => {
    const bundler = browserify({
        entries: './src/index.js',
        debug: true
    });

    bundler.transform(babelify);

    bundler.bundle()
        .on('error', err => console.log(err))
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulpif(isProduction, uglify()))
        .pipe(gulpif(isProduction, rename({suffix: '.min'})))
        .pipe(gulp.dest('dist/scripts'));
});
/*
gulp.task('tests', () => {
    const bundler = browserify({
        entries: './src/tests.js',
        debug: true
    });

    bundler.transform(babelify);

    bundler.bundle()
        .on('error', err => console.log(err))
        .pipe(source('tests.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist/scripts'));
});
*/
let buildTasks = ['transpile'];

gulp.task('build', buildTasks);
gulp.task('watch', ['build'], () => {
    gulp.watch('./src/**/*.js', ['transpile']);
});

