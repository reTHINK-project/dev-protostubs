import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

//import { generateGUID } from '../src/utils/utils';
//import IdpProxy from '../GoogleIdpProxyStub.idp';
import {login} from '../../Login';
import FacebookIdpProxyProtoStub from '../FacebookIdpProxyStub.idp';


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

let idpProxy = new FacebookIdpProxyProtoStub(idpProxyUrl, bus, {});

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
    
      login(loginUrl)
        .then(result => {

          generateAssertionMessage.body.params.usernameHint = result;

          bus.postMessage( generateAssertionMessage, (reply)=> {
            expect(reply.body.value).to.have.keys('assertion', 'idp', 'expires', 'userProfile' );

            assertion = reply.body.value.assertion;
      
            done();
              
         })
              
        })

    });

    it('validate Assertion', function(done) {
//      this.timeout(5000);
      validateAssertionMessage.body.params.assertion = assertion;
      
      bus.postMessage( validateAssertionMessage, (reply)=> {
        expect(reply.body.value).to.have.keys('identity', 'contents');
  
        done();
          
     })

   });
  
});
