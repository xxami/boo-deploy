
const http = require('http');
const exec = require('child_process').exec;

const createHandler = require('github-webhook-handler');
const handler = createHandler({
  path: '/',
  secret: 'test'
});

const deployments = {
  'boo-deploy': './boo-deploy.sh',
};

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
  let repository = event.payload.repository;
  let release = event.payload.release;
  console.log('Received a release event for %s action=%s: %s (%s)',
    repository.name,
    event.payload.action,
    release.tag_name,
    release.author.login);
    if (deployments.hasOwnProperty(repository.name)) {
      console.log('Found deployment scripts, running...');
      exec(deployments[repository.name],
        function(err, stdout, stderr) {

        let logstdio = function(description, stdio) {
          if (stdio != null)
            console.log(description + ': ' + stdio);
        };
        logstdio('output', stdout);
        logstdio('stderr', stderr);
        logstdio('error', err);
      });
    }
});
