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

export let getExpiresAtJSON = (function (json) {
  let expires = json.hasOwnProperty('expires_in') ? json.expires_in : false

  if (expires) expires = expires + Math.floor(Date.now() / 1000);
  else expires = 3153600000 + Math.floor(Date.now() / 1000);

  return Number(expires);

});

export let getExpires = (function (url) {
  let expires = urlParser(url, 'expires_in');

  if (expires) expires = expires + Math.floor(Date.now() / 1000);
  else expires = 3153600000 + Math.floor(Date.now() / 1000);

  return Number(expires);

});
 
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

let getAccessTokenWithCodeToken = (function (resources, url) {
  return new Promise(function (resolve, reject) {
    let code = urlParser(url, 'code');

    if (!code) reject('[OIDC.getAccessTokenWithCodeToken] code not include in the url: ', url);

      sendHTTPRequest('POST', accessTokenEndpoint(code)).then(function (info) {

        console.info('[OIDC.getAccessTokenWithCodeToken] response: ', info);

        if (info.hasOwnProperty('access_token')) {

          let expires = getExpiresAtJSON(info);
          let refresh = info.hasOwnProperty('refresh_token') ? info.refresh_token : false;
          resolve (accessTokenResult(resources, info.access_token, expires, info, refresh));
        } else reject('[OIDC.getAccessTokenWithCodeToken] access token not returned in the exchange code result: ', info);
      }, function (error) {
        reject(error);
      });

  });
});

let accessTokenResult = (function (resources, accessToken, expires, input, refresh) {

  let result = { domain: domain, resources: resources, accessToken: accessToken, expires: expires, input: input };

  if (refresh) result.refresh = refresh;

  return result;

});


/**
* Function to exchange the code received to the id Token, access token and a refresh token
*
*/
/*let exchangeCode = (function(code) {
  let i = googleInfo;

  let URL = i.tokenEndpoint + 'code=' + code + '&client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&redirect_uri=' + i.redirectURI + '&grant_type=authorization_code&access_type=' + i.accessType;


  return new Promise(function(resolve, reject) {
    sendHTTPRequest('POST', URL).then(function(info) {
      console.log('[OIDC.exchangeCode] returned info: ', info);
      resolve(info);
    }, function(error) {
      reject(error);
    });

  });
});

let exchangeRefreshToken = (function(refreshToken) {
  let i = googleInfo;

  let URL = i.tokenEndpoint + 'client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&refresh_token=' + refreshToken + '&grant_type=refresh_token';

  return new Promise(function(resolve, reject) {
    sendHTTPRequest('POST', URL).then(function(info) {
      resolve(info);
    }, function(error) {
      reject(error);
    });

  });
});*/

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
    console.info('[OIDC.validateAssertionProxy] assertion: ', atob(assertion))
//    console.info('validateAssertionProxy:atob(assertion)', atob(assertion));

    //TODO check the values with the hash received
  //  return new Promise(function(resolve,reject) {

      let decodedContent2 = atob(assertion);
      let content = JSON.parse(decodedContent2);
      let idTokenSplited = content.tokenID.split('.');
      let idToken = JSON.parse(atob(idTokenSplited[1]));

      //resolve({identity: idToken.email, contents: idToken.nonce});

    //});

    return new Promise(function(resolve,reject) {
      let i = config.idpInfo;
      let decodedContent = atob(assertion);
      let content = JSON.parse(decodedContent);
      sendHTTPRequest('GET', i.tokenInfo + content.tokenID).then(result => {
        if (JSON.stringify(result) === JSON.stringify(content.tokenIDJSON)) {
          resolve({identity: content.tokenIDJSON.email, contents: content.tokenIDJSON});
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
  * TODO add details of the implementation, and improve implementation
  *
  * @param  {idpInfo}      Object information about IdP endpoints
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {usernameHint} optional usernameHint parameter
  * @return {Promise} returns a promise with an identity assertion
  */
  generateAssertion: (config, contents, origin, hint) => {
    console.log('[OIDC.generateAssertion:contents]', contents);
    console.log('[OIDC.generateAssertion:origin]', origin);
    console.log('[OIDC.generateAssertion:hint]', hint);
    let i = config.idpInfo;

    //start the login phase
    //TODO later should be defined a better approach
    return new Promise(function(resolve, reject) {
      if (!hint) {
        /*try {
          if (window) {
            resolve('url');
          }
        } catch (error) {*/

        let requestUrl = i.authorisationEndpoint + 'redirect_uri=' + redirectURI
        + '&prompt=consent&response_type=' + i.type
        + '&client_id=' + i.clientID
        + '&scope=' + i.scope
        + '&access_type=' + i.accessType
        + '&nonce=' + contents
        + '&state=' + i.state ;

//        let requestUrl = i.authorisationEndpoint + 'scope=' + i.scope + '&client_id=' + i.clientID + '&redirect_uri=' + i.redirectURI + '&response_type=code' + /*i.type +*/ '&state=' + i.state + '&prompt=consent&access_type=' + i.accessType + '&nonce=' + contents;
        console.log('[OIDC.generateAssertion] NO_HINT: rejecting with requestUrl ', requestUrl);

        reject({name: 'IdPLoginError', loginUrl: requestUrl});

      //  }

      } else {
        // the request have already been made, so idpPRoxy will exchange the tokens along to the idp, to obtain the information necessary
        let accessToken = urlParser(hint, 'access_token');
        let idToken = urlParser(hint, 'id_token');
        let code = urlParser(hint, 'code');

        //console.log('GOOGLE_PROXY_HINT: ', hint);

//       exchangeCode(code).then(function(value) {
 //       console.log('[OIDC.generateAssertion] obtained exchanged Token ', value);

          //obtain information about the user
          //let infoTokenURL = i.userinfo + value.access_token;
          let infoTokenURL = i.userinfo + accessToken;
          sendHTTPRequest('GET', infoTokenURL).then(function(infoToken) {
            console.log('[OIDC.generateAssertion] obtained infoToken ', infoToken);

//            let identityBundle = {accessToken: value.access_token, idToken: value.id_token, refreshToken: value.refresh_token, tokenType: value.token_type, infoToken: infoToken};

//            let idTokenURL = i.tokenInfo + value.id_token;
/*
            let identityBundle = {
              accessToken: accessToken,
              idToken: idToken,
//              refreshToken: value.refresh_token,
              tokenType: 'Bearer',
              infoToken: infoToken
            };*/

            let idTokenURL = i.tokenInfo + idToken;

            //obtain information about the user idToken
            sendHTTPRequest('GET', idTokenURL).then(function(idTokenJSON) {
              console.log('[OIDC.generateAssertion] obtained idToken ', idTokenJSON);

/*              identityBundle.tokenIDJSON = idTokenJSON;
              identityBundle.expires = idTokenJSON.exp;
              identityBundle.email = idTokenJSON.email;*/

              let assertion = btoa(JSON.stringify({tokenID: idToken, tokenIDJSON: idTokenJSON}));
              let idpBundle = {domain: i.domain, protocol: 'OIDC'};

              //TODO delete later the field infoToken, and delete the need in the example
              let returnValue = {assertion: assertion, idp: idpBundle, expires: idTokenJSON.exp, userProfile: infoToken};

              identities[nIdentity] = returnValue;
              ++nIdentity;

              console.log('[OIDC.generateAssertion] returning: ', JSON.stringify(returnValue));

              resolve(returnValue);
            }, function(e) {

              reject(e);
            });
          }, function(error) {

            reject(error);
          });
/*        }, function(err) {

          reject(err);
        });*/

      }
    });
  },

  /**
  * Function to get an Access Token endpoint
  *
  * @param  {config}      Object information about IdP endpoints
  * @param  {resources} Object contents includes information about the identity received
  * @return {Promise} returns a promise with an identity assertion
  */

  getAccessTokenAuthorisationEndpoint: (config, resources) => {
    console.log('[OIDC.getAccessTokenAuthorisationEndpoint:config]', config);
//    console.log('[OIDC.generateAssertion:contents]', contents);
//    console.log('[OIDC.generateAssertion:origin]', origin);
    console.log('[OIDC.getAccessTokenAuthorisationEndpoint:resources]', resources);
//    let i = idpInfo;
    accessTokenAuthorisationEndpoint = config.accessTokenAuthorisationEndpoint;
    const mapping = config.mapping;

    let _this = this;
    //start the login phase
    return new Promise(function (resolve, reject) {
      // TODO replace by resources[0]
      resolve(accessTokenAuthorisationEndpoint(mapping(resources)));

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

  getAccessToken: (config, resources, login) => {
    console.log('[OIDC.getAccessToken:config]', config);
//    console.log('[OIDC.generateAssertion:contents]', contents);
//    console.log('[OIDC.generateAssertion:origin]', origin);
    console.log('[OIDC.getAccessToken:login]', login);
//    let i = idpInfo;
    accessTokenEndpoint = config.accessTokenEndpoint;
    domain = config.domain;

    let _this = this;
    //start the login phase
    return new Promise(function (resolve, reject) {
        // the user is loggedin, try to extract the Access Token and its expires
        let expires = getExpires(login);

        let accessToken = urlParser(login, 'access_token');

        if (accessToken) resolve( accessTokenResult(resources, accessToken, expires, login) );
        else resolve( getAccessTokenWithCodeToken(resources, login) );
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

 refreshAccessToken: (config, token) => {
    console.log('[OIDC.refreshAccessToken:config]', config);
  //    console.log('[OIDC.generateAssertion:contents]', contents);
  //    console.log('[OIDC.generateAssertion:origin]', origin);
    console.log('[OIDC.refreshAccessToken:outdated token]', token);
  //    let i = idpInfo;
  refreshAccessTokenEndpoint = config.refreshAccessTokenEndpoint;
    domain = config.domain;

    let _this = this;
    //start the login phase
    return new Promise(function (resolve, reject) {
        // the user is loggedin, try to extract the Access Token and its expires

        let refresh = token.refresh;

        if (!refresh) reject('[OIDC.refreshAccessToken] refresh token not available in the access token', token);
    
          sendHTTPRequest('POST', refreshAccessTokenEndpoint(refresh)).then(function (info) {
    
            console.info('[OIDC.refreshAccessToken] response: ', info);
    
            if (info.hasOwnProperty('access_token')) {
    
              let expires = getExpiresAtJSON(info);
              resolve (accessTokenResult(token.resources, info.access_token, expires, info, refresh));
            } else reject('[OIDC.refreshAccessToken] new access token not returned in the response: ', info);
          }, function (error) {
            reject(error);
          });
    
//      });
    
    }, function (e) {

      reject(e);
    });
  }  
};
