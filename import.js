var minq = require('minq')
var rawData = require('./data.json')
var log = console.log.bind(console)
var moment = require('moment')


shows = [
{
  name: "To Kickstart or Not To Kickstart: Crowd-Source Funding",
  hour: "11:00am",
  day: 3
},
{
  name: "A Beginners’ Guide to Music Publishing and Licensing",
  hour: "12:30pm",
  day: 3
},
{
  name: "Music Video Production",
  hour: "2:0pm",
  day: 3
},
{
  name: "Los Angeles Music Video Festival Showcase",
  hour: "3:15pm",
  day: 3
},
{
  name: "The Politics of Music",
  hour: "11:00am",
  day: 4
},
{
  name: "Building A Local Music Scene",
  hour: "12:30pm",
  day: 4
},
{
  name: "Bringing it All Together: Band Case Study",
  hour: "2:00pm",
  day: 4
}
]



var ht = 390;

var Show = function(raw) {

  return {
    _id: minq.ObjectId(),
    name: "Panel: " + raw.name,
    tw: undefined,
    hashtag: 'tfort'+ht++,
    venue: 'v18',
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