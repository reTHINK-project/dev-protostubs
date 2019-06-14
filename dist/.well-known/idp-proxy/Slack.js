"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var redirectURI, slackAccessTokenInfo, slackIdAssertionInfo;

  // function to convert Slack user profile info into standard reTHINK user profile object
  function convertUserProfile(userSlack) {
    console.log('[SlackUserProfileConverter] ', userSlack);
    var userProfile = userSlack.user.profile;
    userProfile.userURL = 'user://slack.com/' + userSlack.user.name;
    userProfile.picture = userProfile.image_original ? userProfile.image_original : userProfile.image_72;
    userProfile.id = userSlack.user.id;
    if (!userProfile.hasOwnProperty('preferred_username')) userProfile.preferred_username = userSlack.user.name;
    userProfile.name = userSlack.user.name;
    return userProfile;
  }

  function accessTokenInput(info) {
    console.log('[Slack.getAccessTokenInput] from ', info);
    return {
      user_id: info.user_id,
      team_id: info.team_id
    };
  }

  function userInfoEndpoint(info) {
    return slackIdAssertionInfo.userinfo + info.access_token + '&user=' + info.user_id;
  }

  function validateAssertionEndpoint(info) {
    return slackIdAssertionInfo.userinfo + info.access_token + '&user=' + info.input.user.id;
  }

  function authorisationEndpoint(nonce) {
    var url = slackIdAssertionInfo.authorisationEndpoint + 'redirect_uri=' + redirectURI + '&response_type=' + slackIdAssertionInfo.type + '&client_id=' + slackIdAssertionInfo.clientID + '&scope=' + slackIdAssertionInfo.scope + '&access_type=' + slackIdAssertionInfo.accessType + '&state=' + nonce;
    console.log('[Slack.authorisationEndpoint] ', url);
    return url;
  }

  function tokenEndpoint(code) {
    return slackIdAssertionInfo.tokenEndpoint + 'client_id=' + slackIdAssertionInfo.clientID + '&client_secret=' + slackIdAssertionInfo.clientSecret + '&code=' + code + '&redirect_uri=' + redirectURI;
  }

  function accessTokenAuthorisationEndpoint() {
    var url = slackAccessTokenInfo.authorisationEndpoint + 'redirect_uri=' + redirectURI + '&response_type=' + slackAccessTokenInfo.type + '&client_id=' + slackAccessTokenInfo.clientID + '&scope=' + slackAccessTokenInfo.scope + '&access_type=' + slackAccessTokenInfo.accessType + '&state=' + slackAccessTokenInfo.state;
    console.log('[Slack.accessTokenAuthorisationEndpoint] ', url);
    return url;
  }

  function accessTokenEndpoint(code) {
    return slackAccessTokenInfo.tokenEndpoint + 'client_id=' + slackAccessTokenInfo.clientID + '&client_secret=' + slackAccessTokenInfo.clientSecret + '&code=' + code + '&redirect_uri=' + redirectURI;
  }

  _export({
    convertUserProfile: convertUserProfile,
    accessTokenInput: accessTokenInput,
    userInfoEndpoint: userInfoEndpoint,
    validateAssertionEndpoint: validateAssertionEndpoint,
    authorisationEndpoint: authorisationEndpoint,
    tokenEndpoint: tokenEndpoint,
    accessTokenAuthorisationEndpoint: accessTokenAuthorisationEndpoint,
    accessTokenEndpoint: accessTokenEndpoint
  });

  return {
    setters: [],
    execute: function () {
      /*
      	So that an application can use Slack's OAuth 2.0 authentication system for user login,
        first is required to set up a project in the Facebook Developers Console (https://developers.facebook.com/apps/) 
        to obtain OAuth 2.0 credentials and set a redirect URI.
       */
      redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : ''); // Information to be used to obtain Slack Access Tokens to interwork with Slack chat serviço

      slackAccessTokenInfo = {
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
      }; // Information to be used to generate and validate Slack IdAssertions
      // ie Slack is used as an Identity Provider

      slackIdAssertionInfo = {
        clientID: '11533603872.291565187299',
        "authorisationEndpoint": "https://slack.com/oauth/authorize?",
        "userinfo": "https://slack.com/api/users.info?token=",
        "type": "token",
        "granted_scopes": "identity.basic,identity.avatar,identity.email",
        "state": "state",
        "accessType": "online",
        tokenEndpoint: 'https://slack.com/api/oauth.access?',
        scope: 'client',
        clientSecret: '721ee11eb303817b6b8ee41b785746de'
      };
    }
  };
});