var Q = require('q')

module.exports = {
  get: get,
  post: post,
  put: put,
  'delete': del
}

function get(opts) {
  opts.type = 'GET'
  return Q($.ajax(opts))
}

function post(opts) {
  opts.type = 'POST'
  return Q($.ajax(opts))
}

function put(opts) {
  opts.type = 'PUT'
  return Q($.ajax(opts))
}

function del(opts) {
  opts.type = 'DELETE'
  return Q($.ajax(opts))
}