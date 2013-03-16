var shows = require('./data/shows')
var venues = require('./data/venues')
var tShowDetails = require('./templates/showDetail.bliss')
var tCommentsPreview = require('./templates/comments.bliss')
var comments = require('./comments')
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
            .on('vclick', '.button.fave', fave)
            .on('vclick', '.comments', showComments)

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
  if (expanded == this.id) { return collapse()}
  if (collapsed === this.id && (new Date - collapsedAt) < 200) {
    return
  }
  if (expanded) { collapse() }
  var $show = $(this)

  $show.addClass('expanded')
  var $d = $('#detail')
    .css({top: $show.offset().top + 49})
    .addClass('expanded')
  
  var $clone = $show.clone() 
  

  shows.byId(this.id).then(function (show) {
    var venue = venues[show.venue]

    var details = tShowDetails(show, venue)
    $d.html(details)
    //$clone.append(details)
    lazyLoadDetails(show, $d)
    //lazyLoadComments(show, $show)
  }).done()
    
    expanded = this.id
}


function collapse() {
  if (!expanded) { return }
  $('#'+expanded).removeClass('expanded')
  $('#detail')
    .empty()
    .removeClass('expanded')
  collapsed = expanded
  collapsedAt = +new Date
  expanded = false 
}

function addComment() {
  collapse()
  var $detail = $(this).closest('.showdetail')
  var id = $detail.attr('data-id')
  shows.byId(id).then(function (show) {
    comments.show(show, true)
  }).done()
}

function showComments() {
  collapse()
  var $detail = $(this).closest('.showdetail')
  var id = $detail.attr('data-id')
  shows.byId(id).then(function (show) {
    comments.show(show)
  }).done()  
}


function lazyLoadDetails(show, $show) {
  shows.detailsById(show._id).then(function (details){
    show.faves = details.faves
    show.comments = details.comments
    console.log('faves!', details)
    var faves = tFaves(details.faves)
    var comments = tCommentsPreview(details.comments, details.total)
    console.log('faves', faves)
    $show.find('.faves').empty().append(faves)
    $show.find('.comments').empty().append(comments)
  })
}

function fave(e){
  e.preventDefault()
  e.stopPropagation()
  var $detail = $(this).closest('.showdetail')
  var id = $detail.attr('data-id')
  var $show = $('#' + id)
  var $count = $show.find('.count')
  if ($show.hasClass('faved')) {
    $show.removeClass('faved')
    $detail.removeClass('faved')
    increment($count, -1)
    faves.unfave('show', id).then(null, function () {
      $show.addClass('faved')
      $detail.addClass('faved')
      increment($count, 1)
    })
  } else {
    $show.addClass('faved')
    $detail.addClass('faved')
    increment($count, 1)
    faves.fave('show', id).then(null, function () {
      $show.removeClass('faved')
      $detail.removeClass('faved')
      increment($count, -1)
    })
  }
}

function increment($el, delta) {
  var i = parseInt($el.text())
  i += delta
  $el.text(i)
}