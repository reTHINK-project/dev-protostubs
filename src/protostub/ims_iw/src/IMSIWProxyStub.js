/**
* Identity Provider Proxy Protocol Stub
*/
class IMSIWProxyStub {

  /**
  * Constructor of the IdpProxy Stub
  * The constructor add a listener in the messageBus received and start a web worker with the received idpProxy
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

    _this.messageBus.addListener('*', function(msg) {
      //TODO add the respective listener
      if (msg.to === 'domain-idp://quobis.com') {
        _this.requestToIdp(msg);
      }
    });
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
            let access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            let infoToken = {picture: '', email: 'david.vilchez@quobis.com', family_name: 'vilchez', given_name: 'david'};
            let assertion = btoa(JSON.stringify({tokenID: access_token, email: 'david.vilchez@quobis.com', id: ''}));
            _this.replyMessage(msg, {assertion: assertion, idp: {domain: 'quobis.com', protocol: 'OAuth 2.0'}, infoToken: infoToken, interworking: {access_token: access_token, domain: 'quobis.com' }});
        break;
      case 'validateAssertion':
          _this.replyMessage(msg, {identity: 'identity@idp.com', contents: 'content'});
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

    let message = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {code: 200, value: value}};

    _this.messageBus.postMessage(message);
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
    name: 'IMSIWProxyStub',
    instance: new IMSIWProxyStub(url, bus, config)
  };
}

