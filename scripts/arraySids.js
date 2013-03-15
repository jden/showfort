var minq = require('minq')
var cs = 'mongodb://tfweb:98jp3h98fjouhrf9834jf98@linus.mongohq.com:10065/treefort'
//var cs = 'mongodb://localhost/treefort'

minq.verbose = true
minq.connect(cs)

minq.from('users').select({sid: 1}).toArray().then(function (users) {
  users.forEach(function (user) {
    var setter = {$set: {sid: [user.sid]}}
    console.log(user, setter)    
    minq.from('users').byId(user._id).update(setter)
  })
})