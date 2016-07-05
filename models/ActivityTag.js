var db = require('./../db.js')
var async = require('async')
var squel = require("squel")

exports.add = (cb, params) => {
  var q = squel.insert().into("ActivityTag")
    .set("activity_id", parseInt(params.activity_id))
    .set("tag_id", parseInt(params.tag_id))
  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    cb(err, rows)
  })
}

exports.remove = (cb, params) => {
  var q = squel.delete().from("ActivityTag")
    .where("activity_id = ?", parseInt(params.activity_id))
    .where("tag_id = ?", parseInt(params.tag_id))
  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    cb(err, rows)
  })
}
