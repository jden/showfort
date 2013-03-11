var IndexedArray = require('indexed-array')
module.exports = IndexedArray(require('../../venues.json'))
window.venues = module.exports