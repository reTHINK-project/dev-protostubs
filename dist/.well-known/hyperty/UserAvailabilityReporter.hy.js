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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hyperty/user-availability/UserAvailabilityReporter.hy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hyperty/user-availability/UserAvailabilityReporter.hy.js":
/*!**********************************************************************!*\
  !*** ./src/hyperty/user-availability/UserAvailabilityReporter.hy.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _availability_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./availability.js */ \"./src/hyperty/user-availability/availability.js\");\n/**\r\n* Copyright 2016 PT Inovação e Sistemas SA\r\n* Copyright 2016 INESC-ID\r\n* Copyright 2016 QUOBIS NETWORKS SL\r\n* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\r\n* Copyright 2016 ORANGE SA\r\n* Copyright 2016 Deutsche Telekom AG\r\n* Copyright 2016 Apizee\r\n* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\r\n*\r\n* Licensed under the Apache License, Version 2.0 (the \"License\");\r\n* you may not use this file except in compliance with the License.\r\n* You may obtain a copy of the License at\r\n*\r\n*   http://www.apache.org/licenses/LICENSE-2.0\r\n*\r\n* Unless required by applicable law or agreed to in writing, software\r\n* distributed under the License is distributed on an \"AS IS\" BASIS,\r\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n* See the License for the specific language governing permissions and\r\n* limitations under the License.\r\n**/\r\n\r\n// Service Framework\r\n//import {Discovery} from 'service-framework/dist/Discovery';\r\n//import IdentityManager from 'service-framework/dist/IdentityManager';\r\n//import {Syncher} from 'service-framework/dist/Syncher';\r\n//import {ContextReporter} from 'service-framework/dist/ContextManager';\r\n\r\n// Utils\r\n//import EventEmitter from '../utils/EventEmitter.js';\r\n//import {divideURL} from '../utils/utils.js';\r\n//import URI from 'urijs';\r\n\r\n\r\n\r\n/**\r\n* Hyperty User Availability;\r\n* @author Paulo Chainho  [paulo-g-chainho@alticelabs.com]\r\n* @version 0.1.0\r\n*/\r\nclass UserAvailabilityReporter {\r\n\r\n  constructor() {\r\n\r\n  }\r\n  set name(name) {\r\n    this._name = name;\r\n  }\r\n  \r\n  get name() {\r\n    return this._name;\r\n  }\r\n  \r\n  get runtimeHypertyURL(){\r\n    return this.hypertyURL;\r\n  }\r\n\r\n    _start(hypertyURL, bus, configuration, factory) {\r\n      this.hypertyURL = hypertyURL;\r\n\r\n    this._context = factory.createContextReporter(hypertyURL, bus, configuration);\r\n    let _this = this;\r\n\r\n    console.info('[UserAvailabilityReporter] started with url: ', hypertyURL);\r\n\r\n//    this.syncher = new Syncher(hypertyURL, bus, configuration);\r\n\r\n    //    this.discovery = new Discovery(hypertyURL, bus);\r\n    this.identityManager = factory.createIdentityManager(hypertyURL, configuration.runtimeURL, bus);\r\n/*    this.domain = divideURL(hypertyURL).domain;\r\n\r\n    this.userAvailabilityyDescURL = 'hyperty-catalogue://catalogue.' + this.domain + '/.well-known/dataschema/Context';\r\n*/\r\n\r\n//    this.heartbeat = [];\r\n\r\n    this.context.syncher.onNotification((event) => {\r\n      let _this = this;\r\n      _this.context.processNotification(event);\r\n    });\r\n\r\n\r\n/*    this.syncher.onClose((event) => {\r\n\r\n      console.log('[UserAvailabilityReporter.onClose]')\r\n      let _this = this;\r\n      _this.setStatus('unavailable');\r\n      event.ack();\r\n    });*/\r\n\r\n  }\r\n\r\nget context() {\r\n  return this._context;\r\n}\r\n\r\nstart(){\r\n  let _this = this;\r\n\r\n  return new Promise((resolve, reject) => {\r\n    console.log('[UserAvailabilityReporter.starting]' );\r\n\r\n    _this.context.syncher.resumeReporters({store: true}).then((reporters) => {\r\n\r\n      let reportersList = Object.keys(reporters);\r\n\r\n      if (reportersList.length  > 0) {\r\n\r\n      //TODO: filter from contexts instead of returning context[0]\r\n\r\n      _this.context.contexts['myAvailability'] = _this._filterResumedContexts(reporters);\r\n\r\n      console.log('[UserAvailabilityReporter.start] resuming ', _this.context.contexts['myAvailability']);\r\n      // set availability to available\r\n\r\n      _this.context._onSubscription(_this.context.contexts['myAvailability']);\r\n\r\n/*      _this.userAvailability = reporters[reportersList[0]];\r\n\r\n      _this._onSubscription(_this.userAvailability);*/\r\n\r\n      resolve(_this.context.contexts['myAvailability']);\r\n      } else {\r\n        console.log('[UserAvailabilityReporter.start] nothing to resume ', reporters);\r\n        let name = 'myAvailability';\r\n        resolve(_this.create(name, Object(_availability_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(), ['availability_context'], name));\r\n      }\r\n\r\n    }).catch((reason) => {\r\n      console.error('[UserAvailabilityReporter] Resume failed | ', reason);\r\n    });\r\n  }).catch((reason) => {\r\n  reject('[UserAvailabilityReporter] Start failed | ', reason);\r\n});\r\n}\r\n\r\n// return my resumed context\r\n\r\n_filterResumedContexts(reporters) {\r\n  let last = 0;\r\n\r\n  return Object.keys(reporters)\r\n    .filter(reporter => reporters[reporter].metadata.reporter === this.context.syncher._owner)\r\n    .reduce((obj, key) => {\r\n      if (Date.parse(reporters[key].metadata.lastModified) > last) obj = reporters[key];\r\n      return obj;\r\n    }, {});\r\n}\r\n\r\nonResumeReporter(callback) {\r\n   let _this = this;\r\n   _this.context._onResumeReporter = callback;\r\n }\r\n/*\r\n  onNotification(event) {\r\n    let _this = this;\r\n    console.info('userAvailability Event Received: ', event);\r\n    console.log('from hyperty', event.from);\r\n\r\n    event.ack();\r\n\r\n  }*/\r\n\r\n  /**\r\n   * This function is used to create a new status object syncher\r\n   * @param  {URL.UserURL} contacts List of Users\r\n   * @return {Promise}\r\n   */\r\n  create(id, init, resources, name = 'myContext') {\r\n    return this.context.create(id, init, resources, name);\r\n  }\r\n\r\n/*  _onSubscription(userAvailability){\r\n    userAvailability.onSubscription((event) => {\r\n      console.info('[UserAvailabilityReporterReporter._onSubscription] accepting: ', event);\r\n      event.accept();\r\n    });\r\n  }*/\r\n\r\n  setStatus(newStatus) {\r\n//    _this.contexts[id].data.values[0].value;\r\n    let newContext = [{value: newStatus}];\r\n    return this._context.setContext('myAvailability', newContext);\r\n  }\r\n\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (UserAvailabilityReporter);\r\n\n\n//# sourceURL=webpack:///./src/hyperty/user-availability/UserAvailabilityReporter.hy.js?");

/***/ }),

/***/ "./src/hyperty/user-availability/availability.js":
/*!*******************************************************!*\
  !*** ./src/hyperty/user-availability/availability.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = (function() {\r\n    return Object.assign({}, {\r\n        id: '_' + Math.random().toString(36).substr(2, 9),// do we need this?\r\n        values: [{\r\n            name: \"availability\",\r\n            type: \"availability_status\",\r\n            unit: \"pres\",\r\n            value: \"available\"\r\n        }]\r\n    });\r\n});;\r\n\n\n//# sourceURL=webpack:///./src/hyperty/user-availability/availability.js?");

/***/ })

/******/ })
			);
		}
	};
});