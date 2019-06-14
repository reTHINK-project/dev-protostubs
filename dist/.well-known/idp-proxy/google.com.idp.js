"use strict";

System.register(["../../libs/idpproxy/OIDC.js", "./GoogleInfo.js", "./GoogleConverter.js", "../../libs/idpproxy/AbstractIdpProxyStub.js"], function (_export, _context) {
  "use strict";

  var IdpProxy, googleInfo, googleAPIInfo, accessTokenAuthorisationEndpoint, accessTokenEndpoint, authorisationEndpoint, accessTokenInput, mapping, refreshAccessTokenEndpoint, revokeAccessTokenEndpoint, convertUserProfile, AbstractIdpProxyProtoStub, idpProxyDescriptor, GoogleIdpProxyProtoStub;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  return {
    setters: [function (_libsIdpproxyOIDCJs) {
      IdpProxy = _libsIdpproxyOIDCJs.IdpProxy;
    }, function (_GoogleInfoJs) {
      googleInfo = _GoogleInfoJs.googleInfo;
      googleAPIInfo = _GoogleInfoJs.googleAPIInfo;
      accessTokenAuthorisationEndpoint = _GoogleInfoJs.accessTokenAuthorisationEndpoint;
      accessTokenEndpoint = _GoogleInfoJs.accessTokenEndpoint;
      authorisationEndpoint = _GoogleInfoJs.authorisationEndpoint;
      accessTokenInput = _GoogleInfoJs.accessTokenInput;
      mapping = _GoogleInfoJs.mapping;
      refreshAccessTokenEndpoint = _GoogleInfoJs.refreshAccessTokenEndpoint;
      revokeAccessTokenEndpoint = _GoogleInfoJs.revokeAccessTokenEndpoint;
    }, function (_GoogleConverterJs) {
      convertUserProfile = _GoogleConverterJs.convertUserProfile;
    }, function (_libsIdpproxyAbstractIdpProxyStubJs) {
      AbstractIdpProxyProtoStub = _libsIdpproxyAbstractIdpProxyStubJs.default;
    }],
    execute: function () {
      idpProxyDescriptor = {
        "name": "GoogleIdpProxyProtoStub",
        "language": "javascript",
        "description": "IDPProxy for google idp",
        "signature": "",
        "configuration": {},
        "constraints": {
          "browser": true
        },
        "interworking": true,
        "objectName": "google.com"
        /**
        * Google Identity Provider Proxy Protocol Stub
        */

      };

      _export("default", GoogleIdpProxyProtoStub =
      /*#__PURE__*/
      function (_AbstractIdpProxyProt) {
        _inherits(GoogleIdpProxyProtoStub, _AbstractIdpProxyProt);

        /**
        * Constructor of the IdpProxy Stub
        * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received
        *
        * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
        * @param  {Message.Message}                           busPostMessage     configuration
        * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
        */
        function GoogleIdpProxyProtoStub() {
          _classCallCheck(this, GoogleIdpProxyProtoStub);

          return _possibleConstructorReturn(this, _getPrototypeOf(GoogleIdpProxyProtoStub).call(this));
        }

        _createClass(GoogleIdpProxyProtoStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, bus, config) {
            console.log('[GoogleIdpProxyProtoStub._start] ');
            config.domain = 'google.com';
            config.idpUrl = 'domain-idp://google.com';
            config.idpProxy = IdpProxy;
            config.idpInfo = googleInfo;
            config.apiInfo = googleAPIInfo;
            config.accessTokenAuthorisationEndpoint = accessTokenAuthorisationEndpoint;
            config.accessTokenEndpoint = accessTokenEndpoint;
            config.refreshAccessTokenEndpoint = refreshAccessTokenEndpoint;
            config.revokeAccessTokenEndpoint = revokeAccessTokenEndpoint;
            config.accessTokenInput = accessTokenInput;
            config.authorisationEndpoint = authorisationEndpoint;
            config.convertUserProfile = convertUserProfile;
            config.mapping = mapping;

            _get(_getPrototypeOf(GoogleIdpProxyProtoStub.prototype), "_init", this).call(this, runtimeProtoStubURL, bus, config);
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

        return GoogleIdpProxyProtoStub;
      }(AbstractIdpProxyProtoStub)); // export default IdpProxyProtoStub;

      /**
       * To activate this protocol stub, using the same method for all protostub.
       * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
       * @param  {Message.Message}                           busPostMessage     configuration
       * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
       * @return {Object} Object with name and instance of ProtoStub
       */
      //export default GoogleIdpProxyProtoStub;

      /*  export default function activate(url, bus, config) {
        return {
          name: 'GoogleIdpProxyProtoStub',
          instance: new GoogleIdpProxyProtoStub(url, bus, config)
        };
      }*/

    }
  };
});