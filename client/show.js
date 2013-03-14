var shows = require('./data/shows')
var venues = require('./data/venues')
var tShowDetails = require('./templates/showDetail.bliss')
var tComments = require('./templates/comments.bliss')
var comments = require('./data/comments')
var faves = require('./faves')
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

$('#shows').on(ev, '.button.comment', addComment)
$('#shows').on(ev, '.button.fave', fave)

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

function addComment() {
  console.log($(this))
  var $show = $(this).closest('.show')
  comments.postComment('shows', $listing[0].id) 
}

function lazyLoadComments(show, $show) {
  shows.commentsById(show._id).then(function (comments){
    var comments = tComments(comments)
    $show.find('.comments').empty().append(comments)
  })
}

function fave(){
  var $show = $(this).closest('.show')
  var $count = $show.find('.count')
  var id = $show[0].id
  if ($show.hasClass('faved')) {
    $show.removeClass('faved')
    increment($count, -1)
    faves.unfave('show', id).then(null, function () {
      $show.addClass('faved')
      increment($count, 1)
    })
  } else {
    $show.addClass('faved')
    increment($count, 1)
    faves.fave('show', id).then(null, function () {
      $show.removeClass('faved')
      increment($count, -1)
    })
  }
}

function increment($el, delta) {
  var i = parseInt($el.text())
  i += delta
  $el.text(i)
}