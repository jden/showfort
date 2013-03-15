var minq = require('minq')
var Q = require('q')
var _ = require('lodash')
var crypto = require('crypto')

var secret = 'HELLZYASHOWFORT'

var userSessionProjection = {
  _id: 1,
  name: 1,
  bio: 1,
  faves: 1
}

exports.userify = function (req, res, next) {
  //console.log('s', req.cookies, req)
  if (req.cookies && req.cookies.get('showfortid')) {
    console.log('\tgetting session', req.cookies.get('showfortid'))
    minq.from('users')
      .where({sid: req.cookies.get('showfortid') })
      .one()
      .then(function (user) {
        if (!user) {
          req.cookies.set('showfortid')
          console.log('invalid session id')
          return next()
        }
        req.user = user
        console.log('\t\tsession:', user.name)
        next()
      }, function (e) {
        console.error(e)
        next()
      })
  } else {
    console.log('\tno session')
    next() 
  }
}

module.exports.setCookie = function (req, res, username, sid) {
  // yay security!
    minq.from('users')
      .where({sid: sid, name: username })
      .one()
      .then(function (user) {
        if (user) {
          res.cookies.set('showfortid', sid, { expires: new Date(Date.now() + 30*24*60*60*1000), httpOnly: true, overwrite: true, secure: false });
          res.send('Close this tab to continue')
        } else {
          res.send(403)
        }
      })
}

function makeSession(req, res, username) {
  try {
    var sid = minq.ObjectId().toString()
    res.cookies.set('showfortid', sid, { expires: new Date(Date.now() + 30*24*60*60*1000), httpOnly: true, overwrite: true, secure: false });
    console.log('made session', sid)
  } catch (e) {
    console.log('could not make session for ', username, e, e.stack)
    return Q.reject(e)
  }

  return minq.from('users')
    .where({name: username})
    .update({$addToSet: {sid: sid}})
}

function makeUserResp(user) {
  return {
    bio: user.bio,
    faves: user.faves,
    name: user.name
  }
}
exports.me = function (user) {
  if (!user) {
    return Q.resolve()
  }
  var u = makeUserResp(user)
  return Q.resolve(u)
}

exports.login = function (req, res) {
  // register
  // login
  // denied if username exists and passwords dont match
  // also denied if either username or password is blank
  var username = req.body.user

  hash(req.body.pass)
  .then(function (hashedPassword) {
    console.log('login request form ', username)
    delete req.body.pass
    minq.from('users')
      .where({name: minq.like(username)})
      .one()
      .then(function (user) {
        if (user) {
          // user already exists
          console.log('authn', user)
          if (user.hashedPassword === hashedPassword) {
            console.log(user.name + ' successfully authenticated')
            makeSession(req, res, user.name)
              .then(function () {
                return res.send(makeUserResp(user))
              }, function (e) {
                console.error(e)
                return res.send(500)
              })
          } else {
            console.log('invalid username and / or password')
            res.send(403)
          }

        } else {
          // user does not exist
          register(username, hashedPassword).then(function (user) {
            return makeSession(req, res, user.name)
          }).then(function () {
            res.send(201, makeUserResp(user))
          }, function (e) {
            console.log(e)
            res.send(500)
          })
        }
      })
  })
}

exports.getByIdN = function (id, cb) {
  console.log('getting user for id: ', id)
  cb()
}

exports.ensureAuthenticated = function (req, res, next) {
  //console.log('AUTHN', req)
  next()
}

exports.authenticate = function (username, hashedPassword, done) {
    console.log('authenticating', username, hashedPassword)
    minq.from('users')
      .where({name: username, hashedPassword: hashedPassword })
      .one(function (user) {
        if (user) {
          console.log(user + ' just logged in')
          return done(null, true)
        }
        console.log('failed login attempt for ' + user)
        done(null, false)
      }, done)
}

function register(username, hashedPassword) {
  console.log('registering', username)
  var user = {
    name: username,
    hashedPassword: hashedPassword,
    bio: '',
    faves: {
      shows: [],
      venues: [],
      users: []
    }
  }
  return minq.from('users')
    .insert(user).then(function (){ return user })
}

// @returns Promise<String>
function hash(password) {
  return Q.ninvoke(crypto, 'pbkdf2', password, secret, 10, 64)
}