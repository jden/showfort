var http = require('./http')
var $barTitle
var $commentsList
var prevTitle
var _show

$(function () {
  $commentsList = $('#commentsList')
  $barTitle = $('#barTitle')
  $commentsList.on('submit', 'form', submit)
})

function show(show, focus) {
  _show = show
  console.log(show)
  $commentsList.toggleClass('on off')
  prevTitle = $barTitle.text()
  $barTitle.text(show.name)
  $('#bar').addClass('sub')

  if (focus) {
    $('#addCommentInput').focus()
  }
  $(document).on('back.comment', hide)
}

function hide() {
  $barTitle.text(prevTitle)
  $('#bar').removeClass('sub')
  $commentsList.toggleClass('on off')
  $(document).off('back.comment')
}

function submit(e) {
  e.preventDefault()
  var text = $('#addCommentInput').val()
  if (!text) { return }
  var post = http.post({url: '/shows/'+_show._id+'/comments', data: {text: text}})



  //post.then()

}

module.exports.show = show