import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import AbstractIdpProxyStub from '../idpproxy/AbstractIdpProxyStub';

chai.config.truncateThreshold = 0;

let expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

let assertion;
let idpProxyUrl = 'domain-idp://facebook.com';
let idmURL = 'runtime://test.com/123/idm';
let contents = 'BASE64_CONTENT';
let origin = 'undefined';
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

/*
bus.postMessage( generateAssertionMessage, (reply)=> {
  console.log('IdpProxyTest.reply with login url: ', reply.body.value.loginUrl)
  expect(reply.body.value).to.have.keys('name', 'loginUrl');

  loginUrl = reply.body.value.loginUrl;
  done();

})
 */

describe('IdP Proxy test', function() {

  it('send status message', function(done) {
    let idpProxy = new AbstractIdpProxyStub(idpProxyUrl, bus, {});
    done();
  });

  it('calls sendStatus', function(done) {
    // setup spy
    let sendStatusSpy = sinon.spy(AbstractIdpProxyStub.prototype, '_sendStatus');
    let idpProxy = new AbstractIdpProxyStub(idpProxyUrl, bus, {});
    expect(sendStatusSpy).to.have.been.calledOnce;
    // free spy
    sendStatusSpy.restore();
    done();
  });

  // describe('requestToIdp()', function() {
  //
  //   it('generates assertion', function(done) {
  //     let idpProxy = new AbstractIdpProxyStub(idpProxyUrl, bus, {});
  //     let requestToIdpSpy = sinon.spy(IdpProxy.prototype, 'requestToIdp');
  //
  //     // send message
  //     idpProxy.messageBus.postMessage( generateAssertionMessage);
  //
  //     // expect(requestToIdpSpy).to.have.been.calledOnce;
  //     requestToIdpSpy.restore();
  //     done();
  //   });
  // });


  // describe('message bus', function() {
  //
  //   it('calls requestToIdp', function(done) {
  //     let requestToIdpSpy = sinon.spy(AbstractIdpProxyStub.prototype, 'requestToIdp');
  //     let idpProxy = new AbstractIdpProxyStub(idpProxyUrl, bus, {});
  //
  //     // send message
  //     idpProxy.messageBus.postMessage( generateAssertionMessage);
  //
  //     // expect(requestToIdpSpy).to.have.been.calledOnce;
  //     requestToIdpSpy.restore();
  //     done();
  //   });
  // });



});
