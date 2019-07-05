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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/protostub/google/fitness.google.com.ps.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/protostub/fitness/FitnessProtoStub.js":
/*!***************************************************!*\
  !*** ./src/protostub/fitness/FitnessProtoStub.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return FitnessProtoStub; });\nclass FitnessProtoStub {\r\n\r\n    /**\r\n   * Fitness ProtoStub creation\r\n   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.\r\n   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.\r\n   * @param  {Object} config - Mandatory fields are: \"url\" of the MessageNode address and \"runtimeURL\".\r\n   * @return {FitnessProtoStub}\r\n   */\r\n  constructor() {}\r\n  _init(runtimeProtoStubURL, bus, config, factory, name) {\r\n        this._stubName = name;\r\n        if (!runtimeProtoStubURL)\r\n            throw new Error(\"The runtimeProtoStubURL is a needed parameter\");\r\n        if (!bus) throw new Error(\"The bus is a needed parameter\");\r\n        if (!config) throw new Error(\"The config is a needed parameter\");\r\n\r\n\r\n        if (!config.runtimeURL)\r\n            throw new Error(\"The config.runtimeURL is a needed parameter\");\r\n\r\n        let _this = this;\r\n        console.log(`[${this._stubName}] PROTOSTUB`, _this);\r\n        this._id = 0;\r\n\r\n        this._runtimeProtoStubURL = runtimeProtoStubURL;\r\n        this._bus = bus;\r\n        this._config = config;\r\n        this._domain = config.domain;\r\n\r\n        this._runtimeSessionURL = config.runtimeURL;\r\n        this._syncher = factory.createSyncher(runtimeProtoStubURL, bus, config);\r\n\r\n        this._userActivityVertxHypertyURL = \"hyperty://sharing-cities-dsm/user-activity\";\r\n\r\n        _this._sendStatus(\"created\");\r\n\r\n        _this.started = false;\r\n\r\n        const dataObjectName = \"user_activity\";\r\n\r\n        bus.addListener(\"*\", msg => {\r\n            console.log(`${_this._stubName} new Message  : `, msg);\r\n            if (msg.identity) {\r\n                _this._identity = msg.identity;\r\n            }\r\n\r\n            if (msg.type === 'delete') {\r\n                _this.stopWorking();\r\n                return;\r\n            }\r\n\r\n            if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('identity')) {\r\n                if (msg.body.identity.accessToken) {\r\n                    _this._accessToken = msg.body.identity.accessToken;\r\n                    // reply to hyperty\r\n                    let msgResponse = {\r\n                        id: msg.id,\r\n                        type: 'response',\r\n                        from: msg.to,\r\n                        to: msg.from,\r\n                        body: {\r\n                            code: 200,\r\n                            runtimeURL: _this._runtimeSessionURL\r\n                        }\r\n                    };\r\n                    console.log(_this);\r\n                    _this._bus.postMessage(msgResponse);\r\n                }\r\n                // get JS hyperty\r\n                _this.hypertyJSUrl = msg.from;\r\n            }\r\n\r\n\r\n\r\n            const objectSchema = \"hyperty-catalogue://catalogue.\" + _this._domain + \"/.well-known/dataschema/Context\";\r\n            const initialData = {\r\n                id: \"1276020076\",\r\n                values: [\r\n                    {\r\n                        type: \"user_walking_context\",\r\n                        name: \"walking distance in meters\",\r\n                        unit: \"meter\",\r\n                        value: 0,\r\n                        startTime: \"2018-03-25T12:00:00Z\",\r\n                        endTime: \"2018-03-25T12:10:00Z\"\r\n                    },\r\n                    {\r\n                        type: \"user_biking_context\",\r\n                        name: \"biking distance in meters\",\r\n                        unit: \"meter\",\r\n                        value: 0,\r\n                        startTime: \"2018-03-26T12:00:00Z\",\r\n                        endTime: \"2018-03-26T12:10:00Z\"\r\n                    }\r\n                ]\r\n            };\r\n\r\n            if (_this._accessToken && !_this.started && msg.type === 'create') {\r\n                _this._resumeReporters(dataObjectName, msg.to).then(function (reporter) {\r\n                    console.log(`[${_this._stubName}._resumeReporters (result)  `, reporter);\r\n                    if (reporter == false) {\r\n                        _this._setUpReporter(_this._identity, objectSchema, initialData, [\"context\"], dataObjectName, msg.to)\r\n                            .then(function (reporter) {\r\n                                if (reporter) {\r\n                                    _this.startWorking(reporter, false);\r\n                                }\r\n                            });\r\n                    } else {\r\n                        _this.startWorking(reporter, true);\r\n\r\n                    }\r\n                }).catch(function (error) {\r\n                });\r\n            }\r\n        });\r\n    }\r\n    get descriptor() {\r\n        return protostubDescriptor;\r\n      }\r\n    \r\n      get name(){\r\n        return protostubDescriptor.name;\r\n      }\r\n    \r\n    startWorking(reporter, resumedReporter) {\r\n        let _this = this;\r\n        _this.reporter = reporter;\r\n        _this.hasStartedQuerying = false;\r\n\r\n        function startQuerying() {\r\n            const startTime = reporter.metadata.created;\r\n            let lastModified = reporter.metadata.lastModified;\r\n            if (!lastModified) {\r\n                lastModified = startTime;\r\n            }\r\n            // query when starting\r\n            _this.querySessions(startTime, lastModified);\r\n            _this.startInterval = setInterval(function () {\r\n                lastModified = reporter.metadata.lastModified;\r\n                if (!lastModified) {\r\n                    lastModified = startTime;\r\n                }\r\n                _this.querySessions(startTime, lastModified);\r\n            }, _this.config.sessions_query_interval);\r\n            _this.started = true;\r\n        }\r\n\r\n        if (resumedReporter) {\r\n            _this.hasStartedQuerying = true;\r\n            startQuerying();\r\n        }\r\n\r\n        reporter.onSubscription(function (event) {\r\n            event.accept();\r\n            console.log(`${_this._stubName} new subs`, event);\r\n            if (!_this.hasStartedQuerying) {\r\n                _this.hasStartedQuerying = true;\r\n                startQuerying();\r\n            }\r\n        });\r\n\r\n        console.log(`${_this._stubName} User activity DO created: `, reporter);\r\n        reporter.inviteObservers([_this._userActivityVertxHypertyURL]);\r\n\r\n    }\r\n\r\n    stopWorking() {\r\n        clearInterval(this.startInterval);\r\n        this.started = false;\r\n    }\r\n\r\n    _setUpReporter(identity, objectDescURL, data, resources, name, reporterURL) {\r\n\r\n        let _this = this;\r\n        return new Promise(function (resolve, reject) {\r\n            let input = {\r\n                resources: resources,\r\n                expires: 3600,\r\n                reporter: reporterURL,\r\n                domain_registration: false,\r\n                domain_routing: false\r\n            };\r\n\r\n            _this._syncher\r\n                .create(objectDescURL, [], data, true, false, name, identity, input)\r\n                .then(reporter => {\r\n                    console.log(`${_this._stubName} REPORTER RETURNED`, reporter);\r\n\r\n                    resolve(reporter);\r\n                })\r\n                .catch(function (err) {\r\n                    console.error(`${_this._stubName} err`, err);\r\n                    resolve(null);\r\n                });\r\n        });\r\n    }\r\n\r\n    _resumeReporters(name, reporterURL) {\r\n        let _this = this;\r\n        return new Promise((resolve, reject) => {\r\n            _this._syncher.resumeReporters({ store: true, reporter: reporterURL }).then((reporters) => {\r\n                console.log(`[${_this._stubName} Reporters resumed`, reporters);\r\n                let reportersList = Object.keys(reporters);\r\n\r\n                if (reportersList.length > 0) {\r\n\r\n                    reportersList.forEach((dataObjectReporterURL) => {\r\n\r\n                        console.log(`[${_this._stubName}`, dataObjectReporterURL);\r\n                        console.log(`[${_this._stubName}`, reporters[dataObjectReporterURL]);\r\n\r\n                        if (reporterURL == reporters[dataObjectReporterURL].metadata.reporter && reporters[dataObjectReporterURL].metadata.name == name) {\r\n                            return resolve(reporters[dataObjectReporterURL]);\r\n                        }\r\n                    });\r\n\r\n                } else {\r\n                    return resolve(false);\r\n                }\r\n            }).catch((reason) => {\r\n                console.info(`[${_this._stubName} Reporters:`, reason);\r\n            });\r\n        });\r\n    }\r\n\r\n    querySessions(startTime, lastModified) {\r\n\r\n    }\r\n\r\n    writeToReporter(activityType, distance, startISO, endTime) {\r\n\r\n        let type, name;\r\n        if (activityType === 'bike') {\r\n            type = \"user_biking_context\";\r\n            name = \"biking distance in meters\";\r\n        }\r\n        else if (activityType === 'walk') {\r\n            type = \"user_walking_context\";\r\n            name = \"walking distance in meters\";\r\n        }\r\n\r\n        this.reporter.data.values = [\r\n            {\r\n                type: type,\r\n                name: name,\r\n                unit: \"meter\",\r\n                value: distance,\r\n                startTime: startISO,\r\n                endTime: endTime\r\n            }\r\n        ];\r\n\r\n\r\n    }\r\n\r\n    refreshAccessToken(startTime, lastModified, domain) {\r\n        let _this = this;\r\n        return new Promise((resolve, reject) => {\r\n\r\n            let msg = {\r\n                type: 'execute',\r\n                from: _this._runtimeProtoStubURL,\r\n                to: _this._runtimeSessionURL + '/idm',\r\n                body: {\r\n\r\n                    method: 'refreshAccessToken',\r\n\r\n                    params: {\r\n                        resources: ['user_activity_context'],\r\n                        domain: domain\r\n                    }\r\n                }\r\n            }\r\n\r\n            _this._bus.postMessage(msg, (reply) => {\r\n                console.log(`[${_this._stubName}.refreshAccessToken] reply `, reply);\r\n                if (reply.body.hasOwnProperty('value')) {\r\n                    _this._accessToken = reply.body.value;\r\n                    _this.querySessions(startTime, lastModified);\r\n                    resolve();\r\n                } else reject(reply.body);\r\n            });\r\n        });\r\n    }\r\n\r\n    /**\r\n    * Get the configuration for this ProtoStub\r\n    * @return {Object} - Mandatory fields are: \"url\" of the MessageNode address and \"runtimeURL\".\r\n    */\r\n    get config() {\r\n        return this._config;\r\n    }\r\n\r\n    get runtimeSession() {\r\n        return this._runtimeSessionURL;\r\n    }\r\n\r\n    _sendStatus(value, reason) {\r\n        let _this = this;\r\n        console.log(`[[${this._stubName}] status changed] to `, value);\r\n        _this._state = value;\r\n        let msg = {\r\n            type: \"update\",\r\n            from: _this._runtimeProtoStubURL,\r\n            to: _this._runtimeProtoStubURL + \"/status\",\r\n            body: {\r\n                value: value\r\n            }\r\n        };\r\n        if (reason) {\r\n            msg.body.desc = reason;\r\n        }\r\n        _this._bus.postMessage(msg);\r\n    }\r\n\r\n}\r\n\n\n//# sourceURL=webpack:///./src/protostub/fitness/FitnessProtoStub.js?");

/***/ }),

/***/ "./src/protostub/google/fitness.google.com.ps.js":
/*!*******************************************************!*\
  !*** ./src/protostub/google/fitness.google.com.ps.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return GoogleProtoStub; });\n/* harmony import */ var _fitness_FitnessProtoStub_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../fitness/FitnessProtoStub.js */ \"./src/protostub/fitness/FitnessProtoStub.js\");\n\r\n/**\r\n * Copyright 2016 PT Inovação e Sistemas SA\r\n * Copyright 2016 INESC-ID\r\n * Copyright 2016 QUOBIS NETWORKS SL\r\n * Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\r\n * Copyright 2016 ORANGE SA\r\n * Copyright 2016 Deutsche Telekom AG\r\n * Copyright 2016 Apizee\r\n * Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\r\n *\r\n * Licensed under the Apache License, Version 2.0 (the \"License\");\r\n * you may not use this file except in compliance with the License.\r\n * You may obtain a copy of the License at\r\n *\r\n *   http://www.apache.org/licenses/LICENSE-2.0\r\n *\r\n * Unless required by applicable law or agreed to in writing, software\r\n * distributed under the License is distributed on an \"AS IS\" BASIS,\r\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\r\n * See the License for the specific language governing permissions and\r\n * limitations under the License.\r\n **/\r\n//import { Syncher } from \"service-framework/dist/Syncher\";\r\n\r\n\r\n\r\n\r\nclass GoogleProtoStub extends _fitness_FitnessProtoStub_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\r\n\r\n\r\n  constructor() {\r\n    super();\r\n  }\r\n\r\n  _start(runtimeProtoStubURL, bus, config, factory) {\r\n    super._init(runtimeProtoStubURL, bus, config, factory, 'GoogleProtoStub');\r\n  }\r\n\r\n  querySessions(startTime, lastModified) {\r\n    let _this = this;\r\n    if (startTime !== lastModified) {\r\n      startTime = lastModified;\r\n    }\r\n    // current date\r\n    const endDate = new Date();\r\n    const endTime = endDate.toISOString();\r\n    const endTimeMillis = endDate.getTime();\r\n    const startTimeMillis = new Date(startTime).getTime();\r\n\r\n    // make request\r\n    var xhr = new XMLHttpRequest();\r\n    xhr.withCredentials = true;\r\n\r\n    _this.getDistanceForActivities(startTimeMillis, endTimeMillis).then(buckets => {\r\n      for (let i = 0; i < buckets.length; i += 1) {\r\n        const bucket = buckets[i];\r\n        const activityType = bucket.activity;\r\n        const distance = bucket.dataset[0].point[0].value[0].fpVal;\r\n        const startISO = new Date(startTimeMillis).toISOString();\r\n        switch (activityType) {\r\n          case 7:\r\n          case 8:\r\n            // walking/running\r\n            console.log(\"[GoogleProtoStub] walking/running distance (m): \", distance);\r\n            _this.writeToReporter('walk', distance, startISO, endTime);\r\n            break;\r\n          case 1:\r\n            // biking\r\n            console.log(\"[GoogleProtoStub] biking distance (m): \", distance);\r\n            _this.writeToReporter('bike', distance, startISO, endTime);\r\n            break;\r\n          default:\r\n            break;\r\n        }\r\n      }\r\n    }, (error) => {\r\n      if (error.hasOwnProperty('errorCode') && error.errorCode === 401)\r\n        return _this.refreshAccessToken(startTime, lastModified, 'google.com');\r\n      else throw error;\r\n\r\n    }).catch(onError => {\r\n      _this._sendStatus('disconnected', onError);\r\n      console.error(\"[GoogleProtoStub.querySessions] error: \", onError);\r\n\r\n    });\r\n  }\r\n\r\n  getDistanceForActivities(start, end) {\r\n    return new Promise((resolve, reject) => {\r\n\r\n      const bodyData = {\r\n        \"aggregateBy\": [{ \"dataTypeName\": \"com.google.distance.delta\" }],\r\n        \"bucketByActivityType\": { \"minDurationMillis\": 0 },\r\n        \"startTimeMillis\": start,\r\n        \"endTimeMillis\": end\r\n      };\r\n\r\n\r\n      // make request\r\n      var xhr = new XMLHttpRequest();\r\n      xhr.withCredentials = true;\r\n      xhr.addEventListener(\"readystatechange\", function () {\r\n        if (this.readyState === 4) {\r\n          const response = JSON.parse(this.responseText);\r\n          console.log(\"[GoogleProtoStub.getDistanceForActivities] response: \", response);\r\n          if (response.hasOwnProperty('bucket')) resolve(response.bucket);\r\n          else if (response.hasOwnProperty('code') && response.code > 299) reject({ errorCode: response.code });\r\n          else reject(response);\r\n\r\n        }\r\n      });\r\n      xhr.open(\"POST\", \"https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate\");\r\n      xhr.setRequestHeader(\"Content-Type\", \"application/json\");\r\n      xhr.setRequestHeader(\"Authorization\", \"Bearer \" + this._accessToken);\r\n      xhr.setRequestHeader(\"Cache-Control\", \"no-cache\");\r\n      xhr.send(JSON.stringify(bodyData));\r\n    });\r\n  }\r\n\r\n}\r\n\r\n/*export default function activate(url, bus, config, factory) {\r\n  return {\r\n    name: \"GoogleProtoStub\",\r\n    instance: new GoogleProtoStub(url, bus, config, factory)\r\n  };\r\n}*/\r\n\n\n//# sourceURL=webpack:///./src/protostub/google/fitness.google.com.ps.js?");

/***/ })

/******/ })
			);
		}
	};
});