var gulp = require('gulp')
var babel = require('gulp-babel')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var exec = require('child_process').exec
var browserSync = require('browser-sync').create()
var spawn = require('child_process').spawn
var concat = require('gulp-concat')
var async = require('async')

var jsMap = [
  {
    input: ['./jsx/common/*.js'],
    output: 'common.js'
  },
  {
    input: ['./jsx/home/*.js', './jsx/Home.js'],
    output: 'home.js'
  },
  {
    input: ['./jsx/activity/*.js', './jsx/Activity.js'],
    output: 'activity.js'
  }
]

gulp.task('jsx', (callback) => {
  async.eachSeries(jsMap, (item, cb) => {
    gulp.src(item.input)
      .pipe(babel({
        presets: ['es2015', 'react']
      })).on('error', function(err) {
        console.log(err.codeFrame)
        this.emit('end')
      })
      .pipe(concat(item.output))
      .pipe(gulp.dest('./public/js'))
      .on('end', cb)
  }, callback)
})

gulp.task('web-server', () => {
  spawn('node', ['server.js'], {detached: true})
})

gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: "localhost:7777",
    ws: true
  })
})

gulp.task('db-sync', (cb) => {
  var command = 'rsync -avzrP pi@pi.local:/home/pi/code/apps/gps-node/fit_files/ fit_files/;'
  // command += 'sudo mysql -u ben -ppassword < schema.sql; '
  command += 'mysqldump -u ben -ppassword gps | mysql -u ben -ppassword uatgps <&0'
  exec(command, cb)
})

gulp.task('push-to-pi', (cb) => {
  var command = 'rsync -avzrP --exclude node_modules . pi:/home/pi/code/apps/gps-node/ --delete;'
  command += 'ssh pi "sudo service gps stop; sudo service gps start"'
  exec(command, cb)
})

gulp.task('sass', () => {
  gulp.src('./sass/themes/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['./bower_components/foundation-sites/scss', './bower_components/motion-ui/src']
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
})

gulp.task('watch', ['browser-sync', 'jsx', 'sass'], () => {
    gulp.watch('./jsx/**/*', ['jsx'])
    gulp.watch('./sass/**/*.scss', ['sass'])
    gulp.watch(['./public/**/*', 'views/**/*']).on('change', () => {
      setTimeout(browserSync.reload, 1000)
    })
})
