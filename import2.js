var minq = require('minq')
var cs = 'mongodb://tfweb:98jp3h98fjouhrf9834jf98@linus.mongohq.com:10065/treefort'
//var cs = 'mongodb://localhost/treefort'

minq.verbose = true
minq.connect(cs)
var shows = [{
  "name": "Nick Jaina",
  "tw": "nickjaina",
  "hashtag": "tfort301",
  "venue": "v14",
  "day": "1",
  "hour": "12:00pm",
  "timestamp": 1363888800000,
  "faves": [],
  "comments": [],
  "tags": []
},

{
  "name": "B. Dolan",
  "tw": "BDolanSFR",
  "hashtag": "tfort302",
  "venue": "v14",
  "day": "1",
  "hour": "1:30pm",
  "timestamp": 1363894200000,
  "faves": [],
  "comments": [],
  "tags": []
},

{
  "name": "Foxygen",
  "tw": "foxygentheband",
  "hashtag": "tfort303",
  "venue": "v14",
  "day": "1",
  "hour": "3:00pm",
  "timestamp": 1363899600000,
  "faves": [],
  "comments": [],
  "tags": []
}]

shows.forEach(function (show) {
minq.from('shows').insert(show)
console.log('inserted', show.name)
  })