import { IdpProxy } from "../OAUTH"
import { mobieAPIInfo, accessTokenAuthorisationEndpoint, accessTokenEndpoint, authorisationEndpoint, accessTokenInput, mapping, refreshAccessTokenEndpoint, revokeAccessTokenEndpoint } from "./MobieInfo"
//import { convertUserProfile } from "./GoogleConverter"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub"

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
  constructor(runtimeProtoStubURL, bus, config) {
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
    super(runtimeProtoStubURL, bus, config);
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
export default function activate(url, bus, config) {
  return {
    name: 'MobieIdpProxyProtoStub',
    instance: new MobieIdpProxyProtoStub(url, bus, config)
  };
}
