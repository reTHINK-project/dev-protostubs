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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hyperty/user-availability/UserAvailabilityObserver.hy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hyperty/user-availability/UserAvailabilityObserver.hy.js":
/*!**********************************************************************!*\
  !*** ./src/hyperty/user-availability/UserAvailabilityObserver.hy.js ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\nclass UserAvailabilityObserver {\r\n\r\n  constructor() {}\r\n    _start(hypertyURL, bus, configuration, factory) {\r\n    this.hypertyURL = hypertyURL;\r\n//    super(hypertyURL, bus, configuration, ['availability_context'], factory);\r\n    this._context = factory.createContextObserver(hypertyURL, bus, configuration,['availability_context']);\r\n  }\r\n\r\n  set name(name) {\r\n    this._name = name;\r\n  }\r\n  \r\n  get name() {\r\n    return this._name;\r\n  }\r\n  \r\n  get runtimeHypertyURL(){\r\n    return this.hypertyURL;\r\n  }\r\n\r\n\r\n  start() {\r\n    let resumedCallback = (availability) => {\r\n      console.log('[UserAvailabilityObserver.onDisconnected]: ', availability);\r\n\r\n      availability.data.values[0].value = 'unavailable';\r\n      // to avoid false disconnects\r\n      availability.sync();\r\n    };\r\n\r\n    let resumedInit = [{value: 'unavailable'}];\r\n\r\n    return this._context.start(resumedInit, resumedCallback);\r\n  }\r\n\r\nresumeDiscoveries() {\r\n  return this._context.resumeDiscoveries();\r\n\r\n}\r\n\r\n  onResumeObserver(callback) {\r\n    return this._context.onResumeObserver(callback);\r\n   }\r\n\r\n\r\n  discoverUsers(email,domain)\r\n  {\r\n    return this._context.discoverUsers(email,domain);\r\n\r\n  }\r\n\r\n  /**\r\n   * This function is used to start the user availability observation for a certain user availability reporter\r\n   * @param  {DiscoveredObject} hyperty       Hyperty to be observed.\r\n   * @return {<Promise> DataObjectObserver}      It returns as a Promise the UserAvailability Data Object Observer.\r\n   */\r\n\r\n  observe(hyperty)\r\n    {\r\n      return this._context.observe(hyperty);\r\n\r\n  }\r\n\r\n\r\n/**\r\n * This function is used to stop the user availability observation for a certain user\r\n * @param  {string} availability       the UserAvailability Data Object Observer URL to be unobserved.\r\n */\r\n\r\n  unobserve(availability)\r\n    {\r\n      return this._context.unobserve(availability);\r\n\r\n  }\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (UserAvailabilityObserver);\r\n\n\n//# sourceURL=webpack:///./src/hyperty/user-availability/UserAvailabilityObserver.hy.js?");

/***/ })

/******/ })
			);
		}
	};
});