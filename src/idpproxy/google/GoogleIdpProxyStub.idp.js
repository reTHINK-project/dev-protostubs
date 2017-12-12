let identities = {};
let nIdentity = 0;

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

let googleInfo = {
  clientSecret:          'Xx4rKucb5ZYTaXlcZX9HLfZW',
  clientID:              '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
  redirectURI:            location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '' ), 
  issuer:                'https://accounts.google.com',
  tokenEndpoint:         'https://www.googleapis.com/oauth2/v4/token?',
  jwksUri:               'https://www.googleapis.com/oauth2/v3/certs?',
  authorisationEndpoint: 'https://accounts.google.com/o/oauth2/auth?',
  userinfo:              'https://www.googleapis.com/oauth2/v3/userinfo?access_token=',
  tokenInfo:             'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=',
  accessType:            'offline',
  type:                  'code token id_token',
  scope:                 'openid%20email%20profile',
  state:                 'state'
};
/*
let googleInfo = {
  clientID:              '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
  redirectURI:            location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '' ), 
  issuer:                'https://accounts.google.com',
  tokenEndpoint:         'https://www.googleapis.com/oauth2/v4/token?',
  jwksUri:               'https://www.googleapis.com/oauth2/v3/certs?',
  authorisationEndpoint: 'https://accounts.google.com/o/oauth2/auth?',
  userinfo:              'https://www.googleapis.com/oauth2/v3/userinfo?access_token=',
  tokenInfo:             'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=',
  accessType:            'online',
  type:                  'token',
  scope:                 'https://www.googleapis.com/auth/userinfo.profile',
  state:                 'state'
};*/

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
let exchangeCode = (function(code) {
  let i = googleInfo;

  let URL = i.tokenEndpoint + 'code=' + code + '&client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&redirect_uri=' + i.redirectURI + '&grant_type=authorization_code&access_type=' + i.accessType;

  //let URL = = i.tokenEndpoint + 'client_id=' + i.clientID + '&client_secret=' + i.clientSecret + '&refresh_token=' + code + '&grant_type=refresh_token';

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
});

/**
* Identity Provider Proxy
*/
let IdpProxy = {

  /**
  * Function to validate an identity Assertion received
  * TODO add details of the implementation, and improve the implementation
  *
  * @param  {assertion}    Identity Assertion to be validated
  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
  * @return {Promise}      Returns a promise with the identity assertion validation result
  */
  validateAssertion: (assertion, origin) => {
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
      let i = googleInfo;
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
  },

  /**
  * Function to generate an identity Assertion
  * TODO add details of the implementation, and improve implementation
  *
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {usernameHint} optional usernameHint parameter
  * @return {Promise} returns a promise with an identity assertion
  */
  generateAssertion: (contents, origin, hint) => {
    console.log('[GoogleIdpProxy.generateAssertion:contents]', contents);
    console.log('[GoogleIdpProxy.generateAssertion:origin]', origin);
    console.log('[GoogleIdpProxy.generateAssertion:hint]', hint);
    let i = googleInfo;

    //start the login phase
    //TODO later should be defined a better approach
    return new Promise(function(resolve, reject) {
      if (!hint) {
        /*try {
          if (window) {
            resolve('url');
          }
        } catch (error) {*/

//        let requestUrl = i.authorisationEndpoint + 'redirect_uri=' + i.redirectURI + '&prompt=consent&response_type=token' +
//        '&client_id=' + i.clientID + '&scope=' + i.scope + '&access_type=' + i.accessType;
            
        let requestUrl = i.authorisationEndpoint + 'scope=' + i.scope + '&client_id=' + i.clientID + '&redirect_uri=' + i.redirectURI + '&response_type=code' + /*i.type +*/ '&state=' + i.state + '&prompt=consent&access_type=' + i.accessType + '&nonce=' + contents;
        console.log('[GoogleIdpProxy.generateAssertion] NO_HINT: rejecting with requestUrl ', requestUrl);

        reject({name: 'IdPLoginError', loginUrl: requestUrl});

      //  }

      } else {
        // the request have already been made, so idpPRoxy will exchange the tokens along to the idp, to obtain the information necessary
        let accessToken = urlParser(hint, 'access_token');
        let idToken = urlParser(hint, 'id_token');
        let code = urlParser(hint, 'code');

        //console.log('GOOGLE_PROXY_HINT: ', hint);

        exchangeCode(code).then(function(value) {

          //obtain information about the user
          let infoTokenURL = i.userinfo + value.access_token;
          sendHTTPRequest('GET', infoTokenURL).then(function(infoToken) {
            console.log('[GoogleIdpProxy.generateAssertion] obtained infoToken ', infoToken);
            
            let identityBundle = {accessToken: value.access_token, idToken: value.id_token, refreshToken: value.refresh_token, tokenType: value.token_type, infoToken: infoToken};

            let idTokenURL = i.tokenInfo + value.id_token;

            //obtain information about the user idToken
            sendHTTPRequest('GET', idTokenURL).then(function(idToken) {
              console.log('[GoogleIdpProxy.generateAssertion] obtained idToken ', idToken);
              
              identityBundle.tokenIDJSON = idToken;
              identityBundle.expires = idToken.exp;
              identityBundle.email = idToken.email;

              let assertion = btoa(JSON.stringify({tokenID: value.id_token, tokenIDJSON: idToken}));
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
        }, function(err) {

          reject(err);
        });

      }
    });
  }
};


function getAssertion() {
  console.log('get assertion');
  var contents = "NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTg0LDE5MCwyMjgsMjQ5LDgwLDM1LDMyLDE4LDE0OCwyMDAsMTM0LDcsMjUxLDQ0LDE1NywxMDgsMTk3LDk0LDg5LDg2LDIyNCwxMCwxNjYsNjksNDgsMTIwLDI3LDIwLDIwNyw5MywxMDEsMjExLDE2Miw5MywxMTgsMiwyNDksOTksMTQ3LDgzLDMsMzQsNjksMTI0LDE0MywxMDcsMTk2LDE2Myw1Myw5NywyMTgsMTg2LDEzNywyNTEsMTI3LDE5NywyMDgsMTc2LDgzLDE1NCwxMTQsMjIsMTIxLDExMiwxODYsMTQsOTIsMTQsMTM0LDgzLDEwMCwxNDYsMjQ1LDE4Niw0Nyw5MiwzMiwyMTcsMjEyLDIxLDI5LDE4MywxMjMsMTExLDQ0LDE4MywxNjIsOTUsMTkzLDE3MCwxNDksODUsMTMsNzIsODAsNjYsNzQsMTgwLDI1MywyNDYsMTczLDE1NywyMjksMjI5LDIwNCw4NCwxMDgsMTQ0LDE2MSw2MiwyNiwxODEsMTgzLDQ5LDEyNiwxNTQsMzgsMTk3LDE4Niw4OCwxMzEsOTcsMjIzLDE1MSw2Niw2Niw0MywxOSwzMCw5MSwyNTMsMjM4LDE3NSwyMTksMTYyLDgyLDIwMywxMTUsMTg2LDE4LDU2LDI1MSwyMSwxMTksMjUyLDk5LDc2LDEwOCwyMTMsMjA5LDMwLDIwNCw5Miw2Miw3OSwxMjMsMTYwLDQ5LDEzOCwyNDEsMTg2LDEyLDc1LDQ1LDE4OSw0NCwyMzksNTAsMjAsMzYsMTU0LDEyNSwyNDgsMjI5LDE1MCw0NywyMTUsMjI5LDYzLDk2LDIzOSwxNjAsMTg2LDIzNCwxMjYsNTMsMTUxLDIxNSwxODEsOTksNTYsMzksMzEsMjI4LDYxLDIzMSwxOTUsNywyMjcsMTQwLDEyNSwxNjYsMjA4LDI0NSwyNDAsNywzOSw4Miw5OCw4OSw3Miw4MCwxMjYsMTE2LDExMiwxOTEsMTkyLDEyNiwxMzgsMjA1LDE2NywyMCwyOCwyMzUsMTU0LDEyNiwyMDEsNzgsNDAsODIsMjAyLDEzNSw0NSwyNDcsMjAzLDE5OCwxMTgsMjM1LDIwNCwyMDMsMjIyLDkyLDE3MiwyNDYsOTQsMjI5LDI1MSwxMjQsMjcsMjE2LDU5LDgzLDIzMiwyNDgsMTQsNzksMiwzLDEsMCwx";
  var origin = undefined;
  var requestUrl = "https://accounts.google.com/o/oauth2/auth?scope=openid%20email%20profile&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com&redirect_uri=https://localhost&response_type=code&state=state&prompt=consent&access_type=offline&nonce=NDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMTg0LDE5MCwyMjgsMjQ5LDgwLDM1LDMyLDE4LDE0OCwyMDAsMTM0LDcsMjUxLDQ0LDE1NywxMDgsMTk3LDk0LDg5LDg2LDIyNCwxMCwxNjYsNjksNDgsMTIwLDI3LDIwLDIwNyw5MywxMDEsMjExLDE2Miw5MywxMTgsMiwyNDksOTksMTQ3LDgzLDMsMzQsNjksMTI0LDE0MywxMDcsMTk2LDE2Myw1Myw5NywyMTgsMTg2LDEzNywyNTEsMTI3LDE5NywyMDgsMTc2LDgzLDE1NCwxMTQsMjIsMTIxLDExMiwxODYsMTQsOTIsMTQsMTM0LDgzLDEwMCwxNDYsMjQ1LDE4Niw0Nyw5MiwzMiwyMTcsMjEyLDIxLDI5LDE4MywxMjMsMTExLDQ0LDE4MywxNjIsOTUsMTkzLDE3MCwxNDksODUsMTMsNzIsODAsNjYsNzQsMTgwLDI1MywyNDYsMTczLDE1NywyMjksMjI5LDIwNCw4NCwxMDgsMTQ0LDE2MSw2MiwyNiwxODEsMTgzLDQ5LDEyNiwxNTQsMzgsMTk3LDE4Niw4OCwxMzEsOTcsMjIzLDE1MSw2Niw2Niw0MywxOSwzMCw5MSwyNTMsMjM4LDE3NSwyMTksMTYyLDgyLDIwMywxMTUsMTg2LDE4LDU2LDI1MSwyMSwxMTksMjUyLDk5LDc2LDEwOCwyMTMsMjA5LDMwLDIwNCw5Miw2Miw3OSwxMjMsMTYwLDQ5LDEzOCwyNDEsMTg2LDEyLDc1LDQ1LDE4OSw0NCwyMzksNTAsMjAsMzYsMTU0LDEyNSwyNDgsMjI5LDE1MCw0NywyMTUsMjI5LDYzLDk2LDIzOSwxNjAsMTg2LDIzNCwxMjYsNTMsMTUxLDIxNSwxODEsOTksNTYsMzksMzEsMjI4LDYxLDIzMSwxOTUsNywyMjcsMTQwLDEyNSwxNjYsMjA4LDI0NSwyNDAsNywzOSw4Miw5OCw4OSw3Miw4MCwxMjYsMTE2LDExMiwxOTEsMTkyLDEyNiwxMzgsMjA1LDE2NywyMCwyOCwyMzUsMTU0LDEyNiwyMDEsNzgsNDAsODIsMjAyLDEzNSw0NSwyNDcsMjAzLDE5OCwxMTgsMjM1LDIwNCwyMDMsMjIyLDkyLDE3MiwyNDYsOTQsMjI5LDI1MSwxMjQsMjcsMjE2LDU5LDgzLDIzMiwyNDgsMTQsNzksMiwzLDEsMCwx";
  var hint;

  IdpProxy.generateAssertion(contents,origin)
  .then( function (assertion) {console.log(assertion)},
      function (error) {
       openPopup(error.loginUrl).then( function (value) {
         console.log('getAssertion: result from popup ', value);
          IdpProxy.generateAssertion(contents,origin, value)
          .then( function (assertion) {
          console.log(assertion);
          });
      }).catch((error) => {console.error(error)});    
  });    
}

function openPopup(urlreceived) {

  console.log('[openPopup] url ', urlreceived );
  
      return new Promise((resolve, reject) => {
  
        let win = window.open(urlreceived, 'openIDrequest', 'width=800, height=600');
        if (window.cordova) {
          win.addEventListener('loadstart', function(e) {
            let url = e.url;
            let code = /\&code=(.+)$/.exec(url);
            let error = /\&error=(.+)$/.exec(url);
  
            if (code || error) {
              win.close();
              return resolve(url);
            } else {
              return reject('openPopup error 1 - should not happen');
            }
          });
        } else {
          let pollTimer = setInterval(function() {
            try {
              if (win.closed) {
                return reject('Some error occured when trying to get identity.');
                clearInterval(pollTimer);
              }

              console.log('openPopup url: ', win.document.URL);
              console.log('openPopup origin: ', location.origin);
              
  
              if (win.document.URL.indexOf('id_token') !== -1 || win.document.URL.indexOf(location.origin) !== -1) {
                window.clearInterval(pollTimer);
                let url =   win.document.URL;
  
                win.close();
                return resolve(url);
              }
            } catch (e) {
              //return reject('openPopup error 2 - should not happen');
              //console.log(e);
            }
          }, 500);
        }
      });
    }