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
  console.log(res.cookie, req.cookies)
  if (req.cookies && req.cookies.get('showfortid')) {
    minq.from('users')
      .where({sid: req.cookies.get('showfortid') })
      .one()
      .then(function (user) {
        req.user = user
        console.log('fetched session user from db', user)
        next()
      }, function (e) {
        console.error(e)
        next()
      })
  } else {
    console.log('no session')
    next() 
  }
}

function makeSession(req, res, username) {
    console.log('boo')
  try {
    var sid = minq.ObjectId().toString()
    res.cookies.set('showfortid', sid, { expires: new Date(Date.now() + 30*24*60*60*1000), httpOnly: true, overwrite: true });
    console.log('made session', sid)
  } catch (e) {
    console.log('foo', e, e.stack)
    return Q.reject(e)
  }

  return minq.from('users')
    .where({name: username})
    .update({$set: {sid: sid}})
}

exports.me = function (user) {
  var u = _.cloneDeep(user)
  //delete u.password
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
      .where({name: username})
      .one()
      .then(function (user) {
        if (user) {
          // user already exists
          console.log('authn', user)
          if (user.hashedPassword === hashedPassword) {
            console.log(user.name + ' successfully authenticated')
            makeSession(req, res, username)
              .then(function () {
                return res.send(200)
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
          register(username, hashedPassword).then(function () {
            return makeSession(req, res, username)
          }).then(function () {
            res.send(201)
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
    .insert(user)
}

// @returns Promise<String>
function hash(password) {
  return Q.ninvoke(crypto, 'pbkdf2', password, secret, 10, 64)
}