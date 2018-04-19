/*
	So that an application can use Google's OAuth 2.0 authentication system for user login,
	first is required to set up a project in the Google Developers Console to obtain OAuth 2.0 credentials and set a redirect URI.
	A test account was created to set the project in the Google Developers Console to obtain OAuth 2.0 credentials,	with the following credentials:
      	username: openidtest10@gmail.com
        password: testOpenID10
	To add more URI's, follow the steps:
	1º choose the project ( can be the My OpenID Project)	 from  https://console.developers.google.com/projectselector/apis/credentials using the credentials provided above.
	2º Open The Client Web 1 listed in OAuth 2.0 Client ID's
	3º Add the URI  in the authorized redirect URI section.
  4º change the REDIRECT parameter bellow with the pretended URI
 */
export let googleInfo = {
  "clientID": "808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com",
  "issuer": "https://accounts.google.com",
  "tokenEndpoint": "https://www.googleapis.com/oauth2/v4/token?",
  "jwksUri": "https://www.googleapis.com/oauth2/v3/certs?",
  "authorisationEndpoint": "https://accounts.google.com/o/oauth2/auth?",
  "userinfo": "https://www.googleapis.com/oauth2/v3/userinfo?access_token=",
  "tokenInfo": "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=",
  "accessType": "online",
  "type": "token id_token",
  "scope": "openid%20email%20profile",
  "state": "state", 
  "domain": "google.com"
};


export let googleFitInfo = {
  "clientID": "407408718192.apps.googleusercontent.com",
  "issuer": "https://accounts.google.com",
  "tokenEndpoint": "https://www.googleapis.com/oauth2/v4/token?",
  "jwksUri": "https://www.googleapis.com/oauth2/v3/certs?",
  "authorisationEndpoint": "https://accounts.google.com/o/oauth2/auth?",
  "userinfo": "https://www.googleapis.com/oauth2/v3/userinfo?access_token=",
  "tokenInfo": "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=",
  "accessType": "online",
  "type": "token id_token",
  "scope": "https://www.googleapis.com/auth/fitness.activity.read",
  "state": "state",
  "domain": "google.com",
  "code": '4/AABndBmE-08YSzlueM0XajTHsv1FNZToHFvoWTfNXGGRRMOGSKunl58bRN1WeAisNqCoftPp4-xV401GT9b0FIM',
  'client_secret': 'secret',
  'grant_type': 'authorization_code'
};

const redirectURI = 'https://developers.google.com/oauthplayground';

export function accessTokenEndpoint(code) {

  return googleFitInfo.tokenEndpoint
    + 'client_id=' + googleFitInfo.clientID
    + '&response_type=' + code
    + '&prompt=' + 'consent'
    + '&access_type=' + 'offline'
    + '&redirect_uri=' + redirectURI;

}



export function authorisationEndpoint(nonce) {

  let url = googleFitInfo.authorisationEndpoint
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + slackIdAssertionInfo.type
    + '&client_id=' + slackIdAssertionInfo.clientID
    + '&scope=' + slackIdAssertionInfo.scope
    + '&access_type=' + slackIdAssertionInfo.accessType
    + '&state=' + nonce;
  console.log('[Slack.authorisationEndpoint] ', url);
  return url;
}




