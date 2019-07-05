System.register([], function(__WEBPACK_DYNAMIC_EXPORT__) {

	return {

		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/idpproxy/microsoft/microsoft.com.idp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/idpproxy/microsoft/microsoft.com.idp.js":
/*!*****************************************************!*\
  !*** ./src/idpproxy/microsoft/microsoft.com.idp.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet microsoftInfo = {\r\n  clientID:              '000000004C18391F',\r\n  redirectURI:           location.origin,\r\n  tokenEndpoint:         'https://login.live.com/oauth20_authorize.srf?',\r\n  type:                  'token',\r\n  scope:                 'wl.signin,wl.basic',\r\n  mode:                  'fragment'\r\n};\r\n\r\n/*\r\nINSTRUCTIONS TO ADD ANOTHER DOMAINS TO BE AUTHORISED\r\n\r\nHow to change information (using the rethinkProject2020@outlook.com account):\r\nuser: rethinkProject2020@outlook.com\r\npass: 45%asd34!zD2&\r\n\r\nother test accounts:\r\nuser: openidtest10@outlook.com\r\npass: testOpenID10\r\n\r\n1º https://portal.azure.com/ -> example\r\n2º go to the left side bar -> more services -> Azure active directory\r\n3º open a small box on the rigth saying \"App registrations\".\r\n4º on right of the page -> \"rethink Project\" -> redirect URIs\r\n5º Add the URI to be authorised for the requests.\r\n\r\nTO ADD MORE USERS THAT ARE ALLOW TO MADE REQUEST (maybe because is a trial account, it is required  to add users to the list of the users that can make requests for the OIDC )\r\n\r\n1º https://portal.azure.com/ -> example\r\n2º go to the left side bar -> more services -> Azure active directory\r\n3º open a small box on the middle saying \"Users and groups\".\r\n4º on right of the page -> \"All users\" -> top button \" + add\"\r\n5º fill with the information and click create\r\n*/\r\n\r\n/**\r\n* Identity Provider Proxy\r\n*/\r\nlet idp = {\r\n\r\n  /**\r\n  * Function to validate an identity Assertion received\r\n  * TODO add details of the implementation, and improve the implementation\r\n  *\r\n  * @param  {assertion}    Identity Assertion to be validated\r\n  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection\r\n  * @return {Promise}      Returns a promise with the identity assertion validation result\r\n  */\r\n  validateAssertion: (assertion, origin) => {\r\n    return new Promise(function(resolve,reject) {\r\n\r\n      let idToken = JSON.parse(atob(assertion));\r\n\r\n      resolve({identity: idToken.email, contents: idToken.nonce});\r\n\r\n    });\r\n  },\r\n\r\n  /**\r\n  * Function to generate an identity Assertion\r\n  * TODO add details of the implementation, and improve implementation\r\n  *\r\n  * @param  {contents} The contents includes information about the identity received\r\n  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection\r\n  * @param  {usernameHint} optional usernameHint parameter\r\n  * @return {Promise} returns a promise with an identity assertion\r\n  */\r\n  generateAssertion: (contents, origin, hint) => {\r\n\r\n    //start the login phase\r\n    //TODO later should be defined a better approach\r\n    return new Promise(function(resolve, reject) {\r\n      if (!hint) {\r\n        let m = microsoftInfo;\r\n\r\n        //let requestUrl = 'https://login.windows.net/common/oauth2/authorize?response_type=id_token&client_id=7e2f3589-4b38-4b1c-a321-c9251de00ef2&scope=openid&nonce=7362CAEA-9CA5-4B43-9BA3-34D7C303EBA7&response_mode=fragment&redirect_uri=' + location.origin;\r\n\r\n        let requestUrl = m.tokenEndpoint + 'response_type=' + m.type + '&client_id=' + m.clientID + '&scope=' + m.scope + '&nonce=' +  contents + '&response_mode=' + m.mode + '&redirect_uri=' +  m.redirectURI;\r\n\r\n        reject({name: 'IdPLoginError', loginUrl: requestUrl});\r\n\r\n      } else {\r\n\r\n        //later verify the token and use the information from the JWT\r\n\r\n        let token = hint.split('/');\r\n        let tokenSplited = token[3];\r\n\r\n        let hintSplited = tokenSplited.split('.');\r\n\r\n        let idToken = JSON.parse(atob(hintSplited[1]));\r\n\r\n        let idpBundle = {domain: 'microsoft.com', protocol: 'OIDC'};\r\n        let identityBundle = {assertion: hintSplited[1], idp: idpBundle, infoToken: idToken};\r\n        resolve(identityBundle);\r\n\r\n      }\r\n    });\r\n  }\r\n};\r\n\r\nconst idpProxyDescriptor = {\r\n  \"name\": \"MicrosoftProxyStub\",\r\n  \"language\": \"javascript\",\r\n  \"description\": \"IDPProxy for microsoft idp\",\r\n  \"signature\": \"\",\r\n  \"configuration\": {},\r\n  \"constraints\": {\r\n    \"browser\": true\r\n  },\r\n  \"interworking\": false,\r\n  \"objectName\": \"microsoft.com\"\r\n}\r\n\r\n/**\r\n* Identity Provider Proxy Protocol Stub\r\n*/\r\nclass MicrosoftProxyStub {\r\n\r\n  /**\r\n  * Constructor of the IdpProxy Stub\r\n  * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received\r\n  *\r\n  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n  * @param  {Message.Message}                           busPostMessage     configuration\r\n  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n  */\r\n constructor() {}\r\n _start(runtimeProtoStubURL, bus, config) {\r\n    let _this = this;\r\n   _this.runtimeProtoStubURL = runtimeProtoStubURL;\r\n   _this.messageBus = bus;\r\n   _this.config = config;\r\n\r\n   _this.messageBus.addListener('*', function(msg) {\r\n     if (msg.to === 'domain-idp://microsoft.com') {\r\n\r\n       _this.requestToIdp(msg);\r\n     }\r\n   });\r\n   _this._sendStatus('created');\r\n }\r\n get descriptor() {\r\n  return idpProxyDescriptor;\r\n}\r\n\r\nget name(){\r\n  return idpProxyDescriptor.name;\r\n}\r\n\r\n  /**\r\n  * Function that see the intended method in the message received and call the respective function\r\n  *\r\n  * @param {message}  message received in the messageBus\r\n  */\r\n  requestToIdp(msg) {\r\n    let _this = this;\r\n    let params = msg.body.params;\r\n\r\n    switch (msg.body.method) {\r\n      case 'generateAssertion':\r\n        idp.generateAssertion(params.contents, params.origin, params.usernameHint).then(\r\n          function(value) { _this.replyMessage(msg, value);},\r\n\r\n          function(error) { _this.replyMessage(msg, error);}\r\n        );\r\n        break;\r\n      case 'validateAssertion':\r\n        idp.validateAssertion(params.assertion, params.origin).then(\r\n          function(value) { _this.replyMessage(msg, value);},\r\n\r\n          function(error) { _this.replyMessage(msg, error);}\r\n        );\r\n        break;\r\n      default:\r\n        break;\r\n    }\r\n  }\r\n\r\n  /**\r\n  * This function receives a message and a value. It replies the value to the sender of the message received\r\n  *\r\n  * @param  {message}   message received\r\n  * @param  {value}     value to include in the new message to send\r\n  */\r\n  replyMessage(msg, value) {\r\n    let _this = this;\r\n\r\n    let message = {id: msg.id, type: 'response', to: msg.from, from: msg.to,\r\n                   body: {code: 200, value: value}};\r\n\r\n    _this.messageBus.postMessage(message);\r\n  }\r\n\r\n  _sendStatus(value, reason) {\r\n    let _this = this;\r\n\r\n    console.log('[GoogleIdpProxy.sendStatus] ', value);\r\n\r\n    _this._state = value;\r\n\r\n    let msg = {\r\n      type: 'update',\r\n      from: _this.runtimeProtoStubURL,\r\n      to: _this.runtimeProtoStubURL + '/status',\r\n      body: {\r\n        value: value\r\n      }\r\n    };\r\n\r\n    if (reason) {\r\n      msg.body.desc = reason;\r\n    }\r\n\r\n    _this.messageBus.postMessage(msg);\r\n  }\r\n\r\n}\r\n\r\n// export default IdpProxyProtoStub;\r\n\r\n/**\r\n * To activate this protocol stub, using the same method for all protostub.\r\n * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n * @param  {Message.Message}                           busPostMessage     configuration\r\n * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n * @return {Object} Object with name and instance of ProtoStub\r\n */\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (MicrosoftProxyStub);\r\n\r\n/*export default function activate(url, bus, config) {\r\n  return {\r\n    name: 'MicrosoftProxyStub',\r\n    instance: new MicrosoftProxyStub(url, bus, config)\r\n  };\r\n}*/\r\n\n\n//# sourceURL=webpack:///./src/idpproxy/microsoft/microsoft.com.idp.js?");

/***/ })

/******/ })
			);
		}
	};
});