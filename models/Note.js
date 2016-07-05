var db = require('./../db.js')
var squel = require("squel")

exports.get = (id, cb) => {
  var q = squel.select().from('Activity').where('id = ?', id)
  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    cb(err, rows.pop())
  })
}

exports.set = (id, note, cb) => {
  var q = squel.update().table('Activity').where('id = ?', id).set('note', note)
  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    cb(err)
  })
}
