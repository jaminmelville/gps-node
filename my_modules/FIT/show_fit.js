var FIT = require('./index.js');
var filename = process.argv[2];
var session = FIT.read(filename).get('SESSION')[0];
console.log(session);
var records = FIT.read(filename).get('RECORD')[0];
console.log(records);

var records = FIT.read(filename).get('LAP')[0];
console.log(records);
