var _ = require('lodash')
var shows = require('./data/shows')

$(function () {
  $('.content').on('scroll', manage)
})


var started = 0
var last = 0
var timer
var now
function manage() {
  now = +new Date
  clearTimeout(timer)
  timer = setTimeout(end, 100)
  if (!started) {
    start()
  } else if (now - last > 99){
    $(document).trigger('scrollTick')
    last = now
  }
}
function start() {
  started = +new Date
  last = started
  $(document).trigger('scrollStart')
}
function end() {
  started = 0
  $(document).trigger('scrollEnd')
}

$(document).on('scrollTick, scrollEnd', debounce(updateTitle))
var currentDay
var currentTime
function updateTitle() {
  var $el = $(document.elementFromPoint(2, 85))
  if (!$el.hasClass('show') && !($el = $el.next()).hasClass('show')) { return }
  var id = $el[0].id

  var show = shows.sync()[id]
  if (show.day !== currentDay) {
    currentDay = show.day
    $('header h1').text('Day ' + currentDay)
  }
}

function debounce(fn) {
  var timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(fn, 100)
  }
}