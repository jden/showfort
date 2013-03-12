$(function () {
  $('header h1, #about').on('click', toggle)
})

function toggle() {
  $('#about').toggle()
}