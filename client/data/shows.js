var Q = require('q')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')

var loaded = false
var shows

function reload () {
  $.ajax('/shows').then(function (s) {
    var indexed = IndexedArray(s)
    window.shows = indexed
    shows = Q.resolve(indexed)
    loaded = true
    events.emit('loaded', shows)
  })
}

reload()

module.exports = {
  byId: byId,
  all: all,
  reload: reload
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
    console.log(shows, id, shows[id])
    return shows[id]
  })
}