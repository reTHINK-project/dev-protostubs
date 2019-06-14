"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var _this2, identities, nIdentity, redirectURI, accessTokenEndpoint, refreshAccessTokenEndpoint, domain, accessTokenAuthorisationEndpoint, revokeAccessTokenEndpoint, getExpiresAtJSON, getExpires, getAccessTokenWithCodeToken, accessTokenResult, IdpProxy;

  //function to parse the query string in the given URL to obatin certain values
  function urlParser(url, name) {
    name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regexS = '[\\#&?]' + name + '=([^&#]*)';
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results === null) return false;else return results[1];
  }

  function sendHTTPRequest(method, url) {
    var xhr = new XMLHttpRequest();

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
              var info = JSON.parse(xhr.responseText);
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

  _export({
    accessTokenEndpoint: void 0,
    refreshAccessTokenEndpoint: void 0,
    domain: void 0,
    accessTokenAuthorisationEndpoint: void 0,
    revokeAccessTokenEndpoint: void 0
  });

  return {
    setters: [],
    execute: function () {
      _this2 = this;
      // import {getExpires} from './OAUTH';
      identities = {};
      nIdentity = 0;
      redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : ''); //let tokenEndpoint;
      //let authorisationEndpoint;

      _export("getExpiresAtJSON", getExpiresAtJSON = function getExpiresAtJSON(json) {
        var expires = json.hasOwnProperty('expires_in') ? json.expires_in : false;
        if (expires) expires = expires + Math.floor(Date.now() / 1000);else expires = 3153600000 + Math.floor(Date.now() / 1000);
        return Number(expires);
      });

      _export("getExpires", getExpires = function getExpires(url) {
        var expires = urlParser(url, 'expires_in');
        if (expires) expires = expires + Math.floor(Date.now() / 1000);else expires = 3153600000 + Math.floor(Date.now() / 1000);
        return Number(expires);
      });

      getAccessTokenWithCodeToken = function getAccessTokenWithCodeToken(resources, url) {
        return new Promise(function (resolve, reject) {
          var code = urlParser(url, 'code');
          if (!code) reject('[OIDC.getAccessTokenWithCodeToken] code not include in the url: ', url);
          sendHTTPRequest('POST', accessTokenEndpoint(code)).then(function (info) {
            console.info('[OIDC.getAccessTokenWithCodeToken] response: ', info);

            if (info.hasOwnProperty('access_token')) {
              var expires = getExpiresAtJSON(info);
              var refresh = info.hasOwnProperty('refresh_token') ? info.refresh_token : false;
              resolve(accessTokenResult(resources, info.access_token, expires, info, refresh));
            } else reject('[OIDC.getAccessTokenWithCodeToken] access token not returned in the exchange code result: ', info);
          }, function (error) {
            reject(error);
          });
        });
      };

      accessTokenResult = function accessTokenResult(resources, accessToken, expires, input, refresh) {
        var result = {
          domain: domain,
          resources: resources,
          accessToken: accessToken,
          expires: expires,
          input: input
        };
        if (refresh) result.refresh = refresh;
        return result;
      };
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


      _export("IdpProxy", IdpProxy = {
        /**
        * Function to validate an identity Assertion received
        * TODO add details of the implementation, and improve the implementation
        *
        * @param  {idpInfo}      Object information about IdP endpoints
        * @param  {assertion}    Identity Assertion to be validated
        * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
        * @return {Promise}      Returns a promise with the identity assertion validation result
        */
        validateAssertion: function validateAssertion(config, assertion, origin) {
          console.info('[OIDC.validateAssertionProxy] assertion: ', atob(assertion)); //    console.info('validateAssertionProxy:atob(assertion)', atob(assertion));
          //TODO check the values with the hash received
          //  return new Promise(function(resolve,reject) {

          var decodedContent2 = atob(assertion);
          var content = JSON.parse(decodedContent2);
          var idTokenSplited = content.tokenID.split('.');
          var idToken = JSON.parse(atob(idTokenSplited[1])); //resolve({identity: idToken.email, contents: idToken.nonce});
          //});

          return new Promise(function (resolve, reject) {
            var i = config.idpInfo;
            var decodedContent = atob(assertion);
            var content = JSON.parse(decodedContent);
            sendHTTPRequest('GET', i.tokenInfo + content.tokenID).then(function (result) {
              if (JSON.stringify(result) === JSON.stringify(content.tokenIDJSON)) {
                resolve({
                  identity: content.tokenIDJSON.email,
                  contents: content.tokenIDJSON
                });
              } else {
                reject('invalid');
              }
            })["catch"](function (err) {
              reject(err);
            });
          });
        },
        refreshAssertion: function refreshAssertion(identity) {
          console.log('OIDC.refreshAssertion:oldIdentity', identity); //    let i = googleInfo;

          return new Promise(function (resolve, reject) {
            /*      if (identity.info.refreshToken) {
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
                  }*/
            resolve(identity);
          });
        },

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
        generateAssertion: function generateAssertion(config, contents, origin, hint) {
          console.log('[OIDC.generateAssertion:contents]', contents);
          console.log('[OIDC.generateAssertion:origin]', origin);
          console.log('[OIDC.generateAssertion:hint]', hint);
          var i = config.idpInfo; //start the login phase
          //TODO later should be defined a better approach

          return new Promise(function (resolve, reject) {
            if (!hint) {
              /*try {
                if (window) {
                  resolve('url');
                }
              } catch (error) {*/
              var requestUrl = i.authorisationEndpoint + 'redirect_uri=' + redirectURI + '&prompt=consent&response_type=' + i.type + '&client_id=' + i.clientID + '&scope=' + i.scope + '&access_type=' + i.accessType + '&nonce=' + contents + '&state=' + i.state; //        let requestUrl = i.authorisationEndpoint + 'scope=' + i.scope + '&client_id=' + i.clientID + '&redirect_uri=' + i.redirectURI + '&response_type=code' + /*i.type +*/ '&state=' + i.state + '&prompt=consent&access_type=' + i.accessType + '&nonce=' + contents;

              console.log('[OIDC.generateAssertion] NO_HINT: rejecting with requestUrl ', requestUrl);
              reject({
                name: 'IdPLoginError',
                loginUrl: requestUrl
              }); //  }
            } else {
              // the request have already been made, so idpPRoxy will exchange the tokens along to the idp, to obtain the information necessary
              var accessToken = urlParser(hint, 'access_token');
              var idToken = urlParser(hint, 'id_token');
              var code = urlParser(hint, 'code'); //console.log('GOOGLE_PROXY_HINT: ', hint);
              //       exchangeCode(code).then(function(value) {
              //       console.log('[OIDC.generateAssertion] obtained exchanged Token ', value);
              //obtain information about the user
              //let infoTokenURL = i.userinfo + value.access_token;

              var infoTokenURL = i.userinfo + accessToken;
              sendHTTPRequest('GET', infoTokenURL).then(function (infoToken) {
                console.log('[OIDC.generateAssertion] obtained infoToken ', infoToken); //            let identityBundle = {accessToken: value.access_token, idToken: value.id_token, refreshToken: value.refresh_token, tokenType: value.token_type, infoToken: infoToken};
                //            let idTokenURL = i.tokenInfo + value.id_token;

                /*
                            let identityBundle = {
                              accessToken: accessToken,
                              idToken: idToken,
                //              refreshToken: value.refresh_token,
                              tokenType: 'Bearer',
                              infoToken: infoToken
                            };*/

                var idTokenURL = i.tokenInfo + idToken; //obtain information about the user idToken

                sendHTTPRequest('GET', idTokenURL).then(function (idTokenJSON) {
                  console.log('[OIDC.generateAssertion] obtained idToken ', idTokenJSON);
                  /*              identityBundle.tokenIDJSON = idTokenJSON;
                                identityBundle.expires = idTokenJSON.exp;
                                identityBundle.email = idTokenJSON.email;*/

                  var assertion = btoa(JSON.stringify({
                    tokenID: idToken,
                    tokenIDJSON: idTokenJSON
                  }));
                  var idpBundle = {
                    domain: i.domain,
                    protocol: 'OIDC'
                  }; //TODO delete later the field infoToken, and delete the need in the example
                  // TODO replace "refresh: true" by the real refresh token

                  var returnValue = {
                    assertion: assertion,
                    idp: idpBundle,
                    expires: idTokenJSON.exp,
                    userProfile: infoToken,
                    refresh: true
                  };
                  identities[nIdentity] = returnValue;
                  ++nIdentity;
                  console.log('[OIDC.generateAssertion] returning: ', JSON.stringify(returnValue));
                  resolve(returnValue);
                }, function (e) {
                  reject(e);
                });
              }, function (error) {
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
        getAccessTokenAuthorisationEndpoint: function getAccessTokenAuthorisationEndpoint(config, resources) {
          console.log('[OIDC.getAccessTokenAuthorisationEndpoint:config]', config); //    console.log('[OIDC.generateAssertion:contents]', contents);
          //    console.log('[OIDC.generateAssertion:origin]', origin);

          console.log('[OIDC.getAccessTokenAuthorisationEndpoint:resources]', resources); //    let i = idpInfo;

          accessTokenAuthorisationEndpoint = config.accessTokenAuthorisationEndpoint;
          var mapping = config.mapping;
          var _this = _this2; //start the login phase

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
        getAccessToken: function getAccessToken(config, resources, login) {
          console.log('[OIDC.getAccessToken:config]', config); //    console.log('[OIDC.generateAssertion:contents]', contents);
          //    console.log('[OIDC.generateAssertion:origin]', origin);

          console.log('[OIDC.getAccessToken:login]', login); //    let i = idpInfo;

          accessTokenEndpoint = config.accessTokenEndpoint;
          domain = config.domain;
          var _this = _this2; //start the login phase

          return new Promise(function (resolve, reject) {
            // the user is loggedin, try to extract the Access Token and its expires
            var expires = getExpires(login);
            var accessToken = urlParser(login, 'access_token');
            if (accessToken) resolve(accessTokenResult(resources, accessToken, expires, login));else resolve(getAccessTokenWithCodeToken(resources, login));
          }, function (e) {
            reject(e);
          });
        },

        /**
          * Function to refresh an Access Token
          *
          * @param  {login} optional login result
          * @return {Promise} returns a promise with an identity assertion
          */
        refreshAccessToken: function refreshAccessToken(config, token) {
          console.log('[OIDC.refreshAccessToken:config]', config); //    console.log('[OIDC.generateAssertion:contents]', contents);
          //    console.log('[OIDC.generateAssertion:origin]', origin);

          console.log('[OIDC.refreshAccessToken:outdated token]', token); //    let i = idpInfo;

          refreshAccessTokenEndpoint = config.refreshAccessTokenEndpoint;
          domain = config.domain;
          var _this = _this2; //start the login phase

          return new Promise(function (resolve, reject) {
            // the user is loggedin, try to extract the Access Token and its expires
            var refresh = token.refresh;
            if (!refresh) reject('[OIDC.refreshAccessToken] refresh token not available in the access token', token);
            sendHTTPRequest('POST', refreshAccessTokenEndpoint(refresh)).then(function (info) {
              console.info('[OIDC.refreshAccessToken] response: ', info);

              if (info.hasOwnProperty('access_token')) {
                var expires = getExpiresAtJSON(info);
                resolve(accessTokenResult(token.resources, info.access_token, expires, info, refresh));
              } else reject('[OIDC.refreshAccessToken] new access token not returned in the response: ', info);
            }, function (error) {
              reject(error);
            }); //      });
          }, function (e) {
            reject(e);
          });
        },

        /**
          * Function to remove an Access Token
          *
          * @param  {login} optional login result
          * @return {Promise} returns a promise with an identity assertion
          */
        revokeAccessToken: function revokeAccessToken(config, token) {
          console.log('[OIDC.revokeAccessToken:config]', config); //    console.log('[OIDC.generateAssertion:contents]', contents);
          //    console.log('[OIDC.generateAssertion:origin]', origin);

          console.log('[OIDC.revokeAccessToken: token]', token); //    let i = idpInfo;

          revokeAccessTokenEndpoint = config.revokeAccessTokenEndpoint;
          domain = config.domain;
          var _this = _this2; //start the login phase

          return new Promise(function (resolve, reject) {
            // the user is loggedin, try to extract the Access Token and its expires
            var refresh = token.refresh;
            if (!refresh) reject('[OIDC.revokeAccessToken] refresh token not available in the access token', token);
            sendHTTPRequest('POST', revokeAccessTokenEndpoint(token.accessToken)).then(function (info) {
              console.info('[OIDC.revokeAccessToken] response: ', info);
              resolve(true);
            }, function (error) {
              reject(error);
            }); //      });
          }, function (e) {
            reject(e);
          });
        }
      });
    }
  };
});