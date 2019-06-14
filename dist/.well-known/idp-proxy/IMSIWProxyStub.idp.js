"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var domain, idpProxyDescriptor, IMSIWProxyStub;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      domain = 'rethink-project.eu';
      idpProxyDescriptor = {
        "name": "IMSIWProxyStub",
        "language": "javascript",
        "description": "IDPProxy rethink-project.eu description",
        "signature": "",
        "configuration": {},
        "constraints": {
          "browser": true,
          "onlyAccessToken": true
        },
        "interworking": true,
        "objectName": "rethink-project.eu"
        /**
         * Identity Provider Proxy Protocol Stub
         */

      };

      IMSIWProxyStub =
      /*#__PURE__*/
      function () {
        /**
         * Constructor of the IdpProxy Stub
         * The constructor add a listener in the messageBus received and start a web worker with the received idpProxy
         *
         * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
         * @param  {Message.Message}                           busPostMessage     configuration
         * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
         */
        function IMSIWProxyStub() {
          _classCallCheck(this, IMSIWProxyStub);
        }

        _createClass(IMSIWProxyStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, bus, config) {
            var _this2 = this;

            this.runtimeProtoStubURL = runtimeProtoStubURL;
            this.messageBus = bus;
            this.config = config;
            this.messageBus.addListener('*', function (msg) {
              //TODO add the respective listener
              if (msg.to === "domain-idp://".concat(domain)) {
                _this2.requestToIdp(msg);
              }
            });

            this._sendStatus('created');
          }
        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason) {
            var _this = this;

            console.log('[Slack Idp Proxy status changed] to ', value);
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
          /**
           * Function that see the intended method in the message received and call the respective function
           *
           * @param {message}  message received in the messageBus
           */

        }, {
          key: "requestToIdp",
          value: function requestToIdp(msg) {
            var _this3 = this;

            var params = msg.body.params;

            switch (msg.body.method) {
              case 'generateAssertion':
                this.generateAssertion(params.contents, params.origin, params.usernameHint).then(function (value) {
                  return _this3.replyMessage(msg, value);
                })["catch"](function (error) {
                  return _this3.replyMessage(msg, error);
                });
                break;

              case 'validateAssertion':
                this.replyMessage(msg, {
                  identity: 'identity@idp.com',
                  contents: 'content'
                });
                break;

              default:
                break;
            }
          }
        }, {
          key: "generateAssertion",
          value: function generateAssertion(contents, origin, hint) {
            var _this4 = this;

            console.log('contents->', contents);
            console.log('origin->', origin);
            console.log('hint->', hint);
            return new Promise(function (resolve, reject) {
              //the hint field contains the information obtained after the user authentication
              // if the hint content is not present, then rejects the value with the URL to open the page to authenticate the user
              if (!hint) {
                var requestUrl = "https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&state=%2Fprofile&redirect_uri=".concat(location.protocol, "//").concat(location.hostname, "&response_type=token&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com");
                console.log('first url ', requestUrl, 'done');
                reject({
                  name: 'IdPLoginError',
                  loginUrl: requestUrl
                });
              } else {
                var accessToken = _this4._urlParser(hint, 'access_token');

                var expires = Math.floor(Date.now() / 1000) + _this4._urlParser(hint, 'expires_in');

                fetch("https://www.googleapis.com/oauth2/v1/userinfo?access_token=".concat(accessToken)).then(function (res_user) {
                  return res_user.json();
                }).then(function (body) {
                  var infoToken = {
                    picture: body.picture,
                    email: body.email,
                    family_name: body.family_name,
                    given_name: body.given_name
                  };
                  var assertion = btoa(JSON.stringify({
                    tokenID: accessToken,
                    email: body.email,
                    id: body.id
                  }));
                  var toResolve = {
                    info: {
                      expires: expires
                    },
                    assertion: assertion,
                    idp: {
                      domain: domain,
                      protocol: 'OAuth 2.0'
                    },
                    infoToken: infoToken,
                    interworking: {
                      access_token: accessToken,
                      domain: domain
                    }
                  };
                  console.log('RESOLVING THIS OBJECT', toResolve);
                  resolve(toResolve);
                })["catch"](reject);
              }
            });
          }
        }, {
          key: "_urlParser",
          value: function _urlParser(url, name) {
            name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
            var regexS = '[\\#&?]' + name + '=([^&#]*)';
            var regex = new RegExp(regexS);
            var results = regex.exec(url);
            if (results === null) return '';else return results[1];
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
            this.messageBus.postMessage(message);
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

        return IMSIWProxyStub;
      }();
      /**
       * To activate this protocol stub, using the same method for all protostub.
       * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
       * @param  {Message.Message}                           busPostMessage     configuration
       * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
       * @return {Object} Object with name and instance of ProtoStub
       */


      _export("default", IMSIWProxyStub);
      /*export default function activate(url, bus, config) {
      	return {
      		name: 'IMSIWProxyStub',
      		instance: new IMSIWProxyStub(url, bus, config)
      	}
      }*/

    }
  };
});