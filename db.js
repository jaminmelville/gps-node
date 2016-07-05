var mysql = require('mysql')
var config = require('./config.json')
var connection
var connected = 0

exports.connect = () => {
  if (connected == 0) {
    connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'ben',
      password : 'password',
      database : config.database
    })
    connection.connect()
  }
  connected += 1
}

exports.end = () => {
  connected -= 1
  if (connected == 0) {
    connection.end()
  }
}

exports.query = (q, cb) => {
  connection.query(q, cb)
}
