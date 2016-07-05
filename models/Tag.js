var db = require('./../db.js')
var async = require('async')
var squel = require("squel")

exports.get = (cb) => {
  var q = squel.select().from('Tag')
  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    cb(err, rows)
  })
}

exports.create = (name, cb) => {
  var q = squel.insert().into("Tag").set("name", name)
  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    cb(err, rows)
  })
}
