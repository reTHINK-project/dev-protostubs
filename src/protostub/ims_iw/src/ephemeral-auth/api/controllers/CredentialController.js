/**
 * CredentialController
 *
 * @description :: Server-side logic for managing credentials
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fetch = require('node-fetch');
var crypto = require('crypto');
var secret = sails.config.ephemeral.secret_key;
var uri = sails.config.ephemeral.ims_uri;
var getCredential = function(uname, domain) {
    var hmac = crypto.createHmac('sha1', secret);
    var ttl = 86400;
    var timestamp = Math.floor(Date.now() / 1000) + ttl;
    var username = new Buffer(timestamp + ':' + uname);
    var uris = [ uri ];

    hmac.update(username);

    return {
      username: username.toString('utf-8') + '@' + domain,
      password: hmac.digest().toString('base64'),
      ttl: ttl,
      uris: uris
    };
}

module.exports = {
  find: function(req, res) {
    var credential;

    if(!req.get('authorization')) {
      res.status(401);
      res.send();
    } else {
      var token = req.get('authorization').split(' ')[1]
      fetch('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token, { method: 'GET' })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token)
              .then(res_user => res_user.json())
              .then(body => {
                  var email_parts = body.email.split('@')
                  var username = email_parts[0]
                  var domain = email_parts[1]

                  res.send(getCredential(username, domain))
                }).catch(err => {
                console.log(err)
                  res.status(500)
                  res.send(err)
                })
          } else {
            res.status(response.status)
            response.text().then(text => res.send(text))
          }
        });
    }
  }
};
