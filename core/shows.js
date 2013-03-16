var minq = require('minq')
var IndexedArray = require('indexed-array')
var Q = require('q')

var listProjection = {
  name: 1,
  tw: 1,
  venue: 1,
  day: 1,
  hour: 1,
  hashtag: 1,
  timestamp: 1,
  timeclass: 1,
  faves: 1
}

var list = function (skip, limit) {
  skip = skip || 0
  limit = limit || 500
  return minq
    .from('shows')
    .select(listProjection)
    .skip(skip)
    .limit(limit)
    .toArray()
}

var renderShows = function (shows, user) {

  shows.forEach(function (show) {
    if (user && show.faves && show.faves.indexOf(user.name) >= 0) {
      show.fave = true
    }
    show.score = show.faves.length
    delete show.faves
  })
  return shows
}

exports.list = function (skip, limit, user) {
  return list(skip, limit).then(function (shows) {
    return renderShows(shows, user)
  })
}

exports.faveShow = function (username, showId) {
  console.log('faveshow', arguments)
  return Q.all([
    minq
      .from('users')
      .where({name: username})
      .update({$addToSet: {'faves.shows': minq.ObjectId(showId)}}),
    minq
      .from('shows')
      .byId(showId)
      .update({$addToSet: {faves: username}})
  ])
}

exports.unfaveShow = function (username, showId) {
  return Q.all([
    minq
      .from('users')
      .where({name: username})
      .update({$pull: {'faves.shows': minq.ObjectId(showId)}}),
    minq
      .from('shows')
      .byId(showId)
      .update({$pull: {faves: username}})
  ])
}

exports.getCommentsById = function (showId) {
  return minq
    .from('shows')
    .byId(showId)
    .select({comments: 1})
    .one().then(function (show) {
      return show.comments
    })
}

exports.getFavesById = function (showId) {
  return minq
    .from('shows')
    .byId(showId)
    .select({faves: 1})
    .one().then(function (show) {
      return show.faves
    })
}

exports.getDetailsById = function (showId) {
  var comments = exports.getCommentsById(showId).then(function (comments) {
    return comments.length > 5 ? comments.slice(comments.length-5) : comments
  })
  var faves = exports.getFavesById(showId)

  return Q.all([
    comments, faves
    ]).then(function (details) {
      return {
        comments: details[0],
        faves: details[1]
      }
    })
}

exports.addComment = function (username, showId, text) {
  var comment = {user: username, text: text, mentioned:[], hashtags:[]}
  return minq
    .from('shows')
    .byId(showId)
    .update({$push: {'comments': comment}})
}