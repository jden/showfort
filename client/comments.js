var $barTitle
var $commentsList
var prevTitle

$(function () {
  $commentsList = $('#commentsList')
  $barTitle = $('#barTitle')
})

function show(show, focus) {
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


module.exports.show = show