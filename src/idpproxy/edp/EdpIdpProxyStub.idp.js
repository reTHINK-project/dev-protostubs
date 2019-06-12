import { IdpProxy } from "./IdpProxy"
import { edpInfo, authEndpoint, accessTokenInput, accessTokenErrorMsg, revokeEndpoint } from "./EdpInfo"
import AbstractIdpProxyProtoStub from "../AbstractIdpProxyStub"

const idpProxyDescriptor = {
  "name": "EdpIdpProxyProtoStub",
  "language": "javascript",
  "description": "IDPProxy for EDP Distribuição IDP",
  "signature": "",
  "configuration": {},
  "constraints": {
    "browser": true
  },
  "interworking": true,
  "objectName": "edpdistribuicao.pt"
}

/**
* Google Identity Provider Proxy Protocol Stub
*/
class EdpIdpProxyProtoStub extends AbstractIdpProxyProtoStub {

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
    config.domain = 'edpdistribuicao.pt';
    config.idpUrl = 'domain-idp://edpdistribuicao.pt';
    config.idpProxy = IdpProxy;
    config.idpInfo = edpInfo;
    config.apiInfo = edpInfo;
    config.authEndpoint = authEndpoint;
    config.accessTokenInput = accessTokenInput;
    config.accessTokenEndpoint = authEndpoint;
    config.accessTokenErrorMsg = accessTokenErrorMsg;
    super._init(runtimeProtoStubURL, bus, config);
  }
  get descriptor() {
    return idpProxyDescriptor;
  }

  get name() {
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
export default EdpIdpProxyProtoStub;
/*
export default function activate(url, bus, config) {
  return {
    name: 'EdpIdpProxyProtoStub',
    instance: new EdpIdpProxyProtoStub(url, bus, config)
  };
}*/
