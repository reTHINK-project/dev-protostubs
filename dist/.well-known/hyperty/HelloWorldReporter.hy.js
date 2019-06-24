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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hyperty/hello-world/HelloWorldReporter.hy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hyperty/hello-world/HelloWorldReporter.hy.js":
/*!**********************************************************!*\
  !*** ./src/hyperty/hello-world/HelloWorldReporter.hy.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _hello__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hello */ \"./src/hyperty/hello-world/hello.js\");\n/* jshint undef: true */\r\n\r\n//import {Syncher} from 'service-framework/dist/Syncher';\r\n//import {divideURL} from '../utils/utils';\r\n\r\n\r\n\r\n/**\r\n* Hyperty Connector;\r\n* @author Paulo Chainho [paulo-g-chainho@telecom.pt]\r\n* @version 0.1.0\r\n*/\r\nclass HelloWorldReporter {\r\n\r\n  /**\r\n  * Create a new HelloWorldReporter\r\n  * @param  {Syncher} syncher - Syncher provided from the runtime core\r\n  */\r\n\r\n  constructor() {\r\n\r\n }\r\n\r\n set name(name) {\r\n  this._name = name;\r\n}\r\n\r\nget name() {\r\n  return this._name;\r\n}\r\n\r\n\r\n\r\n  _start(hypertyURL, bus, configuration, factory) {\r\n\r\n    if (!hypertyURL) throw new Error('The hypertyURL is a needed parameter');\r\n    if (!bus) throw new Error('The MiniBus is a needed parameter');\r\n    if (!configuration) throw new Error('The configuration is a needed parameter');\r\n    if (!factory) throw new Error('The factory is a needed parameter');\r\n\r\n    let _this = this;\r\n\r\n    let domain = factory.divideURL(hypertyURL).domain;\r\n    _this._domain = domain;\r\n    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + domain + '/.well-known/dataschema/HelloWorldDataSchema';\r\n    _this._factory = factory;\r\n    _this._backup = configuration.hasOwnProperty('backup') ? configuration.backup : false;\r\n\r\n    console.log('HelloWorldReporter configuration', configuration);\r\n\r\n    let syncher = _this._factory.createSyncher(hypertyURL, bus, configuration);\r\n\r\n    _this._syncher = syncher;\r\n\r\n    _this._runtimeHypertyURL = hypertyURL;\r\n\r\n    /*_this._syncher.resumeReporters({}).then((resumeReporters) => {\r\n\r\n      if (!resumeReporters) return;\r\n\r\n      // lets now observe any changes done in Hello World Object\r\n      console.log('[hyperty syncher resume] - dataObject', resumeReporters);\r\n\r\n      Object.values(resumeReporters).forEach((helloObjtReporter) => {\r\n        _this.helloObjtReporter = helloObjtReporter;\r\n\r\n        this.prepareDataObjectReporter(helloObjtReporter);\r\n\r\n        helloObjtReporter.data.hello = 'REPORTER RESUMED';\r\n\r\n        console.log(this._onReporterResume);\r\n        if (this._onReporterResume) this._onReporterResume(helloObjtReporter);\r\n      })\r\n\r\n    });*/\r\n\r\n  }\r\n\r\n  get runtimeHypertyURL(){\r\n    return this._runtimeHypertyURL;\r\n  }\r\n\r\n  /**\r\n  * Create HelloWorld Data Object\r\n  * @param  {HypertyURL} HypertyURL - Invited\r\n  */\r\n\r\n  hello(hypertyURL) {\r\n    let _this = this;\r\n    let syncher = _this._syncher;\r\n\r\n    return new Promise(function(resolve, reject) {\r\n\r\n      let input = Object.assign({resources: ['hello']}, {});\r\n      input.backup = _this._backup;\r\n      input.reuseURL = true;\r\n      input.mutual = false;\r\n      input.domain_registration = false;\r\n\r\n      syncher.create(_this._objectDescURL, [hypertyURL], _hello__WEBPACK_IMPORTED_MODULE_0__[\"default\"], true, false, 'hello', {}, input).then(function(helloObjtReporter) {\r\n        console.info('1. Return Created Hello World Data Object Reporter', helloObjtReporter);\r\n\r\n        _this.helloObjtReporter = helloObjtReporter;\r\n\r\n        _this.prepareDataObjectReporter(helloObjtReporter);\r\n\r\n        resolve(helloObjtReporter);\r\n\r\n      })\r\n      .catch(function(reason) {\r\n        console.error(reason);\r\n        reject(reason);\r\n      });\r\n\r\n    });\r\n  }\r\n\r\n  prepareDataObjectReporter(helloObjtReporter) {\r\n\r\n    helloObjtReporter.onSubscription(function(event) {\r\n      console.info('-------- Hello World Reporter received subscription request --------- \\n');\r\n\r\n      // All subscription requested are accepted\r\n\r\n      event.accept();\r\n    });\r\n\r\n    helloObjtReporter.onRead((event) => {\r\n      event.accept();\r\n    });\r\n\r\n  }\r\n\r\n  /**\r\n  * Update HelloWorld Data Object\r\n  *\r\n  */\r\n\r\n  bye(byeMsg) {\r\n    let _this = this;\r\n\r\n    console.log('bye:', _this.helloObjtReporter );\r\n\r\n    if (byeMsg)\r\n      _this.helloObjtReporter.data.hello = byeMsg;\r\n    else {\r\n      _this.helloObjtReporter.data.hello = \"bye, bye\";\r\n      }\r\n  }\r\n\r\n  onReporterResume(callback) {\r\n    this._onReporterResume = callback;\r\n  }\r\n\r\n\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (HelloWorldReporter);\r\n\r\n\n\n//# sourceURL=webpack:///./src/hyperty/hello-world/HelloWorldReporter.hy.js?");

/***/ }),

/***/ "./src/hyperty/hello-world/hello.js":
/*!******************************************!*\
  !*** ./src/hyperty/hello-world/hello.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\r\n\r\nlet hello = {\r\n  name: \"hello\",\r\n  hello: \"Hello buddy!!\"\r\n};\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (hello);\r\n\n\n//# sourceURL=webpack:///./src/hyperty/hello-world/hello.js?");

/***/ })

/******/ })
			);
		}
	};
});