var Q = require('q')
var http = require('./http')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')
var users = require('./users')
var shows = require('./shows')

var loaded = false
var user
var _user = false


module.exports = {
  fave: fave,
  unfave: unfave
}


function get(type, id) {
  if (type === 'show') {
    return shows.sync()[id]
  }
}

function fave(type, id) {
  var thing = get(type, id)
  return users.authenticated('adding ' +thing.name + ' as a fave',
    function () {
      return http.put({url: '/' + type + 's/' + id + '/fave'})
    })
}

function fave(type, id) {
  var thing = get(type, id)
  return users.authenticated('removing ' +thing.name + ' as a fave',
    function () {
      return http.deleting({url: '/' + type + 's/' + id + '/fave'})
    })
}