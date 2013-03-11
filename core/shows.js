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

var listFuture = function (skip, limit) {
  skip = skip || 0
  limit = limit || 500
  return minq
    .from('shows')
    .select(listProjection)
    .where({
      time: {$gt: +new Date}
    })
    .skip(skip)
    .limit(limit)
    .toArray()
}

var customizeShows = function (shows, user) {
  var faves = IndexedArray(user.faves)
  var upvoted = IndexedArray(user.upvoted)
  var downvoted = IndexedArray(user.downvoted)

  shows.forEach(function (show) {
    show.fave = show._id.toString() in user.faves
    if (show.venue === 'v3') {
      show.score = 5
      show.fave = true
    }
    show.upvoted = show._id.toString() in user.upvoted
    show.downvoted = show._id.toString() in user.downvoted
  })
  return shows
}

exports.list = function (skip, limit, user) {
  var shows = list(skip, limit)
  if (!user) return shows;

  return shows.then(function (shows) {
    return customizeShows(shows, user)
  })
}

exports.listFuture = function (skip, limit, user) {
  var shows = listFuture(skip, limit)
  if (!user) return shows;

  return shows.then(function (shows) {
    return customizeShows(shows, user)
  })
}

exports.upvoteShow = function (showId, username) {
  showId = minq.ObjectId(showId)
  var show = minq
    .from('shows')
    .byId(showId)
    .update({$addToSet: {upvotes: username}, $pull: {downvotes: username}})
  var user = minq
    .from('users')
    .where({name: username})
    update({$addToSet: {upvoted: showId}, $pull: {downvoted: showId}})

  return Q.all([show, user]).then(function () { updateScore(showId) })
}

exports.downvoteShow = function (showId, username) {
  showId = minq.ObjectId(showId)
  var show = minq
    .from('shows')
    .byId(showId)
    .update({$addToSet: {donwvotes: username}, $pull: {upvotes: username}})
  var user = minq
    .from('users')
    .where({name: username})
    update({$addToSet: {downvotes: showId}, $pull: {upvoted: showId}})

  return Q.all([show, user]).then(function () { updateScore(showId) })
}

function updateScore(showId) {
  minq
    .from('shows')
    .byId(showId)
    .select({upvotes: 1, downvotes: 1})
    .one()
    .then(function (show) {
      var score = show.upvotes.length - show.downvotes.length
      minq.from('shows')
      .byId(showId)
      .update({$set: {score: score}})
      console.log('score updated to ', score)
    })
}

function faveShow(username, showId) {
  return minq
    .from('users')
    .where({name: username})
    .update({$addToSet: {faves: minq.ObjectId(showId)}})
}

function unfaveShow(username, showId) {
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