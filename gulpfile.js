(function() {
	'use strict';

	const gulp = require('gulp');
	const babel = require('gulp-babel');
	const stylus = require('gulp-stylus');
	const cleanCSS = require('gulp-clean-css');
	const rename = require('gulp-rename');
	const concat = require('gulp-concat');
	const uglify = require('gulp-uglify');
	const postcss = require('gulp-postcss');
	const autoprefixer = require('gulp-autoprefixer');
	const del = require('del');
	const lost = require('lost');
	const nib = require('nib');
	const rupture = require('rupture');
	const sourcemaps = require('gulp-sourcemaps');
	const pages = require('gulp-gh-pages');

	// Styles
	gulp.task('styles', function () {
		return gulp.src('assets/src/styl/**/*.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus({
			compress: true,
			use: [nib(), rupture()]
		}))
		.pipe(postcss([
			lost()
		]))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('assets/dist/css'));
	});

	// Scripts
	gulp.task('scripts', function() {
	  return gulp.src('./assets/src/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ["env"]
		}))
		.pipe(uglify())
		.pipe(concat('main.js'))
		.pipe(rename("main.min.js"))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./assets/dist/js'));
	});

	// HTML
	gulp.task('html', function() {
		return gulp.src('./assets/src/index.html')
		.pipe(gulp.dest('assets/dist'));
	});

	// Clean
	gulp.task('clean', function() {
	  del(['./assets/dist']);
	})

	// Build
	gulp.task('build', ['html', 'styles', 'scripts']);

	// Deploy
	gulp.task('deploy', function() {
		return gulp.src('assets/dist/**/*')
		.pipe(pages());
	});

	// Watch
	gulp.task('watch', function(){
		gulp.watch('./assets/src/*.html', ['html']);
		gulp.watch('./assets/src/styl/**/*.styl', ['styles']);
		gulp.watch('./assets/src/js/*.js', ['scripts']);
	});

}())
