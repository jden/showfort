require('./vmouse')
var tGroup = require('./templates/group.bliss')
var tShow = require('./templates/show.bliss')
var _ = require('lodash')
var show = require('./show')
var search = require('./search')
var about = require('./about')
require('./scrollMgr')
var shows = require('./data/shows')
var users = require('./data/users')

$(function () {
  render()
  $('#back').on('vclick', function (e) {
    e.preventDefault()
    $(document).trigger('back')
  })
})

var days = {
  '1': 'Thursday',
  '2': 'Friday',
  '3': 'Saturday',
  '4': 'Sunday'
}

function render() {

  shows.all().then(function (shows) {

  window.shows = shows
    var html = ''

    var s = _.sortBy(shows, 'timestamp')
    s = _.groupBy(s, 'day')

    _.forEach(s, function (shows, day) {
      
      var label = 'Day ' + day + ' (' + days[day] + ')'

      html += tGroup(label, 'day')

      var s = _.groupBy(shows, 'hour')
      _.forEach(s, function (shows, hour) {
        html += tGroup(hour, 'hour', 'h'+day+hour.replace(':',''))
        html += shows.map(tShow).join('')
      })

    })

    goToNow()

    $('#shows').empty().append(html) 
    $(window).trigger('hashchange')
  })


  $('#notice').on('vclick', '.login-btn', function () {
    users.authenticated(false, function () {})
  })
}

setTimeout(function () {
  // try re-rendering if it failed the first time (slow phones)
  if ($('#shows .show').length < 100) {
    render()
  }
}, 2000)

function goToNow(time) {
  time = time || new Date
 shows.all().then(function (shows){
    var next = _.find(_.sortBy(shows, 'timestamp'), function (show) {
      return show.timestamp > time
    })
    var header = 'h'+next.day+next.hour.replace(':','')
    try{
      $('#'+header).addClass('nextUp')[0].scrollIntoView()
    } catch (e) {

    }
 })
}
window.gtn = goToNow
