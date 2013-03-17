var $notice
$(function () {

  $('#notice').on('vclick', function () {
    if ($(this).hasClass('on')) {
      hide()
    }
  })

})

function show(html) {
  $('#notice-msg').html(html)
  $('#notice').addClass('on')
}

function hide() {
  $('#notice').removeClass('on')
    .trigger('dismissed')
}

module.exports = show