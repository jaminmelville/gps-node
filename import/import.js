var fs = require('fs');
var FIT = require('../my_modules/FIT');
var Activity = require('../models/Activity.js');
var async = require('async');
var squel = require("squel");
var db = require('./../db.js');

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function semicirclesToDegrees(semicircle) {
  return semicircle / ( Math.pow(2,31) / 180 );
}

function getTimestamp(time) {
  var SECONDS_SINCE_1990 = new Date('1989-12-31').getTime()/1000;
  var epoch = time + SECONDS_SINCE_1990;
  return epoch;
}

var fitFiles = fs.readdirSync('./fit_files');
Activity.get(function(err, activities) {
  var filenames = activities.map(function (activity) {
    return activity.filename;
  });
  var newbies = fitFiles.diff(filenames);
  console.log(newbies.length);

  async.forEach(newbies, function(filename, callback) {

    var session = FIT.read('./fit_files/' + filename).get('SESSION')[0];
    var records = FIT.read('./fit_files/' + filename).get('RECORD');

    var activity = {
      filename: filename,
      start_time: getTimestamp(session.start_time), // SQL datetime
      elapsed_time:session.total_elapsed_time/1000, // Seconds
      distance: session.total_distance/100 // Meters
    };

    Activity.create(activity, function(err, result) {
      var records = FIT.read('./fit_files/' + activity.filename).get('RECORD');

      var rows = records.map(function(record) {
        var time = getTimestamp(record.timestamp);
        var latitude = semicirclesToDegrees(record.position_lat);
        var longitude = semicirclesToDegrees(record.position_long);
        return { time: time, latitude: latitude, longitude: longitude, activity_id: parseInt(result.insertId)};
      });

      var q = squel.insert().into("Record").setFieldsRows(rows);
      db.connect();
      db.query(q.toString(), function (err) {
        db.end();
        callback();
      });
    });
  }, function() {
     db.end();
     console.log('done');
     process.exit();
  });

}, {});
