!function ($, _) {
var once = true
var shows = $.ajax('/shows')

shows.then(function (shows) {
window.shows = shows
  var html = ''

  var s = _.sortBy(shows, 'timestamp')
  s = _.groupBy(s, 'day')

  console.log(s)

  _.forEach(s, function (shows, day) {
    
    html += group('Day ' + day, 'day')

    var s = _.groupBy(shows, 'hour')
    _.forEach(s, function (shows, hour) {
      html += group(hour, 'hour')
      html += shows.map(function (show) {
        return countItem(show.name, show.score, show._id, show.timeclass, show)
      }).join('')
    })

  })

  $('#shows').append(html)

})
  

function group(title, className) {
  var a = '<li class="list-divider ' + className + '">' + title + '</li>'
  return a
}

function countItem(title, count, id, aclass, show) {
  var a = '<li class="show v'+aclass+ (once? ' expanded' : '') +'" id="'+id+'"><a href="#">'+title+'<span class="chevron"></span><span class="count">'+count+'</span></a>';
  return a + (once ? detail(show) : '') + '</li>'
}

function detail(show) {
once = false

  var a = '<div class="showinfo"><span class="venue '+ show.timeclass+'">At '+show.venue+', 5th and Main</span>' +
  '<span class="hashtag"><span class="icon-twitter"></span>'+ show.hashtag + '</span></div>' +
  '<div class="detail">' +
  '<div class="showctl"><a class="button comment"><span class="icon-comment"></span> comment</a>' +
'<a class="button fave">★ fave</a></div>'

var thoughts = [{
  user: 'jden',
  vote: 1,
  thought: 'this band is super fuckin rad - you\'d best see them!'
},{
  user: 'pandafoo',
  vote: 1,
  thought: 'wooooooooooooo wha? @jden'
}, {
  user: 'emily',
  vote: 1,
  thought: 'gilbert for mayor #hella'
}]

a += '<ul class="comments">' + thoughts.map(thought).join('') + '</ul>'

return a + '</div>'
}

function thought(item) {
  var a = '<li><span class="user">'+item.user+'</span>: ' + item.thought+'</li>'
  return a
}

}(jQuery, _)