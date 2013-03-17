var Q = require('q')
var EE = require('events').EventEmitter
var events = new EE()
var IndexedArray = require('indexed-array')
var http = require('../http')
var notice = require('../notice')

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
    notice('Protip: You can customize your schedule! Tap "<span class="icon-star"></span> fave" on any show.')
  }
})


module.exports.getUser = function (username) {
  return http.get('/users/' + username)
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
  return _user
}

function authenticated(action, fn) {
  return me().then(function (user) {
    if (!user) {
      return register(action).then(function (user) {
        var msg = 'Welcome, ' + user.name + '!'
        var weGotUserStateThatWeNeedToRerender = user.faves.shows.length > 1
        if (weGotUserStateThatWeNeedToRerender) {
          msg += ' Reload the app to restore your faved shows.'
        }
        notice(msg)
        return fn.call(user, user)
      })
    }

    return fn.call(user, user)
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
        $('#signup .button-main').text('sending...')
        $('#register-pass, #register-user').blur()
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

    //var url = (/fort/.test(window.location.href)) ? 'https://showfort.jitsu.com/'
    function sendRegistration(user, pass) {
      return http.post({url: '/login', data: {user: user, pass: pass }}).then(function (rUser) {
        _user = rUser
        user = resolve(rUser)
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
