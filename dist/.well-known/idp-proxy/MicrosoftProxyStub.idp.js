"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var microsoftInfo, idp, idpProxyDescriptor, MicrosoftProxyStub;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      microsoftInfo = {
        clientID: '000000004C18391F',
        redirectURI: location.origin,
        tokenEndpoint: 'https://login.live.com/oauth20_authorize.srf?',
        type: 'token',
        scope: 'wl.signin,wl.basic',
        mode: 'fragment'
      };
      /*
      INSTRUCTIONS TO ADD ANOTHER DOMAINS TO BE AUTHORISED
      
      How to change information (using the rethinkProject2020@outlook.com account):
      user: rethinkProject2020@outlook.com
      pass: 45%asd34!zD2&
      
      other test accounts:
      user: openidtest10@outlook.com
      pass: testOpenID10
      
      1º https://portal.azure.com/ -> example
      2º go to the left side bar -> more services -> Azure active directory
      3º open a small box on the rigth saying "App registrations".
      4º on right of the page -> "rethink Project" -> redirect URIs
      5º Add the URI to be authorised for the requests.
      
      TO ADD MORE USERS THAT ARE ALLOW TO MADE REQUEST (maybe because is a trial account, it is required  to add users to the list of the users that can make requests for the OIDC )
      
      1º https://portal.azure.com/ -> example
      2º go to the left side bar -> more services -> Azure active directory
      3º open a small box on the middle saying "Users and groups".
      4º on right of the page -> "All users" -> top button " + add"
      5º fill with the information and click create
      */

      /**
      * Identity Provider Proxy
      */

      idp = {
        /**
        * Function to validate an identity Assertion received
        * TODO add details of the implementation, and improve the implementation
        *
        * @param  {assertion}    Identity Assertion to be validated
        * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
        * @return {Promise}      Returns a promise with the identity assertion validation result
        */
        validateAssertion: function validateAssertion(assertion, origin) {
          return new Promise(function (resolve, reject) {
            var idToken = JSON.parse(atob(assertion));
            resolve({
              identity: idToken.email,
              contents: idToken.nonce
            });
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
        generateAssertion: function generateAssertion(contents, origin, hint) {
          //start the login phase
          //TODO later should be defined a better approach
          return new Promise(function (resolve, reject) {
            if (!hint) {
              var m = microsoftInfo; //let requestUrl = 'https://login.windows.net/common/oauth2/authorize?response_type=id_token&client_id=7e2f3589-4b38-4b1c-a321-c9251de00ef2&scope=openid&nonce=7362CAEA-9CA5-4B43-9BA3-34D7C303EBA7&response_mode=fragment&redirect_uri=' + location.origin;

              var requestUrl = m.tokenEndpoint + 'response_type=' + m.type + '&client_id=' + m.clientID + '&scope=' + m.scope + '&nonce=' + contents + '&response_mode=' + m.mode + '&redirect_uri=' + m.redirectURI;
              reject({
                name: 'IdPLoginError',
                loginUrl: requestUrl
              });
            } else {
              //later verify the token and use the information from the JWT
              var token = hint.split('/');
              var tokenSplited = token[3];
              var hintSplited = tokenSplited.split('.');
              var idToken = JSON.parse(atob(hintSplited[1]));
              var idpBundle = {
                domain: 'microsoft.com',
                protocol: 'OIDC'
              };
              var identityBundle = {
                assertion: hintSplited[1],
                idp: idpBundle,
                infoToken: idToken
              };
              resolve(identityBundle);
            }
          });
        }
      };
      idpProxyDescriptor = {
        "name": "MicrosoftProxyStub",
        "language": "javascript",
        "description": "IDPProxy for microsoft idp",
        "signature": "",
        "configuration": {},
        "constraints": {
          "browser": true
        },
        "interworking": false,
        "objectName": "microsoft.com"
        /**
        * Identity Provider Proxy Protocol Stub
        */

      };

      MicrosoftProxyStub =
      /*#__PURE__*/
      function () {
        /**
        * Constructor of the IdpProxy Stub
        * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received
        *
        * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
        * @param  {Message.Message}                           busPostMessage     configuration
        * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
        */
        function MicrosoftProxyStub() {
          _classCallCheck(this, MicrosoftProxyStub);
        }

        _createClass(MicrosoftProxyStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, bus, config) {
            var _this = this;

            _this.runtimeProtoStubURL = runtimeProtoStubURL;
            _this.messageBus = bus;
            _this.config = config;

            _this.messageBus.addListener('*', function (msg) {
              if (msg.to === 'domain-idp://microsoft.com') {
                _this.requestToIdp(msg);
              }
            });

            _this._sendStatus('created');
          }
        }, {
          key: "requestToIdp",

          /**
          * Function that see the intended method in the message received and call the respective function
          *
          * @param {message}  message received in the messageBus
          */
          value: function requestToIdp(msg) {
            var _this = this;

            var params = msg.body.params;

            switch (msg.body.method) {
              case 'generateAssertion':
                idp.generateAssertion(params.contents, params.origin, params.usernameHint).then(function (value) {
                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error);
                });
                break;

              case 'validateAssertion':
                idp.validateAssertion(params.assertion, params.origin).then(function (value) {
                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error);
                });
                break;

              default:
                break;
            }
          }
          /**
          * This function receives a message and a value. It replies the value to the sender of the message received
          *
          * @param  {message}   message received
          * @param  {value}     value to include in the new message to send
          */

        }, {
          key: "replyMessage",
          value: function replyMessage(msg, value) {
            var _this = this;

            var message = {
              id: msg.id,
              type: 'response',
              to: msg.from,
              from: msg.to,
              body: {
                code: 200,
                value: value
              }
            };

            _this.messageBus.postMessage(message);
          }
        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason) {
            var _this = this;

            console.log('[GoogleIdpProxy.sendStatus] ', value);
            _this._state = value;
            var msg = {
              type: 'update',
              from: _this.runtimeProtoStubURL,
              to: _this.runtimeProtoStubURL + '/status',
              body: {
                value: value
              }
            };

            if (reason) {
              msg.body.desc = reason;
            }

            _this.messageBus.postMessage(msg);
          }
        }, {
          key: "descriptor",
          get: function get() {
            return idpProxyDescriptor;
          }
        }, {
          key: "name",
          get: function get() {
            return idpProxyDescriptor.name;
          }
        }]);

        return MicrosoftProxyStub;
      }(); // export default IdpProxyProtoStub;

      /**
       * To activate this protocol stub, using the same method for all protostub.
       * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
       * @param  {Message.Message}                           busPostMessage     configuration
       * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
       * @return {Object} Object with name and instance of ProtoStub
       */


      _export("default", MicrosoftProxyStub);
      /*export default function activate(url, bus, config) {
        return {
          name: 'MicrosoftProxyStub',
          instance: new MicrosoftProxyStub(url, bus, config)
        };
      }*/

    }
  };
});