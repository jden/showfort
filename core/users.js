var minq = require('minq')
var Q = require('q')
var _ = require('lodash')
// require bcrypt or use node crypto secure hash

var secret = 'HELLZYASHOWFORT'

exports.me = function (user) {
  var u = _.cloneDeep(user)
  delete u.password
  return Q.resolve(u)
}

exports.login = function (req, res) {
  // register
  // login
  // denied if username exists and passwords dont match
  // also denied if either username or password is blank

  var username = req.body.username
  var hashedPassword = hash(req.body.password)

  minq.from('users')
    .where({username: username})
    .expect(1)
    .one()
    .then(function (user) {
      // user already exists
    }, function () {
      // user does not exist
      return register(username, hashedPassword)
    })

}

function register(username, hashedPassword) {

}

function hash(password) {
  return 'foo'
}