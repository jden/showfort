var like = require('like')
var shows = require('./data/shows')
var _ = require('lodash')
var ev = ('ontouchend' in window) ? 'touchstart' : 'click' 
var users = require('./data/users')
var notice = require('./notice')

var $searchBar
var $search
var searching = false
var filterUser
$(function () {
  $('#search-btn').on('vclick', toggle)
  $searchBar = $('nav.search')
  $search = $('#search')
  $search.on('keyup', update)
  $('#search-clear').on('vclick', clearSearch)
  $('#favetoggle').on('vclick', toggleFaveFilter)

  $(window).on('hashchange', function () {
    var pg = window.location.hash.substr(1)
    var match = pg.match(/^user\/([a-zA-Z0-9]+)$/) 
    if (match) {
      users.getUser(match[1]).then(function (user) {
        filterUser = user
        $('#bar').addClass('sub')
        $('#barTitle').text(user.name +'\'s faves')
        faveFilterOn()
        $(document).on('back', function () {
          filterUser = users.meSync()
          $('#bar').removeClass('sub')
          $('#barTitle').text('showfort')
          window.location.hash = ''
          faveFilterOff()
        })
      })
    }
  })
})

var prompted = false
function loginPrompt() {
  if (prompted) { return }
  prompted = true
  if (!users.meSync()) {
    notice('Fave some shows to get back to them later. If you already have an account, <a class="button-main login-btn">log in</a>')
  }
}

var faveFilter = false
function toggleFaveFilter(e) {
  e.preventDefault()

  if (faveFilter) {
    faveFilterOff()
  } else {
    loginPrompt()
    faveFilterOn()
  }
}

function faveFilterOff() {
  cache()
  $('#favetoggle').removeClass('on').addClass('off')
  faveFilter = false
  update()
}

function faveFilterOn() {
  cache()
  $('#favetoggle').removeClass('off').addClass('on')
  faveFilter = true
  filterUser = filterUser || users.meSync()
  update()
}

function clearSearch() {
  $search.val('')
  $search.focus()
  update()
  hide()
}

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

}
function clearCache(){
  delete cache._
  delete cache.headers
}

function update() {
  try {
    $(document).trigger('updateList')
  } catch (e) {}
  var headers = {}
  var search = $search.val()
  var s = like(search)
  var matching = _.groupBy(shows.sync(), function (show) {
    var key = headerCacheKey(show)
    headers[key] = headers[key] || 0

    var match = true
    if (searching) {
      match = match && s.test(show.name)
    }
    if (faveFilter) {
      match = match && filterUser ? filterUser.faves.shows.indexOf(show._id) !== -1 : false
    }

    if (match) {
      headers[key]++
    } else {
      headers[key]--
    }
    return match;
  })
  matching.true = matching.true || []
  matching.false = matching.false || []

  matching.false.map(toId).forEach(function (id) {
    cache._[id].style.display = 'none'
  })

  matching.true.map(toId).forEach(function (id) {
    cache._[id].style.display = 'list-item'
  })

  _.forEach(cache.headers, function (header, key) {

    if (header.c + headers[key] > 0) {
      header.el.style.display = 'list-item'
    } else {
      header.el.style.display = 'none'
    }
  })

}

function toId(x) { return x._id }