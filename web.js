var wham = require('wham')('treefortApi')
var passport = require('passport')

var client = require('./client/server')
var shows = require('./core/shows')

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

wham('upcoming shows', '/shows/upcoming')
  .get(shows.listFuture, 'req.query.skip', 'req.query.limit', 'req.user')

wham('upvote', '/shows/:id/upvote')
  .put({auth: true},
    shows.upvoteShow, 'req.params.id', 'req.user')
  //.delete({auth: true},
    //shows.unupvoteShow, 'req.params.id', 'req.user')

wham('downvote', '/shows/:id/downvote')
  .put({auth: true}, wham)

module.exports = wham.bam

function fakeSession(req, res, next) {
  req.user = {
    _id: '4343534t43t43t3443543',
    name: 'jden',
    faves: [],
    upvoted: [],
    downvoted: []
  }
  next()
}

function logReq(req, res, next) {
  console.log(req.path, req.query, req.method, req.user.name)
  next()
}