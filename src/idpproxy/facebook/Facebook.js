
/*
	So that an application can use Facebook's OAuth 2.0 authentication system for user login,
  first is required to set up a project in the Facebook Developers Console (https://developers.facebook.com/apps/) 
  to obtain OAuth 2.0 credentials and set a redirect URI.
 */
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');

let facebookInfo = {
  "clientID":             "516850078685290",
  "authorisationEndpoint": "https://www.facebook.com/v2.11/dialog/oauth?",
  "userinfo":              "https://graph.facebook.com/v2.11/me/?fields=id,name,picture,email&access_token=",
  "type":                  "token",
  "granted_scopes":        "email,public_profile",
  "state":                 "state",
  "domain":                "facebook.com"
};



// function to convert google user profile info into standard reTHINK user profile object

export function convertUserProfile(userProfile) {

  console.log('[FaceboolUserProfileConverter] ', userProfile );
  userProfile.userURL = 'user://facebook.com/' + userProfile.name;

  userProfile.picture = userProfile.picture.data.url;

  if (!userProfile.hasOwnProperty('preferred_username')) 
  userProfile.preferred_username = userProfile.id;

  return userProfile;
}



export function userInfoEndpoint(info) {

  return facebookInfo.userinfo + info.access_token;

}

export function authorisationEndpoint() {

  let url = facebookInfo.authorisationEndpoint 
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + facebookInfo.type
    + '&client_id=' + facebookInfo.clientID
    + '&granted_scopes=' + facebookInfo.granted_scopes
    + '&state=' + facebookInfo.state;
  console.log('[Slack.authorisationEndpoint] ', url);
  return url;
}

