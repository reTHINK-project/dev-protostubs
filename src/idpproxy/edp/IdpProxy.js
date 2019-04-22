// import {getExpires} from './OAUTH';

let identities = {};
let nIdentity = 0;
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '' );


//let tokenEndpoint;
//let authorisationEndpoint;
let accessTokenEndpoint;
let refreshAccessTokenEndpoint;
let domain;
let accessTokenAuthorisationEndpoint;


//function to parse the query string in the given URL to obatin certain values
function urlParser(url, name) {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  let regexS = '[\\#&?]' + name + '=([^&#]*)';
  let regex = new RegExp(regexS);
  let results = regex.exec(url);
  if (results === null)
  return false;
  else
  return results[1];
}

function sendHTTPRequest(method, url) {
  let xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != 'undefined') {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // Otherwise, CORS is not supported by the browser.
    xhr = null;
  }
  return new Promise(function(resolve,reject) {
    if (xhr) {
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            let info = JSON.parse(xhr.responseText);
            resolve(info);
          } else if (xhr.status === 400) {
            reject('There was an error processing the token');
          } else {
            reject('something else other than 200 was returned');
          }
        }
      };
      xhr.send();
    } else {
      reject('CORS not supported');
    }
  });
}


let accessTokenResult = (function (resources, accessToken, expires, input, refresh) {

  let result = { domain: domain, resources: resources, accessToken: accessToken, expires: expires, input: input };

  if (refresh) result.refresh = refresh;

  return result;

});



/**
* Identity Provider Proxy
*/
export let IdpProxy = {

  /**
  * Function to validate an identity Assertion received
  * TODO add details of the implementation, and improve the implementation
  *
  * @param  {idpInfo}      Object information about IdP endpoints
  * @param  {assertion}    Identity Assertion to be validated
  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
  * @return {Promise}      Returns a promise with the identity assertion validation result
  */


  /**
  * Function to get an Access Token endpoint
  *
  * @param  {config}      Object information about IdP endpoints
  * @param  {resources} Object contents includes information about the identity received
  * @return {Promise} returns a promise with an identity assertion
  */

  getAccessTokenAuthorisationEndpoint: (config, client_id) => {
    console.log('[Edp.IdpProxy.getAccessTokenAuthorisationEndpoint:config]', config);
//    console.log('[OIDC.generateAssertion:contents]', contents);
//    console.log('[OIDC.generateAssertion:origin]', origin);
    console.log('[Edp.IdpProxy.getAccessTokenAuthorisationEndpoint:resources]', client_id);
//    let i = idpInfo;
    accessTokenAuthorisationEndpoint = config.authEndpoint;
    //start the login phase
    return new Promise(function (resolve, reject) {
      // TODO replace by resources[0]
      resolve(accessTokenAuthorisationEndpoint(client_id));

    }, function (e) {

      reject(e);
    });
  },

  /**
  * Function to get an Access Token
  *
  * @param  {login} optional login result
  * @return {Promise} returns a promise with an identity assertion
  */

  getAccessToken: (config, client_id, login) => {
    console.log('[OIDC.getAccessToken:config]', config);
//    console.log('[OIDC.generateAssertion:contents]', contents);
//    console.log('[OIDC.generateAssertion:origin]', origin);
    console.log('[OIDC.getAccessToken:login]', login);
//    let i = idpInfo;
    accessTokenEndpoint = config.accessTokenEndpoint;
    domain = config.domain;

    //start the login phase
    return new Promise(function (resolve, reject) {
        // the user is loggedin, try to extract the Access Token and its expires
        let isValid = urlParser(login, 'isValid') === 'true' ? true : false;

        let consent = urlParser(login, 'consent') === 'true' ? true : false;

        if (consent & isValid) {
          let accessToken = consent;
          let expires = 3153600000 + Math.floor(Date.now() / 1000);

          resolve( accessTokenResult(client_id, accessToken, expires, login) );
        } else {
          reject( config.accessTokenErrorMsg(isValid, consent));
        }


    }, function (e) {

      reject(e);
    });
  }

};
