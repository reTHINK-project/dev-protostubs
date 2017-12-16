/*
	So that an application can use Facebook's OAuth 2.0 authentication system for user login,
	first is required to set up a project in the Facebook Developers Console (https://developers.facebook.com/apps/) to obtain OAuth 2.0 credentials and set a redirect URI.
 */

export let facebookInfo = {
        "clientID":             "516850078685290",
        "issuer":                "https://accounts.google.com",
        "jwksUri":               "https://www.googleapis.com/oauth2/v3/certs?",
        "authorisationEndpoint": "https://www.facebook.com/v2.11/dialog/oauth?",
        "userinfo":              "https://graph.facebook.com/v2.11/me/?fields=id,name,picture,email&access_token=",
        "tokenInfo":             "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=",
        "accessType":            "online",
        "type":                  "token",
        "scope":                 "openid%20email%20profile",
        "state":                 "state"
      };


