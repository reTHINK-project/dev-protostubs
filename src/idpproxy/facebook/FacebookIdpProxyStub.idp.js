import { IdpProxy } from "../OAUTH"
//import {facebookInfo} from "./FacebookInfo"
import { convertUserProfile, userInfoEndpoint,
   authorisationEndpoint, validateAssertionEndpoint } from "./Facebook"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub"

const idpProxyDescriptor = {
  "name": "FacebookIdpProxyProtoStub",
  "language": "javascript",
  "description": "IDPProxy for Facebook idp",
  "signature": "",
  "configuration": {},
  "constraints": {
    "browser": true
  },
  "interworking": false,
  "objectName": "facebook.com"
}

/**
* Google Identity Provider Proxy Protocol Stub
*/
class FacebookIdpProxyProtoStub extends AbstractIdpProxyProtoStub {

  /**
  * Constructor of the IdpProxy Stub
  * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received
  *
  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
  * @param  {Message.Message}                           busPostMessage     configuration
  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
  */
 constructor() {
  super();

 }

 _start(runtimeProtoStubURL, bus, config) {
    config.idpUrl = 'domain-idp://facebook.com';
    config.domain = 'facebook.com';
    config.idpProxy = IdpProxy;
    //     config.idpInfo = facebookInfo;
    config.convertUserProfile = convertUserProfile;
    config.userInfoEndpoint = userInfoEndpoint;
    config.authorisationEndpoint = authorisationEndpoint;
    config.validateAssertionEndpoint = validateAssertionEndpoint;
    super._init(runtimeProtoStubURL, bus, config);
  }
  get descriptor() {
    return idpProxyDescriptor;
  }
  
  get name(){
    return idpProxyDescriptor.name;
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
export default FacebookIdpProxyProtoStub;

/*export default function activate(url, bus, config) {
  return {
    name: 'FacebookIdpProxyProtoStub',
    instance: new FacebookIdpProxyProtoStub(url, bus, config)
  };
}*/
