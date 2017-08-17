'use strict';

const gulp = require('gulp');
// const browserSync = require('browser-sync').create();	Commented out until required

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const sassdoc = require('sassdoc');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const newer = require('gulp-newer');
const imageMin = require('gulp-imagemin');
// const responsive = require('gulp-responsive-images');	Commented out until required

const cleanedFiles = [ 'public/css/*.css' ];
const stylesInput = './assets/sass/*.scss';
const stylesOutput = './public/css';
const imageInput = './assets/images/**/*';
const imageOutput = './public/images';
const htmlInput = './views/*.html';
const htmlOutput = './public/html';

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

const autoprefixerOptions = {
  browsers: ['last 8 versions', '> 0.5%', 'Firefox ESR'],
  cascade: false
};

const sassdocOptions = {  dest: './public/sassdoc' };

const imageOptions = [
    imageMin.gifsicle({interlaced: true}),
    imageMin.jpegtran({progressive: true}),
    imageMin.optipng({optimizationLevel: 5}),
    imageMin.svgo({plugins: [{removeViewBox: true}]})
];


// gulp.task('browser-sync', () => {
// 	browserSync.init({
// 		server: {
// 			baseDir: './'
// 		}
// 	});
// });

gulp.task('clean', () => {
	return del(cleanedFiles);
});

gulp.task('optimiseImages', () => {
	return gulp
		.src(imageInput)
		.pipe(newer(imageOutput))
		.pipe(imageMin(imageOptions))
		.pipe(gulp.dest(imageOutput));
});

// gulp.task('optimiseBackgrounds', () => {
// 	return gulp
// 		.src(imageInput)
// 		.pipe(responsive({
// 			'*': [
// 			{
// 				width: 3500,
// 				rename: { suffix: '-full' }
// 			}, {
// 				width: 1920,
// 				rename: { suffix: '-desktop' }
// 			}, {
// 				width: 1024,
// 				rename: { suffix: '-laptop' }
// 			}, {
// 				width: 768,
// 				rename: { suffix: '-tablet' }
// 			}, {
// 				width: 425,
// 				rename: { suffix: '-mobile' }
// 			}
// 		]}, imageOptions))
// 		.pipe(gulp.dest(imageOutput));
// });

gulp.task('sass', [ 'clean', 'optimiseImages' ], () => {
	return gulp
		.src(stylesInput)
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(cssnano())
		.pipe(gulp.dest(stylesOutput))
		.resume();
});

gulp.task('watch', () => {
	return gulp
		.watch(stylesInput, ['sass'])
		.on('change', (event) => {
			console.log(`File ${event.path} was ${event.type}, running tasks...`)
		});
});

gulp.task('sassdoc', () => {
	return gulp
		.src(stylesInput)
		.pipe(sassdoc(sassdocOptions))
		.resume();
});

gulp.task('default', [ 'sass', 'watch', 'sassdoc' ]);