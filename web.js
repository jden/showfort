var wham = require('wham')('treefortApi')
var connect = require('connect')
var snap = require('./snap')
var cookies = require('cookies').express()

var client = require('./client/server')
var shows = require('./core/shows')
var users = require('./core/users')

// requestHandlers
//

wham.use(connect.bodyParser())

wham.use(cookies)
wham.use(users.userify)

//wham.use(connect.favicon('')) //http://www.senchalabs.org/connect/favicon.html
//wham.use(fakeSession)
wham.use(logReq)

module.exports = wham.bam

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

wham('user fave', '/shows/:id/fave')
  .put(shows.faveShow, 'req.user.name', 'req.params.id')
  .delete(shows.unfaveShow, 'req.user.name', 'req.params.id')

wham('show faves', '/shows/:id/faves')
  .get(shows.getFavesById, 'req.params.id')

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
  console.log(req.path, req.query, req.method, req.body, req.session, req.user)
  next()
}