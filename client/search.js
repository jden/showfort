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
}

function show() {
  $searchBar.show()
  $('#search').focus()
  searching = true

  cache()
}

function cache() {
  cache._ = {}
  shows.sync().forEach(function (show) {
    cache._[show._id] = document.getElementById(show._id)
  })
}
function clearCache(){
  delete cache._
}

function update() {
  var search = $search.val()
  var s = like(search)
  var matching = _.groupBy(shows.sync(), function (show) { return s.test(show.name) })
  matching.true = matching.true || []
  matching.false = matching.false || []
  console.log(search, matching)

  matching.false.map(toId).forEach(function (id) {
    cache._[id].style.display = 'none'
  })

  matching.true.map(toId).forEach(function (id) {
    cache._[id].style.display = 'list-item'
  })

}

function toId(x) { return x._id }