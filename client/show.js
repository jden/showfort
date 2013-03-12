var shows = require('./data/shows')
var venues = require('./data/venues')
var tShowDetails = require('./templates/showDetail.bliss')
var tComments = require('./templates/comments.bliss')
//require('./vclick')
var ev = ('ontouchend' in window) ? 'touchend' : 'click' 

$(function () {

$('#shows').on(ev, '.listing', toggle)

// $('#shows').on(ev, '.button.hashtag', function () {
//   var tag = $(this).text()
//   tag = tag.substr(tag.indexOf('#')+1)
//   console.log('ht', tag)
//   document.location.href = 'https://twitter.com/intent/tweet?&hashtags='+tag
// })

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
    lazyLoadComments(show, $show)
  }).done()
}

function collapse() {
  console.log('collapsing', this)
  $('.detail, .showinfo', this).remove()
  $(this).removeClass('expanded')
}

function lazyLoadComments(show, $show) {
  shows.commentsById(show._id).then(function (comments){
    var comments = tComments(comments)
    $show.find('.comments').empty().append(comments)
  })
}