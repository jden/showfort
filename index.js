var config = require('./config.json')

var minq = require('minq')
minq.verbose = true
//minq.connect(config.connectionString)
minq.connect('mongodb://localhost/treefort')

var web = require('./web')

console.log('building a treefort...')
web(8000)



var request = require('request')
request('http://localhost:8000/shows?limit=5', function (err, res) {
  console.log(res.headers, res.statusCode, res.body)
})