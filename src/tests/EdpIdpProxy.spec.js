import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import $ from 'jquery';


//import { generateGUID } from '../src/utils/utils';
//import IdpProxy from '../GoogleIdpProxyStub.idp';
import {login} from '../idpproxy/Login';
import EdpIdpProxyProtoStub from '../idpproxy/edp/EdpIdpProxyStub.idp';


chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

let assertion;
let idpProxyUrl = 'domain-idp://edpdistribuicao.pt';
let idmURL = 'runtime://test.com/123/idm';
let contents = 'BASE64_CONTENT';
let origin = 'localhost:8080';
let loginUrl;
let resources = ['fake-client-id'];
let accessToken;
let refreshToken;



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

let idpProxy = new EdpIdpProxyProtoStub(idpProxyUrl, bus, {});

describe('IdP Proxy test', function() {

  it('get AccessToken authorisation url', function (done) {
    bus.postMessage(getAccessTokenAuthorisationEndpointMessage, (reply) => {
      console.log('IdpProxyTest.reply with AccessToken auth url: ', reply.body.value)
      expect(reply.body.value).to.be.a('string');
      loginUrl = reply.body.value;
      done();
    });
  });

  it('get Access Token', function (done) {
    this.timeout(50000);

    // replace window.open to get reference to opened windows
    var windows = [];
    var winOpen = window.open;
    window.open = function () {
      var win = winOpen.apply(this, arguments);
      windows.push(win);
      return win;
    };

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

      /*
    // wait some time
    setTimeout(function () {
      if (windows.length > 0) {
        // access window
        var w = windows[0];
        // email
        const email = "openidtest10@gmail.com";
        const pass = "testOpenID10";
        // mail
        $("#identifierId", w.document.body).val(email);
        // next btn
        $("#identifierNext", w.document.body).click();
        setTimeout(function () {
          if (windows.length > 0) {
            // access window
            var w = windows[0];
            // email
            const email = "openidtest10@gmail.com";
            const pass = "testOpenID10";

            // password
            $("input[name='password']", w.document.body).val(pass);
            // submit login
            $("#passwordNext", w.document.body).click();
          }

        }, 2000);
      }

    }, 3000);
    */

  });

});
