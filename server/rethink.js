// jshint browser:true, jquery: true
// jshint varstmt: true

// All the environments
//import rethinkCore from '../resources/factories/rethink';
//import rethink from 'runtime-core/dist/rethink';

//import {rethink} from 'runtime-core/dist/rethink';

import {rethink as runtime} from 'runtime-core/dist/rethink';
//import rethinkBrowser from 'runtime-browser/bin/rethink';

import browserConfig from '../config.json';

import { hypertyDeployed, hypertyFail } from './main';
//import $ from 'jquery';
//jQuery.noConflict();


window.KJUR = {};

console.info('reTHINK config:', browserConfig);
//let rethink = browserConfig.ENVIRONMENT === 'core' || browserConfig.ENVIRONMENT === 'all' ? rethinkCore : rethinkBrowser;

let domain = browserConfig.DOMAIN;
let config = {
  development: browserConfig.DEVELOPMENT,
  runtimeURL: browserConfig.RUNTIME_URL,
  domain: browserConfig.DOMAIN,
  indexURL: browserConfig.INDEX_URL,
  sandboxURL: browserConfig.SANDBOX_URL
};

let runtimeLoader;
let loading = false;

if (!runtime) {
  hypertyFail('This environment is not ready to be used');
  throw new Error('This environment is not ready to be used');
}

runtime.install(config).then(function(result) {

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

 
      hypertyDeployed(hyperty, runtimeLoader);
      loading = false;
  
//    })
  }).catch((reason) => {
    hypertyFail(reason);
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
