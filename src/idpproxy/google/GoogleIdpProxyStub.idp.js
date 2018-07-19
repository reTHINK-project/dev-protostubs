import { IdpProxy } from "../OIDC"
import { googleInfo, googleAPIInfo, accessTokenAuthorisationEndpoint, accessTokenEndpoint, authorisationEndpoint, accessTokenInput, mapping, refreshAccessTokenEndpoint } from "./GoogleInfo"
import { convertUserProfile } from "./GoogleConverter"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub"

/**
* Google Identity Provider Proxy Protocol Stub
*/
class GoogleIdpProxyProtoStub extends AbstractIdpProxyProtoStub {

  /**
  * Constructor of the IdpProxy Stub
  * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received
  *
  * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
  * @param  {Message.Message}                           busPostMessage     configuration
  * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
  */
  constructor(runtimeProtoStubURL, bus, config) {
    config.domain = 'google.com';
    config.idpUrl = 'domain-idp://google.com';
    config.idpProxy = IdpProxy;
    config.idpInfo = googleInfo;
    config.apiInfo = googleAPIInfo;
    config.accessTokenAuthorisationEndpoint = accessTokenAuthorisationEndpoint;
    config.accessTokenEndpoint = accessTokenEndpoint;
    config.refreshAccessTokenEndpoint = refreshAccessTokenEndpoint;
    config.accessTokenInput = accessTokenInput;
    config.authorisationEndpoint = authorisationEndpoint;
    config.convertUserProfile = convertUserProfile;
    config.mapping = mapping;
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
    name: 'GoogleIdpProxyProtoStub',
    instance: new GoogleIdpProxyProtoStub(url, bus, config)
  };
}
