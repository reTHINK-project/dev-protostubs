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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/idpproxy/edp/edpdistribuicao.pt.idp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/idpproxy/AbstractIdpProxyStub.js":
/*!**********************************************!*\
  !*** ./src/idpproxy/AbstractIdpProxyStub.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet IdpProxy;\r\nlet idpInfo;\r\nlet convertUserProfile;\r\nlet userInfoEndpoint;\r\nlet accessTokenInput;\r\n\r\n/**\r\n* Abstract Identity Provider Proxy Protocol Stub to be extended by real Idp Proxies\r\n*/\r\nclass AbstractIdpProxyProtoStub {\r\n\r\n  /**\r\n  * Constructor of the IdpProxy Stub\r\n  * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received\r\n  *\r\n  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n  * @param  {Message.Message}                           busPostMessage     configuration\r\n  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n  */\r\n  constructor() {\r\n    console.log('[AbstractIdpProxy] constructor');\r\n  }\r\n\r\n  _init(runtimeProtoStubURL, bus, config) {\r\n    let _this = this;\r\n    _this.runtimeProtoStubURL = runtimeProtoStubURL;\r\n    _this.messageBus = bus;\r\n    _this.config = config;\r\n    IdpProxy = config.idpProxy;\r\n    convertUserProfile = config.convertUserProfile;\r\n    accessTokenInput = config.accessTokenInput;\r\n\r\n\r\n\r\n    _this.messageBus.addListener('*', function (msg) {\r\n      if (msg.to === config.idpUrl) {\r\n\r\n        _this.requestToIdp(msg);\r\n      }\r\n    });\r\n    _this._sendStatus('created');\r\n  }\r\n\r\n  /**\r\n  * Function that see the intended method in the message received and call the respective function\r\n  *\r\n  * @param {message}  message received in the messageBus\r\n  */\r\n  requestToIdp(msg) {\r\n    let _this = this;\r\n    let params = msg.body.params;\r\n    //console.info('requestToIdp:', msg.body.method);\r\n    console.info('[AbstractIdpProxyProtoStub] receiving request: ', msg);\r\n\r\n    switch (msg.body.method) {\r\n      case 'generateAssertion':\r\n        IdpProxy.generateAssertion(_this.config, params.contents, params.origin, params.usernameHint).then(\r\n          function (value) {\r\n\r\n            value.userProfile = convertUserProfile(value.userProfile);\r\n            _this.replyMessage(msg, value);\r\n          },\r\n\r\n          function (error) { _this.replyMessage(msg, error, 401); }\r\n        );\r\n        break;\r\n      case 'validateAssertion':\r\n        //       console.info('validateAssertion');\r\n        IdpProxy.validateAssertion(_this.config, params.assertion, params.origin).then(\r\n          function (value) { _this.replyMessage(msg, value); },\r\n\r\n          function (error) { _this.replyMessage(msg, error); }\r\n        );\r\n        break;\r\n      case 'refreshAssertion':\r\n        //     console.info('refreshAssertion');\r\n        IdpProxy.refreshAssertion(params.identity).then(\r\n          function (value) { _this.replyMessage(msg, value); },\r\n\r\n          function (error) { _this.replyMessage(msg, error, value, 401); }\r\n        );\r\n        break;\r\n      case 'getAccessTokenAuthorisationEndpoint':\r\n        //     console.info('getAccessToken');\r\n        IdpProxy.getAccessTokenAuthorisationEndpoint(_this.config, params.resources).then(\r\n          function (value) {\r\n            _this.replyMessage(msg, value);\r\n          },\r\n\r\n          function (error) { _this.replyMessage(msg, error, 401); }\r\n        );\r\n        break;\r\n      case 'getAccessToken':\r\n        //     console.info('getAccessToken');\r\n        IdpProxy.getAccessToken(_this.config, params.resources, params.login).then(\r\n          function (value) {\r\n            console.info('OIDC.getAccessToken result: ', value);\r\n            value.input = accessTokenInput(value.input);\r\n            _this.replyMessage(msg, value);\r\n          },\r\n\r\n          function (error) { _this.replyMessage(msg, error, 401); }\r\n        );\r\n        break;\r\n      case 'refreshAccessToken':\r\n        //     console.info('getAccessToken');\r\n        IdpProxy.refreshAccessToken(_this.config, params.token).then(\r\n          function (value) {\r\n            console.info('OIDC.refreshAccessToken result: ', value);\r\n//            value.input = accessTokenInput(value.input);\r\n            _this.replyMessage(msg, value);\r\n          },\r\n\r\n          function (error) { _this.replyMessage(msg, error, 401); }\r\n        );\r\n        break;\r\n      case 'revokeAccessToken':\r\n        //     console.info('getAccessToken');\r\n        IdpProxy.revokeAccessToken(_this.config, params.token).then(\r\n          function (value) {\r\n            console.info('OIDC.revokeAccessToken result: ', value);\r\n//            value.input = accessTokenInput(value.input);\r\n            _this.replyMessage(msg, value);\r\n          },\r\n\r\n          function (error) { _this.replyMessage(msg, error, 401); }\r\n        );\r\n        break;\r\n      default:\r\n        break;\r\n    }\r\n  }\r\n\r\n  /**\r\n  * This function receives a message and a value. It replies the value to the sender of the message received\r\n  *\r\n  * @param  {message}   message received\r\n  * @param  {value}     value to include in the new message to send\r\n  */\r\n  replyMessage(msg, value, code = 200) {\r\n    let _this = this;\r\n\r\n    let message = {\r\n      id: msg.id, type: 'response', to: msg.from, from: msg.to,\r\n      body: { code: code }\r\n    };\r\n\r\n    if (code < 300 ) message.body.value = value;\r\n    else message.body.description = value;\r\n\r\n    console.log('[AbstractIdpProxyProtoStub.replyMessage] ', message);\r\n\r\n    _this.messageBus.postMessage(message);\r\n  }\r\n\r\n  _sendStatus(value, reason) {\r\n    let _this = this;\r\n\r\n    console.log('[AbstractIdpProxyProtoStub.sendStatus] ', value);\r\n\r\n    _this._state = value;\r\n\r\n    let msg = {\r\n      type: 'update',\r\n      from: _this.runtimeProtoStubURL,\r\n      to: _this.runtimeProtoStubURL + '/status',\r\n      body: {\r\n        value: value\r\n      }\r\n    };\r\n\r\n    if (reason) {\r\n      msg.body.desc = reason;\r\n    }\r\n\r\n    _this.messageBus.postMessage(msg);\r\n  }\r\n}\r\n\r\n// export default IdpProxyProtoStub;\r\n\r\n/**\r\n * To activate this protocol stub, using the same method for all protostub.\r\n * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n * @param  {Message.Message}                           busPostMessage     configuration\r\n * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n * @return {Object} Object with name and instance of ProtoStub\r\n */\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (AbstractIdpProxyProtoStub);\r\n\n\n//# sourceURL=webpack:///./src/idpproxy/AbstractIdpProxyStub.js?");

/***/ }),

/***/ "./src/idpproxy/edp/EdpInfo.js":
/*!*************************************!*\
  !*** ./src/idpproxy/edp/EdpInfo.js ***!
  \*************************************/
/*! exports provided: edpInfo, authEndpoint, revokeEndpoint, accessTokenInput, accessTokenErrorMsg */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"edpInfo\", function() { return edpInfo; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"authEndpoint\", function() { return authEndpoint; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"revokeEndpoint\", function() { return revokeEndpoint; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"accessTokenInput\", function() { return accessTokenInput; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"accessTokenErrorMsg\", function() { return accessTokenErrorMsg; });\n\r\nlet redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');\r\n\r\nlet edpInfo = {\r\n//  \"authorisationEndpoint\":  \"https://online.edpdistribuicao.pt/sharing-cities/login?\",\r\n//  \"revokeEndpoint\": \"https://online.edpdistribuicao.pt/sharing-cities/revoke?\",\r\n  \"authorisationEndpoint\":  \"https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/login?\",\r\n  \"revokeEndpoint\": \"https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/revoke?\",\r\n  \"domain\": \"edpdistribuicao.pt\",\r\n  \"invalidCPEErroMsg\": \"Lamentamos mas o CPE indicado não está localizado no Concelho de Lisboa\",\r\n  \"consentErroMsg\": \"Não deu consentimento para disponibilizar os seus dados de consumo de energia eléctrica\"\r\n};\r\n\r\nfunction authEndpoint(client_id) {\r\n\r\n  return edpInfo.authorisationEndpoint\r\n    + 'client_id=' + client_id\r\n    + '&redirect_uri=' + redirectURI;\r\n};\r\n\r\nfunction revokeEndpoint(client_id) {\r\n\r\n  return edpInfo.revokeEndpoint\r\n  + 'client_id=' + client_id;\r\n};\r\n\r\nfunction accessTokenInput(info) {\r\n\r\n  return {info};\r\n};\r\n\r\nfunction accessTokenErrorMsg(isValid, consent) {\r\n\r\n\r\n\r\n  return isValid ? edpInfo.consentErroMsg : edpInfo.invalidCPEErroMsg;\r\n};\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./src/idpproxy/edp/EdpInfo.js?");

/***/ }),

/***/ "./src/idpproxy/edp/IdpProxy.js":
/*!**************************************!*\
  !*** ./src/idpproxy/edp/IdpProxy.js ***!
  \**************************************/
/*! exports provided: IdpProxy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"IdpProxy\", function() { return IdpProxy; });\n// import {getExpires} from './OAUTH';\r\n\r\nlet identities = {};\r\nlet nIdentity = 0;\r\nlet redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '' );\r\n\r\n\r\n//let tokenEndpoint;\r\n//let authorisationEndpoint;\r\nlet accessTokenEndpoint;\r\nlet refreshAccessTokenEndpoint;\r\nlet domain;\r\nlet accessTokenAuthorisationEndpoint;\r\n\r\n\r\n//function to parse the query string in the given URL to obatin certain values\r\nfunction urlParser(url, name) {\r\n  name = name.replace(/[\\[]/, '\\\\\\[').replace(/[\\]]/, '\\\\\\]');\r\n  let regexS = '[\\\\#&?]' + name + '=([^&#]*)';\r\n  let regex = new RegExp(regexS);\r\n  let results = regex.exec(url);\r\n  if (results === null)\r\n  return false;\r\n  else\r\n  return results[1];\r\n}\r\n\r\nfunction sendHTTPRequest(method, url) {\r\n  let xhr = new XMLHttpRequest();\r\n  if ('withCredentials' in xhr) {\r\n    xhr.open(method, url, true);\r\n  } else if (typeof XDomainRequest != 'undefined') {\r\n    // Otherwise, check if XDomainRequest.\r\n    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.\r\n    xhr = new XDomainRequest();\r\n    xhr.open(method, url);\r\n  } else {\r\n    // Otherwise, CORS is not supported by the browser.\r\n    xhr = null;\r\n  }\r\n  return new Promise(function(resolve,reject) {\r\n    if (xhr) {\r\n      xhr.onreadystatechange = function(e) {\r\n        if (xhr.readyState === 4) {\r\n          if (xhr.status === 200) {\r\n            let info = JSON.parse(xhr.responseText);\r\n            resolve(info);\r\n          } else if (xhr.status === 400) {\r\n            reject('There was an error processing the token');\r\n          } else {\r\n            reject('something else other than 200 was returned');\r\n          }\r\n        }\r\n      };\r\n      xhr.send();\r\n    } else {\r\n      reject('CORS not supported');\r\n    }\r\n  });\r\n}\r\n\r\n\r\nlet accessTokenResult = (function (resources, accessToken, expires, input, refresh) {\r\n\r\n  let result = { domain: domain, resources: resources, accessToken: accessToken, expires: expires, input: input };\r\n\r\n  if (refresh) result.refresh = refresh;\r\n\r\n  return result;\r\n\r\n});\r\n\r\n\r\n\r\n/**\r\n* Identity Provider Proxy\r\n*/\r\nlet IdpProxy = {\r\n\r\n  /**\r\n  * Function to validate an identity Assertion received\r\n  * TODO add details of the implementation, and improve the implementation\r\n  *\r\n  * @param  {idpInfo}      Object information about IdP endpoints\r\n  * @param  {assertion}    Identity Assertion to be validated\r\n  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection\r\n  * @return {Promise}      Returns a promise with the identity assertion validation result\r\n  */\r\n\r\n\r\n  /**\r\n  * Function to get an Access Token endpoint\r\n  *\r\n  * @param  {config}      Object information about IdP endpoints\r\n  * @param  {resources} Object contents includes information about the identity received\r\n  * @return {Promise} returns a promise with an identity assertion\r\n  */\r\n\r\n  getAccessTokenAuthorisationEndpoint: (config, client_id) => {\r\n    console.log('[Edp.IdpProxy.getAccessTokenAuthorisationEndpoint:config]', config);\r\n//    console.log('[OIDC.generateAssertion:contents]', contents);\r\n//    console.log('[OIDC.generateAssertion:origin]', origin);\r\n    console.log('[Edp.IdpProxy.getAccessTokenAuthorisationEndpoint:resources]', client_id);\r\n//    let i = idpInfo;\r\n    accessTokenAuthorisationEndpoint = config.authEndpoint;\r\n    //start the login phase\r\n    return new Promise(function (resolve, reject) {\r\n      // TODO replace by resources[0]\r\n      resolve(accessTokenAuthorisationEndpoint(client_id));\r\n\r\n    }, function (e) {\r\n\r\n      reject(e);\r\n    });\r\n  },\r\n\r\n  /**\r\n  * Function to get an Access Token\r\n  *\r\n  * @param  {login} optional login result\r\n  * @return {Promise} returns a promise with an identity assertion\r\n  */\r\n\r\n  getAccessToken: (config, client_id, login) => {\r\n    console.log('[OIDC.getAccessToken:config]', config);\r\n//    console.log('[OIDC.generateAssertion:contents]', contents);\r\n//    console.log('[OIDC.generateAssertion:origin]', origin);\r\n    console.log('[OIDC.getAccessToken:login]', login);\r\n//    let i = idpInfo;\r\n    accessTokenEndpoint = config.accessTokenEndpoint;\r\n    domain = config.domain;\r\n\r\n    //start the login phase\r\n    return new Promise(function (resolve, reject) {\r\n        // the user is loggedin, try to extract the Access Token and its expires\r\n        let isValid = urlParser(login, 'isValid') === 'true' ? true : false;\r\n\r\n        let consent = urlParser(login, 'consent') === 'true' ? true : false;\r\n\r\n        if (consent & isValid) {\r\n          let accessToken = consent;\r\n          let expires = 3153600000 + Math.floor(Date.now() / 1000);\r\n\r\n          resolve( accessTokenResult(client_id, accessToken, expires, login) );\r\n        } else {\r\n          reject( config.accessTokenErrorMsg(isValid, consent));\r\n        }\r\n\r\n\r\n    }, function (e) {\r\n\r\n      reject(e);\r\n    });\r\n  }\r\n\r\n};\r\n\n\n//# sourceURL=webpack:///./src/idpproxy/edp/IdpProxy.js?");

/***/ }),

/***/ "./src/idpproxy/edp/edpdistribuicao.pt.idp.js":
/*!****************************************************!*\
  !*** ./src/idpproxy/edp/edpdistribuicao.pt.idp.js ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _IdpProxy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IdpProxy.js */ \"./src/idpproxy/edp/IdpProxy.js\");\n/* harmony import */ var _EdpInfo_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EdpInfo.js */ \"./src/idpproxy/edp/EdpInfo.js\");\n/* harmony import */ var _AbstractIdpProxyStub_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../AbstractIdpProxyStub.js */ \"./src/idpproxy/AbstractIdpProxyStub.js\");\n\r\n\r\n\r\n\r\n/**\r\n* Google Identity Provider Proxy Protocol Stub\r\n*/\r\nclass EdpIdpProxyProtoStub extends _AbstractIdpProxyStub_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"] {\r\n\r\n  /**\r\n  * Constructor of the IdpProxy Stub\r\n  * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received\r\n  *\r\n  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n  * @param  {Message.Message}                           busPostMessage     configuration\r\n  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n  */\r\n  constructor() {\r\n    super();\r\n\r\n  }\r\n  _start(runtimeProtoStubURL, bus, config) {\r\n    config.domain = 'edpdistribuicao.pt';\r\n    config.idpUrl = 'domain-idp://edpdistribuicao.pt';\r\n    config.idpProxy = _IdpProxy_js__WEBPACK_IMPORTED_MODULE_0__[\"IdpProxy\"];\r\n    config.idpInfo = _EdpInfo_js__WEBPACK_IMPORTED_MODULE_1__[\"edpInfo\"];\r\n    config.apiInfo = _EdpInfo_js__WEBPACK_IMPORTED_MODULE_1__[\"edpInfo\"];\r\n    config.authEndpoint = _EdpInfo_js__WEBPACK_IMPORTED_MODULE_1__[\"authEndpoint\"];\r\n    config.accessTokenInput = _EdpInfo_js__WEBPACK_IMPORTED_MODULE_1__[\"accessTokenInput\"];\r\n    config.accessTokenEndpoint = _EdpInfo_js__WEBPACK_IMPORTED_MODULE_1__[\"authEndpoint\"];\r\n    config.accessTokenErrorMsg = _EdpInfo_js__WEBPACK_IMPORTED_MODULE_1__[\"accessTokenErrorMsg\"];\r\n    super._init(runtimeProtoStubURL, bus, config);\r\n  }\r\n\r\n/*  get name() {\r\n    return idpProxyDescriptor.name;\r\n  }*/\r\n}\r\n\r\n// export default IdpProxyProtoStub;\r\n\r\n/**\r\n * To activate this protocol stub, using the same method for all protostub.\r\n * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n * @param  {Message.Message}                           busPostMessage     configuration\r\n * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n * @return {Object} Object with name and instance of ProtoStub\r\n */\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (EdpIdpProxyProtoStub);\r\n/*\r\nexport default function activate(url, bus, config) {\r\n  return {\r\n    name: 'EdpIdpProxyProtoStub',\r\n    instance: new EdpIdpProxyProtoStub(url, bus, config)\r\n  };\r\n}*/\r\n\n\n//# sourceURL=webpack:///./src/idpproxy/edp/edpdistribuicao.pt.idp.js?");

/***/ })

/******/ })
			);
		}
	};
});