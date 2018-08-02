/*
	So that an application can use Facebook's OAuth 2.0 authentication system for user login,
  first is required to set up a project in the Facebook Developers Console (https://developers.facebook.com/apps/) 
  to obtain OAuth 2.0 credentials and set a redirect URI.
 */

export let slackInfo = {
        clientID: '11533603872.72434934356',
        "authorisationEndpoint": "https://slack.com/oauth/authorize?",
        "userinfo":              "https://slack.com/api/users.info?token=",
        "type":                  "token",
        "granted_scopes":        "client",
        "state":                 "state",
        "domain":                "slack.com",
        "accessType":            "online",
        tokenEndpoint: 'https://slack.com/api/oauth.access?',
        scope: 'client',
        clientSecret: 'd427ef3c957d68a292dc7c4e20b78330'
      };

      