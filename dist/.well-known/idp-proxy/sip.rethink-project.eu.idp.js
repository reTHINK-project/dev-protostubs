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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/idpproxy/sip.rethink-project.eu/sip.rethink-project.eu.idp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/idpproxy/sip.rethink-project.eu/sip.rethink-project.eu.idp.js":
/*!***************************************************************************!*\
  !*** ./src/idpproxy/sip.rethink-project.eu/sip.rethink-project.eu.idp.js ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet domain = 'rethink-project.eu'\r\n\r\n  \r\n/**\r\n * Identity Provider Proxy Protocol Stub\r\n */\r\nclass IMSIWProxyStub {\r\n\r\n\t/**\r\n\t * Constructor of the IdpProxy Stub\r\n\t * The constructor add a listener in the messageBus received and start a web worker with the received idpProxy\r\n\t *\r\n\t * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n\t * @param  {Message.Message}                           busPostMessage     configuration\r\n\t * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n\t */\r\n\tconstructor() {}\r\n\t_start(runtimeProtoStubURL, bus, config) {\r\n\t\t\tthis.runtimeProtoStubURL = runtimeProtoStubURL\r\n\t\tthis.messageBus = bus\r\n\t\tthis.config = config\r\n\r\n\t\tthis.messageBus.addListener('*', msg => {\r\n\t\t\t//TODO add the respective listener\r\n\t\t\tif (msg.to === `domain-idp://${domain}`) {\r\n\t\t\t\tthis.requestToIdp(msg)\r\n\t\t\t}\r\n\t\t})\r\n\r\n\t\tthis._sendStatus('created')\r\n\t}\r\n\r\n\t  \r\n\t_sendStatus(value, reason) {\r\n\t\tlet _this = this\r\n\r\n\t\tconsole.log('[Slack Idp Proxy status changed] to ', value)\r\n\r\n\t\t_this._state = value\r\n\r\n\t\tlet msg = {\r\n\t\t\ttype: 'update',\r\n\t\t\tfrom: _this.runtimeProtoStubURL,\r\n\t\t\tto: _this.runtimeProtoStubURL + '/status',\r\n\t\t\tbody: {\r\n\t\t\t\tvalue: value\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\tif (reason) {\r\n\t\t\tmsg.body.desc = reason\r\n\t\t}\r\n\r\n\t\t_this.messageBus.postMessage(msg)\r\n\t}\r\n\r\n\t/**\r\n\t * Function that see the intended method in the message received and call the respective function\r\n\t *\r\n\t * @param {message}  message received in the messageBus\r\n\t */\r\n\trequestToIdp(msg) {\r\n\t\tlet params = msg.body.params\r\n\r\n\t\tswitch (msg.body.method) {\r\n\t\tcase 'generateAssertion':\r\n\t\t\tthis.generateAssertion(params.contents, params.origin, params.usernameHint)\r\n\t\t\t\t.then(value => this.replyMessage(msg, value))\r\n\t\t\t\t.catch(error => this.replyMessage(msg, error))\r\n\t\t\tbreak\r\n\t\tcase 'validateAssertion':\r\n\t\t\tthis.replyMessage(msg, {identity: 'identity@idp.com', contents: 'content'})\r\n\t\t\tbreak\r\n\t\tdefault:\r\n\t\t\tbreak\r\n\t\t}\r\n\t}\r\n\r\n\tgenerateAssertion (contents, origin, hint)  {\r\n\r\n\t\tconsole.log('contents->', contents)\r\n\t\tconsole.log('origin->', origin)\r\n\t\tconsole.log('hint->', hint)\r\n\r\n\t\treturn new Promise((resolve, reject) => {\r\n\r\n\t\t\t//the hint field contains the information obtained after the user authentication\r\n\t\t\t// if the hint content is not present, then rejects the value with the URL to open the page to authenticate the user\r\n\t\t\tif (!hint) {\r\n\t\t\t\tlet requestUrl =`https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&state=%2Fprofile&redirect_uri=${location.protocol}//${location.hostname}&response_type=token&client_id=808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com`\r\n\t\t\t\tconsole.log('first url ', requestUrl, 'done')\r\n\t\t\t\treject({name: 'IdPLoginError', loginUrl: requestUrl})\r\n\t\t\t} else {\r\n\t\t\t\tlet accessToken = this._urlParser(hint, 'access_token')\r\n\t\t\t\tlet expires = Math.floor(Date.now() / 1000) + this._urlParser(hint, 'expires_in')\r\n\t\t\t\tfetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`)\r\n\t\t\t\t\t.then(res_user => res_user.json())\r\n\t\t\t\t\t.then(body => {\r\n\t\t\t\t\t\tlet infoToken = {picture: body.picture, email: body.email, family_name: body.family_name, given_name: body.given_name}\r\n\t\t\t\t\t\tlet assertion = btoa(JSON.stringify({tokenID: accessToken, email: body.email, id: body.id}))\r\n\t\t\t\t\t\tlet toResolve = {info: { expires: expires }, assertion: assertion, idp: {domain: domain, protocol: 'OAuth 2.0'}, infoToken: infoToken, interworking: {access_token: accessToken, domain: domain }}\r\n\t\t\t\t\t\tconsole.log('RESOLVING THIS OBJECT', toResolve)\r\n\t\t\t\t\t\tresolve(toResolve)\r\n\t\t\t\t\t}).catch(reject)\r\n\t\t\t}\r\n\t\t})\r\n\t}\r\n\r\n\t_urlParser(url, name) {\r\n\t\tname = name.replace(/[\\[]/, '\\\\\\[').replace(/[\\]]/, '\\\\\\]')\r\n\t\tlet regexS = '[\\\\#&?]' + name + '=([^&#]*)'\r\n\t\tlet regex = new RegExp(regexS)\r\n\t\tlet results = regex.exec(url)\r\n\t\tif (results === null)\r\n\t\t\treturn ''\r\n\t\telse\r\n\t\t\treturn results[1]\r\n\t}\r\n\r\n\t/**\r\n\t * This function receives a message and a value. It replies the value to the sender of the message received\r\n\t *\r\n\t * @param  {message}   message received\r\n\t * @param  {value}     value to include in the new message to send\r\n\t */\r\n\treplyMessage(msg, value) {\r\n\t\tlet message = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {code: 200, value: value}}\r\n\r\n\t\tthis.messageBus.postMessage(message)\r\n\t}\r\n}\r\n\r\n/**\r\n * To activate this protocol stub, using the same method for all protostub.\r\n * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL\r\n * @param  {Message.Message}                           busPostMessage     configuration\r\n * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration\r\n * @return {Object} Object with name and instance of ProtoStub\r\n */\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (IMSIWProxyStub);\r\n\r\n/*export default function activate(url, bus, config) {\r\n\treturn {\r\n\t\tname: 'IMSIWProxyStub',\r\n\t\tinstance: new IMSIWProxyStub(url, bus, config)\r\n\t}\r\n}*/\r\n\r\n\n\n//# sourceURL=webpack:///./src/idpproxy/sip.rethink-project.eu/sip.rethink-project.eu.idp.js?");

/***/ })

/******/ })
			);
		}
	};
});