var express = require('express')
var http = require('http')
var Activity = require('./models/Activity.js')
var ActivityTag = require('./models/ActivityTag.js')
var Record = require('./models/Record.js')
var Note = require('./models/Note.js')
var Tag = require('./models/Tag.js')
var async = require('async')
var hbs = require('hbs')
var socket = require('socket.io')
var usb = require('usb')
var cookieParser = require('cookie-parser')
var exec = require('child_process').exec
var config = require('./config.json')

var app = express()
var server = http.Server(app)
var io = socket(server)

app.set('views', './views')
app.set('view engine', 'hbs')

hbs.registerHelper('toJSON', (object) => {
  return JSON.stringify(object)
})

app.use(express.static('./public'))
var bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(cookieParser())

var themer = (req, res, next) => {
  var theme = req.cookies.theme ? req.cookies.theme : 'green'
  hbs.registerHelper('theme', () => {
    return theme
  })
  next()
}

app.use(themer)
app.get('/', (req, res) => {
  Tag.get((err, tags) => {
    res.render('index', {tags:tags})
  })
})

app.get('/activity/:id', (req, res) => {
  var activity
  var tags
  var records
  var note

  async.parallel([
      (cb) => {
        Activity.get((err, activities) => {
          activity = activities.pop()
          cb()
        }, {id: req.params.id})
      },
      (cb) => {
        Tag.get((err, data) => {
          tags = data
          cb()
        })
      },
      (cb) => {
        Note.get(req.params.id, (err, data) => {
          note = data
          cb()
        })
      },
      (cb) => {
        Record.get(req.params.id, (err, data) => {
          records = data
          cb()
        })
      }
  ], () => {
    res.render('activity', {activity: activity, tags: tags, records: records, note:note})
  })

})

app.get('/create', (req, res) => {
  res.render('create')
})

app.post('/api/create', (req, res) => {
  var activity = {
    start_time: req.body.timestamp,
    filename: 'man_' + req.body.timestamp,
    distance: req.body.distance,
    elapsed_time: req.body.elapsed_time
  }
  Activity.create(activity, (err, result) => {
      res.send('/activity/' + result.insertId)
  })
})

app.post('/api/activities', (req, res) => {
  Activity.get((err, activities) => {
    res.json(activities)
  }, req.body)
})

app.get('/api/new-activities', (req, res) => {
  Activity.getNew((err, activities) => {
    res.json(activities)
  })
})

app.get('/tags', (req, res) => {
  res.render('tags')
})

app.post('/api/tag/create', (req, res) => {
  Tag.create(req.body.name, (err, rows) => {
    res.send('success')
  })
})

app.post('/api/tag/add', (req, res) => {
  ActivityTag.add((err, rows) => {
    res.send('success')
  }, req.body)
})

app.post('/api/tag/remove', (req, res) => {
  ActivityTag.remove((err, rows) => {
    res.send('success')
  }, req.body)
})

app.post('/api/note/update', (req, res) => {
  Note.set(req.body.id , req.body.text, (err) => {
    res.send('success')
  }, req.body)
})

var syncFiles = () => {
  console.log('syncing files')
  setTimeout(() => {
    exec('rsync -avhzP /media/ben/GARMIN/GARMIN/ACTIVITY/ /usr/local/gps-node/fit_files/; \
      rsync -avhzP /media/heidi/GARMIN/GARMIN/ACTIVITY/ /usr/local/gps-node/fit_files/; \
      cd /usr/local/gps-node/; node import/import.js', (err, stdout, stderr) => {
        // @todo Call the node script here rather than through a new child_process.
        if (err) {
          console.error(err)
          return
        }
        console.log(stdout)
        io.emit('attach')
      }
    )
  }, 2000)
}

var VID = 2334
var PID = 9674

var device = usb.findByIds(VID, PID)
if (device) {
  console.log('Watch is plugged in already')
  syncFiles()
}

usb.on('attach', (device) => {
  if (device.deviceDescriptor.idVendor == VID && device.deviceDescriptor.idProduct == PID) {
    console.log('Watch has just been plugged in')
    syncFiles()
  }
})

usb.on('detach', (device) => {
  if (device.deviceDescriptor.idVendor == VID && device.deviceDescriptor.idProduct == PID) {
    console.log('Watch has just been unplugged')
  }
})

server.listen(config.port)
