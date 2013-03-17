var browserify = require('browserify')
var ecstatic = require('ecstatic')
var URL = require('url')
var blissify = require('./blissify')
var watch = require('watch')
var UglifyJS = require('uglify-js')
var Negotiator = require('negotiator');
var zlib = require('zlib');


var debug = process.env.NODE_ENV !== 'production'
//debug = true
var bundle = ''
var bundleGzip
var bundleCompress
var bundleEtag = ''
var bundleDate

var files = ecstatic({ root: __dirname + '/public' })

module.exports = function (req, res) {
  for (var path in req.query) {}
  req.url = path || '/index.html'
  
  if (req.url === '/bundle.js') {
    serveBundle(req, res)
    return
  }

  files(req, res)

}

var bundler = browserify(__dirname + '/main.js')

bundler.transform(blissify())

var building = false
function build() {
  if (building) { return }
  building = true
  console.log('rebuilding...')
  bundler.bundle( debug ? {insertGlobals: true, detectGlobals: false} : {}, function (err, src) {
    if (err) { return console.error('browserify error:', err) }
    bundle = debug ? src : uglify(src)
    building = false
    var b = new Buffer(bundle)
    zlib.gzip(b, function (err, zipped) {
      bundleGzip = zipped
    })
    zlib.deflate(b, function (err, zipped) {
      bundleCompress = zipped
    })
    console.log('browserify: bundle updated - ' + new Date)
    bundleDate = new Date
    bundleEtag = '"' + (+bundleDate) +'-'+ bundle.length + '"'
  })
}
build()

function uglify(src) {
  var ast = UglifyJS.parse(src)
  ast.figure_out_scope()
  compressor = UglifyJS.Compressor()
  ast = ast.transform(compressor)
  return ast.print_to_string()
}

if (debug) {
  watch.watchTree(__dirname, build)
}

function serveBundle(req, res) {
  res.setHeader('ETag', bundleEtag)
  res.setHeader('Last-Modified', bundleDate.toUTCString())
  res.setHeader('Vary', 'Accept-Encoding')

  // Return a 304 if necessary
  if ( req.headers
    && (
      (req.headers['if-none-match'] === bundleEtag)
      || (Date.parse(req.headers['if-modified-since']) >= bundleDate)
    )
  ) {

    res.statusCode = 304;
    res.end();
    return
  }

  // serve le bundle
  var negotiator = new Negotiator(req)
  var enc = negotiator.preferredEncodings([ 'gzip', 'compress', 'identity' ])
  if (Array.isArray(enc)) enc = enc[0]

  res.setHeader('Content-Type', 'text/javascript')
  if (enc === 'gzip' && bundleGzip) {
    res.setHeader('content-encoding', enc)
    res.write(bundleGzip)
  } else if (enc === 'compress' && bundleCompress) {
    res.setHeader('content-encoding', enc)
    res.write(bundleCompress)
  } else {
    res.send(bundle)
  }
  res.end()
}

module.exports.assets = files