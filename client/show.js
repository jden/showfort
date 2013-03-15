var shows = require('./data/shows')
var venues = require('./data/venues')
var tShowDetails = require('./templates/showDetail.bliss')
var tComments = require('./templates/comments.bliss')
var comments = require('./data/comments')
var tFaves = require('./templates/faves.bliss')
var faves = require('./faves')

$(function () {

$('#shows').on('vclick', '.listing', toggle)
$('#detail').on('vclick', collapse)
$(document).on('scrollStart', collapse)
$(document).on('updateList', collapse)
// $('#shows').on('vclick', '.button.hashtag', function () {
//   var tag = $(this).text()
//   tag = tag.substr(tag.indexOf('#')+1)
//   console.log('ht', tag)
//   document.location.href = 'https://twitter.com/intent/tweet?&hashtags='+tag
// })

$('#detail').on('vclick', '.button.comment', addComment)
$('#detail').on('vclick', '.button.fave', fave)

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
var collapsed
var collapsedAt

// function expand() {
//   if (expanded) { collapse.call(expanded) }
//   var $show = $(this).addClass('expanded')
//   expanded = $show
//   shows.byId(this.id).then(function (show) {
//     var venue = venues[show.venue]
//     //var details = tShowDetails(show, venue)
//     //$show.append(details)
//     //lazyLoadFaves(show, $show)
//     //lazyLoadComments(show, $show)
//   }).done()
// }


function expand() {
  if (collapsed === this.id && (new Date - collapsedAt) < 200) {
    return
  }
  if (expanded) { collapse() }
  var $show = $(this)

//debugger;

  var $d = $('#detail')
    .css({top: $show.offset().top - 1})
    .addClass('expanded')
  
  var $clone = $show.clone() 
  $d.append($clone)

  shows.byId(this.id).then(function (show) {
    var venue = venues[show.venue]
    var details = tShowDetails(show, venue)
    $clone.append(details)
    lazyLoadFaves(show, $clone)
    //lazyLoadComments(show, $show)
  }).done()
    
    expanded = this.id
}


function collapse() {
  if (!expanded) { return }
  console.log('collapsing')
  $('#detail')
    .empty()
    .removeClass('expanded')
  collapsed = expanded
  collapsedAt = +new Date
  expanded = false 
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

function lazyLoadFaves(show, $show) {
  shows.favesById(show._id).then(function (faves){
    console.log('faves!', faves)
    var faves = tFaves(faves)
    console.log('faves', faves)
    $show.find('.faves').empty().append(faves)
  })
}

function fave(e){
  e.preventDefault()
  e.stopPropagation()
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