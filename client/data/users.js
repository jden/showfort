var Q = require('q')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')
var http = require('../http')

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
  return me().then(function user() {
    if (!user) {
      return register(action).then(function () {
        return fn.call(user)
      })
    }
    return register(action).then(function () {
        return fn.call(user)
      })
    //return fn.call(user)
  })  
}

function register(action) {
  $('#continuationAction').text(action)
  $('#signup').show()
  return Q.promise(function (resolve, reject) {
    $('#signup .button-main').on('click', function (e) { e.preventDefault(); checkRegistrationForm() })
    $('#signup-cancel').on('click', function (e) { e.preventDefault(); close() })

    function checkRegistrationForm() {
      var $msg = $('#continuationMsg')
      var user = $('#register-user').val()
      var pass = $('#register-user').val()

      if(/^[a-zA-Z0-9]+/.test(user) && pass.length > 4) {
        sendRegistration(user, pass).then(function () {
          $msg.text('You\'re all set. Tell all yr friends.')
          setTimeout(function () {
            cleanup()
            resolve()
          }, 500)
        }, function () {
          $msg.text('We couldn\t talk to the internet right now. Bummer. Please try again in a minute.')
          $('#signup-cancel').text('try later')
        })
      } else {
        $msg.text('Oops. Your username should just have letters and numbers, and your password needs to be at least 5 characters')
      }
    }

    function sendRegistration(user, pass) {
      return http.post({url: '/login', data: {user: user, pass: pass }})
    }

    function close() {
      $('#signup').hide();
      cleanup()
      reject(new Error('Not authenticated'))
    }

  })
}

function cleanup() {
  $('#signup .button-main').off()
  $('#signup-cancel').off()
}
