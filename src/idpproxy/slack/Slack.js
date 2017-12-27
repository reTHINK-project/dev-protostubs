/*
	So that an application can use Facebook's OAuth 2.0 authentication system for user login,
  first is required to set up a project in the Facebook Developers Console (https://developers.facebook.com/apps/) 
  to obtain OAuth 2.0 credentials and set a redirect URI.
 */
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');


let slackInfo = {
  clientID: '11533603872.72434934356',
  "authorisationEndpoint": "https://slack.com/oauth/authorize?",
  "userinfo": "https://slack.com/api/users.info?token=",
  "type": "token",
  "granted_scopes": "client",
  "state": "state",
  "accessType": "online",
  tokenEndpoint: 'https://slack.com/api/oauth.access?',
  scope: 'client',
  clientSecret: 'd427ef3c957d68a292dc7c4e20b78330'
};



// function to convert Slack user profile info into standard reTHINK user profile object

export function convertUserProfile(userSlack) {


  console.log('[SlackUserProfileConverter] ', userSlack);
  let userProfile = userSlack.user.profile;
  userProfile.userURL = 'user://slack.com/' + userSlack.name;

  userProfile.picture = userProfile.image_original;

  userProfile.id = userSlack.id;

  if (!userProfile.hasOwnProperty('preferred_username'))
    userProfile.preferred_username = userSlack.name;

  userProfile.name = userSlack.name;

  return userProfile;
}

export function accessTokenInput(info) {


  console.log('[Slack.getAccessTokenInput] from ', info);

  return {user_id: info.user_id, team_id: info.team_id };
}

export function userInfoEndpoint(info) {

  return slackInfo.userinfo + info.access_token + '&user=' + info.user_id;

}

export function authorisationEndpoint() {

  let url = slackInfo.authorisationEndpoint 
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + slackInfo.type
    + '&client_id=' + slackInfo.clientID
    + '&scope=' + slackInfo.scope
    + '&access_type=' + slackInfo.accessType
    + '&state=' + slackInfo.state;
  console.log('[Slack.authorisationEndpoint] ', url);
  return url;
}

export function tokenEndpoint(code) {

  return slackInfo.tokenEndpoint 
    + 'client_id=' + slackInfo.clientID
    + '&client_secret=' + slackInfo.clientSecret
    + '&code=' + code 
    + '&redirect_uri=' + redirectURI;

}

export function accessTokenAuthorisationEndpoint() {

  let url = slackInfo.authorisationEndpoint 
    + 'redirect_uri=' + redirectURI
    + '&response_type=' + slackInfo.type
    + '&client_id=' + slackInfo.clientID
    + '&scope=' + slackInfo.scope
    + '&access_type=' + slackInfo.accessType
    + '&state=' + slackInfo.state;
  console.log('[Slack.accessTokenAuthorisationEndpoint] ', url);
  return url;
}

export function accessTokenEndpoint(code) {

  return slackInfo.tokenEndpoint 
    + 'client_id=' + slackInfo.clientID
    + '&client_secret=' + slackInfo.clientSecret
    + '&code=' + code 
    + '&redirect_uri=' + redirectURI;

}
