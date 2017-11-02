## boo-deploy

A very basic deployment solution using github webhooks

### Configure
```sh
cp default.yml local.yml
```

```yaml
server:
  path: /
  port: 7777

github:
  webhook_secret: test

deployment_scripts:
  example: ./example.sh
  boo-deploy: echo "Hello, world!"
```
Add a release webhook event to your repos (example/boo-deploy in example) posting your domain/path/port as configured. **Important:** Be sure to set the webhook secret, as this is the only measure of security in triggering boo-deploy.

### Run
```sh
node deploy.js
```
All that's left is to create a release! When we next release boo-deploy, we'll echo "Hello, world!".

### Stuff used to make this:

 * [github-webhook-handler](https://github.com/rvagg/github-webhook-handler) for handling http/webhooks
 * [node-config](https://github.com/lorenwest/node-config) for the cute configuration system
