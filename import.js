var minq = require('minq')
var rawData = require('./data.json')
var log = console.log.bind(console)
var moment = require('moment')


var ht = 1;

var Show = function(raw) {

  return {
    _id: minq.ObjectId(raw.href.substr('/event/'.length, 24)), //minq.ObjectId()
    name: raw.name,
    tr: raw.tw,
    hashtag: 'tfort'+ht++,
    venue: 'v'+raw.class.substr(3),
    day: raw.date.substr(9),
    hour: raw.time.trim(),
    timestamp: +timestamp(raw),
    faves: [],
    comments: [],
    tags: []
  }
}

function timestamp(obj) {

  var parsed = obj.time.trim().match(/(.*)(am|pm)/)
  var hhmm = parsed[1]
  var ampm = parsed[2]

  var date = parseInt(obj.date.substr('2013-03-'.length))

  if (ampm === 'am') {
    date++
  }

  return moment('2013-03-' + date +' ' + hhmm + ampm + ' -0600',
    'YYYY-MM-DD h:ma z')._d
}

var cs = 'mongodb://localhost/treefort'

minq.verbose = true
minq.connect(cs)
.then(function () {
  minq.collection('users').drop()  
})
.then(function () {
  return minq.collection('shows').drop()
})
.then(function () {

  rawData.map(Show).forEach(function (show) {
    minq.collection('shows').insert(show)
  })

  minq.collection('users').insert({
    name: 'jden',
    bio: 'real life awesome dude',
    faves: {
      shows: [],
      venues: [],
      users: []
    }
  })

}).then(function () {
  process.exit()
}).done()