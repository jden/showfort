var bliss = require('bliss')
bliss = new bliss()
var through = require('through')

function endsWith(str, suffix){
  return str.substr(str.length-suffix.length) === suffix
} 

module.exports = function (extension) {
  extension = extension || '.bliss'


  return function blissify(file) {
    if (!endsWith(file, extension)) { return through() }

    var src = ''
    var stream = through(write, end) 
    return through(write, end)

    function write(buffer) { src += buffer }
    function end() {
      console.log('compiling', file)
      try {
        var fn = bliss.compile(src)
      } catch (e) {
        if (module.exports.verbose) {
          console.error('blissify error:', file, e)
        }
        stream.emit('error', e)
      }
      this.queue('module.exports='+fn.toString())
      this.queue(null)
    }
  }
}