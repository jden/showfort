var http = require('./http')
var tComments = require('./templates/comments.bliss')
var $barTitle
var $commentsList
var prevTitle
var _show
var commentsModel = []
var users = require('./data/users')
var shows = require('./data/shows')

$(function () {
  $commentsList = $('#commentsList')
  $barTitle = $('#barTitle')
  $('#addCommentBar').on('submit', 'form', submit)
})

function show(show, focus) {
  _show = show
  commentsModel = [].concat(show.comments)
  console.log(show)
  $commentsList.toggleClass('on off')
  $('#addCommentBar').addClass('on')
  prevTitle = $barTitle.text()
  $barTitle.text(show.name)
  $('#bar').addClass('sub')

  render()
  lazyLoadComments()

  if (focus) {
    $('#addCommentInput').focus()
  }
  $(document).on('back.comment', hide)
}

function hide() {
  $barTitle.text(prevTitle)
  $('#bar').removeClass('sub')
  $commentsList.toggleClass('on off')
  $('#addCommentBar').removeClass('on')
  $(document).off('back.comment')
}

function submit(e) {
  e.preventDefault()
  var text = $('#addCommentInput').val()
  if (!text) { return }
    $('#addCommentInput').blur()
  users.authenticated('posting a comment about ' + _show.name,
    function (user) {
      var post = http.post({url: '/shows/'+_show._id+'/comments', data: {text: text}})
      commentsModel.push({user: user.name, text: text})
      render()
    })

}

function lazyLoadComments() {
  shows.commentsById(_show._id).then(function (comments){
    commentsModel = comments
    render()
  })
}

function render() {
  $('#addCommentInput').val('')
  var html = tComments(commentsModel)
  $commentsList.find('.list').html(html)
}

module.exports.show = show