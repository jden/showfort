var Negotiator = require('negotiator');
var zlib = require('zlib');

module.exports = function zip (err, result) {
  var res = this
  if (err) { return this.send(500) }
  var string = JSON.stringify(result)
  compress(res.req, res, string, function (err, zipped) {
    res.setHeader('Content-Type', 'application/json')
    res.removeHeader('content-length')
    res.write(zipped)
    res.end()
  }) 
}

function compress(req, res, string, next) {
  var negotiator = new Negotiator(req)
  var enc = negotiator.preferredEncodings([ 'gzip', 'compress', 'identity' ])
  if (Array.isArray(enc)) enc = enc[0]

  var contents = new Buffer(string)
    if (!res._headers
    || res._headers['content-encoding'] === undefined) {
        res.setHeader('content-encoding', enc)
    }

  if (enc === 'gzip') {
    zlib.gzip(contents, next)
  } else if (enc === 'compress') {
    zlib.deflate(contents, next)
  } else {
    next(null, contents)
  }
}