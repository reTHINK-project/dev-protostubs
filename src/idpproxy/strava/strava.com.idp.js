import { IdpProxy } from "../OAUTH.js"
import { APIInfo, accessTokenAuthorisationEndpoint, accessTokenEndpoint, authorisationEndpoint, accessTokenInput, mapping, refreshAccessTokenEndpoint, revokeAccessTokenEndpoint } from "./StravaInfo.js"
//import { convertUserProfile } from "./GoogleConverter"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub.js"


/**
* Strava Identity Provider Proxy Protocol Stub
*/
class StravaIdpProxyProtoStub extends AbstractIdpProxyProtoStub {

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
    config.domain = 'strava.com';
    config.idpUrl = 'domain-idp://strava.com';
    config.idpProxy = IdpProxy;
//    config.idpInfo = googleInfo;
    config.apiInfo = APIInfo;
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

  }

// export default IdpProxyProtoStub;

/**
 * To activate this protocol stub, using the same method for all protostub.
 * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
 * @param  {Message.Message}                           busPostMessage     configuration
 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
 * @return {Object} Object with name and instance of ProtoStub
 */
export default StravaIdpProxyProtoStub;

/*export default function activate(url, bus, config) {
  return {
    name: 'StravaIdpProxyProtoStub',
    instance: new StravaIdpProxyProtoStub(url, bus, config)
  };
}*/
