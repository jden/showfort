var tGroup = require('./templates/group.bliss')
var tShow = require('./templates/show.bliss')
var _ = require('lodash')
var show = require('./show')
var search = require('./search')
var about = require('./about')
require('./scrollMgr')
var shows = require('./data/shows')


$(render)

function render() {
  shows.all().then(function (shows) {

  window.shows = shows
    var html = ''

    var s = _.sortBy(shows, 'timestamp')
    s = _.groupBy(s, 'day')

    _.forEach(s, function (shows, day) {
      
      html += tGroup('Day ' + day, 'day')

      var s = _.groupBy(shows, 'hour')
      _.forEach(s, function (shows, hour) {
        html += tGroup(hour, 'hour', 'h'+day+hour.replace(':',''))
        html += shows.map(tShow).join('')
      })

    })

    $('#shows').append(html) 
  })
}

setTimeout(function () {
  // try re-rendering if it failed the first time (slow phones)
  if ($('#shows .show').length < 100) {
    render()
  }
}, 2000)