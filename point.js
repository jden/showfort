var EE = require('events').EventEmitter
var emitter = new EE
var i = 30

while(i--){
  emitter.on('foo', function () {
    var me = i
    console.log(me)
  })
}

emitter.emit('foo')