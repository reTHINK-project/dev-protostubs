let identities = {};
let nIdentity = 0;
//import fetch from 'node-fetch';
//let fetch = require("node-fetch");
//const https = require('https');
let btoa = require('btoa');
let atob = require('atob');

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
    console.log('validateAssertionProxyNODEJSFAKE:assertion', assertion);

    //TODO check the values with the hash received
    return new Promise(function(resolve,reject) {
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
    console.log('[IDPROXY.generateAssertionFAKE:contents]', contents);
    console.log('[IDPROXY.generateAssertionFAKE:origin]', origin);
    console.log('[IDPROXY.generateAssertionFAKE:hint]', hint);

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


let generateMessageResponse =
{assertion:
'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqUTNOMlF4TnprM01tUXlZVEF3TVRBM05HUTFPRFppTlRnNE9UYzJaREl6TkRJNU5qZ3dNV1VpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURNeE5UUTBPVEUzTVRFeU56VXhNall6TkRJaUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhek15TVVCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWkwM2RtRTJNMVZ2ZFdWRU1reDZTMWN6Umw4Mk9GRWlMQ0p1YjI1alpTSTZJbHMwT0N3eE16QXNNU3d6TkN3ME9Dd3hNeXcyTERrc05ESXNNVE0wTERjeUxERXpOQ3d5TkRjc01UTXNNU3d4TERFc05Td3dMRE1zTVRNd0xERXNNVFVzTUN3ME9Dd3hNekFzTVN3eE1Dd3lMREV6TUN3eExERXNNQ3d5TWpnc05ETXNNVEF4TERFeUxERXlNU3czTERFMU55dzNNU3c0TVN3MU9Dd3lNVGtzTXpJc01UQXNNVEE0TERFNU15d3hOemtzTWpFeUxERXhOaXd5TlRVc05Ua3NNakUzTERNeUxERTJNU3d5TURFc05UTXNNVGN4TERJeU5pd3hPVGtzTVRNM0xESXdNaXd4TnpFc05qQXNPRElzTlRNc01USTFMRFl5TERFM055d3hNallzTVRZMUxESTBMREUwTVN3ek1Dd3hOU3d5TWpZc05Ua3NNVEEzTERNMExEY3NNVE1zTVRRNUxERXhNaXd4TWpVc01UQXNNak13TERFNU1Td3hOVFlzTVRZMExERTNOeXd4TUN3eE9EVXNNVE1zTmpZc015d3lNVGNzTVRZMkxESTBOQ3c1TUN3eE1Ua3NNVEV4TERJM0xERTBOU3d4TURRc056RXNNVGc1TERFMk5pd3lNallzTWpVMUxERXpNeXc0TXl3eE5URXNNak14TERFd01Td3hOVEVzT0Rrc01qSXNNVGtzTmpVc01UVTBMREV3TERVekxESXdPQ3d5TVRnc01qVXlMREl4T1N3ek55dzFNQ3d5TVRJc09EWXNNVFExTERFd055d3hNeklzT1RBc01qTXpMREl3TWl3eU1qY3NNVEE0TERFeE5Dd3hOREVzTWprc056TXNNVGczTERNeExERXpMREl6TkN3d0xESXpNaXd5TkN3eE9URXNNelVzTVRRNUxERTNPU3d4TXpnc01qRTBMREUxT1N3eU5EVXNNVFl5TERFME9Dd3lNakVzTVRFNExERTNMREV3TlN3NE9Td3hOVEVzTVRRMkxESXdPU3cxTlN3eU16WXNOakVzTVRRekxESXpNeXd5TWpnc01UQXNNVEUxTERnc09ERXNNVGszTERRMUxERXlNeXd4T0Rjc01qSXpMREUzTml3eU5UUXNNVFkxTERZNUxERTBNeXd5T1N3eE1EQXNNVEUwTERFM0xERXpNQ3d5TWpZc01qSXpMRE16TERFeExESTBNQ3c0TVN3Mk1Td3hOeklzTVRreExERTFOeXd5TkRZc01qQXlMRGczTERFek1Td3lNakVzT0Rnc05EZ3NNVEkzTERFMU9Td3hNVGtzTVRZd0xERTFNaXd4TVRjc05qRXNNalV6TERFM05DdzJOU3d5TVRRc01qQXpMREl4T0N3Mk15dzFNQ3czT0N3eE5qQXNNVGd4TERJeU1Td3lNVEVzTVRJNExEY3dMREUzT0N3eE9URXNNVGN3TERBc01UTXNNVEl5TERFM015d3hNaXd5TURNc01qVXlMRFFzTVRnMExESXlOU3d5TlRJc055dzJNaXc1Tml3eE1UWXNNVFVzTWpFMkxERTFPQ3cxTlN3NE5TdzBPQ3d4Tml3NUxESXdOaXd4TVRrc056UXNNVEV5TERJME15d3hNellzT0RRc01UZzBMREl5TXl3eU5UUXNNVEF4TERreExEWXhMREV3TERreExEZzFMREU1TWl3eE5EY3NNVFEwTERVM0xESTVMRFkyTERJek9Dd3hPVGtzTWpRMExERTVNeXd4T1RRc01UVXdMREl6TWl3eU1EQXNNVEEzTERJc015d3hMREFzTVYwaUxDSnBjM01pT2lKb2RIUndjem92TDJGalkyOTFiblJ6TG1kdmIyZHNaUzVqYjIwaUxDSnBZWFFpT2pFMU1USTJORFl3T0RBc0ltVjRjQ0k2TVRVeE1qWTBPVFk0TUgwLnRlSTFtOTBWckFFZ0t0djNQSUc3SjZzQWhkX1FZN21pM1FzV0xZYmFrV0pxTDZmNGdtRnlkZEV3cUt4R1k0eDdzTUx0ai1VYzBaS3VXWF9xRTdLNml3amhNbHpiVEhLOExlaHlJTE9DWTdYc3VvYTZNcWZUMVdwOEJnMFRmSkh1T25iWl95bXhQTVFLT2tmWmlQVlM1aXFzTzNibmVRelRyMEpicXRRN3hXc0pTNm56LWlBNnJFZEtqZkM3MGFtVzBpU0ktLWxXbVg3c1phVGVaYzd1ZzRyNFo1LXpMRjM5endRUE93RVFBbFQtWkFfeTFnT180VnVlRGVabVdtVnV6MmtKT185MWg2cUU1blpPdHdXVnVDcmR3LTlJYXc3ejJEUGVzX2o1UkQ4bERvdlI2Sk0wZGoySnF6TDlWcFRjbUYyN0FKc2MxamhRTHNMV2JsY3hadyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMzE1NDQ5MTcxMTI3NTEyNjM0MiIsImVtYWlsIjoidGVzdGFuZHRoaW5rMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiItN3ZhNjNVb3VlRDJMektXM0ZfNjhRIiwibm9uY2UiOiJbNDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMjI4LDQzLDEwMSwxMiwxMjEsNywxNTcsNzEsODEsNTgsMjE5LDMyLDEwLDEwOCwxOTMsMTc5LDIxMiwxMTYsMjU1LDU5LDIxNywzMiwxNjEsMjAxLDUzLDE3MSwyMjYsMTk5LDEzNywyMDIsMTcxLDYwLDgyLDUzLDEyNSw2MiwxNzcsMTI2LDE2NSwyNCwxNDEsMzAsMTUsMjI2LDU5LDEwNywzNCw3LDEzLDE0OSwxMTIsMTI1LDEwLDIzMCwxOTEsMTU2LDE2NCwxNzcsMTAsMTg1LDEzLDY2LDMsMjE3LDE2NiwyNDQsOTAsMTE5LDExMSwyNywxNDUsMTA0LDcxLDE4OSwxNjYsMjI2LDI1NSwxMzMsODMsMTUxLDIzMSwxMDEsMTUxLDg5LDIyLDE5LDY1LDE1NCwxMCw1MywyMDgsMjE4LDI1MiwyMTksMzcsNTAsMjEyLDg2LDE0NSwxMDcsMTMyLDkwLDIzMywyMDIsMjI3LDEwOCwxMTQsMTQxLDI5LDczLDE4NywzMSwxMywyMzQsMCwyMzIsMjQsMTkxLDM1LDE0OSwxNzksMTM4LDIxNCwxNTksMjQ1LDE2MiwxNDgsMjIxLDExOCwxNywxMDUsODksMTUxLDE0NiwyMDksNTUsMjM2LDYxLDE0MywyMzMsMjI4LDEwLDExNSw4LDgxLDE5Nyw0NSwxMjMsMTg3LDIyMywxNzYsMjU0LDE2NSw2OSwxNDMsMjksMTAwLDExNCwxNywxMzAsMjI2LDIyMywzMywxMSwyNDAsODEsNjEsMTcyLDE5MSwxNTcsMjQ2LDIwMiw4NywxMzEsMjIxLDg4LDQ4LDEyNywxNTksMTE5LDE2MCwxNTIsMTE3LDYxLDI1MywxNzQsNjUsMjE0LDIwMywyMTgsNjMsNTAsNzgsMTYwLDE4MSwyMjEsMjExLDEyOCw3MCwxNzgsMTkxLDE3MCwwLDEzLDEyMiwxNzMsMTIsMjAzLDI1Miw0LDE4NCwyMjUsMjUyLDcsNjIsOTYsMTE2LDE1LDIxNiwxNTgsNTUsODUsNDgsMTYsOSwyMDYsMTE5LDc0LDExMiwyNDMsMTM2LDg0LDE4NCwyMjMsMjU0LDEwMSw5MSw2MSwxMCw5MSw4NSwxOTIsMTQ3LDE0NCw1NywyOSw2NiwyMzgsMTk5LDI0NCwxOTMsMTk0LDE1MCwyMzIsMjAwLDEwNywyLDMsMSwwLDFdIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoiMTUxMjY0NjA4MCIsImV4cCI6IjE1MTI2NDk2ODAiLCJhbGciOiJSUzI1NiIsImtpZCI6IjQ3N2QxNzk3MmQyYTAwMTA3NGQ1ODZiNTg4OTc2ZDIzNDI5NjgwMWUifX0=',
idp:{
domain:'nodejs-idp',
protocol:'OIDC'},
info:{'accessToken':'ya29.GlsbBalGJJmVi_N5IDyqMI3JxkO5eLV4333I93eQBCpNAofEqtU4UkWHh8drVlrViVTqt6Jk3P86_CDt4sKVh0G9AbTk1rVW3MAxcFhEUFE-KMXdDK_KsMf6fNQk',
idToken:'eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ3N2QxNzk3MmQyYTAwMTA3NGQ1ODZiNTg4OTc2ZDIzNDI5NjgwMWUifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMxNTQ0OTE3MTEyNzUxMjYzNDIiLCJlbWFpbCI6InRlc3RhbmR0aGluazMyMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ii03dmE2M1VvdWVEMkx6S1czRl82OFEiLCJub25jZSI6Ils0OCwxMzAsMSwzNCw0OCwxMyw2LDksNDIsMTM0LDcyLDEzNCwyNDcsMTMsMSwxLDEsNSwwLDMsMTMwLDEsMTUsMCw0OCwxMzAsMSwxMCwyLDEzMCwxLDEsMCwyMjgsNDMsMTAxLDEyLDEyMSw3LDE1Nyw3MSw4MSw1OCwyMTksMzIsMTAsMTA4LDE5MywxNzksMjEyLDExNiwyNTUsNTksMjE3LDMyLDE2MSwyMDEsNTMsMTcxLDIyNiwxOTksMTM3LDIwMiwxNzEsNjAsODIsNTMsMTI1LDYyLDE3NywxMjYsMTY1LDI0LDE0MSwzMCwxNSwyMjYsNTksMTA3LDM0LDcsMTMsMTQ5LDExMiwxMjUsMTAsMjMwLDE5MSwxNTYsMTY0LDE3NywxMCwxODUsMTMsNjYsMywyMTcsMTY2LDI0NCw5MCwxMTksMTExLDI3LDE0NSwxMDQsNzEsMTg5LDE2NiwyMjYsMjU1LDEzMyw4MywxNTEsMjMxLDEwMSwxNTEsODksMjIsMTksNjUsMTU0LDEwLDUzLDIwOCwyMTgsMjUyLDIxOSwzNyw1MCwyMTIsODYsMTQ1LDEwNywxMzIsOTAsMjMzLDIwMiwyMjcsMTA4LDExNCwxNDEsMjksNzMsMTg3LDMxLDEzLDIzNCwwLDIzMiwyNCwxOTEsMzUsMTQ5LDE3OSwxMzgsMjE0LDE1OSwyNDUsMTYyLDE0OCwyMjEsMTE4LDE3LDEwNSw4OSwxNTEsMTQ2LDIwOSw1NSwyMzYsNjEsMTQzLDIzMywyMjgsMTAsMTE1LDgsODEsMTk3LDQ1LDEyMywxODcsMjIzLDE3NiwyNTQsMTY1LDY5LDE0MywyOSwxMDAsMTE0LDE3LDEzMCwyMjYsMjIzLDMzLDExLDI0MCw4MSw2MSwxNzIsMTkxLDE1NywyNDYsMjAyLDg3LDEzMSwyMjEsODgsNDgsMTI3LDE1OSwxMTksMTYwLDE1MiwxMTcsNjEsMjUzLDE3NCw2NSwyMTQsMjAzLDIxOCw2Myw1MCw3OCwxNjAsMTgxLDIyMSwyMTEsMTI4LDcwLDE3OCwxOTEsMTcwLDAsMTMsMTIyLDE3MywxMiwyMDMsMjUyLDQsMTg0LDIyNSwyNTIsNyw2Miw5NiwxMTYsMTUsMjE2LDE1OCw1NSw4NSw0OCwxNiw5LDIwNiwxMTksNzQsMTEyLDI0MywxMzYsODQsMTg0LDIyMywyNTQsMTAxLDkxLDYxLDEwLDkxLDg1LDE5MiwxNDcsMTQ0LDU3LDI5LDY2LDIzOCwxOTksMjQ0LDE5MywxOTQsMTUwLDIzMiwyMDAsMTA3LDIsMywxLDAsMV0iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE1MTI2NDYwODAsImV4cCI6MTUxMjY0OTY4MH0.teI1m90VrAEgKtv3PIG7J6sAhd_QY7mi3QsWLYbakWJqL6f4gmFyddEwqKxGY4x7sMLtj-Uc0ZKuWX_qE7K6iwjhMlzbTHK8LehyILOCY7Xsuoa6MqfT1Wp8Bg0TfJHuOnbZ_ymxPMQKOkfZiPVS5iqsO3bneQzTr0JbqtQ7xWsJS6nz-iA6rEdKjfC70amW0iSI--lWmX7sZaTeZc7ug4r4Z5-zLF39zwQPOwEQAlT-ZA_y1gO_4VueDeZmWmVuz2kJO_91h6qE5nZOtwWVuCrdw-9Iaw7z2DPes_j5RD8lDovR6JM0dj2JqzL9VpTcmF27AJsc1jhQLsLWblcxZw',
refreshToken:'1/6cCGEWyzx2uO2bH2F1A8v6KDTG4rP0CXc-XUQ12-U0o',
tokenType:'Bearer',
infoToken:{
sub:'103154491711275126342',
name:'test think',
given_name:'test',
family_name:'think',
picture:'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
email:'testandthink321@gmail.com',
email_verified:true,
locale:'en'},
tokenIDJSON:{'azp':'808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
aud:'808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com',
sub:'103154491711275126342',
email:'testandthink321@gmail.com',
email_verified:'true',
at_hash:'-7va63UoueD2LzKW3F_68Q',
nonce:[48,130,1,34,48,13,6,9,42,134,72,134,247,13,1,1,1,5,0,3,130,1,15,0,48,130,1,10,2,130,1,1,0,228,43,101,12,121,7,157,71,81,58,219,32,10,108,193,179,212,116,255,59,217,32,161,201,53,171,226,199,137,202,171,60,82,53,125,62,177,126,165,24,141,30,15,226,59,107,34,7,13,149,112,125,10,230,191,156,164,177,10,185,13,66,3,217,166,244,90,119,111,27,145,104,71,189,166,226,255,133,83,151,231,101,151,89,22,19,65,154,10,53,208,218,252,219,37,50,212,86,145,107,132,90,233,202,227,108,114,141,29,73,187,31,13,234,0,232,24,191,35,149,179,138,214,159,245,162,148,221,118,17,105,89,151,146,209,55,236,61,143,233,228,10,115,8,81,197,45,123,187,223,176,254,165,69,143,29,100,114,17,130,226,223,33,11,240,81,61,172,191,157,246,202,87,131,221,88,48,127,159,119,160,152,117,61,253,174,65,214,203,218,63,50,78,160,181,221,211,128,70,178,191,170,0,13,122,173,12,203,252,4,184,225,252,7,62,96,116,15,216,158,55,85,48,16,9,206,119,74,112,243,136,84,184,223,254,101,91,61,10,91,85,192,147,144,57,29,66,238,199,244,193,194,150,232,200,107,2,3,1,0,1],
iss:'https://accounts.google.com',
iat:'1512646080',
exp:'1512649680',
alg:'RS256',
kid:'477d17972d2a001074d586b588976d234296801e'},
expires:'1512649680',
email:'testandthink321@gmail.com'},
infoToken:
{sub:'103154491711275126342',
name:'test think',
given_name:'test',
family_name:'think',
picture:'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
email:'testandthink321@gmail.com',
email_verified:true,
locale:'en'},
identity:'user://google.com/testandthink321@gmail.com',
messageInfo:{userProfile:{username:'testandthink321@gmail.com',
cn:'testandthink321',
avatar:'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
locale:'en',
userURL:'user://google.com/testandthink321@gmail.com'},
idp:'nodejs-idp',
assertion:'eyJ0b2tlbklEIjoiZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNklqUTNOMlF4TnprM01tUXlZVEF3TVRBM05HUTFPRFppTlRnNE9UYzJaREl6TkRJNU5qZ3dNV1VpZlEuZXlKaGVuQWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKaGRXUWlPaUk0TURnek1qazFOall3TVRJdGRIRnlPSEZ2YURFeE1UazBNbWRrTW10bk1EQTNkREJ6T0dZeU56ZHliMmt1WVhCd2N5NW5iMjluYkdWMWMyVnlZMjl1ZEdWdWRDNWpiMjBpTENKemRXSWlPaUl4TURNeE5UUTBPVEUzTVRFeU56VXhNall6TkRJaUxDSmxiV0ZwYkNJNkluUmxjM1JoYm1SMGFHbHVhek15TVVCbmJXRnBiQzVqYjIwaUxDSmxiV0ZwYkY5MlpYSnBabWxsWkNJNmRISjFaU3dpWVhSZmFHRnphQ0k2SWkwM2RtRTJNMVZ2ZFdWRU1reDZTMWN6Umw4Mk9GRWlMQ0p1YjI1alpTSTZJbHMwT0N3eE16QXNNU3d6TkN3ME9Dd3hNeXcyTERrc05ESXNNVE0wTERjeUxERXpOQ3d5TkRjc01UTXNNU3d4TERFc05Td3dMRE1zTVRNd0xERXNNVFVzTUN3ME9Dd3hNekFzTVN3eE1Dd3lMREV6TUN3eExERXNNQ3d5TWpnc05ETXNNVEF4TERFeUxERXlNU3czTERFMU55dzNNU3c0TVN3MU9Dd3lNVGtzTXpJc01UQXNNVEE0TERFNU15d3hOemtzTWpFeUxERXhOaXd5TlRVc05Ua3NNakUzTERNeUxERTJNU3d5TURFc05UTXNNVGN4TERJeU5pd3hPVGtzTVRNM0xESXdNaXd4TnpFc05qQXNPRElzTlRNc01USTFMRFl5TERFM055d3hNallzTVRZMUxESTBMREUwTVN3ek1Dd3hOU3d5TWpZc05Ua3NNVEEzTERNMExEY3NNVE1zTVRRNUxERXhNaXd4TWpVc01UQXNNak13TERFNU1Td3hOVFlzTVRZMExERTNOeXd4TUN3eE9EVXNNVE1zTmpZc015d3lNVGNzTVRZMkxESTBOQ3c1TUN3eE1Ua3NNVEV4TERJM0xERTBOU3d4TURRc056RXNNVGc1TERFMk5pd3lNallzTWpVMUxERXpNeXc0TXl3eE5URXNNak14TERFd01Td3hOVEVzT0Rrc01qSXNNVGtzTmpVc01UVTBMREV3TERVekxESXdPQ3d5TVRnc01qVXlMREl4T1N3ek55dzFNQ3d5TVRJc09EWXNNVFExTERFd055d3hNeklzT1RBc01qTXpMREl3TWl3eU1qY3NNVEE0TERFeE5Dd3hOREVzTWprc056TXNNVGczTERNeExERXpMREl6TkN3d0xESXpNaXd5TkN3eE9URXNNelVzTVRRNUxERTNPU3d4TXpnc01qRTBMREUxT1N3eU5EVXNNVFl5TERFME9Dd3lNakVzTVRFNExERTNMREV3TlN3NE9Td3hOVEVzTVRRMkxESXdPU3cxTlN3eU16WXNOakVzTVRRekxESXpNeXd5TWpnc01UQXNNVEUxTERnc09ERXNNVGszTERRMUxERXlNeXd4T0Rjc01qSXpMREUzTml3eU5UUXNNVFkxTERZNUxERTBNeXd5T1N3eE1EQXNNVEUwTERFM0xERXpNQ3d5TWpZc01qSXpMRE16TERFeExESTBNQ3c0TVN3Mk1Td3hOeklzTVRreExERTFOeXd5TkRZc01qQXlMRGczTERFek1Td3lNakVzT0Rnc05EZ3NNVEkzTERFMU9Td3hNVGtzTVRZd0xERTFNaXd4TVRjc05qRXNNalV6TERFM05DdzJOU3d5TVRRc01qQXpMREl4T0N3Mk15dzFNQ3czT0N3eE5qQXNNVGd4TERJeU1Td3lNVEVzTVRJNExEY3dMREUzT0N3eE9URXNNVGN3TERBc01UTXNNVEl5TERFM015d3hNaXd5TURNc01qVXlMRFFzTVRnMExESXlOU3d5TlRJc055dzJNaXc1Tml3eE1UWXNNVFVzTWpFMkxERTFPQ3cxTlN3NE5TdzBPQ3d4Tml3NUxESXdOaXd4TVRrc056UXNNVEV5TERJME15d3hNellzT0RRc01UZzBMREl5TXl3eU5UUXNNVEF4TERreExEWXhMREV3TERreExEZzFMREU1TWl3eE5EY3NNVFEwTERVM0xESTVMRFkyTERJek9Dd3hPVGtzTWpRMExERTVNeXd4T1RRc01UVXdMREl6TWl3eU1EQXNNVEEzTERJc015d3hMREFzTVYwaUxDSnBjM01pT2lKb2RIUndjem92TDJGalkyOTFiblJ6TG1kdmIyZHNaUzVqYjIwaUxDSnBZWFFpT2pFMU1USTJORFl3T0RBc0ltVjRjQ0k2TVRVeE1qWTBPVFk0TUgwLnRlSTFtOTBWckFFZ0t0djNQSUc3SjZzQWhkX1FZN21pM1FzV0xZYmFrV0pxTDZmNGdtRnlkZEV3cUt4R1k0eDdzTUx0ai1VYzBaS3VXWF9xRTdLNml3amhNbHpiVEhLOExlaHlJTE9DWTdYc3VvYTZNcWZUMVdwOEJnMFRmSkh1T25iWl95bXhQTVFLT2tmWmlQVlM1aXFzTzNibmVRelRyMEpicXRRN3hXc0pTNm56LWlBNnJFZEtqZkM3MGFtVzBpU0ktLWxXbVg3c1phVGVaYzd1ZzRyNFo1LXpMRjM5endRUE93RVFBbFQtWkFfeTFnT180VnVlRGVabVdtVnV6MmtKT185MWg2cUU1blpPdHdXVnVDcmR3LTlJYXc3ejJEUGVzX2o1UkQ4bERvdlI2Sk0wZGoySnF6TDlWcFRjbUYyN0FKc2MxamhRTHNMV2JsY3hadyIsInRva2VuSURKU09OIjp7ImF6cCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjgwODMyOTU2NjAxMi10cXI4cW9oMTExOTQyZ2Qya2cwMDd0MHM4ZjI3N3JvaS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMzE1NDQ5MTcxMTI3NTEyNjM0MiIsImVtYWlsIjoidGVzdGFuZHRoaW5rMzIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF0X2hhc2giOiItN3ZhNjNVb3VlRDJMektXM0ZfNjhRIiwibm9uY2UiOiJbNDgsMTMwLDEsMzQsNDgsMTMsNiw5LDQyLDEzNCw3MiwxMzQsMjQ3LDEzLDEsMSwxLDUsMCwzLDEzMCwxLDE1LDAsNDgsMTMwLDEsMTAsMiwxMzAsMSwxLDAsMjI4LDQzLDEwMSwxMiwxMjEsNywxNTcsNzEsODEsNTgsMjE5LDMyLDEwLDEwOCwxOTMsMTc5LDIxMiwxMTYsMjU1LDU5LDIxNywzMiwxNjEsMjAxLDUzLDE3MSwyMjYsMTk5LDEzNywyMDIsMTcxLDYwLDgyLDUzLDEyNSw2MiwxNzcsMTI2LDE2NSwyNCwxNDEsMzAsMTUsMjI2LDU5LDEwNywzNCw3LDEzLDE0OSwxMTIsMTI1LDEwLDIzMCwxOTEsMTU2LDE2NCwxNzcsMTAsMTg1LDEzLDY2LDMsMjE3LDE2NiwyNDQsOTAsMTE5LDExMSwyNywxNDUsMTA0LDcxLDE4OSwxNjYsMjI2LDI1NSwxMzMsODMsMTUxLDIzMSwxMDEsMTUxLDg5LDIyLDE5LDY1LDE1NCwxMCw1MywyMDgsMjE4LDI1MiwyMTksMzcsNTAsMjEyLDg2LDE0NSwxMDcsMTMyLDkwLDIzMywyMDIsMjI3LDEwOCwxMTQsMTQxLDI5LDczLDE4NywzMSwxMywyMzQsMCwyMzIsMjQsMTkxLDM1LDE0OSwxNzksMTM4LDIxNCwxNTksMjQ1LDE2MiwxNDgsMjIxLDExOCwxNywxMDUsODksMTUxLDE0NiwyMDksNTUsMjM2LDYxLDE0MywyMzMsMjI4LDEwLDExNSw4LDgxLDE5Nyw0NSwxMjMsMTg3LDIyMywxNzYsMjU0LDE2NSw2OSwxNDMsMjksMTAwLDExNCwxNywxMzAsMjI2LDIyMywzMywxMSwyNDAsODEsNjEsMTcyLDE5MSwxNTcsMjQ2LDIwMiw4NywxMzEsMjIxLDg4LDQ4LDEyNywxNTksMTE5LDE2MCwxNTIsMTE3LDYxLDI1MywxNzQsNjUsMjE0LDIwMywyMTgsNjMsNTAsNzgsMTYwLDE4MSwyMjEsMjExLDEyOCw3MCwxNzgsMTkxLDE3MCwwLDEzLDEyMiwxNzMsMTIsMjAzLDI1Miw0LDE4NCwyMjUsMjUyLDcsNjIsOTYsMTE2LDE1LDIxNiwxNTgsNTUsODUsNDgsMTYsOSwyMDYsMTE5LDc0LDExMiwyNDMsMTM2LDg0LDE4NCwyMjMsMjU0LDEwMSw5MSw2MSwxMCw5MSw4NSwxOTIsMTQ3LDE0NCw1NywyOSw2NiwyMzgsMTk5LDI0NCwxOTMsMTk0LDE1MCwyMzIsMjAwLDEwNywyLDMsMSwwLDFdIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoiMTUxMjY0NjA4MCIsImV4cCI6IjE1MTI2NDk2ODAiLCJhbGciOiJSUzI1NiIsImtpZCI6IjQ3N2QxNzk3MmQyYTAwMTA3NGQ1ODZiNTg4OTc2ZDIzNDI5NjgwMWUifX0=',
expires:'1512649680'}}
