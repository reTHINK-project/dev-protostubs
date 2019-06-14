"use strict";

System.register(["sdp-transform"], function (_export, _context) {
  "use strict";

  var transform;

  function addCandidatesToSDP(txtSdp, candidates) {
    var sdp = transform.parse(txtSdp);
    sdp.media[0].candidates = [];
    if (sdp.media.length > 1) sdp.media[1].candidates = [];
    candidates.forEach(function (candidate) {
      var parts = candidate.candidate.substring(10).split(' ');
      var c = {
        foundation: parts[0],
        component: parts[1],
        transport: parts[2].toLowerCase(),
        priority: parts[3],
        ip: parts[4],
        port: parts[5],
        type: parts[7],
        generation: '0'
      };

      for (var i = 8; i < parts.length; i += 2) {
        if (parts[i] === 'raddr') {
          c.raddr = parts[i + 1];
        } else if (parts[i] === 'rport') {
          c.rport = parts[i + 1];
        } else if (parts[i] === 'generation') {
          c.generation = parts[i + 1];
        } else if (parts[i] === 'tcptype') {
          c.tcptype = parts[i + 1];
        } else if (parts[i] === 'network-id') {
          c['network-id'] = parts[i + 1];
        } else if (parts[i] === 'network-cost') {
          c['network-cost'] = parts[i + 1];
        }
      }

      sdp.media.filter(function (m) {
        return m.type === candidate.sdpMid;
      })[0].candidates.push(c);
    });
    return transform.write(sdp);
  }

  _export("addCandidatesToSDP", addCandidatesToSDP);

  return {
    setters: [function (_sdpTransform) {
      transform = _sdpTransform.default;
    }],
    execute: function () {}
  };
});