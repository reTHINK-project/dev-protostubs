// jshint browser:true, jquery: true
// jshint varstmt: true

import {getTemplate, serialize} from './utils';

let loading = false;

export function hypertyDeployed(hyperty, runtimeLoader = null) {

  let $el = $('.main-content .notification');
  removeLoader($el);

  // Add some utils
  serialize();

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

  getTemplate(template, script).then(function(template) {
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

export function hypertyFail(reason) {
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
