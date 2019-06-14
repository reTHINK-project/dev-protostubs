"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var redirectURI, mobieAPIInfo;

  function authorisationEndpoint(nonce) {
    var url = mobieAPIInfo.authorisationEndpoint + 'redirect_uri=' + redirectURI + '&response_type=' + mobieAPIInfo.type + '&client_id=' + mobieAPIInfo.clientID //    + '&scope=' + mobieAPIInfo.scope
    //    + '&access_type=' + mobieAPIInfo.accessType
    + '&state=' + nonce + '&BU=MOBI.E';
    console.log('[MobieInfo.authorisationEndpoint] ', url);
    return url;
  }

  function accessTokenEndpoint(code, user) {
    return mobieAPIInfo.tokenEndpoint + 'client_id=' + mobieAPIInfo.clientID + '&code=' + code + '&grant_type=authorization_code' //    + '&access_type=' + 'offline'
    + '&user_id=' + user + '&client_secret=' + mobieAPIInfo.secret + '&redirect_uri=' + redirectURI;
  }

  function refreshAccessTokenEndpoint(refresh) {
    return mobieAPIInfo.tokenEndpoint + 'client_id=' + mobieAPIInfo.clientID + '&refresh_token=' + refresh + '&grant_type=refresh_token' + '&client_secret=' + mobieAPIInfo.secret;
  }

  function revokeAccessTokenEndpoint(token) {
    return mobieAPIInfo.revokeEndpoint + '&token=' + token;
  }
  /*export function mapping(resource) {
    if (!resource) {
      return "fitness.activity.read";
    }
    switch (resource) {
      case "user_activity_context":
        return "fitness.activity.read";
        break;
  
      default:
        return "fitness.activity.read";
        break;
    }
  }*/


  function accessTokenAuthorisationEndpoint(nonce) {
    var url = mobieAPIInfo.authorisationEndpoint + 'redirect_uri=' + redirectURI + '&response_type=' + mobieAPIInfo.type + '&client_id=' + mobieAPIInfo.clientID //    + '&scope=' + mobieAPIInfo.scope
    //    + '&access_type=' + mobieAPIInfo.accessType
    + '&state=' + nonce + '&BU=MOBI.E';
    console.log('[MobieInfo.accessTokenAuthorisationEndpoint] ', url);
    return url;
  }

  function accessTokenInput(info) {
    return {
      info: info
    };
  }

  _export({
    authorisationEndpoint: authorisationEndpoint,
    accessTokenEndpoint: accessTokenEndpoint,
    refreshAccessTokenEndpoint: refreshAccessTokenEndpoint,
    revokeAccessTokenEndpoint: revokeAccessTokenEndpoint,
    accessTokenAuthorisationEndpoint: accessTokenAuthorisationEndpoint,
    accessTokenInput: accessTokenInput
  });

  return {
    setters: [],
    execute: function () {
      /*
      Mainly used to authorise access to Mobi.e plataform through OAuth 2.0 protocol
       */
      redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');

      _export("mobieAPIInfo", mobieAPIInfo = {
        "clientID": "DSMSHARCITIES",
        //  "authorisationEndpoint": "http://sc.ceiia.pagekite.me/dsmauth?",
        //  "tokenEndpoint": "http://sc.ceiia.pagekite.me/dsmauth/token/?",
        "tokenEndpoint": "https://sharingcities.mobinteli.com/dsmauth/token/?",
        "authorisationEndpoint": "https://sharingcities.mobinteli.com/dsmauth/?",
        "revokeEndpoint": "https://sharingcities.mobinteli.com/dsmauth/revoke?",
        //  "accessType": "offline",
        "type": "code",
        // TODO - scope is read from message (support multiple Google APIs)
        //  "scope": "https://www.googleapis.com/auth/fitness.activity.read",
        //  "state": "state",
        "domain": "mobie.pt",
        //  'grant_type': "authorization_code",
        'secret': "secretKey"
      });
    }
  };
});