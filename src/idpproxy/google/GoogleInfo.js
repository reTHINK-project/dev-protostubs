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
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');

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


export let googleAPIInfo = {
  "clientID": "808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com",
  "issuer": "https://accounts.google.com",
  "tokenEndpoint": "https://www.googleapis.com/oauth2/v4/token?",
  "jwksUri": "https://www.googleapis.com/oauth2/v3/certs?",
  "authorisationEndpoint": "https://accounts.google.com/o/oauth2/auth?",
  "userinfo": "https://www.googleapis.com/oauth2/v3/userinfo?access_token=",
  "tokenInfo": "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=",
  "accessType": "offline",
  "type": "code",
  // TODO - scope is read from message (support multiple Google APIs)
  "scope": "https://www.googleapis.com/auth/fitness.activity.read",
  "state": "state",
  "domain": "google.com",
  'grant_type': "authorization_code",
  'secret': "Xx4rKucb5ZYTaXlcZX9HLfZW"
};



export function accessTokenEndpoint(code) {

  return googleAPIInfo.tokenEndpoint
    + 'client_id=' + googleAPIInfo.clientID
    + '&code=' + code
    + '&grant_type=authorization_code'
    + '&access_type=' + 'offline'
    + '&client_secret=' + googleAPIInfo.secret
    + '&redirect_uri=' + redirectURI;
}

export function refreshAccessTokenEndpoint(refresh) {

  return googleAPIInfo.tokenEndpoint
    + 'client_id=' + googleAPIInfo.clientID
    + '&refresh_token=' + refresh
    + '&grant_type=refresh_token'
    + '&client_secret=' + googleAPIInfo.secret
}

export function mapping(resource) {
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
}

export function accessTokenAuthorisationEndpoint(API) {
  let url = googleAPIInfo.authorisationEndpoint
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + googleAPIInfo.type
    + '&client_id=' + googleAPIInfo.clientID
    + '&scope=' + 'https://www.googleapis.com/auth/' + API
    + '&access_type=' + googleAPIInfo.accessType
//    + '&include_granted_scopes=true'
//    + '&prompt=none'
    + '&state=' + googleAPIInfo.state;
  console.log('[GoogleInfo.accessTokenAuthorisationEndpoint] ', url);
  return url;
}

export function authorisationEndpoint(nonce) {

  let url = googleAPIInfo.authorisationEndpoint
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + googleAPIInfo.type
    + '&client_id=' + googleAPIInfo.clientID
    + '&scope=' + googleAPIInfo.scope
    + '&access_type=' + googleAPIInfo.accessType
    + '&state=' + nonce;
  console.log('[GoogleInfo.authorisationEndpoint] ', url);
  return url;
}

export function accessTokenInput(info) {

  return {info};
}




