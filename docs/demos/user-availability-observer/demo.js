/*
 * This is the Hello World App demo that uses the Hello World Reporter and Observer Hyperties
 *
 */

//import {getTemplate, serialize} from './utils';

let RUNTIME;
const hypertyURI = (hyperty_domain, hyperty) => `https://${hyperty_domain}/.well-known/hyperty/${hyperty}.hy.js`;
let runtime_domain = 'rethink.alticelabs.com';
let hyperty_domain = 'rethink.alticelabs.com';
let demoTemplate = 'https://'+hyperty_domain+'/examples/user-availability/userAvailabilityObserver';
let demoJs = 'https://'+hyperty_domain+'/examples/user-availability/UserAvailabilityObserverDemo.js';

let config = {
  domain: hyperty_domain
};

$(window).on( "load", function() {
  console.log('ready');

  loadRuntime();
});

/**
* Function to load the Runtime
*/

function loadRuntime() {
  var start = new Date().getTime();
  //Rethink runtime is included in index.html
  rethink.rethink.install(config).then((runtime) => {
    RUNTIME = runtime
    loadHyperty()
  }).catch((reason) => {
    console.error(reason);
  });
}

/**
* Function to load the Hyperty
*/

function loadHyperty()
{
  RUNTIME.requireHyperty(hypertyURI(hyperty_domain, 'UserAvailabilityObserver')).then((hyperty) => {
    console.log('[UserAvailabilityObserverDemo.loadHyperty', hyperty);

    getTemplate(demoTemplate, demoJs).then(function(template) {
      let html = template();
      $('.demo-content').html(html);

      templateAreReady('user-availability');

      if (typeof hypertyLoaded === 'function') {
        hypertyLoaded(hyperty);
      } else {
        let msg = 'If you need pass the hyperty to your template, create a function called hypertyLoaded';
        console.info(msg);
        notification(msg, 'warn');
      }

      loading = false;

    });
  });
}
