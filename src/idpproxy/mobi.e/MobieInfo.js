/*
Mainly used to authorise access to Mobi.e plataform through OAuth 2.0 protocol
 */
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');


export let mobieAPIInfo = {
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
};


export function authorisationEndpoint(nonce) {

  let url = mobieAPIInfo.authorisationEndpoint
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + mobieAPIInfo.type
    + '&client_id=' + mobieAPIInfo.clientID
//    + '&scope=' + mobieAPIInfo.scope
//    + '&access_type=' + mobieAPIInfo.accessType
    + '&state=' + nonce
    + '&BU=MOBI.E';
  console.log('[MobieInfo.authorisationEndpoint] ', url);
  return url;
}

export function accessTokenEndpoint(code, user) {

  return mobieAPIInfo.tokenEndpoint
    + 'client_id=' + mobieAPIInfo.clientID
    + '&code=' + code
    + '&grant_type=authorization_code'
//    + '&access_type=' + 'offline'
    + '&user_id=' + user
    + '&client_secret=' + mobieAPIInfo.secret
    + '&redirect_uri=' + redirectURI;
}

export function refreshAccessTokenEndpoint(refresh) {

  return mobieAPIInfo.tokenEndpoint
    + 'client_id=' + mobieAPIInfo.clientID
    + '&refresh_token=' + refresh
    + '&grant_type=refresh_token'
    + '&client_secret=' + mobieAPIInfo.secret
}

export function revokeAccessTokenEndpoint(token) {

  return mobieAPIInfo.revokeEndpoint
    + '&token=' + token
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
  let url = mobieAPIInfo.authorisationEndpoint
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + mobieAPIInfo.type
    + '&client_id=' + mobieAPIInfo.clientID
//    + '&scope=' + mobieAPIInfo.scope
//    + '&access_type=' + mobieAPIInfo.accessType
    + '&state=' + nonce
    + '&BU=MOBI.E';
  console.log('[MobieInfo.accessTokenAuthorisationEndpoint] ', url);
  return url;
}


export function accessTokenInput(info) {

  return {info};
}




