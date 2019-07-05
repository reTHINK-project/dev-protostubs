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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hyperty/group-chat-manager/GroupChatManager.hy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hyperty/group-chat-manager/GroupChatManager.hy.js":
/*!***************************************************************!*\
  !*** ./src/hyperty/group-chat-manager/GroupChatManager.hy.js ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n/**\r\n* Copyright 2016 PT Inovação e Sistemas SA\r\n* Copyright 2016 INESC-ID\r\n* Copyright 2016 QUOBIS NETWORKS SL\r\n* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\r\n* Copyright 2016 ORANGE SA\r\n* Copyright 2016 Deutsche Telekom AG\r\n* Copyright 2016 Apizee\r\n* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\r\n*\r\n* Licensed under the Apache License, Version 2.0 (the \"License\");\r\n* you may not use this file except in compliance with the License.\r\n* You may obtain a copy of the License at\r\n*\r\n*   http://www.apache.org/licenses/LICENSE-2.0\r\n*\r\n* Unless required by applicable law or agreed to in writing, software\r\n* distributed under the License is distributed on an \"AS IS\" BASIS,\r\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n* See the License for the specific language governing permissions and\r\n* limitations under the License.\r\n**/\r\n\r\n// Service Framework\r\n//import IdentityManager from 'service-framework/dist/IdentityManager';\r\n//import {ChatManager,ChatController} from 'runtime-core/dist/ChatManager';\r\n//import { RegistrationStatus} from 'service-framework/dist/Discovery';\r\n//import {Syncher} from 'service-framework/dist/Syncher';\r\n\r\n// Utils\r\n/*import {divideURL} from '../utils/utils';\r\nimport Search from '../utils/Search';*/\r\n\r\n// Internals\r\n\r\n/**\r\n* Hyperty Group Chat Manager API (HypertyChat)\r\n* @author Vitor Silva [vitor-t-silva@telecom.pt]\r\n* @version 0.1.0\r\n*/\r\nclass GroupChatManager {\r\n\r\n  constructor() {}\r\n\r\n  set name(name) {\r\n    this._name = name;\r\n  }\r\n  \r\n  get name() {\r\n    return this._name;\r\n  }\r\n  \r\n  get runtimeHypertyURL(){\r\n    return this.hypertyURL;\r\n  }\r\n\r\n  _start(hypertyURL, bus, configuration, factory) {\r\n      //    super(hypertyURL, bus, configuration, factory);\r\n\r\n    let _this = this;\r\n    _this._factory = factory;\r\n    _this._syncher = factory.createSyncher(hypertyURL, bus, configuration);\r\n\r\n    _this._manager = factory.createChatManager(hypertyURL, bus, configuration, _this._syncher);\r\n    _this.discovery = _this._manager.discovery;\r\n    _this.identityManager = _this._manager.identityManager;\r\n    _this.search = _this._manager.search;\r\n    _this._domain = _this._manager._domain;\r\n    _this._myUrl = hypertyURL;\r\n    _this.hypertyURL = hypertyURL;\r\n    _this._runtimeURL = configuration.runtimeURL;\r\n    _this._bus = bus;\r\n    _this._backup = configuration.hasOwnProperty('backup') ? configuration.backup : false;\r\n    _this._heartbeat = configuration.hasOwnProperty('heartbeat') ? configuration.heartbeat : undefined;\r\n\r\n    _this._syncher.onNotification(function (event) {\r\n      console.log('[GroupChatManager] onNotification:', event);\r\n      _this.processNotification(event);\r\n    });\r\n\r\n    _this._resumeReporters();\r\n    _this._resumeObservers();\r\n\r\n\r\n\r\n  }\r\n\r\n\r\n  register(CRMaddress, code, identity) {\r\n    let _this = this;\r\n    debugger;\r\n    const msgIdentity = { userProfile: { guid: identity.guid, userURL: identity.userURL, info: { code: code } } };\r\n    let createMessage = {\r\n      type: 'forward', to: CRMaddress, from: _this.hypertyURL,\r\n      identity: msgIdentity,\r\n      body: {\r\n        type: 'create',\r\n        from: _this.hypertyURL,\r\n        identity: msgIdentity\r\n      }\r\n    };\r\n    _this._bus.postMessage(createMessage);\r\n  }\r\n\r\n  _getRegisteredUser() {\r\n    let _this = this;\r\n\r\n    return new Promise((resolve, reject) => {\r\n\r\n      if (_this._manager.currentIdentity) {\r\n        resolve(_this._manager.currentIdentity);\r\n      } else {\r\n        // create a new chatController but first get identity\r\n        _this._manager.identityManager.discoverUserRegistered().then((identity) => {\r\n          console.log('[GroupChatManager] GET MY IDENTITY:', identity);\r\n          resolve(identity);\r\n        }).catch((error) => {\r\n          console.error('[GroupChatManager] ERROR:', error);\r\n          reject(error);\r\n        });\r\n\r\n      }\r\n\r\n    });\r\n\r\n  }\r\n\r\n\r\n  _resumeReporters() {\r\n    let _this = this;\r\n\r\n    _this._syncher.resumeReporters({ store: true }).then((reporters) => {\r\n\r\n      let reportersList = Object.keys(reporters);\r\n\r\n      if (reportersList.length > 0) {\r\n\r\n        _this._getRegisteredUser().then((identity) => {\r\n\r\n          reportersList.forEach((dataObjectReporterURL) => {\r\n\r\n            console.log('[GroupChatManager.resumeReporter]: ', dataObjectReporterURL);\r\n\r\n            let chatController = _this._factory.createChatController(_this._syncher, _this.discovery, _this._domain, _this.search, identity, _this._manager);\r\n            chatController.dataObjectReporter = reporters[dataObjectReporterURL];\r\n\r\n            // Save the chat controllers by dataObjectReporterURL\r\n            this._manager._reportersControllers[dataObjectReporterURL] = chatController;\r\n\r\n            _this._resumeInterworking(chatController.dataObjectReporter);\r\n\r\n            console.log('[GroupChatManager] chatController invitationsHandler: ', chatController.invitationsHandler);\r\n\r\n//            chatController.dataObjectReporter.sync();\r\n\r\n            chatController.invitationsHandler.resumeDiscoveries(_this._manager.discovery, chatController.dataObjectReporter);\r\n\r\n          });\r\n\r\n          if (_this._onResumeReporter) _this._onResumeReporter(this._manager._reportersControllers);\r\n\r\n        });\r\n\r\n      }\r\n\r\n    }).catch((reason) => {\r\n      console.info('[GroupChatManager.resumeReporters] :', reason);\r\n    });\r\n\r\n  }\r\n\r\n  _resumeObservers() {\r\n    let _this = this;\r\n\r\n    _this._syncher.resumeObservers({ store: true }).then((observers) => {\r\n\r\n      console.log('[GroupChatManager] resuming observers : ', observers, _this, _this._onResume);\r\n\r\n      let observersList = Object.keys(observers);\r\n      if (observersList.length > 0) {\r\n\r\n        _this._getRegisteredUser().then((identity) => {\r\n\r\n          observersList.forEach((dataObjectObserverURL) => {\r\n\r\n            console.log('[GroupChatManager].syncher.resumeObserver: ', dataObjectObserverURL);\r\n\r\n            let chatObserver = observers[dataObjectObserverURL];\r\n\r\n            let chatController = _this._factory.createChatController(_this._syncher, _this._manager.discovery, _this._domain, _this.search, identity, _this._manager);\r\n            chatController.dataObjectObserver = chatObserver;\r\n\r\n            // Save the chat controllers by dataObjectReporterURL\r\n            this._manager._observersControllers[dataObjectObserverURL] = chatController;\r\n\r\n            let reporterStatus = _this._factory.createRegistrationStatus(chatObserver.url, _this._runtimeURL, _this._myUrl, _this._bus);\r\n\r\n            // recursive function to sync with chat reporter\r\n\r\n            let reporterSync = function (observer, subscriber, status) {\r\n              let statusOfReporter = status;\r\n              observer.sync().then((synched) => {\r\n\r\n                if (!synched) {\r\n\r\n                  statusOfReporter.onLive(subscriber, () => {\r\n                    statusOfReporter.unsubscribeLive(subscriber);\r\n                    reporterSync(observer, subscriber, statusOfReporter);\r\n                  });\r\n\r\n                  //TODO: subscribe to sync when reporter is live. New synched messages should trigger onMessage ie onChild\r\n                }\r\n              });\r\n            };\r\n\r\n            reporterSync(chatObserver, _this._myUrl, reporterStatus);\r\n\r\n          });\r\n\r\n          if (_this._onResumeObserver) _this._onResumeObserver(this._manager._observersControllers);\r\n\r\n        });\r\n\r\n      }\r\n\r\n    }).catch((reason) => {\r\n      console.info('[GroupChatManager] Resume Observer | ', reason);\r\n    });\r\n  }\r\n\r\n  /**\r\n   * This function is used to resume interworking Stubs for participants from legacy chat services\r\n   * @param  {Communication}              communication Communication data object\r\n   */\r\n\r\n  _resumeInterworking(communication) {\r\n\r\n    let _this = this;\r\n\r\n    if (communication.data.participants) {\r\n\r\n      let participants = communication.data.participants;\r\n      let objectUrl = communication.url;\r\n      let schemaUrl = communication.schema;\r\n\r\n      // let name = communication.name;\r\n\r\n      console.log('[GroupChatManager._resumeInterworking for] ', participants);\r\n\r\n      Object.keys(participants).forEach((participant) => {\r\n\r\n        let user = participants[participant].identity.userProfile.userURL.split('://');\r\n\r\n        if (user[0] !== 'user') {\r\n\r\n          console.log('[GroupChatManager._resumeInterworking for] ', participant);\r\n\r\n          user = user[0] + '://' + user[1].split('/')[1];\r\n\r\n          let msg = {\r\n            type: 'create', from: _this._myUrl, to: user,\r\n            body: { resource: objectUrl, schema: schemaUrl, value: communication.metadata }\r\n          };\r\n\r\n          _this._bus.postMessage(msg, () => {\r\n          });\r\n        }\r\n\r\n      });\r\n    }\r\n  }\r\n\r\n  /**\r\n   * This function is used to create a new Group Chat providing the name and the identifiers of users to be invited.\r\n   * @param  {string}                     name  Is a string to identify the Group Chat\r\n   * @param  {array<URL.userURL>}         users Array of users to be invited to join the Group Chat. Users are identified with reTHINK User URL, like this format user://<ipddomain>/<user-identifier>\r\n   * @return {<Promise>ChatController}    A ChatController object as a Promise.\r\n   */\r\n  create(name, users, extra = {}) {\r\n\r\n    extra.backup = this._backup;\r\n    extra.heartbeat = this._heartbeat;\r\n\r\n    console.log('[GroupChatManager.create] extra: ', extra);\r\n\r\n    return this._manager.create(name, users, extra);\r\n  }\r\n\r\n\r\n  /**\r\n   * This function is used to handle notifications about incoming invitations to join a Group Chat.\r\n   * @param  {Function} CreateEvent The CreateEvent fired by the Syncher when an invitaion is received\r\n   */\r\n  onInvitation(callback) {\r\n    return this._manager.onInvitation(callback);\r\n  }\r\n\r\n  onResumeReporter(callback) {\r\n    let _this = this;\r\n    _this._onResumeReporter = callback;\r\n  }\r\n\r\n  onResumeObserver(callback) {\r\n    let _this = this;\r\n    _this._onResumeObserver = callback;\r\n  }\r\n\r\n  /**\r\n   * This function is used to join a Group Chat.\r\n   * @param  {URL.CommunicationURL} invitationURL  The Communication URL of the Group Chat to join that is provided in the invitation event\r\n   * @return {<Promise>ChatController}             It returns the ChatController object as a Promise\r\n   */\r\n  join(invitationURL) {\r\n    return this._manager.join(invitationURL);\r\n\r\n\r\n  }\r\n  /**\r\n   * This function is used to retrieve my identity.\r\n   * @return {<Promise>Identity}             It returns the Identity object as a Promise\r\n   */\r\n  myIdentity(identity) {\r\n    console.log('[GroupChatManager.myIdentity] ', identity);\r\n    return this._manager.myIdentity(identity);\r\n\r\n\r\n  }\r\n  /**\r\n   * This function is used to process incoming messages.\r\n   */\r\n  processNotification(event) {\r\n    return this._manager.processNotification(event);\r\n\r\n\r\n  }\r\n\r\n  /**\r\n   * This function is used to process incoming messages.\r\n   */\r\n  onInvitation(callback) {\r\n    return this._manager.onInvitation(callback);\r\n\r\n\r\n  }\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (GroupChatManager);\r\n\n\n//# sourceURL=webpack:///./src/hyperty/group-chat-manager/GroupChatManager.hy.js?");

/***/ })

/******/ })
			);
		}
	};
});