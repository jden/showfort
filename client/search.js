var like = require('like')
var shows = require('./data/shows')
var _ = require('lodash')
var ev = ('ontouchend' in window) ? 'touchstart' : 'click' 

var $searchBar
var $search
var searching = false
$(function () {
  $('#search-btn').on('click', toggle)
  $searchBar = $('nav.search')
  $search = $('#search')
  $search.on('keyup', update)
})


function toggle(e) {
  e.preventDefault()

  if (searching) {
    hide()
  } else {
    show()
  }
}

function hide() {
  $searchBar.hide()
  searching = false
  $('.content').removeClass('searching')
}

function show() {
  $searchBar.show()
  $('#search').focus()
  searching = true
  $('.content').addClass('searching')

  cache()
}

function headerCacheKey(show) {
  return 'h' + show.day + show.hour.replace(':','')
}

function cache() {
  cache._ = {}

  cache.headers = {}

  var s = shows.sync()
  s.forEach(function (show) {
    cache._[show._id] = document.getElementById(show._id)
  })

  var headers = _.groupBy(s, headerCacheKey)
  _.forEach(headers, function (shows, header) {
    cache.headers[header] = {c: shows.length, el: document.getElementById(header) }
  })
  console.log(cache.headers)
}
function clearCache(){
  delete cache._
  delete cache.headers
}

function update() {
  var headers = {}
  var search = $search.val()
  var s = like(search)
  var matching = _.groupBy(shows.sync(), function (show) {
    var key = headerCacheKey(show)
    headers[key] = headers[key] || 0

    var match = s.test(show.name)
    
    if (match) {
      headers[key]++
    } else {
      headers[key]--
    }
    return match;
  })
  matching.true = matching.true || []
  matching.false = matching.false || []
  console.log(search, matching)

  matching.false.map(toId).forEach(function (id) {
    cache._[id].style.display = 'none'
  })

  matching.true.map(toId).forEach(function (id) {
    cache._[id].style.display = 'list-item'
  })

  _.forEach(cache.headers, function (header, key) {
    console.log(header.c, headers[key], header.c + headers[key], key)
    if (header.c + headers[key] > 0) {
      header.el.style.display = 'list-item'
    } else {
      header.el.style.display = 'none'
    }
  })

}

function toId(x) { return x._id }