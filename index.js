process.env.connectionString = process.env.connectionString || 'mongodb://localhost/treefort'

var web = require('./web')
var minq = require('minq')
minq.verbose = true

process.on('error', error)

console.log('building a treefort...')
minq.connect(process.env.connectionString)

var port = process.env.NODE_ENV === 'production' ? 80 : 8000 
web(port)
console.log('listening on port ', port)

console.log('started in ' + (process.env.NODE_ENV || 'dev'))

function error(e) {
  console.log('Uncaught error:', e)
}