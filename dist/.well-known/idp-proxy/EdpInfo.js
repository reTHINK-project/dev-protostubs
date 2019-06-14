"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var redirectURI, edpInfo;

  function authEndpoint(client_id) {
    return edpInfo.authorisationEndpoint + 'client_id=' + client_id + '&redirect_uri=' + redirectURI;
  }

  function revokeEndpoint(client_id) {
    return edpInfo.revokeEndpoint + 'client_id=' + client_id;
  }

  function accessTokenInput(info) {
    return {
      info: info
    };
  }

  function accessTokenErrorMsg(isValid, consent) {
    return isValid ? edpInfo.consentErroMsg : edpInfo.invalidCPEErroMsg;
  }

  _export({
    authEndpoint: authEndpoint,
    revokeEndpoint: revokeEndpoint,
    accessTokenInput: accessTokenInput,
    accessTokenErrorMsg: accessTokenErrorMsg
  });

  return {
    setters: [],
    execute: function () {
      redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');

      _export("edpInfo", edpInfo = {
        //  "authorisationEndpoint":  "https://online.edpdistribuicao.pt/sharing-cities/login?",
        //  "revokeEndpoint": "https://online.edpdistribuicao.pt/sharing-cities/revoke?",
        "authorisationEndpoint": "https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/login?",
        "revokeEndpoint": "https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/revoke?",
        "domain": "edpdistribuicao.pt",
        "invalidCPEErroMsg": "Lamentamos mas o CPE indicado não está localizado no Concelho de Lisboa",
        "consentErroMsg": "Não deu consentimento para disponibilizar os seus dados de consumo de energia eléctrica"
      });

      ;
      ;
      ;
      ;
    }
  };
});