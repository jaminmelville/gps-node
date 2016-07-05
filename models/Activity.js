var db = require('./../db.js')
var async = require('async')
var squel = require("squel")

exports.getNew = (cb) => {
  var activity_ids = squel.select().field('activity_id').from('ActivityTag').group('activity_id')

  var q = squel.select().from('Activity')
  q.field('Activity.id AS id').field('start_time').field('elapsed_time').field('distance').field('filename')
  q.where('Activity.id not in (' + activity_ids + ')')
  q.order('start_time', false)

  db.connect()
  db.query(q.toString(), (err, rows) => {
    db.end()
    if (rows) {
      rows.forEach((row) => {
        row.tags = []
      })
    }
    cb(err, rows)
  })
}

exports.get = (cb, params) => {
  var q = squel.select().from('Activity')
  q.field('Activity.id AS id').field('start_time').field('elapsed_time').field('distance').field('filename')

  if ('id' in params) {
    q.where('Activity.id= ?', parseInt(params.id))
  }
  if ('start' in params && 'end' in params) {
    q.where('start_time BETWEEN ? AND ?', parseInt(params.start), parseInt(params.end))
  }
  if ('max' in params && 'min' in params) {
    q.where('distance BETWEEN ? AND ?', parseInt(params.min), parseInt(params.max))
  }
  if (params.includeTags) {
    q.from('ActivityTag').where('Activity.id = activity_id')
    q.field('count(*) as count')
    q.where('tag_id in ('+ params.includeTags.join(',') + ')')
    q.group('activity_id').having('count = ?', params.includeTags.length)
  }

  q.order('start_time', false)

  if (params.excludeTags) {
    var activity_ids = squel.select()
      .field('activity_id')
      .from('ActivityTag')
      .where('tag_id in (' + params.excludeTags.join(',') + ')')
      .group('activity_id')
    q.where('activity_id not in (' + activity_ids + ')')
  }

  db.connect()

  db.query(q.toString(), (err, rows) => {
    async.forEach(rows, (row, callback) => {
      var q = squel.select().from('Tag').from('ActivityTag')
      q.where('Tag.id = tag_id').where('activity_id = ' + row.id)
      db.query(q.toString(),
       (err, tags) => {
         row.tags = tags
         callback(err)
       })
     },
     (err) => {
      db.end()
      cb(err, rows)
    })
  })
}

exports.create = (activity, cb) => {
  var q = squel.insert().into('Activity')
    .set("filename", activity.filename)
    .set("start_time", activity.start_time)
    .set("elapsed_time", activity.elapsed_time)
    .set("distance", activity.distance)

  db.connect()
  db.query(q.toString(),
    (err, rows) => {
      db.end()
      cb(err, rows)
  })
}
