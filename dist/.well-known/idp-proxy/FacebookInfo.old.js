"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var facebookInfo;
  return {
    setters: [],
    execute: function () {
      /*
      	So that an application can use Facebook's OAuth 2.0 authentication system for user login,
        first is required to set up a project in the Facebook Developers Console (https://developers.facebook.com/apps/) 
        to obtain OAuth 2.0 credentials and set a redirect URI.
       */
      _export("facebookInfo", facebookInfo = {
        "clientID": "516850078685290",
        "authorisationEndpoint": "https://www.facebook.com/v2.11/dialog/oauth?",
        "userinfo": "https://graph.facebook.com/v2.11/me/?fields=id,name,picture,email&access_token=",
        "type": "token",
        "granted_scopes": "email,public_profile",
        "state": "state",
        "domain": "facebook.com"
      });
    }
  };
});