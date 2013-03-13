var wham = require('wham')('treefortApi')
var connect = require('connect')
var snap = require('snap')

var client = require('./client/server')
var shows = require('./core/shows')
var users = require('./core/users')

// requestHandlers
//

wham.use(connect.bodyParser())

module.exports = function init (port) {
  snap(wham,
  {
    secret: 'HELLZYASHOWFORT',
    connectionString: process.env.connectionString,
    authenticate: users.authenticate,
    deserializeUser: users.getByIdN
  },  
  wham.bam.bind(this, port))
}


//wham.use(connect.favicon('')) //http://www.senchalabs.org/connect/favicon.html
//wham.use(fakeSession)
wham.use(logReq)

// endpoints
//

wham('client', '/')
  .get(client)

wham('client assets', '/public')
  .get(client.assets)

wham('shows list', '/shows')
  .get(shows.list, 'req.query.skip', 'req.query.limit', 'req.user')

wham('show comments', '/shows/:id/comments')
  .get(shows.getCommentsById, 'req.params.id')

wham('me', '/me')
  .get(users.me, 'req.user')

wham('login or register', '/login') //like a boss
  .post(users.login)

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
  console.log(req.path, req.query, req.method, req)
  next()
}