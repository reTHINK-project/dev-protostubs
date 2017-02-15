import transform from 'sdp-transform'

export function addCandidatesToSDP(txtSdp, candidates){
	let sdp = transform.parse(txtSdp)
	sdp.media[0].candidates = []
	if(sdp.media.length>1)
		sdp.media[1].candidates = []
	candidates.forEach(candidate => {
		let parts = candidate.candidate.substring(10).split(' ')
		let c = {
			foundation: parts[0],
			component: parts[1],
			transport: parts[2].toLowerCase(),
			priority: parts[3],
			ip: parts[4],
			port: parts[5],
			type: parts[7],
			generation: '0'
		}
		for (var i = 8; i < parts.length; i += 2) {
			if (parts[i] === 'raddr') {
				c.raddr = parts[i + 1]
			} else if (parts[i] === 'rport') {
				c.rport = parts[i + 1]
			} else if (parts[i] === 'generation') {
				c.generation = parts[i + 1]
			} else if (parts[i] === 'tcptype') {
				c.tcptype = parts[i + 1]
			} else if (parts[i] === 'network-id') {
				c['network-id'] = parts[i + 1]
			} else if (parts[i] === 'network-cost') {
				c['network-cost'] = parts[i + 1]
			}
		}
		sdp.media.filter(m=>m.type === candidate.sdpMid)[0].candidates.push(c)
	})

	return transform.write(sdp)
}
