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
    events.emit('loaded', _user)
  }, function () {
    // not logged in, error
  })
}

reload()

module.exports = {
  me: me,
  meSync: meSync,
  authenticated: authenticated
}

events.on('loaded', function (user) {
  if (!user) {
    $('#notice').show()
  }
})


function me() {
  if (loaded) return user
  return Q.promise(function (resolve, reject) {
    events.once('loaded', function () {
      resolve(user)
    })
  })
}

function meSync(){
  return _user
}

function authenticated(action, fn) {
  return me().then(function (user) {
    if (!user) {
      return register(action).then(function () {
        $('#notice-msg').text('Welcome, ' + _user.name + '!')
        $('#notice').show()
        if (_user.faves.shows.length) {
          window.location.reload()
        }
        return fn.call(user)
      })
    }

    return fn.call(user)
  })  
}

function register(action) {
  if (action) {
    $('#continuationAction').text(action)
  } else {
    $('#continuationMsg').text('')
  }
  $('#signup').show()
  $('#register-user').focus()


  return Q.promise(function (resolve, reject) {
    $('#signup .button-main').on('vclick', function (e) { e.preventDefault(); checkRegistrationForm() })
    $('#signup-cancel').on('vclick', function (e) { e.preventDefault(); close() })
    $('#register-pass').on('keyup', function (e) {
      if (e.keyCode === 13) { checkRegistrationForm() }
    }) 
    
    function checkRegistrationForm() {
      var $msg = $('#continuationMsg')
      var user = $('#register-user').val()
      var pass = $('#register-pass').val()

      if(/^[a-zA-Z0-9]+$/.test(user) && pass.length > 4) {
        sendRegistration(user, pass).then(function () {
          $('#signup h2').html('You\'re all set.<br/>Tell all yr friends.').delay(750).fadeOut(function () {
            $('#signup').hide()
            resolve()
          })
          $('#signup .input-group, #signup-cancel, #continuationMsg, .button-main').hide()
        }, function (e) {
          if (e && e.status === 403) {
            $msg.text('Incorrect username or password.')
            $('#signup-cancel').text('try later')
          } else {
            $msg.text('We couldn\t talk to the internet right now. Bummer. Please try again in a minute.')
            $('#signup-cancel').text('try later')            
          }
        })
      } else {
        $msg.text('Oops. Your username should just have letters and numbers, and your password needs to be at least 5 characters')
      }
    }

    function sendRegistration(user, pass) {
      return http.post({url: '/login', data: {user: user, pass: pass }}).then(function (rUser) {
        _user = rUser
        user = Q.resolve(rUser)
      })
    }

    function close() {
      $('#signup').hide();
      $('#register-pass').off()
      $('#signup .button-main').off()
      $('#signup-cancel').off()
      reject(new Error('Not authenticated'))
    }

  })
}
