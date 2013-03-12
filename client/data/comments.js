var Q = require('q')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')
var users = require('./users')
var shows = require('./shows')

var loaded = false
var user
var _user = false
function reload () {
  $.ajax('/me').then(function (u) {
    _user = u
    window.user = u
    user = Q.resolve(u)
    loaded = true
    events.emit('loaded', user)
  }, function () {
    // not logged in
  })
}

reload()

module.exports = {
  postComment: postComment
}


function postComment(type, id, text) {
  var thing
  if (type === 'show') {
    thing = shows.sync()[id]
  }

  users.me().then(function (user) {
    if (!user) {
      return users.register('posting a comment on ' + thing.name, postComment, type, id, text)
    }

    return Q($.ajax({method: 'post', url: '/'+type+'s/'+id+'/comment'})).then(function () {
      // comments posted
    })

  })
}

function me() {
  if (loaded) return user
  return Q.promise(function (resolve, reject) {
    events.once('loaded', function () {
      resolve(user)
    })
  })
}

function sync(){
  return me
}