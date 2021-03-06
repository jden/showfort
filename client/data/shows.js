var Q = require('q')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')
var http = require('../http')

var loaded = false
var shows
var _shows = []
function reload () {
  $.ajax('/shows').then(function (s) {
    _shows = IndexedArray(s)
    window.shows = _shows
    shows = Q.resolve(_shows)
    loaded = true
    events.emit('loaded', shows)
  })
}

reload()

module.exports = {
  byId: byId,
  all: all,
  reload: reload,
  commentsById: commentsById,
  sync: sync
}

function all() {
  if (loaded) return shows
  return Q.promise(function (resolve, reject) {
    events.once('loaded', function () {
      resolve(shows)
    })
  })
}

function byId(id) {
  return all().then(function (shows) {
    return shows[id]
  })
}

function commentsById(id) {
  return Q($.ajax('/shows/'+id+'/comments'))
}

module.exports.favesById = function (id) {
  return http.get('/shows/'+id+'/faves')
}

module.exports.detailsById = function (id) {
  return http.get('/shows/'+id+'/details')
}

function sync(){
  return _shows
}