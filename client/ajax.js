var Q = require('q')

module.exports = {
  get: get,
  post: post,
  put: put,
  delete: delete
}

function get(opts) {
  opts.method = 'GET'
  return Q($.ajax(opts))
}

function post(opts) {
  opts.method = 'POST'
  return Q($.ajax(opts))
}

function put(opts) {
  opts.method = 'PUT'
  return Q($.ajax(opts))
}

function delete(opts) {
  opts.method = 'DELETE'
  return Q($.ajax(opts))
}