var scraped =[]

$('.event').each(function () {

  var ev = {}

  ev.name = $('a.name', this)[0].innerText

  ev.venue = $('.vs', this).text()

  ev.time = $(this).closest('.sched-container').prev().text()

  ev.href = $('a.name', this).attr('href')

  ev.class = Array.prototype.slice.call(this.classList)[1]

  ev.date = $(this).closest('.sched-container').prevAll('.sched-container-header')[0].id

  scraped.push(ev)

})