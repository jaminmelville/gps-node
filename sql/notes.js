var Activity = require('../models/Activity.js');
var squel = require("squel");
var db = require('./../db.js');

Activity.get(function(err, activities) {
  var rows = activities.map(function(activity) {
    return {activity_id:activity.id, text:''}
  });

  var q = squel.insert().into("Note").setFieldsRows(rows);

  db.connect();
  db.query(q.toString(), function () {
    db.end();
    console.log('done.');
  });
},{});
