var web = require('./web')
var minq = require('minq')
minq.verbose = true

console.log('building a treefort...')
minq.connect(process.env.connectionString || 'mongodb://localhost/treefort')

web(process.env.NODE_ENV === 'production' ? 80 : 8000)

console.log('started in ' + (process.env.NODE_ENV || 'dev'))