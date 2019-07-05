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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/protostub/vertx/default.ps.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/protostub/vertx/default.ps.js":
/*!*******************************************!*\
  !*** ./src/protostub/vertx/default.ps.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\r\n* Copyright 2016 PT Inovação e Sistemas SA\r\n* Copyright 2016 INESC-ID\r\n* Copyright 2016 QUOBIS NETWORKS SL\r\n* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\r\n* Copyright 2016 ORANGE SA\r\n* Copyright 2016 Deutsche Telekom AG\r\n* Copyright 2016 Apizee\r\n* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\r\n*\r\n* Licensed under the Apache License, Version 2.0 (the \"License\");\r\n* you may not use this file except in compliance with the License.\r\n* You may obtain a copy of the License at\r\n*\r\n*   http://www.apache.org/licenses/LICENSE-2.0\r\n*\r\n* Unless required by applicable law or agreed to in writing, software\r\n* distributed under the License is distributed on an \"AS IS\" BASIS,\r\n* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n* See the License for the specific language governing permissions and\r\n* limitations under the License.\r\n**/\r\n\r\n\r\n\r\nclass VertxProtoStub {\r\n  /* private\r\n    _continuousOpen: boolean\r\n\r\n    _runtimeProtoStubURL: string\r\n    _bus: MiniBus\r\n    _msgCallback: (Message) => void\r\n    _config: { url, runtimeURL }\r\n\r\n    _sock: (WebSocket | SockJS)\r\n    _reOpen: boolean\r\n  */\r\n\r\n  /**\r\n   * Vertx ProtoStub creation\r\n   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.\r\n   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.\r\n   * @param  {Object} config - Mandatory fields are: \"url\" of the MessageNode address and \"runtimeURL\".\r\n   * @return {VertxProtoStub}\r\n   */\r\n  constructor() {\r\n\r\n  }\r\n\r\n\r\n    _start(runtimeProtoStubURL, bus, config) {\r\n    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');\r\n    if (!bus) throw new Error('The bus is a needed parameter');\r\n    if (!config) throw new Error('The config is a needed parameter');\r\n\r\n    if (!config.url) throw new Error('The config.url is a needed parameter');\r\n    if (!config.runtimeURL) throw new Error('The config.runtimeURL is a needed parameter');\r\n\r\n    let _this = this;\r\n\r\n    this._id = 0;\r\n    this._continuousOpen = true;\r\n\r\n    this._runtimeProtoStubURL = runtimeProtoStubURL;\r\n    this._bus = bus;\r\n    this._config = config;\r\n\r\n    this._runtimeSessionURL = config.runtimeURL;\r\n    this._maxBuffer = config.maxBuffer;\r\n    this._reOpen = false;\r\n\r\n    bus.addListener('*', (msg) => {\r\n      console.log('[VertxProtoStub] outgoing message: ', msg);\r\n      _this._open(() => {\r\n        if (_this._filter(msg)) {\r\n//          msg.body.via = this._runtimeProtoStubURL;\r\n          msg.body.via = this._runtimeSessionURL;\r\n          console.log('[VertxProtoStub: ProtoStub -> MN]', msg);\r\n          _this._sendData( () => {\r\n            _this._sock.send(JSON.stringify(msg));\r\n          } );\r\n\r\n          console.log('[VertxProtoStub] sock.readyState ', _this._sock.readyState);\r\n          console.log('[VertxProtoStub] sock.bufferedAmount ', _this._sock.bufferedAmount);\r\n\r\n        }\r\n      });\r\n    });\r\n\r\n    _this._sendStatus('created');\r\n    _this._open(() => {});\r\n\r\n  }\r\n\r\n  /**\r\n   * Get the configuration for this ProtoStub\r\n   * @return {Object} - Mandatory fields are: \"url\" of the MessageNode address and \"runtimeURL\".\r\n   */\r\n  get config() { return this._config; }\r\n\r\n  get runtimeSession() { return this._runtimeSessionURL; }\r\n\r\n  /**\r\n   * Try to open the connection to the MessageNode. Connection is auto managed, there is no need to call this explicitly.\r\n   * However, if \"disconnect()\" is called, it's necessary to call this to enable connections again.\r\n   * A status message is sent to \"runtimeProtoStubURL/status\", containing the value \"connected\" if successful, or \"disconnected\" if some error occurs.\r\n   */\r\n  connect() {\r\n    let _this = this;\r\n\r\n    _this._continuousOpen = true;\r\n    _this._open(() => {});\r\n  }\r\n\r\n  /**\r\n   * It will disconnect and order to stay disconnected. Reconnection tries, will not be attempted, unless \"connect()\" is called.\r\n   * A status message is sent to \"runtimeProtoStubURL/status\" with value \"disconnected\".\r\n   */\r\n  disconnect() {\r\n    let _this = this;\r\n\r\n    _this._continuousOpen = false;\r\n    if (_this._sock) {\r\n      _this._sendClose();\r\n    }\r\n  }\r\n\r\n  //todo: add documentation\r\n  _sendOpen(callback) {\r\n    let _this = this;\r\n\r\n    this._sendStatus('in-progress');\r\n\r\n    _this._id++;\r\n    let msg = {\r\n      id: _this._id, type: 'open', from: _this._runtimeSessionURL, to: 'mn:/session'\r\n    };\r\n\r\n    if (_this._reOpen) {\r\n      msg.type = 're-open';\r\n    }\r\n\r\n    //register and wait for open reply...\r\n    let hasResponse = false;\r\n    _this._sessionCallback = function(reply) {\r\n      if (reply.type === 'response' & reply.id === msg.id) {\r\n        hasResponse = true;\r\n        if (reply.body.code === 200) {\r\n          if (reply.body.runtimeToken) {\r\n            //setup runtimeSession\r\n            _this._reOpen = true;\r\n            _this._runtimeSessionURL = _this._config.runtimeURL + '/' + reply.body.runtimeToken;\r\n          }\r\n\r\n          _this._sendStatus('live');\r\n          callback();\r\n        } else {\r\n          _this._sendStatus('failed', reply.body.desc);\r\n        }\r\n      }\r\n    };\r\n\r\n    _this._sock.send(JSON.stringify(msg));\r\n    setTimeout(() => {\r\n      if (!hasResponse) {\r\n        //no response after x seconds...\r\n        _this._sendStatus('disconnected', 'Timeout from mn:/session');\r\n      }\r\n    }, 3000);\r\n  }\r\n\r\n  _sendClose() {\r\n    let _this = this;\r\n\r\n    _this._id++;\r\n    let msg = {\r\n      id: _this._id, type: 'close', from: _this._runtimeSessionURL, to: 'mn:/session'\r\n    };\r\n\r\n    //invalidate runtimeSession\r\n    _this._reOpen = false;\r\n    _this._runtimeSessionURL = _this._config._runtimeURL;\r\n\r\n    _this._sock.send(JSON.stringify(msg));\r\n  }\r\n\r\n  _sendStatus(value, reason) {\r\n    let _this = this;\r\n\r\n    console.log('[VertxProtostub status changed] to ', value);\r\n\r\n    _this._state = value;\r\n\r\n    let msg = {\r\n      type: 'update',\r\n      from: _this._runtimeProtoStubURL,\r\n      to: _this._runtimeProtoStubURL + '/status',\r\n      body: {\r\n        value: value\r\n      }\r\n    };\r\n\r\n    if (reason) {\r\n      msg.body.desc = reason;\r\n    }\r\n\r\n    _this._bus.postMessage(msg);\r\n  }\r\n\r\n  _waitReady(callback) {\r\n    let _this = this;\r\n\r\n    if (_this._sock.readyState === 1) {\r\n      callback();\r\n    } else {\r\n      setTimeout(() => {\r\n        _this._waitReady(callback);\r\n      });\r\n    }\r\n  }\r\n\r\n  _sendData(callback) {\r\n    let _this = this;\r\n\r\n    if (_this._sock.bufferedAmount < _this._maxBuffer) {\r\n      callback();\r\n    } else {\r\n      setTimeout(() => {\r\n        console.warn('[VertxProtoStub._sendData] Buffer Overloaded ', _this._sock.bufferedAmount,' trying again ...');\r\n        _this._sendData(callback);\r\n      });\r\n    }\r\n  }\r\n\r\n  _filter(msg) {\r\n    if (!msg.body) {\r\n      msg.body = {};\r\n    }\r\n\r\n    console.log('[VertxProtoStub._filter] msg via: ', msg.body.via,' protostubUrl: ', this._runtimeSessionURL);\r\n\r\n    if (msg.body.via && msg.body.via === this._runtimeSessionURL) {\r\n      return false;\r\n    } else {\r\n      return true;\r\n    }\r\n\r\n  }\r\n\r\n  _deliver(msg) {\r\n    if (!msg.body) msg.body = {};\r\n\r\n    msg.body.via = this._runtimeSessionURL;\r\n    console.log('[VertxProtoStub._deliver]', msg);\r\n    this._bus.postMessage(msg);\r\n  }\r\n\r\n  // add documentation\r\n\r\n  _open(callback) {\r\n    let _this = this;\r\n\r\n    if (!this._continuousOpen) {\r\n      //TODO: send status (sent message error - disconnected)\r\n      return;\r\n    }\r\n\r\n    if (!_this._sock) {\r\n      if (_this._config.url.substring(0, 2) === 'ws') {\r\n        _this._sock = new WebSocket(_this._config.url);\r\n      } else {\r\n        _this._sock = new SockJS(_this._config.url);\r\n      }\r\n\r\n      _this._sock.onopen = function() {\r\n        _this._sendOpen(() => {\r\n          callback();\r\n        });\r\n      };\r\n\r\n      _this._sock.onmessage = function(e) {\r\n        let msg = JSON.parse(e.data);\r\n        console.log('[VertxProtoStub: MN -> SOCKET ON MESSAGE]', msg);\r\n        if (msg.from === 'mn:/session') {\r\n          if (_this._sessionCallback) {\r\n            _this._sessionCallback(msg);\r\n          }\r\n        } else {\r\n          if (_this._filter(msg)) {\r\n            _this._deliver(msg);\r\n          }\r\n        }\r\n      };\r\n\r\n      _this._sock.onclose = function(event) {\r\n        let reason;\r\n\r\n        //See https://tools.ietf.org/html/rfc6455#section-7.4\r\n        if (event.code === 1000) {\r\n          reason = 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';\r\n        } else if (event.code === 1001) {\r\n          reason = 'An endpoint is \\'going away\\', such as a server going down or a browser having navigated away from a page.';\r\n        } else if (event.code === 1002) {\r\n          reason = 'An endpoint is terminating the connection due to a protocol error';\r\n        } else if (event.code === 1003) {\r\n          reason = 'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';\r\n        } else if (event.code === 1004) {\r\n          reason = 'Reserved. The specific meaning might be defined in the future.';\r\n        } else if (event.code === 1005) {\r\n          reason = 'No status code was actually present.';\r\n        } else if (event.code === 1006) {\r\n          reason = 'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';\r\n        } else if (event.code === 1007) {\r\n          reason = 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).';\r\n        } else if (event.code === 1008) {\r\n          reason = 'An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';\r\n        } else if (event.code === 1009) {\r\n          reason = 'An endpoint is terminating the connection because it has received a message that is too big for it to process.';\r\n        } else if (event.code === 1010) {\r\n          reason = 'An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\\'t return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ' + event.reason;\r\n        } else if (event.code === 1011) {\r\n          reason = 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';\r\n        } else if (event.code === 1015) {\r\n          reason = 'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\\'t be verified).';\r\n        } else {\r\n          reason = 'Unknown reason';\r\n        }\r\n\r\n        delete _this._sock;\r\n        console.error('[VertxProtoStub.onClose] ', reason);\r\n\r\n        _this._sendStatus('disconnected', reason);\r\n        _this._reOpen = true;\r\n        _this._open(callback);\r\n\r\n      };\r\n    } else {\r\n      _this._waitReady(callback);\r\n    }\r\n  }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (VertxProtoStub);\r\n\r\n/*export default function activate(url, bus, config) {\r\n  return {\r\n    name: 'VertxProtoStub',\r\n    instance: new VertxProtoStub(url, bus, config)\r\n  };\r\n}*/\r\n\r\n/**\r\n* Callback used to send messages\r\n* @callback PostMessage\r\n* @param {Message} msg - Message to send\r\n*/\r\n\n\n//# sourceURL=webpack:///./src/protostub/vertx/default.ps.js?");

/***/ })

/******/ })
			);
		}
	};
});