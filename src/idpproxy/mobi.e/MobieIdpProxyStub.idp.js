import { IdpProxy } from "../OAUTH.js"
import { mobieAPIInfo, accessTokenAuthorisationEndpoint, accessTokenEndpoint, authorisationEndpoint, accessTokenInput, mapping, refreshAccessTokenEndpoint, revokeAccessTokenEndpoint } from "./MobieInfo.js"
//import { convertUserProfile } from "./GoogleConverter"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub.js"

const idpProxyDescriptor = {
  "name": "MobieIdpProxyProtoStub",
  "language": "javascript",
  "description": "IDPProxy for Mobi.e plataform",
  "signature": "",
  "configuration": {},
  "constraints": {
    "browser": true
  },
  "interworking": true,
  "objectName": "mobie.pt"
}

/**
* Mobie Identity Provider Proxy Protocol Stub
*/
class MobieIdpProxyProtoStub extends AbstractIdpProxyProtoStub {

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
    config.domain = 'mobie.pt';
    config.idpUrl = 'domain-idp://mobie.pt';
    config.idpProxy = IdpProxy;
//    config.idpInfo = googleInfo;
    config.apiInfo = mobieAPIInfo;
    config.accessTokenAuthorisationEndpoint = accessTokenAuthorisationEndpoint;
    config.accessTokenEndpoint = accessTokenEndpoint;
    config.refreshAccessTokenEndpoint = refreshAccessTokenEndpoint;
    config.accessTokenInput = accessTokenInput;
    config.revokeAccessTokenEndpoint = revokeAccessTokenEndpoint;
    config.authorisationEndpoint = authorisationEndpoint;
//    config.convertUserProfile = convertUserProfile;
//    config.mapping = mapping;
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
export default MobieIdpProxyProtoStub;

/*export default function activate(url, bus, config) {
  return {
    name: 'MobieIdpProxyProtoStub',
    instance: new MobieIdpProxyProtoStub(url, bus, config)
  };
}*/
