import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import $ from 'jquery';


//import { generateGUID } from '../src/utils/utils';
//import IdpProxy from '../GoogleIdpProxyStub.idp';
import {login} from '../idpproxy/Login';
import SlackProxyStub from '../idpproxy/slack/SlackProxyStub.idp';


chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

let assertion;
let idpProxyUrl = 'domain-idp://slack.com';
let idmURL = 'runtime://test.com/123/idm';
let contents = 'BASE64_CONTENT';
let origin = 'localhost:8080';
let loginUrl;
let resources = ['resource'];
let schemes = ['test'];

let generateAssertionMessage = {
  type: 'execute',
  to: idpProxyUrl,
  from: idmURL,
  body: {
    resource: 'identity',
    method: 'generateAssertion',
    params: { contents: contents, origin: origin }
  }
}

let validateAssertionMessage = {
  type: 'execute',
  to: idpProxyUrl,
  from: idmURL,
  body: {
    resource: 'identity',
    method: 'validateAssertion',
    params: { origin: origin }
  }
}

let getAccessTokenAuthorisationEndpointMessage = {
  type: 'execute',
  to: idpProxyUrl,
  from: idmURL,
  body: {
    method: 'getAccessTokenAuthorisationEndpoint',
    params: { resources: resources }
  }
}

let getAccessTokenMessage = {
  type: 'execute',
  to: idpProxyUrl,
  from: idmURL,
  body: {
    method: 'getAccessToken',
    params: { resources: resources }
  }
}

let bus = {
  addListener: (url, callback) => {
    this._listener = callback;

  },

  postMessage: (msg, replyCallback) => {
    if (replyCallback) {
      this._replyCallback = replyCallback;
      this._listener(msg);
    } else if (this._replyCallback) this._replyCallback(msg);
  }
};

let idpProxy = new SlackProxyStub(idpProxyUrl, bus, {});

describe('Slack IdP Proxy test', function () {

  it('get IdAssertion login url', function (done) {
    bus.postMessage(generateAssertionMessage, (reply) => {
      console.log('IdpProxyTest.reply with login url: ', reply.body.value.loginUrl)
      expect(reply.body.value).to.have.keys('name', 'loginUrl');

      loginUrl = reply.body.value.loginUrl;
      done();

    })
  });


  it('generate Assertion', function (done) {
    this.timeout(15000);

    // replace window.open to get reference to opened windows
    var windows = [];
    var winOpen = window.open;
    window.open = function() {
      var win = winOpen.apply(this, arguments);
      windows.push(win);
      return win;
    };

    login(loginUrl)
      .then(result => {

        generateAssertionMessage.body.params.usernameHint = result;

        bus.postMessage(generateAssertionMessage, (reply) => {
          expect(reply.body.value).to.have.keys('assertion', 'idp', 'expires', 'userProfile');

          assertion = reply.body.value.assertion;

          done();

        })

      })


      // Slack domain
      setTimeout(function(){
        if (windows.length > 0) {
          // access window
          var w = windows[0];
          // email
          const slackChannel = "rethink-project";
          $("#domain", w.document.body).val( slackChannel );
          $("#submit_team_domain", w.document.body ).click();
        }
      }, 4000);

      // account login
      setTimeout(function(){
        if (windows.length > 0) {
          // access window
          var w = windows[0];

          const email = "rethink.eu.project@gmail.com";
          const pass = "rethink";
          $("#email", w.document.body).val( email );
          // password
          $( "#password", w.document.body ).val( pass );
          // submit login
          $( "#signin_btn", w.document.body ).click();
        }

      }, 7000);

      // authorize
      setTimeout(function(){
        if (windows.length > 0) {
          // access window
          var w = windows[0];
          $("#oauth_authorizify", w.document.body ).click();
        }
      }, 10000);

  });

  it('validate Assertion', function (done) {
    //      this.timeout(5000);
    validateAssertionMessage.body.params.assertion = assertion;

    bus.postMessage(validateAssertionMessage, (reply) => {
      expect(reply.body.value).to.have.keys('identity', 'contents');

      done();

    })

  });

  it('get AccessToken authorisation url', function (done) {
    bus.postMessage(getAccessTokenAuthorisationEndpointMessage, (reply) => {
      console.log('IdpProxyTest.reply with AccessToken auth url: ', reply.body.value)
      expect(reply.body.value).to.be.a('string');
      loginUrl = reply.body.value;
      done();
    });
  });

  it.skip('get Access Token', function (done) {
    this.timeout(10000);

    login(loginUrl)
      .then(result => {
        console.log('IdpProxyTest.getAccessToken login result : ', result);

        getAccessTokenMessage.body.params.login = result;

        bus.postMessage(getAccessTokenMessage, (reply) => {
          console.log('IdpProxyTest.reply with AccessToken : ', reply.body.value);
          expect(reply.body.value).to.have.keys('domain', 'resources', 'accessToken', 'expires', 'input');

          done();

        })

      })

  });

});
