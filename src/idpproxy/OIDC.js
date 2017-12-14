
let identities = {};
let nIdentity = 0;
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '' );



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

/**
* Function to exchange the code received to the id Token, access token and a refresh token
*
*/
/*let exchangeCode = (function(code) {
  let i = googleInfo;

  let URL = i.tokenEndpoint + 'code=' + code + '&client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&redirect_uri=' + i.redirectURI + '&grant_type=authorization_code&access_type=' + i.accessType;


  return new Promise(function(resolve, reject) {
    sendHTTPRequest('POST', URL).then(function(info) {
      console.log('[GoogleIdpProxy.exchangeCode] returned info: ', info);
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
  validateAssertion: (idpInfo, assertion, origin) => {
    console.info('[GoogleIdpProxy.validateAssertionProxy] assertion: ', atob(assertion))
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
      let i = idpInfo;
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
  generateAssertion: (idpInfo, contents, origin, hint) => {
    console.log('[GoogleIdpProxy.generateAssertion:contents]', contents);
    console.log('[GoogleIdpProxy.generateAssertion:origin]', origin);
    console.log('[GoogleIdpProxy.generateAssertion:hint]', hint);
    let i = idpInfo;

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
        console.log('[GoogleIdpProxy.generateAssertion] NO_HINT: rejecting with requestUrl ', requestUrl);

        reject({name: 'IdPLoginError', loginUrl: requestUrl});

      //  } 

      } else {
        // the request have already been made, so idpPRoxy will exchange the tokens along to the idp, to obtain the information necessary
        let accessToken = urlParser(hint, 'access_token');
        let idToken = urlParser(hint, 'id_token');
        let code = urlParser(hint, 'code');

        //console.log('GOOGLE_PROXY_HINT: ', hint);

//       exchangeCode(code).then(function(value) {
 //       console.log('[GoogleIdpProxy.generateAssertion] obtained exchanged Token ', value);
        
          //obtain information about the user
          //let infoTokenURL = i.userinfo + value.access_token;
          let infoTokenURL = i.userinfo + accessToken;
          sendHTTPRequest('GET', infoTokenURL).then(function(infoToken) {
            console.log('[GoogleIdpProxy.generateAssertion] obtained infoToken ', infoToken);
            
//            let identityBundle = {accessToken: value.access_token, idToken: value.id_token, refreshToken: value.refresh_token, tokenType: value.token_type, infoToken: infoToken};
            
//            let idTokenURL = i.tokenInfo + value.id_token;

            let identityBundle = {
              accessToken: accessToken,
              idToken: idToken,
//              refreshToken: value.refresh_token,
              tokenType: 'Bearer',  
              infoToken: infoToken
            };
                        
            let idTokenURL = i.tokenInfo + idToken;
                                    
            //obtain information about the user idToken
            sendHTTPRequest('GET', idTokenURL).then(function(idTokenJSON) {
              console.log('[GoogleIdpProxy.generateAssertion] obtained idToken ', idTokenJSON);
              
              identityBundle.tokenIDJSON = idTokenJSON;
              identityBundle.expires = idTokenJSON.exp;
              identityBundle.email = idTokenJSON.email;

              let assertion = btoa(JSON.stringify({tokenID: idToken, tokenIDJSON: idTokenJSON}));
              let idpBundle = {domain: 'google.com', protocol: 'OIDC'};

              //TODO delete later the field infoToken, and delete the need in the example
              let returnValue = {assertion: assertion, idp: idpBundle, info: identityBundle, infoToken: infoToken};

              identities[nIdentity] = returnValue;
              ++nIdentity;

              console.log('[GoogleIdpProxy.generateAssertion] returning: ', JSON.stringify(returnValue));

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
  }
};
