var tGroup = require('./templates/group.bliss')
var tShow = require('./templates/show.bliss')
var _ = require('lodash')
var show = require('./show')
var search = require('./search')

var shows = require('./data/shows')
shows.all().then(function (shows) {
window.shows = shows
  var html = ''

  var s = _.sortBy(shows, 'timestamp')
  s = _.groupBy(s, 'day')

  _.forEach(s, function (shows, day) {
    
    html += tGroup('Day ' + day, 'day')

    var s = _.groupBy(shows, 'hour')
    _.forEach(s, function (shows, hour) {
      html += tGroup(hour, 'hour')
      html += shows.map(tShow).join('')
    })

  })

  $('#shows').append(html) 

})