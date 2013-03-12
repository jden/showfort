var wham = require('wham')('treefortApi')
var passport = require('passport')

var client = require('./client/server')
var shows = require('./core/shows')
var users = require('./core/users')

// requestHandlers
//

wham.use(fakeSession)
wham.use(logReq)
//wham.use(connect.session({secret: 'trees' }))
//wham.use(passport.initialize())
//wham.use(passport.session())

// responseHandlers
//

// endpoints
//

wham('client', '/')
  .get(client)

wham('client assets', '/public')
  .get(client.assets)

wham('shows list', '/shows')
  .get(shows.list, 'req.query.skip', 'req.query.limit', 'req.user')

wham('show comments', '/shows/8ba4a2177aef90c068bcd108/comments')
  .get(shows.getCommentsById, 'req.params.id')

wham('me', '/me')
  .get(users.me, 'req.user')

wham('login or register', '/login') //like a boss
  .post(users.login)

module.exports = wham.bam

function fakeSession(req, res, next) {
  req.user = {
    _id: require('minq').ObjectId().toString(),
    username: 'jden',
    bio: 'real life awesome dude',
    faves: [],
    friends: []
  }
  next()
}

function logReq(req, res, next) {
  console.log(req.path, req.query, req.method, req.user.name)
  next()
}