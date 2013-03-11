var shows = require('./data/shows')
var venues = require('./data/venues')
var tShowDetails = require('./templates/showDetail.bliss')
//require('./vclick')
var ev = ('ontouchend' in window) ? 'touchend' : 'click' 

$(function () {

$('#shows').on(ev, '.listing', toggle)

})

function toggle(e) {
  e.preventDefault()

  var showEl = this.parentElement
  var expanded = $(showEl).hasClass('expanded')
  if (expanded) {
    collapse.call(showEl)
  } else {
    expand.call(showEl)
  }
}

var expanded

function expand() {
  if (expanded) { collapse.call(expanded) }
  console.log('expanding')
  var $show = $(this).addClass('expanded')
  expanded = $show
  shows.byId(this.id).then(function (show) {
    var venue = venues[show.venue]
    var details = tShowDetails(show, venue)
    $show.append(details)
  }).done()
}

function collapse() {
  console.log('collapsing', this)
  $('.detail, .showinfo', this).remove()
  $(this).removeClass('expanded')
}