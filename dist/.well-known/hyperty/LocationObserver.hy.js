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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hyperty/location/LocationObserver.hy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hyperty/location/LocationObserver.hy.js":
/*!*****************************************************!*\
  !*** ./src/hyperty/location/LocationObserver.hy.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\nclass LocationObserverHyperty {\r\n\r\n    constructor() {}\r\n\r\n    set name(name) {\r\n      this._name = name;\r\n    }\r\n    \r\n    get name() {\r\n      return this._name;\r\n    }\r\n    \r\n  get runtimeHypertyURL(){\r\n    return this.hypertyURL;\r\n  }\r\n\r\n  _start(hypertyURL, bus, config, factory) {\r\n            //    this._domain = divideURL(hypertyURL).domain;\r\n    this.hypertyURL = hypertyURL;\r\n    this._context = factory.createContextObserver(hypertyURL, bus, config,['location-context']);\r\n\r\n    /*    let uri = new URI(hypertyURL);\r\n        this._users2observe = [];\r\n        this._observers = {};\r\n        this._objectDescURL = `hyperty-catalogue://catalogue.${uri.hostname()}/.well-known/dataschema/Context`;\r\n        this._syncher = new Syncher(hypertyURL, bus, config);\r\n        this._discovery = new Discovery(hypertyURL, config.runtimeURL, bus);*/\r\n\r\n\r\n  }\r\n\r\n  start(callback) {\r\n    console.log('[LocationObserver.start] ');\r\n    return this._context.start();\r\n  }\r\n\r\n  resumeDiscoveries() {\r\n    return this._context.resumeDiscoveries();\r\n  }\r\n\r\n  onResumeObserver(callback) {\r\n    return this._context.onResumeObserver(callback);\r\n  }\r\n\r\n  discoverUsers(email,domain) {\r\n    return this._context.discoverUsers(email, domain);\r\n  }\r\n\r\n  observe(hyperty) {\r\n    return this._context.observe(hyperty);\r\n  }\r\n\r\n  unobserve(Context)\r\n  {\r\n    return this._context.unobserve(Context);\r\n  }\r\n\r\n\r\n\r\n/*watchUsersPosition(callback) {\r\n    this.usersPosition = [];\r\n\r\n    this._discovery.discoverDataObjectsPerName('location')\r\n        .then((dataobjects) => {\r\n            const liveDOs = dataobjects.filter(d => d.status === 'live')\r\n            console.log('[LocationObserver] disocvered', liveDOs)\r\n            liveDOs.forEach(dataobject =>  {\r\n                this._syncher.subscribe(this._objectDescURL, dataobject.url).then(observer => {\r\n                    console.log('[LocationObserver] observing', observer)\r\n                    //observer.data.values[]\r\n                    //preferred_username\r\n                    let position = {\r\n                        preferred_username: observer.data.tag,\r\n                        coords:{\r\n                            latitude: observer.data.values.find(v=>v.name==='latitude').value,\r\n                            longitude: observer.data.values.find(v=>v.name==='longitude').value\r\n                        }\r\n                    }\r\n                    this.usersPosition.push(position)\r\n                    observer.onChange('*', (event)=>{\r\n\r\n                        if(event.field === 'values'){\r\n                            position.coords.latitude = event.data.find(v=>v.name==='latitude').value\r\n                            position.coords.longitude = event.data.find(v=>v.name==='longitude').value\r\n                            this.usersPosition.push(position);\r\n                        }\r\n                        if(callback)\r\n                            callback(this.usersPosition)\r\n                    })\r\n                    if(callback)\r\n                        callback(this.usersPosition)\r\n                })\r\n            })\r\n        }).catch((err)=>{\r\n            console.error('[LocationObserver]', err)\r\n        });\r\n}*/\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (LocationObserverHyperty);\r\n\n\n//# sourceURL=webpack:///./src/hyperty/location/LocationObserver.hy.js?");

/***/ })

/******/ })
			);
		}
	};
});