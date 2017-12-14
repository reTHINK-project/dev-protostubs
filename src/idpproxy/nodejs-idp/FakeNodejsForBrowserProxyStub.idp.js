let identities = {};
let nIdentity = 0;
//import fetch from 'node-fetch';
//let fetch = require("node-fetch");
//const https = require('https');
//let btoa = require('btoa');
//let atob = require('atob');

let googleInfo = {
  clientSecret:          'Xx4rKucb5ZYTaXlcZX9HLfZW',
  clientID:              '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
  redirectURI:           'https://localhost',
  issuer:                'https://accounts.google.com',
  tokenEndpoint:         'https://www.googleapis.com/oauth2/v4/token?',
  jwksUri:               'https://www.googleapis.com/oauth2/v3/certs?',
  authorisationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth?',
  userinfo:              'https://www.googleapis.com/oauth2/v3/userinfo?access_token=',
  tokenInfo:             'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=',
  accessType:            'offline',
  type:                  'code',
  scope:                 'openid%20email%20profile',
  state:                 'state'
};


let idp = {

  /**
  * Function to validate an identity Assertion received
  * TODO add details of the implementation, and improve the implementation
  *
  * @param  {assertion}    Identity Assertion to be validated
  * @param  {origin}       Origin parameter that identifies the origin of the RTCPeerConnection
  * @return {Promise}      Returns a promise with the identity assertion validation result
  */
  validateAssertion: (assertion, origin) => {
    console.log('validateAssertionProxyNODEJSFAKEBrowser:assertion', assertion);

    //TODO check the values with the hash received
    return new Promise(function(resolve,reject) {

      // atob may need to be required for nodejs
      // var atob = require('atob');

      let decodedContent = atob(assertion);
      let content = JSON.parse(decodedContent);
      let idTokenSplited = content.tokenID.split('.');
      let idToken = JSON.parse(atob(idTokenSplited[1]));

      resolve({identity: idToken.email, contents: idToken.nonce});

    });
  },

  /**
  * Function to generate an identity Assertion
  * TODO add details of the implementation, and improve implementation
  *
  * @param  {contents} The contents includes information about the identity received
  * @param  {origin} Origin parameter that identifies the origin of the RTCPeerConnection
  * @param  {usernameHint} optional usernameHint parameter
  * @return {Promise} returns a promise with an identity assertion
  */
  generateAssertion: (contents, origin, hint) => {
    console.log('[IDPROXY.generateAssertionFAKE_BROWSER:contents]', contents);
    console.log('[IDPROXY.generateAssertionFAKE_BROWSER:origin]', origin);
    console.log('[IDPROXY.generateAssertionFAKE_BROWSER:hint]', hint);

    return new Promise(function(resolve, reject) {

      console.log('generateMessageResponse:');
      return resolve(generateMessageResponse);

    });

  }

}

/**
* Identity Provider Proxy Protocol Stub
*/
class NodejsProxyStub {

  /**
  * Constructor of the IdpProxy Stub
  * The constructor add a listener in the messageBus received and start a web worker with the received idpProxy
  *
  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
  * @param  {Message.Message}                           busPostMessage     configuration
  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
  */
 constructor(runtimeProtoStubURL, bus, config) {
   console.log('FAKE NODEJS constructor');
   let _this = this;
   _this.runtimeProtoStubURL = runtimeProtoStubURL;
   _this.messageBus = bus;
   _this.config = config;

   _this.messageBus.addListener('*', function(msg) {

     //TODO add the respective listener
     if (msg.to === 'domain-idp://nodejs-idp') {
        _this.requestToIdp(msg);
     }
   });

   _this._sendStatus('created');
 }

  /**
  * Function that see the intended method in the message received and call the respective function
  *
  * @param {message}  message received in the messageBus
  */
  requestToIdp(msg) {
    let _this = this;
    let params = msg.body.params;

    switch (msg.body.method) {
      case 'generateAssertion':
        idp.generateAssertion(params.contents, params.origin, params.usernameHint).then(
          function(value) { _this.replyMessage(msg, value);},

          function(error) { _this.replyMessage(msg, error);}
        );
        break;
      case 'validateAssertion':
        idp.validateAssertion(params.assertion, params.origin).then(
          function(value) { _this.replyMessage(msg, value);},

          function(error) { _this.replyMessage(msg, error);}
        );
        break;
      default:
        break;
    }
  }

/**
  * This function receives a message and a value. It replies the value to the sender of the message received
  *
  * @param  {message}   message received
  * @param  {value}     value to include in the new message to send
  */
  replyMessage(msg, value) {
    let _this = this;

    let message = {id: msg.id, type: 'response', to: msg.from, from: msg.to,
                   body: {code: 200, value: value}};

    _this.messageBus.postMessage(message);
  }

  _sendStatus(value, reason) {
    let _this = this;

    console.log('[NodeJS.sendStatus] ', value);

    _this._state = value;

    let msg = {
      type: 'update',
      from: _this.runtimeProtoStubURL,
      to: _this.runtimeProtoStubURL + '/status',
      body: {
        value: value
      }
    };

    if (reason) {
      msg.body.desc = reason;
    }

    _this.messageBus.postMessage(msg);
  }
}

/**
 * To activate this protocol stub, using the same method for all protostub.
 * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
 * @param  {Message.Message}                           busPostMessage     configuration
 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
 * @return {Object} Object with name and instance of ProtoStub
 */
export default function activate(url, bus, config) {
  return {
    name: 'NodejsProxyStub',
    instance: new NodejsProxyStub(url, bus, config)
  };
}
