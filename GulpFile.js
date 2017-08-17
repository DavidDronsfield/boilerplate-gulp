'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const sassdoc = require('sassdoc');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
// const browserSync = require('browser-sync').create();	Commented out until required

const input = './assets/sass/*.scss';
const output = './public/css';

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

const autoprefixerOptions = {
  browsers: ['last 8 versions', '> 0.5%', 'Firefox ESR'],
  cascade: false
};

const sassdocOptions = {
  dest: './public/sassdoc'
};

// gulp.task('browser-sync', () => {
// 	browserSync.init({
// 		server: {
// 			baseDir: './'
// 		}
// 	});
// });

gulp.task('clean', () => {
	return del([
		'public/css/*.css'
	]);
});

gulp.task('sass', [ 'clean' ], () => {
	return gulp
		.src(input)
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(cssnano())
		.pipe(gulp.dest(output))
		.resume();
});

gulp.task('watch', () => {
	return gulp
		.watch(input, ['sass'])
		.on('change', (event) => {
			console.log(`File ${event.path} was ${event.type}, running tasks...`)
		});
});

gulp.task('sassdoc', () => {
	return gulp
		.src(input)
		.pipe(sassdoc(sassdocOptions))
		.resume();
});

gulp.task('default', [ 'sass', 'watch', 'sassdoc' ]);