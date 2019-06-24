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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hyperty/hello-world/HelloWorldObserver.hy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hyperty/hello-world/HelloWorldObserver.hy.js":
/*!**********************************************************!*\
  !*** ./src/hyperty/hello-world/HelloWorldObserver.hy.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/EventEmitter */ \"./src/hyperty/utils/EventEmitter.js\");\n/* jshint undef: true */\r\n\r\n// import {Syncher} from 'service-framework/dist/Syncher';\r\n// import {divideURL} from '../utils/utils';\r\n\r\n//import helloWorldObserverDescriptor from './HelloWorldObserverDesc'\r\n\r\nconst hypertyDescriptor = {\r\n  \"name\": \"HelloWorldObserver\",\r\n  \"language\": \"javascript\",\r\n  \"signature\": \"\",\r\n  \"configuration\": {},\r\n  \"constraints\": {\r\n    \"browser\": true\r\n  },\r\n  \"hypertyType\": [\r\n    \"hello\"\r\n  ],\r\n  \"dataObjects\": [\r\n    \"https://%domain%/.well-known/dataschema/HelloWorldDataSchema\"\r\n  ]\r\n};\r\n\r\n/**\r\n* Hello World Observer\r\n* @author Paulo Chainho [paulo-g-chainho@telecom.pt]\r\n* @version 0.1.0\r\n*/\r\nclass HelloWorldObserver extends _utils_EventEmitter__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\r\n\r\n  /**\r\n  * Create a new HelloWorldObserver\r\n  * @param  {Syncher} syncher - Syncher provided from the runtime core\r\n  */\r\n constructor() {\r\n  super();\r\n\r\n }\r\n\r\n  _start(hypertyURL, bus, configuration, factory) {\r\n\r\n    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');\r\n    if (!bus) throw new Error('The MiniBus is a needed parameter');\r\n    if (!configuration) throw new Error('The configuration is a needed parameter');\r\n    if (!factory) throw new Error('The factory is a needed parameter');\r\n\r\n\r\n    let _this = this;\r\n    let domain = factory.divideURL(hypertyURL).domain;\r\n    _this._domain = domain;\r\n\r\n    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + domain + '/.well-known/dataschema/HelloWorldDataSchema';\r\n\r\n    let syncher = factory.createSyncher(hypertyURL, bus, configuration);\r\n    syncher.onNotification(function(event) {\r\n      _this._onNotification(event);\r\n    });\r\n\r\n    syncher.resumeObservers({}).then((resumedObservers) => {\r\n\r\n      if (!resumedObservers) return;\r\n      // lets now observe any changes done in Hello World Object\r\n      console.log('[hyperty syncher resume] - dataObject', resumedObservers);\r\n\r\n      Object.values(resumedObservers).forEach((helloObjtObserver) => {\r\n        _this._changes(helloObjtObserver);\r\n        helloObjtObserver.sync();\r\n      })\r\n\r\n    }).catch((reason) => {\r\n      console.log('[hyperty syncher resume] - ', reason);\r\n    });\r\n\r\n    _this._syncher = syncher;\r\n    _this._runtimeHypertyURL = hypertyURL;\r\n  }\r\n\r\n\r\n  get descriptor() {\r\n    return hypertyDescriptor;\r\n  }\r\n\r\n  get name(){\r\n    return hypertyDescriptor.name;\r\n  }\r\n\r\n  get runtimeHypertyURL(){\r\n    return this._runtimeHypertyURL;\r\n  }\r\n\r\n  _onNotification(event) {\r\n\r\n    let _this = this;\r\n\r\n    console.info('Event Received: ', event);\r\n\r\n    _this.trigger('invitation', event.identity);\r\n\r\n    // Acknowledge reporter about the Invitation was received\r\n    event.ack();\r\n\r\n    let input = {\r\n      schema: _this._objectDescURL,\r\n      resource: event.url,\r\n      store: true,\r\n      p2p: false,\r\n      mutual: false\r\n    };\r\n    // Subscribe Hello World Object\r\n    _this._syncher.subscribe(input).then(function(helloObjtObserver) {\r\n\r\n      // Hello World Object was subscribed\r\n      console.info(helloObjtObserver);\r\n\r\n      // lets now observe any changes done in Hello World Object\r\n      console.log('[hyperty syncher subscribe] - dataObject', helloObjtObserver);\r\n\r\n      _this._changes(helloObjtObserver);\r\n\r\n    }).catch(function(reason) {\r\n      console.error(reason);\r\n    });\r\n  }\r\n\r\n  _changes(dataObject) {\r\n\r\n    console.log('[hyperty syncher] - dataObject', dataObject);\r\n\r\n    // lets notify the App the subscription was accepted with the mnost updated version of Hello World Object\r\n    this.trigger('hello', dataObject.data);\r\n\r\n    dataObject.onChange('*', (event) => {\r\n\r\n      // Hello World Object was changed\r\n      console.info('message received:', event);\r\n\r\n      if (event.field === 'hello') {\r\n        // lets notify the App about the change\r\n        this.trigger('hello', dataObject.data);\r\n      }\r\n\r\n    });\r\n  }\r\n\r\n}\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (HelloWorldObserver);\r\n\r\n\n\n//# sourceURL=webpack:///./src/hyperty/hello-world/HelloWorldObserver.hy.js?");

/***/ }),

/***/ "./src/hyperty/utils/EventEmitter.js":
/*!*******************************************!*\
  !*** ./src/hyperty/utils/EventEmitter.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\r\n * Copyright 2016 PT Inovação e Sistemas SA\r\n * Copyright 2016 INESC-ID\r\n * Copyright 2016 QUOBIS NETWORKS SL\r\n * Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\r\n * Copyright 2016 ORANGE SA\r\n * Copyright 2016 Deutsche Telekom AG\r\n * Copyright 2016 Apizee\r\n * Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\r\n *\r\n * Licensed under the Apache License, Version 2.0 (the \"License\");\r\n * you may not use this file except in compliance with the License.\r\n * You may obtain a copy of the License at\r\n *\r\n *   http://www.apache.org/licenses/LICENSE-2.0\r\n *\r\n * Unless required by applicable law or agreed to in writing, software\r\n * distributed under the License is distributed on an \"AS IS\" BASIS,\r\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n * See the License for the specific language governing permissions and\r\n * limitations under the License.\r\n **/\r\n\r\n/**\r\n * EventEmitter\r\n * All classes which extends this, can have addEventListener and trigger events;\r\n */\r\nclass EventEmitter {\r\n\r\n    /**\r\n     * Initializes the EventEmitter\r\n     */\r\n    constructor() {\r\n        // set up listener holder\r\n        this.__eventListeners = {};\r\n    }\r\n\r\n    /**\r\n     * addEventListener listen for an eventType\r\n     * @param  {string}         eventType - listening for this type of event\r\n     * @param  {Function}       cb        - callback function will be executed when the event it is invoked\r\n     */\r\n    addEventListener(eventType, cb) {\r\n        // add callback to the list of callbacks for this type\r\n        // if the list doesn't exist yet, create it with the callback as member\r\n        if (cb != undefined) {\r\n            if (!this.__eventListeners[eventType])\r\n                this.__eventListeners[eventType] = [cb];\r\n            else\r\n                this.__eventListeners[eventType].push(cb);\r\n        }\r\n    }\r\n\r\n    /**\r\n     * Invoke the eventType\r\n     * @param  {string} eventType - event will be invoked\r\n     * @param  {object} params - parameters will be passed to the addEventListener\r\n     */\r\n    trigger(eventType, params) {\r\n        // check if there are callbacks for this type\r\n        let callbacks = this.__eventListeners[eventType];\r\n        if (callbacks) {\r\n            callbacks.forEach((cb) => {\r\n                // catch errors to make sure every callback is being called\r\n                try {\r\n                    cb(params);\r\n                } catch (e) {\r\n                    console.warn(\"calling listener \" + cb.name + \" for event type \" + eventType + \" with parameters '\" + params + \"' resulted in an error!\", e);\r\n                }\r\n            });\r\n        }\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (EventEmitter);\r\n\n\n//# sourceURL=webpack:///./src/hyperty/utils/EventEmitter.js?");

/***/ })

/******/ })
			);
		}
	};
});