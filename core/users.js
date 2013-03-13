var minq = require('minq')
var Q = require('q')
var _ = require('lodash')
var crypto = require('crypto')

var secret = 'HELLZYASHOWFORT'

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
  var hashedPassword = hash(req.body.password)

  minq.from('users')
    .where({name: username})
    //.expect(1)
    .one()
    .then(function (user) {
      // user already exists
      // sign in
      req.authenticate()
    }, function () {
      // user does not exist
      return register(username, hashedPassword)
    })

}

exports.getByIdN = function (id, cb) {
  console.log('getting user for id: ', id)
  cb()
}

exports.ensureAuthenticated = function (req, res, next) {
  console.log('AUTHN', req)
  next()
}

exports.authenticate = function (user, pass, done) {
  minq.from('users')
    .where({name: user, hashedPassword: hash(pass) })
    .one(function (user) {
      if (user) {
        done(null, true)
      }
      done(null, false)
    }, done)
}

function register(username, hashedPassword) {

}

function hash(password) {
  return crypto.pbkdf2Sync(password, secret, 10, 64)
}