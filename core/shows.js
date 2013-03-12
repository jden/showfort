var minq = require('minq')
var IndexedArray = require('indexed-array')

var listProjection = {
  name: 1,
  venue: 1,
  day: 1,
  hour: 1,
  hashtag: 1,
  timestamp: 1,
  timeclass: 1,
  score: 1
}

var list = function (skip, limit) {
  console.log('LIST', arguments)
  skip = skip || 0
  limit = limit || 500
  return minq
    .from('shows')
    .select(listProjection)
    .skip(skip)
    .limit(limit)
    .toArray()
}

exports.getUserByName = function (username) {
  return minq
    .from('users')
    .where({name: username})
    .one()
}

var renderShows = function (shows, user) {

  shows.forEach(function (show) {
    if (show.venue === 'v3') {
      show.faves = ['bob','jim','sue','mary']
    }
  })
  return shows
}

exports.list = function (skip, limit, user) {
  var shows = list(skip, limit)
  if (!user) return shows;

  return shows.then(function (shows) {
    return renderShows(shows)
  })
}

exports.faveShow = function (username, showId) {
  return minq
    .from('users')
    .where({name: username})
    .update({$addToSet: {faves: minq.ObjectId(showId)}})
}

exports.unfaveShow = function (username, showId) {
  return minq
    .from('users')
    .where({name: username})
    .update({$pull: {faves: minq.ObjectId(showID)}})
}

exports.getCommentsById = function (showId) {
  showId = '8ba4a2177aef90c068bcd108'
  return minq
    .from('shows')
    .byId(showId)
    .select({comments: 1})
    .one().then(function (show) {
      return show.comments
    })
}

exports.addComment = function (username, showId, text) {
  var comment = {user: username, text: text, mentioned:[], hashtags:[]}
  return minq
    .from('shows')
    .byId(showId)
    .update({$push: {'comments': comment}})
}