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
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/rethink.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config.json":
/*!*********************!*\
  !*** ./config.json ***!
  \*********************/
/*! exports provided: DEVELOPMENT, RUNTIME_URL, DOMAIN, ENVIRONMENT, INDEX_URL, SANDBOX_URL, HYPERTY_REPO, PROTOSTUB_REPO, default */
/***/ (function(module) {

module.exports = {"DEVELOPMENT":"true","RUNTIME_URL":"hyperty-catalogue://catalogue.localhost/.well-known/runtime/Runtime","DOMAIN":"localhost","ENVIRONMENT":"core","INDEX_URL":"https://localhost/.well-known/runtime/index.html","SANDBOX_URL":"https://localhost/.well-known/runtime/sandbox.html","HYPERTY_REPO":"../dev-hyperty","PROTOSTUB_REPO":"../dev-protostubs-fake"};

/***/ }),

/***/ "./node_modules/runtime-core/dist/rethink.js":
/*!***************************************************!*\
  !*** ./node_modules/runtime-core/dist/rethink.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// version: 0.17.0
// date: Mon Jun 24 2019 16:00:45 GMT+0100 (GMT+01:00)
// licence: 
/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/


// version: 0.17.0
// date: Mon Jun 24 2019 16:00:45 GMT+0100 (GMT+01:00)
// licence: 
/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/



/***/ }),

/***/ "./server/main.js":
/*!************************!*\
  !*** ./server/main.js ***!
  \************************/
/*! exports provided: hypertyDeployed, hypertyFail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hypertyDeployed", function() { return hypertyDeployed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hypertyFail", function() { return hypertyFail; });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./server/utils.js");
// jshint browser:true, jquery: true
// jshint varstmt: true



let loading = false;

function hypertyDeployed(hyperty, runtimeLoader = null) {

  let $el = $('.main-content .notification');
  removeLoader($el);

  // Add some utils
  Object(_utils__WEBPACK_IMPORTED_MODULE_0__["serialize"])();

  let $mainContent = $('.main-content').find('.row');

  let template = '';
  let script = '';

  switch (hyperty.name) {

    case 'UserAvailabilityObserver':
      template = 'examples/user-availability/userAvailabilityObserver';
      script = 'examples/user-availability/UserAvailabilityObserverDemo.js';
      break;

      case 'DeviceManager':
        template = 'examples/device-manager/DeviceManager';
        script = 'examples/device-manager/DeviceManagerDemo.js';
        break;

    case 'Wallet':
      template = 'examples/wallet/Wallet';
      script = 'examples/wallet/wallet.js';
      break;

    case 'UserActivityObserver':
      template = 'examples/user-activity/UserActivityObserver';
      script = 'examples/user-activity/UserActivityObserver.js';
      break;

    case 'UserKwhObserver':
      template = 'examples/observer-kwh/UserKwhObserver';
      script = 'examples/observer-kwh/UserKwhObserver.js';
      break;

    case 'UserAvailabilityReporter':
      template = 'examples/user-availability/userAvailabilityReporter';
      script = 'examples/user-availability/UserAvailabilityReporterDemo.js';
      break;
    case 'ElearningPlayer':
      template = 'examples/learning/learningPlayer';
      script = 'examples/learning/learningPlayerDemo.js';
      break;

    case 'Connector':
      template = 'examples/connector/Connector';
      script = 'examples/connector/demo.js';
      break;

    case 'GroupChatManager':
      template = 'examples/group-chat-manager/ChatManager';
      script = 'examples/group-chat-manager/demo.js';
      break;

    case 'HelloWorldObserver':
      template = 'examples/hello-world/helloWorld';
      script = 'examples/hello-world/helloObserver.js';
      break;

    case 'HelloWorldReporter':
      template = 'examples/hello-world/helloWorld';
      script = 'examples/hello-world/helloReporter.js';
      break;

    case 'NodeHypertyObserver':
      template = 'examples/node-hyperty/NodeHyperty';
      script = 'examples/node-hyperty/NodeHypertyObserver.js';
      break;

    case 'LocationReporter':
      template = 'examples/location/location';
      script = 'examples/location/location.js';
      break;

    case 'LocationObserver':
      template = 'examples/location/locationObserver';
      script = 'examples/location/locationObserver.js';
      break;

    case 'BraceletSensorObserver':
      template = 'examples/bracelet/bracelet';
      script = 'examples/bracelet/BraceletSensorObserver.js';
      break;

    case 'DTWebRTC':
      template = 'examples/dtwebrtc/dtwebrtc';
      script = 'examples/dtwebrtc/dtwebrtc.js';
      break;
    case 'SimpleChat':
      template = 'examples/simple-chat/SimpleChat';
      script = 'examples/simple-chat/demo.js';
      break;
  }

  if (!template) {
    throw Error('You must need specify the template for your example');
  }

  Object(_utils__WEBPACK_IMPORTED_MODULE_0__["getTemplate"])(template, script).then(function(template) {
    let html = template();
    $mainContent.html(html);

    if (typeof hypertyLoaded === 'function') {
      hypertyLoaded(hyperty, runtimeLoader);
    } else {
      let msg = 'If you need pass the hyperty to your template, create a function called hypertyLoaded';
      console.info(msg);
      notification(msg, 'warn');
    }

    loading = false;
  }).catch(function(reason) {

    try {
      eval(reason.responseText);
    } catch (e) {
      console.error(e);
    }

  });

}

function hypertyFail(reason) {
  console.error(reason);
  notification(reason, 'error');
}

function removeLoader(el) {
  el.find('.preloader').remove();
  el.removeClass('center');
}

function notification(msg, type) {

  let $el = $('.main-content .notification');
  let color = type === 'error' ? 'red' : 'black';

  removeLoader($el);
  $el.append('<span class="' + color + '-text">' + msg + '</span>');
}


/***/ }),

/***/ "./server/rethink.js":
/*!***************************!*\
  !*** ./server/rethink.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var runtime_core_dist_rethink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! runtime-core/dist/rethink */ "./node_modules/runtime-core/dist/rethink.js");
/* harmony import */ var runtime_core_dist_rethink__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(runtime_core_dist_rethink__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.json */ "./config.json");
var _config_json__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ../config.json */ "./config.json", 1);
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./main */ "./server/main.js");
// jshint browser:true, jquery: true
// jshint varstmt: true

// All the environments
//import rethinkCore from '../resources/factories/rethink';
//import rethink from 'runtime-core/dist/rethink';

//import {rethink} from 'runtime-core/dist/rethink';


//import rethinkBrowser from 'runtime-browser/bin/rethink';




//import $ from 'jquery';
//jQuery.noConflict();
let config = JSON.parse(document.getElementById('config').innerHTML);


window.KJUR = {};

console.info('reTHINK domain:', config);

let domain = config.domain;

let runtimeLoader;
let loading = false;

if (!runtime_core_dist_rethink__WEBPACK_IMPORTED_MODULE_0__["rethink"]) {
  Object(_main__WEBPACK_IMPORTED_MODULE_2__["hypertyFail"])('This environment is not ready to be used');
  throw new Error('This environment is not ready to be used');
}

runtime_core_dist_rethink__WEBPACK_IMPORTED_MODULE_0__["rethink"].install(config).then(function(result) {

  console.log('after rethink install', result);
  runtimeLoader = result;

  return getListOfHyperties(domain);


}).then(function(hyperties) {

  let $dropDown = $('#hyperties-dropdown');

  hyperties.forEach(function(key) {
    let $item = $(document.createElement('li'));
    let $link = $(document.createElement('a'));

    // create the link features
    $link.html(key);
    $link.css('text-transform', 'none');
    $link.attr('data-name', key);
    $link.on('click', loadHyperty);

    $item.append($link);

    $dropDown.append($item);
  });

  $('.preloader-wrapper').remove();
  $('.card .card-action').removeClass('center');
  $('.hyperties-list-holder').removeClass('hide');

}).catch(function(reason) {
  console.error(reason);
});

function getListOfHyperties(domain) {

  let hypertiesURL = 'https://' + domain + '/.well-known/hyperty/all.json';

  return new Promise(function(resolve, reject) {
    fetch(hypertiesURL).then(function(result) {
/*    $.ajax({
      url: hypertiesURL,
      success: function(result) {*/



        result.json().then(function (hyperties) {
          console.log('[toolkit.getListofHyperties] result', hyperties);
          /*          let response = [];
        if (typeof hyperties === 'object') {
          hyperties.forEach(function(key) {
            response.push(key);
          });
        } else if (typeof hyperties === 'string') {
          response = JSON.parse(hyperties);
        }*/

        hyperties["hyperties"].sort();
        resolve(hyperties["hyperties"]);

        })
      },function(reason) {
//      fail: function(reason) {
        reject(reason);
//        notification(reason, 'warn');
      });
  });
}

function loadHyperty(event) {
  event.preventDefault();

  if (loading) return;
  loading = true;

  let hypertyName = $(event.currentTarget).attr('data-name');
  console.log('Hyperty Name:', hypertyName);

  let hypertyUrl = 'https://' + domain + '/.well-known/hyperty/' + hypertyName + '.hy.js';

  let $el = $('.main-content .notification');
  $el.empty();
  addLoader($el);

//  import( '../../dev-hyperty/dist/' + hypertyName +'.hy')
//  import( '../resources/hyperties/' + hypertyName +'.hy')
//  .then((hypertyModule) => {

    runtimeLoader.requireHyperty(hypertyUrl, true).then((hyperty)=>{
      console.log('Hyperty imported:', hyperty);

 
      Object(_main__WEBPACK_IMPORTED_MODULE_2__["hypertyDeployed"])(hyperty, runtimeLoader);
      loading = false;
  
//    })
  }).catch((reason) => {
    Object(_main__WEBPACK_IMPORTED_MODULE_2__["hypertyFail"])(reason);
    loading = false;
  });

}

function addLoader(el) {

  let html = '<div class="preloader preloader-wrapper small active">' +
      '<div class="spinner-layer spinner-blue-only">' +
      '<div class="circle-clipper left">' +
      '<div class="circle"></div></div><div class="gap-patch"><div class="circle"></div>' +
      '</div><div class="circle-clipper right">' +
      '<div class="circle"></div></div></div></div>';

  el.addClass('center');
  el.append(html);
}

function removeLoader(el) {
  el.find('.preloader').remove();
  el.removeClass('center');
}

function notification(msg, type) {

  let $el = $('.main-content .notification');
  let color = type === 'error' ? 'red' : 'black';

  removeLoader($el);
  $el.append('<span class="' + color + '-text">' + msg + '</span>');
}


/***/ }),

/***/ "./server/utils.js":
/*!*************************!*\
  !*** ./server/utils.js ***!
  \*************************/
/*! exports provided: serialize, getTemplate */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "serialize", function() { return serialize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTemplate", function() { return getTemplate; });
// jshint browser:true, jquery: true
// jshint varstmt: true
/* global Handlebars */

function serialize() {

  $.fn.serializeObject = function() {
    let o = {};
    let a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }

        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });

    return o;
  };

  $.fn.serializeObjectArray = function() {
    let o = {};
    let a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }

        o[this.name].push(this.value || '');
      } else {
        if (!o[this.name]) o[this.name] = [];
        o[this.name].push(this.value || '');
      }
    });

    return o;
  };

}

function getTemplate(path, script) {

  return new Promise(function(resolve, reject) {

    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
      Handlebars.templates = {};
    } else {
      resolve(Handlebars.templates[name]);
    }

    let templateFile = $.ajax({
      url: path + '.hbs',
      success: function(data) {
        Handlebars.templates[name] = Handlebars.compile(data);
      },

      fail: function(reason) {
        return reason;
      }
    });

    let scriptFile = $.getScript(script);

    let requests = [];
    if (path) requests.push(templateFile);
    if (script) requests.push(scriptFile);

    Promise.all(requests).then(function(result) {
      resolve(Handlebars.templates[name]);
    }).catch(function(reason) {
      reject(reason);
    });

  });
}


/***/ })

/******/ });