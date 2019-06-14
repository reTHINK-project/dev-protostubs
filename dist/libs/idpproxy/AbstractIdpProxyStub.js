"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var IdpProxy, idpInfo, convertUserProfile, userInfoEndpoint, accessTokenInput, AbstractIdpProxyProtoStub;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  _export({
    IdpProxy: void 0,
    idpInfo: void 0,
    convertUserProfile: void 0,
    userInfoEndpoint: void 0,
    accessTokenInput: void 0
  });

  return {
    setters: [],
    execute: function () {
      /**
      * Abstract Identity Provider Proxy Protocol Stub to be extended by real Idp Proxies
      */
      AbstractIdpProxyProtoStub =
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
        function AbstractIdpProxyProtoStub() {
          _classCallCheck(this, AbstractIdpProxyProtoStub);

          console.log('[AbstractIdpProxy] constructor');
        }

        _createClass(AbstractIdpProxyProtoStub, [{
          key: "_init",
          value: function _init(runtimeProtoStubURL, bus, config) {
            var _this = this;

            _this.runtimeProtoStubURL = runtimeProtoStubURL;
            _this.messageBus = bus;
            _this.config = config;
            IdpProxy = config.idpProxy;
            convertUserProfile = config.convertUserProfile;
            accessTokenInput = config.accessTokenInput;

            _this.messageBus.addListener('*', function (msg) {
              if (msg.to === config.idpUrl) {
                _this.requestToIdp(msg);
              }
            });

            _this._sendStatus('created');
          }
          /**
          * Function that see the intended method in the message received and call the respective function
          *
          * @param {message}  message received in the messageBus
          */

        }, {
          key: "requestToIdp",
          value: function requestToIdp(msg) {
            var _this = this;

            var params = msg.body.params; //console.info('requestToIdp:', msg.body.method);

            console.info('[AbstractIdpProxyProtoStub] receiving request: ', msg);

            switch (msg.body.method) {
              case 'generateAssertion':
                IdpProxy.generateAssertion(_this.config, params.contents, params.origin, params.usernameHint).then(function (value) {
                  value.userProfile = convertUserProfile(value.userProfile);

                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error, 401);
                });
                break;

              case 'validateAssertion':
                //       console.info('validateAssertion');
                IdpProxy.validateAssertion(_this.config, params.assertion, params.origin).then(function (value) {
                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error);
                });
                break;

              case 'refreshAssertion':
                //     console.info('refreshAssertion');
                IdpProxy.refreshAssertion(params.identity).then(function (value) {
                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error, value, 401);
                });
                break;

              case 'getAccessTokenAuthorisationEndpoint':
                //     console.info('getAccessToken');
                IdpProxy.getAccessTokenAuthorisationEndpoint(_this.config, params.resources).then(function (value) {
                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error, 401);
                });
                break;

              case 'getAccessToken':
                //     console.info('getAccessToken');
                IdpProxy.getAccessToken(_this.config, params.resources, params.login).then(function (value) {
                  console.info('OIDC.getAccessToken result: ', value);
                  value.input = accessTokenInput(value.input);

                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error, 401);
                });
                break;

              case 'refreshAccessToken':
                //     console.info('getAccessToken');
                IdpProxy.refreshAccessToken(_this.config, params.token).then(function (value) {
                  console.info('OIDC.refreshAccessToken result: ', value); //            value.input = accessTokenInput(value.input);

                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error, 401);
                });
                break;

              case 'revokeAccessToken':
                //     console.info('getAccessToken');
                IdpProxy.revokeAccessToken(_this.config, params.token).then(function (value) {
                  console.info('OIDC.revokeAccessToken result: ', value); //            value.input = accessTokenInput(value.input);

                  _this.replyMessage(msg, value);
                }, function (error) {
                  _this.replyMessage(msg, error, 401);
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
            var code = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 200;

            var _this = this;

            var message = {
              id: msg.id,
              type: 'response',
              to: msg.from,
              from: msg.to,
              body: {
                code: code
              }
            };
            if (code < 300) message.body.value = value;else message.body.description = value;
            console.log('[AbstractIdpProxyProtoStub.replyMessage] ', message);

            _this.messageBus.postMessage(message);
          }
        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason) {
            var _this = this;

            console.log('[AbstractIdpProxyProtoStub.sendStatus] ', value);
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
        }]);

        return AbstractIdpProxyProtoStub;
      }(); // export default IdpProxyProtoStub;

      /**
       * To activate this protocol stub, using the same method for all protostub.
       * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
       * @param  {Message.Message}                           busPostMessage     configuration
       * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
       * @return {Object} Object with name and instance of ProtoStub
       */


      _export("default", AbstractIdpProxyProtoStub);
    }
  };
});