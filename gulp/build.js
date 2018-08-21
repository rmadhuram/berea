'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var s3 = require('gulp-s3');
var gutil = require('gulp-util');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'socialDash',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };

  var htmlFilter = $.filter('*.html', { restore: true });
  var jsFilter = $.filter('**/*.js', { restore: true });
  var cssFilter = $.filter('**/*.css', { restore: true });

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe($.useref())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))
    .pipe($.rev())
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    // .pipe($.sourcemaps.init())
    .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', '../fonts/'))
    .pipe($.cssnano())
    .pipe($.rev())
    // .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.htmlmin({
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,otf,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

// Only applies for images from bower dependencies
gulp.task('images', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{png,jpg,jpeg,gif,svg}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, '/styles/')));
});

gulp.task('img', function () {
  return gulp.src(path.join(conf.paths.src, '/img/**/*'))
    .pipe(gulp.dest('./dist/img/'));
});

gulp.task('server', function () {
  return gulp.src('./server/*')
    .pipe(gulp.dest('./dist/server/'));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

// move server.js & package.json into dist/ bundle so that it can be pushed to remote server and deployed.
gulp.task('server-files', function () {
  return gulp.src([
    'server.js',
    'package.json'
  ])
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});


gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

gulp.task('sass-lint', function () {
  var sassLint = require('gulp-sass-lint');
  return gulp.src(path.join(conf.paths.src, '/app/**/*.scss'))
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

gulp.task('build', ['html', 'fonts', 'images', 'server', 'img', 'other', 'server-files', 'sass-lint', 'env']);

var rename = require("gulp-rename");

var env = "",
  destination = conf.paths.dist;

//build depending upon env
gulp.task('env', () => {
  gutil.log(env);
  //gutil.log("env "+ path.join(conf.paths.src, '/app/config/'+'env-integration'+'.js'));
  if(env === "") {
    env = 'env-local';
    destination = conf.paths.src + '/app';
    gutil.log(destination);
  }

  gulp.src(path.join(conf.paths.src, 'config/'+env+'.js'))
  .pipe(rename('env.js'))
  .pipe(gulp.dest(path.join(destination, '/config')));
});


// gulp task to build cdnify and send to S3 in sequence
gulp.task('cdn:int', function (done) {
  env = "env-integration";
  sequence('build','cdnify:int', 'uploadToS3:int', done);
});
//'cdnify_int', 'uploadToS3_int'
gulp.task('cdn:staging', function (done) {
  env = "env-staging";
  sequence('build', 'cdnify:staging', 'uploadToS3:staging', done);
});
gulp.task('cdn:prod', function (done) {
  env = "env-production";
  sequence('build', 'cdnify:prod', 'uploadToS3:prod', done);
});

gulp.task('build:dist', function (done) {
  env = "env-dist";
  sequence('clean', 'build', done);
});



var sequence = require('run-sequence');

// It will upload the 'src' into '/dsp-<env>-folder'

var options_int = {
  uploadPath: 'dsp/int/',
  "x-amz-acl": 'READ'
};

var options_staging = {
  uploadPath: 'dsp/staging/',
  "x-amz-acl": 'READ'
};

var options_prod = {
  uploadPath: 'dsp/prod/',
  "x-amz-acl": 'READ'
};


// change the urls of index.html dependencies from static to s3 urls
var cdnizer = require("gulp-cdnizer");
gulp.task('cdnify:int', function () {
  gulp.src("dist/index.html", { read: true })
    .pipe(cdnizer({
      files: [
        {
          file: 'styles/vendor-*.css',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/int/styles/${ filename }'
        },
        {
          file: 'styles/app-*.css',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/int/styles/${ filename }'
        },
        {
          file: 'scripts/vendor-*.js',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/int/scripts/${ filename }'
        },
        {
          file: 'scripts/app-*.js',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/int/scripts/${ filename }'
        }
      ]
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('cdnify:prod', function () {
  gulp.src("dist/index.html", { read: true })
    .pipe(cdnizer({
      files: [
        {
          file: 'styles/vendor-*.css',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/prod/styles/${ filename }'
        },
        {
          file: 'styles/app-*.css',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/prod/styles/${ filename }'
        },
        {
          file: 'scripts/vendor-*.js',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/prod/scripts/${ filename }'
        },
        {
          file: 'scripts/app-*.js',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/prod/scripts/${ filename }'
        }
      ]
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('cdnify:staging', function () {
  gulp.src("dist/index.html", { read: true })
    .pipe(cdnizer({
      files: [
        {
          file: 'styles/vendor-*.css',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/staging/styles/${ filename }'
        },
        {
          file: 'styles/app-*.css',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/staging/styles/${ filename }'
        },
        {
          file: 'scripts/vendor-*.js',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/staging/scripts/${ filename }'
        },
        {
          file: 'scripts/app-*.js',
          cdn: 'https://s3.amazonaws.com/c1x-ui/dsp/staging/scripts/${ filename }'
        }
      ]
    }))
    .pipe(gulp.dest('./dist/'));
});
