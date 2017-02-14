/**
 * Copyright 2016 PT Inovação e Sistemas SA
 * Copyright 2016 INESC-ID
 * Copyright 2016 QUOBIS NETWORKS SL
 * Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
 * Copyright 2016 ORANGE SA
 * Copyright 2016 Deutsche Telekom AG
 * Copyright 2016 Apizee
 * Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import SIP from 'sip.js'
import transform from 'sdp-transform'
import InviteClientContext from './InviteClientContext'
import InviteServerContext from './InviteServerContext'

let addCandidatesToSDP = (txtSdp, candidates) => {
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

class ConnectionController {
	constructor(configuration, onCall, onDisconnect) {
		if (!configuration) throw new Error('The configuration is a needed parameter')

		SIP.InviteServerContext = InviteServerContext
		this.configuration = configuration
		this.onDisconnect = onDisconnect
		this.onCall = onCall
	}

	connect(accessToken) {
        return new Promise((resolve, reject) => {
            if(this.userAgent)
                return resolve()

            fetch(this.configuration.credential_server, { method: 'GET', headers: { 'Authorization': `Bearer: ${accessToken}`}})
                .then(res => {
                    res.json()
                        .then(user => {
                            this.userAgent = new SIP.UA({
                                uri: user.username,
                                wsServers: user.uris,
                                password: user.password
                            })
							this.userAgent.on('invite', context => {
								console.log('onCall', context)
								this.onCall(context.request.to.friendlyName, context.body)
								this.context = context
							})
                            resolve()
                        })
                })
        })
	}

	accept(dataObjectObserver) {
		this.context.accept({sdp: addCandidatesToSDP(dataObjectObserver.data.connectionDescription.sdp,
                         dataObjectObserver.data.iceCandidates)})
	}

	disconnect() {
		this.context.bye()
	}

	invite(to, dataObjectObserver) {
		let options = {
			sdp: addCandidatesToSDP(dataObjectObserver.data.connectionDescription.sdp,
                         dataObjectObserver.data.iceCandidates)
		}

		return new Promise((resolve, reject) => {
			let context = new InviteClientContext(this.userAgent, to.replace('//', ''), options)
			this.userAgent.afterConnected(context.invite.bind(context))
			context.on('bye', this.onDisconnect)
			context.on('accepted', resolve)
			context.on('failed', reject)
			context.on('rejected', reject)

			//TODO: concurrent call problem
			this.context = context
		})
	}
}

export default ConnectionController
