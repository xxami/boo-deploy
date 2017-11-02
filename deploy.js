
const http = require('http');
const exec = require('child_process').exec;

const createHandler = require('github-webhook-handler');

process.env.NODE_CONFIG_DIR='./';
const config = require('config');

const serverConfig = config.get('server');
const githubConfig = config.get('github');
const deployConfig = config.get('deployment_scripts');

const serverPath = serverConfig.get('path');
const serverPort = serverConfig.get('port');
const webhookSecret = githubConfig.get('webhook_secret');

const handler = createHandler({
  path: serverPath,
  secret: webhookSecret
});

console.log(`Listening for releases at ${serverPath} on port ${serverPort}`);

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(serverPort);

handler.on('error', function (err) {
  console.error('Error:', err.message);
});

handler.on('release', function (event) {
  let repository = event.payload.repository;
  let release = event.payload.release;

  console.log(
    `Received a release event for ${repository.name}` +
   ` ${release.tag_name} (${release.author.login})`);

    if (deployConfig.has(repository.name)) {
      console.log('Found deployment scripts, running...');
      
      exec(deployConfig.get(repository.name),
        function(err, stdout, stderr) {
          if (err != null) {
            console.log(`Could not execute deployment script -> ${err}`);
            return;
          }

          if (stdout != null && stdout != '')
            console.log(`Output: ${stdout}`);
          if (stderr != null && stderr != '')
            console.log(`I/O Error: ${stderr}`)
      });
    }
});
