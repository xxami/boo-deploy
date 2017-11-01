
const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({
  path: '/',
  secret: 'test'
});

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(7777);

handler.on('error', function (err) {
  console.error('Error:', err.message);
});

handler.on('release', function (event) {
  console.log('Received a release event for %s action=%s: %s (%s)',
    event.payload.repository.name,
    event.payload.action,
    event.payload.release.tag_name,
    event.payload.release.author.login);
});
