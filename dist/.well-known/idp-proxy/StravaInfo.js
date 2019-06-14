/*
Mainly used to authorise access to Mobi.e plataform through OAuth 2.0 protocol
 */
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');
let clientID, clientSecret;

if (location.hostname.indexOf('alticelabs.com') > -1) {
  clientID = '31748';
  clientSecret = '521567cbdf0e4f7ab17ad7cce536022bd8cccf87';
} else {
  clientID = '24124';
  clientSecret = 'ff4848fd0f605db8fe46f8080ac2fc185045b79e';
}

export let APIInfo = {
  "clientID": clientID,
  "authorisationEndpoint": "https://www.strava.com/api/v3/oauth/authorize?",
  "tokenEndpoint": "https://www.strava.com/oauth/token?",
  "revokeEndpoint": "https://www.strava.com/oauth/deauthorize?",
  //  "accessType": "offline",
  "type": "code",
  "scope": "read_all,activity:read_all",
  //  "state": "state",
  "domain": "strava.com",
  //  'grant_type': "authorization_code",
  'secret': clientSecret
};
export function authorisationEndpoint(nonce) {
  let url = APIInfo.authorisationEndpoint + 'redirect_uri=' + redirectURI + '&response_type=' + APIInfo.type + '&client_id=' + APIInfo.clientID + '&scope=' + APIInfo.scope //    + '&access_type=' + APIInfo.accessType
  + '&state=' + nonce;
  console.log('[StravaInfo.authorisationEndpoint] ', url);
  return url;
}
export function accessTokenEndpoint(code, user) {
  return APIInfo.tokenEndpoint + 'client_id=' + APIInfo.clientID + '&code=' + code + '&grant_type=authorization_code' //    + '&access_type=' + 'offline'
  //    + '&user_id=' + user
  + '&client_secret=' + APIInfo.secret + '&redirect_uri=' + redirectURI;
}
export function refreshAccessTokenEndpoint(refresh) {
  return APIInfo.tokenEndpoint + 'client_id=' + APIInfo.clientID + '&refresh_token=' + refresh + '&grant_type=refresh_token' + '&client_secret=' + APIInfo.secret;
}
export function revokeAccessTokenEndpoint(token) {
  return APIInfo.revokeEndpoint + '&token=' + token;
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

export function accessTokenAuthorisationEndpoint(nonce) {
  let url = APIInfo.authorisationEndpoint + 'redirect_uri=' + redirectURI + '&response_type=' + APIInfo.type + '&client_id=' + APIInfo.clientID + '&scope=' + APIInfo.scope //    + '&access_type=' + APIInfo.accessType
  + '&state=' + nonce;
  console.log('[StravaInfo.accessTokenAuthorisationEndpoint] ', url);
  return url;
}
export function accessTokenInput(info) {
  return {
    info
  };
}