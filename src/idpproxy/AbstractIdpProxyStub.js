let IdpProxy;
let idpInfo;
let convertUserProfile;
let userInfoEndpoint;
let accessTokenInput;

/**
* Abstract Identity Provider Proxy Protocol Stub to be extended by real Idp Proxies
*/
class AbstractIdpProxyProtoStub {

  /**
  * Constructor of the IdpProxy Stub
  * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received
  *
  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
  * @param  {Message.Message}                           busPostMessage     configuration
  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
  */
  constructor(runtimeProtoStubURL, bus, config) {
    let _this = this;
    _this.runtimeProtoStubURL = runtimeProtoStubURL;
    _this.messageBus = bus;
    _this.config = config;
    IdpProxy = config.idpProxy;
    convertUserProfile = config.convertUserProfile;
    accessTokenInput = config.accessTokenInput;


    console.log('[AbstractIdpProxy] constructor');

    _this.messageBus.addListener('*', function (msg) {
      if (msg.to === config.idpUrl) {

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
    //console.info('requestToIdp:', msg.body.method);
    console.info('[AbstractIdpProxyProtoStub] receiving request: ', msg);

    switch (msg.body.method) {
      case 'generateAssertion':
        IdpProxy.generateAssertion(_this.config, params.contents, params.origin, params.usernameHint).then(
          function (value) {

            value.userProfile = convertUserProfile(value.userProfile);
            _this.replyMessage(msg, value);
          },

          function (error) { _this.replyMessage(msg, error); }
        );
        break;
      case 'validateAssertion':
        //       console.info('validateAssertion');
        IdpProxy.validateAssertion(_this.config, params.assertion, params.origin).then(
          function (value) { _this.replyMessage(msg, value); },

          function (error) { _this.replyMessage(msg, error); }
        );
        break;
      case 'refreshAssertion':
        //     console.info('refreshAssertion');
        IdpProxy.refreshAssertion(params.identity).then(
          function (value) { _this.replyMessage(msg, value); },

          function (error) { _this.replyMessage(msg, error); }
        );
      case 'getAccessToken':
        //     console.info('getAccessToken');
        IdpProxy.getAccessToken(_this.config, params.resources, params.schemes, params.login).then(
          function (value) { 
            value.input = accessTokenInput(value.input);
            _this.replyMessage(msg, value); 
          },

          function (error) { _this.replyMessage(msg, error); }
        );
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

    let message = {
      id: msg.id, type: 'response', to: msg.from, from: msg.to,
      body: { code: 200, value: value }
    };

    console.log('[AbstractIdpProxyProtoStub.replyMessage] ', message);

    _this.messageBus.postMessage(message);
  }

  _sendStatus(value, reason) {
    let _this = this;

    console.log('[AbstractIdpProxyProtoStub.sendStatus] ', value);

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

// export default IdpProxyProtoStub;

/**
 * To activate this protocol stub, using the same method for all protostub.
 * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
 * @param  {Message.Message}                           busPostMessage     configuration
 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
 * @return {Object} Object with name and instance of ProtoStub
 */
export default AbstractIdpProxyProtoStub;
