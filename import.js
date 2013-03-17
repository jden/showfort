var minq = require('minq')
var rawData = require('./data.json')
var log = console.log.bind(console)
var moment = require('moment')


shows = [
{
  name: "Jake McKelvie & The Countertops",
  hour: "11:30am",
  day: 3
},
{
  name: "Dan Costello",
  hour: "11:30am",
  day: 4
}
]



var ht = 320;

var Show = function(raw) {

  return {
    _id: minq.ObjectId(),
    name: raw.name,
    tw: undefined,
    hashtag: 'tfort'+ht++,
    venue: 'v15',
    day: raw.day,
    hour: raw.hour,
    timestamp: +timestamp(raw),
    faves: [],
    comments: [],
    tags: []
  }
}

function timestamp(obj) {

  var parsed = obj.hour.trim().match(/(.*)(am|pm)/)
  var hhmm = parsed[1]
  var ampm = parsed[2]

  var date = obj.day + 20

  return moment('2013-03-' + date +' ' + hhmm + ampm + ' -0600',
    'YYYY-MM-DD h:ma z')._d
}

console.log(shows.map(Show))

//var cs = 'mongodb://localhost/treefort'
var cs = 'mongodb://tfweb:98jp3h98fjouhrf9834jf98@linus.mongohq.com:10065/treefort'
minq.verbose = true
minq.connect(cs)
.then(function () {
  //minq.collection('users').drop()  
})
.then(function () {
  //return minq.collection('shows').drop()
})
.then(function () {

  shows.map(Show).forEach(function (show) {
    minq.collection('shows').insert(show)
  })

  // minq.collection('users').insert({
  //   name: 'jden',
  //   bio: 'real life awesome dude',
  //   faves: {
  //     shows: [],
  //     venues: [],
  //     users: []
  //   }
  // })

}).then(function () {
  //process.exit()
}).done()