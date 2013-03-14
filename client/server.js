var browserify = require('browserify')
var ecstatic = require('ecstatic')
var URL = require('url')
var blissify = require('./blissify')
var watch = require('watch')
var UglifyJS = require('uglify-js')

var debug = process.env.NODE_ENV !== 'production'
var bundle = ''


var files = ecstatic({ root: __dirname + '/public' })

module.exports = function (req, res) {
  for (var path in req.query) {}
  req.url = path || '/index.html'
  
  if (req.url === '/bundle.js') {
    res.setHeader('Content-Type', 'text/javascript')
    res.send(bundle)
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
    console.log('browserify: bundle updated - ' + new Date)
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



module.exports.assets = files