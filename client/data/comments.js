var Q = require('q')
var http = require('../http')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')
var users = require('./users')
var shows = require('./shows')


module.exports = {
  postComment: postComment
}

function get(type, id) {
  if (type === 'show') {
    return shows.sync()[id]
  }
}

function postComment(type, id, text) {
  var thing = get(type, id)

  return users.authenticated('posting a comment on ' + thing.name, function () {
    return http.post({url: '/'+type+'s/'+id+'/comment', data: text})
  })
}