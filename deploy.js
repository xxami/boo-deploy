
const http = require('http');
const exec = require('child_process').exec;

const createHandler = require('github-webhook-handler');
const handler = createHandler({
  path: '/',
  secret: 'test'
});

const port = 7777;
const deployments = {
  'boo-deploy': './boo-deploy.sh',
};

console.log(`Listening for deployment hooks on port ${port}`);
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  });
}).listen(port);

handler.on('error', function (err) {
  console.error('Error:', err.message);
});

handler.on('release', function (event) {
  let repository = event.payload.repository;
  let release = event.payload.release;

  console.log(
    `Received a release event for ${respository.name}` +
   ` ${release.tag_name} (${release.author.login})`);

    if (deployments.hasOwnProperty(repository.name)) {
      console.log('Found deployment scripts, running...');
      
      exec(deployments[repository.name],
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
