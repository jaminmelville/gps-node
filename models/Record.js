var db = require('./../db.js')
var squel = require("squel")

exports.get = (activity_id, cb) => {
  var q = squel.select().from('Record').where('activity_id = ?', activity_id)
  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    cb(err, rows)
  })
}
