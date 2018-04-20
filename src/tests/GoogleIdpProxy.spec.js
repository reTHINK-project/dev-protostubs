import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import $ from 'jquery';


//import { generateGUID } from '../src/utils/utils';
//import IdpProxy from '../GoogleIdpProxyStub.idp';
import {login} from '../idpproxy/Login';
import GoogleIdpProxyProtoStub from '../idpproxy/google/GoogleIdpProxyStub.idp';


chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

let assertion;
let idpProxyUrl = 'domain-idp://google.com';
let idmURL = 'runtime://test.com/123/idm';
let contents = 'BASE64_CONTENT';
let origin = 'localhost:8080';
let loginUrl;

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

let idpProxy = new GoogleIdpProxyProtoStub(idpProxyUrl, bus, {});

describe('IdP Proxy test', function() {

  it('get login url', function(done) {
    bus.postMessage( generateAssertionMessage, (reply)=> {
      console.log('IdpProxyTest.reply with login url: ', reply.body.value.loginUrl)
      expect(reply.body.value).to.have.keys('name', 'loginUrl');

      loginUrl = reply.body.value.loginUrl;
      done();

    })
  });


  it('generate Assertion', function(done) {
    this.timeout(10000);

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

      bus.postMessage( generateAssertionMessage, (reply)=> {
        expect(reply.body.value).to.have.keys('assertion', 'expires', 'idp', 'userProfile' );

        assertion = reply.body.value.assertion;

        done();

      })

    })

    // wait some time
    setTimeout(function(){
      if (windows.length > 0) {
        // access window
        var w = windows[0];
        // email
        const email = "openidtest10@gmail.com";
        const pass = "testOpenID10";
        // mail
        $("#identifierId", w.document.body).val( email );
        // next btn
        $("#identifierNext", w.document.body).click();
        setTimeout(function(){
          if (windows.length > 0) {
            // access window
            var w = windows[0];
            // email
            const email = "openidtest10@gmail.com";
            const pass = "testOpenID10";

            // password
            $( "input[name='password']",w.document.body ).val( pass );
            // submit login
            $( "#passwordNext", w.document.body ).click();
          }

        }, 2000);
      }

    }, 3000);

  });

  it('validate Assertion', function(done) {
    validateAssertionMessage.body.params.assertion = assertion;

    bus.postMessage( validateAssertionMessage, (reply)=> {
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

  it.('get Access Token', function (done) {
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
