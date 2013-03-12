var Q = require('q')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')

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
  me: me,
  meSync: meSync,
  authenticated: authenticated
}

function me() {
  if (loaded) return user
  return Q.promise(function (resolve, reject) {
    events.once('loaded', function () {
      resolve(user)
    })
  })
}

function meSync(){
  return me
}

function authenticated(action, fn) {
  return Q.promise(function(resolve, reject) {
    me().then(function user() {
      if (!user) {
        return register(action, fn)
      }
      return fn.call(user)
    })  
  })
}