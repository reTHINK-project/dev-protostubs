
//let identities = {};
//let nIdentity = 0;
//let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');
let userInfoEndpoint;
let tokenEndpoint;
let authorisationEndpoint;
let domain;
let accessTokenEndpoint;
let accessTokenAuthorisationEndpoint;

//function to parse the query string in the given URL to obatin certain values
function urlParser(url, name) {
  name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
  let regexS = '[\\#&?]' + name + '=([^&#]*)';
  let regex = new RegExp(regexS);
  let results = regex.exec(url);
  if (results === null)
    return '';
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
  return new Promise(function (resolve, reject) {
    if (xhr) {
      xhr.onreadystatechange = function (e) {
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

let exchangeRefreshToken = (function (refreshToken) {
  let i = googleInfo;

  let URL = i.tokenEndpoint + 'client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&refresh_token=' + refreshToken + '&grant_type=refresh_token';

  return new Promise(function (resolve, reject) {
    sendHTTPRequest('POST', URL).then(function (info) {
      resolve(info);
    }, function (error) {
      reject(error);
    });

  });
});

let generateAssertionWithAccessToken = ( function (contents, expires, info) {

  return new Promise(function (resolve, reject) {
    sendHTTPRequest('GET', userInfoEndpoint(info)).then(function (infoToken) {
      console.log('[OAUTH2.generateAssertion] obtained user profile ', infoToken);

      let assertion = btoa(JSON.stringify({ tokenID: info.access_token, tokenIDJSON: infoToken }));
      console.log('atob assertion:', atob(assertion));
      let idpBundle = { domain: domain, protocol: 'OAUTH2' };

      //TODO delete later the field infoToken, and delete the need in the example
      let returnValue = { assertion: assertion, idp: idpBundle, expires: expires, userProfile: infoToken };

/*      identities[nIdentity] = returnValue;
      ++nIdentity;
*/
      console.log('[OAUTH2.generateAssertion] returning: ', JSON.stringify(returnValue));

      resolve(returnValue);
    });
  });
});

let generateAssertionWithCodeToken = (function ( contents, expires, hint) {
  return new Promise(function (resolve, reject) {
    let code = urlParser(hint, 'code');

    if (!code) reject('[OAUTH2.generateAssertionWithCode] code not returned by the authentication: ', hint);

      sendHTTPRequest('POST', tokenEndpoint(code)).then(function (info) {

        if (info.hasOwnProperty('access_token')) 
          resolve(generateAssertionWithAccessToken( contents, expires, info) );
        else reject('[OAUTH2.generateAssertionWithCode] access token not returned in the exchange code result: ', info);
      }, function (error) {
        reject(error);
      });

  });
});

let getAccessTokenWithCodeToken = (function (resources, schemes, login) {
  return new Promise(function (resolve, reject) {
    let code = urlParser(login, 'code');

    if (!code) reject('[OAUTH2.getAccessTokenWithCodeToken] code not returned by the login result: ', login);

      sendHTTPRequest('POST', accessTokenEndpoint(code)).then(function (info) {

        if (info.hasOwnProperty('access_token')) {
          let expires = getExpires(info);
          resolve (accessTokenResult(resources, schemes, info.access_token, expires, info));
        } else reject('[OAUTH2.getAccessTokenWithCodeToken] access token not returned in the exchange code result: ', info);
      }, function (error) {
        reject(error);
      });

  });
});

let getExpires = (function (url) {
  let expires = urlParser(url, 'expires_in');

  if (expires) expires = expires + Math.floor(Date.now() / 1000);
  else expires = 3153600000 + Math.floor(Date.now() / 1000);

  return expires;

});

let accessTokenResult = (function (resources, schemes, accessToken, expires, input, refresh) {

  let result = { resources: resources, schemes: schemes, accessToken: accessToken, expires: expires, input: input };

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
  validateAssertion: (config, assertion, origin) => {
    console.info('[OAUTH2.validateAssertion] assertion: ', atob(assertion));
    userInfoEndpoint = config.userInfoEndpoint;
    domain = config.domain;

    return new Promise(function (resolve, reject) {
//      let i = idpInfo;
      let decodedContent = atob(assertion);
      let content = JSON.parse(decodedContent);
      sendHTTPRequest('GET', userInfoEndpoint({access_token: content.tokenID})).then(result => {
        if (JSON.stringify(result) === JSON.stringify(content.tokenIDJSON)) {
          //        if (result.hasOwnProperty('name')) {
          resolve({ identity: result.id, contents: result });
        } else {
          reject('invalid');
        }
      }).catch(err => {
        reject(err);
      });
    });
  },
  /*
    refreshAssertion: (identity) => {
      //console.log('PROXY:refreshAssertion:oldIdentity', identity);
      let i = googleInfo;
  
      return new Promise(function(resolve, reject) {
        if (identity.info.refreshToken) {
          exchangeRefreshToken(identity.info.refreshToken).then(function(value) {
            let infoTokenURL = i.userinfo + value.access_token;
            sendHTTPRequest('GET', infoTokenURL).then(function(infoToken) {
  
              let identityBundle = {accessToken: value.access_token, idToken: value.id_token, refreshToken: identity.info.refreshToken, tokenType: identity.info.tokenType, infoToken: infoToken};
              let idTokenURL = i.tokenInfo + value.id_token;
  
              //obtain information about the user idToken
              sendHTTPRequest('GET', idTokenURL).then(function(idToken) {
  
                identityBundle.tokenIDJSON = idToken;
                identityBundle.expires = idToken.exp;
                identityBundle.email = idToken.email;
  
                let oldIDToken = JSON.parse(atob(identity.assertion));
                let oldIdTokenSplited = oldIDToken.tokenID.split('.');
                let oldDecodedIDToken = JSON.parse(atob(oldIdTokenSplited[1]));
                let idNonce = oldDecodedIDToken.nonce;
  
                let receivedIDToken = value.id_token;
                let idTokenSplited = receivedIDToken.split('.');
                let decodedIDToken = JSON.parse(atob(idTokenSplited[1]));
  
                decodedIDToken.nonce = idNonce;
                let insertedNonce = btoa(JSON.stringify(decodedIDToken));
                let newIDToken = idTokenSplited[0] + '.' +
                                   insertedNonce + '.' +
                                   idTokenSplited[2];
  
                let assertion = btoa(JSON.stringify({tokenID: newIDToken, tokenIDJSON: idToken}));
                let idpBundle = {domain: 'google.com', protocol: 'OIDC'};
  
                //TODO delete later the field infoToken, and delete the need in the example
                let returnValue = {assertion: assertion, idp: idpBundle, info: identityBundle, infoToken: infoToken};
                //console.log('PROXY:refreshAssertion:newIdentity', returnValue);
                resolve(returnValue);
              });
            });
          });
        }
      });
    },*/

  /**
  * Function to generate an identity Assertion
  *
  * @param  {idpInfo}      Object information about IdP endpoints
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {usernameHint} optional usernameHint parameter
  * @return {Promise} returns a promise with an identity assertion
  */
  generateAssertion: (config, contents, origin, hint) => {
    console.log('[OAUTH2.generateAssertion:config]', config);
    console.log('[OAUTH2.generateAssertion:contents]', contents);
    console.log('[OAUTH2.generateAssertion:origin]', origin);
    console.log('[OAUTH2.generateAssertion:hint]', hint);
//    let i = idpInfo;
    userInfoEndpoint = config.userInfoEndpoint;
    tokenEndpoint = config.tokenEndpoint;
    authorisationEndpoint = config.authorisationEndpoint;
    domain = config.domain;

    let _this = this;
    //start the login phase
    return new Promise(function (resolve, reject) {
      if (!hint) {

//        console.log('[OAUTH2.generateAssertion] NO_HINT: rejecting with requestUrl ', requestUrl);

        reject({ name: 'IdPLoginError', loginUrl: authorisationEndpoint() });

      } else {
        // the request have already been made, so idpPRoxy will try to access the user information
        let expires = urlParser(hint, 'expires_in');

        if (expires) expires = expires + Math.floor(Date.now() / 1000);
        else expires = 3153600000 + Math.floor(Date.now() / 1000);

        let accessToken = urlParser(hint, 'access_token');

        if (accessToken) resolve( generateAssertionWithAccessToken(contents, expires,{access_token: accessToken} ) );
        else resolve( generateAssertionWithCodeToken(contents, expires, hint) );
      }
    }, function (e) {

      reject(e);
    });
  },

  /**
  * Function to get an Access Token
  *
  * @param  {idpInfo}      Object information about IdP endpoints
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {login} optional login result
  * @return {Promise} returns a promise with an identity assertion
  */

  getAccessToken: (config, resources, schemes, login) => {
    console.log('[OAUTH2.getAccessToken:config]', config);
//    console.log('[OAUTH2.generateAssertion:contents]', contents);
//    console.log('[OAUTH2.generateAssertion:origin]', origin);
    console.log('[OAUTH2.getAccessToken:login]', login);
//    let i = idpInfo;
    accessTokenEndpoint = config.accessTokenEndpoint;
    accessTokenAuthorisationEndpoint = config.accessTokenAuthorisationEndpoint;
    domain = config.domain;

    let _this = this;
    //start the login phase
    return new Promise(function (resolve, reject) {
      if (!login) { // the user is not authenticated yet

//        console.log('[OAUTH2.generateAssertion] NO_HINT: rejecting with requestUrl ', requestUrl);

        reject({ name: 'IdPLoginError', loginUrl: accessTokenAuthorisationEndpoint(resources, schemes) });

      } else {
        // the user is loggedin, try to extract the Access Token and its expires
        let expires = getExpires(login);

        let accessToken = urlParser(login, 'access_token');

        if (accessToken) resolve( accessTokenResult(resources, schemes, accessToken, expires, login) );
        else resolve( getAccessTokenWithCodeToken(resources, schemes, login) );
      }
    }, function (e) {

      reject(e);
    });
  }



};

