import { IdpProxy } from "../OIDC.js"
import { googleInfo, googleAPIInfo, accessTokenAuthorisationEndpoint, accessTokenEndpoint, authorisationEndpoint, accessTokenInput, mapping, refreshAccessTokenEndpoint, revokeAccessTokenEndpoint } from "./GoogleInfo.js"
import { convertUserProfile } from "./GoogleConverter.js"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub.js"

const idpProxyDescriptor = {
  "name": "GoogleIdpProxyProtoStub",
  "language": "javascript",
  "description": "IDPProxy for google idp",
  "signature": "",
  "configuration": {},
  "constraints": {
    "browser": true
  },
  "interworking": true,
  "objectName": "google.com"
}


/**
* Google Identity Provider Proxy Protocol Stub
*/
export default class GoogleIdpProxyProtoStub extends AbstractIdpProxyProtoStub {

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
    console.log('[GoogleIdpProxyProtoStub._start] ');
    config.domain = 'google.com';
    config.idpUrl = 'domain-idp://google.com';
    config.idpProxy = IdpProxy;
    config.idpInfo = googleInfo;
    config.apiInfo = googleAPIInfo;
    config.accessTokenAuthorisationEndpoint = accessTokenAuthorisationEndpoint;
    config.accessTokenEndpoint = accessTokenEndpoint;
    config.refreshAccessTokenEndpoint = refreshAccessTokenEndpoint;
    config.revokeAccessTokenEndpoint = revokeAccessTokenEndpoint;
    config.accessTokenInput = accessTokenInput;
    config.authorisationEndpoint = authorisationEndpoint;
    config.convertUserProfile = convertUserProfile;
    config.mapping = mapping;
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
//export default GoogleIdpProxyProtoStub;

/*  export default function activate(url, bus, config) {
  return {
    name: 'GoogleIdpProxyProtoStub',
    instance: new GoogleIdpProxyProtoStub(url, bus, config)
  };
}*/
