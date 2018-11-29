
let redirectURI = location.protocol + '//' + location.hostname + (location.port !== '' ? ':' + location.port : '');

export let edpInfo = {
//  "authorisationEndpoint":  "https://online.edpdistribuicao.pt/sharing-cities/login?",
//  "revokeEndpoint": "https://online.edpdistribuicao.pt/sharing-cities/revoke?",
  "authorisationEndpoint":  "https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/login?",
  "revokeEndpoint": "https://fe-dot-online-dist-edp-pre.appspot.com/sharing-cities/revoke?",
  "domain": "edpdistribuicao.pt"
};

export function authEndpoint(client_id) {

  return edpInfo.authorisationEndpoint
    + 'client_id=' + client_id
    + '&redirect_uri=' + redirectURI;
};

export function revokeEndpoint(client_id) {

  return edpInfo.revokeEndpoint
  + 'client_id=' + client_id;
};

export function accessTokenInput(info) {

  return {info};
};




