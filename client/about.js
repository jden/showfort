$(function () {
  $('header h1, #about').on('vclick', toggle)
})

function toggle() {
  $('#about').toggle()
}