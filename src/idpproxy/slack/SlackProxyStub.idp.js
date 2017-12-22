import {IdpProxy} from "../OAUTH"
import {convertUserProfile, userInfoEndpoint, authorisationEndpoint, tokenEndpoint} from "./Slack"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub"

/**
* Slack Identity Provider Proxy Protocol Stub
*/
class SlackProxyStub extends AbstractIdpProxyProtoStub {
  
    /**
    * Constructor of the IdpProxy Stub
    * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received
    *
    * @param  {URL.RuntimeURL}                            runtimeProtoStubURL runtimeProtoSubURL
    * @param  {Message.Message}                           busPostMessage     configuration
    * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
    */
   constructor(runtimeProtoStubURL, bus, config) {
     config.idpUrl = 'domain-idp://slack.com';
     config.idpProxy = IdpProxy;
//     config.idpInfo = slackInfo;
     config.domain = 'slack.com';
     config.convertUserProfile = convertUserProfile;
     config.userInfoEndpoint = userInfoEndpoint;
     config.authorisationEndpoint = authorisationEndpoint;
     config.tokenEndpoint = tokenEndpoint;
     
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
      name: 'SlackProxyStub',
      instance: new SlackProxyStub(url, bus, config)
    };
  }
  