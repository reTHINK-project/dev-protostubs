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

class ConnectionController {
	constructor(configuration) {
		if (!configuration) throw new Error('The configuration is a needed parameter')

		this.configuration = configuration
	}

	connect() {
		if(this.userAgent)
			return this.userAgent
        
        //this.userAgent = new SIP.UA({
        //    uri: this.configuration.uri,
        //    wsServers: [ this.configuration.server ],
        //    password: this.configuration.password
        //})
        fetch('https://localhost:1337/credential/1', { method: 'GET'})
            .then(res => {
                res.json()
                    .then(user => {
                        console.log('eph', user)
                        this.userAgent = new SIP.UA({
                            uri: user.username,
                            wsServers: user.uris,
                            password: user.password
                        })
                    })
            })
	}

	invite(dataObjectObserver) {
		let sdp = transform.parse(dataObjectObserver.data.connectionDescription.sdp)
		sdp.media[0].candidates = []
		sdp.media[1].candidates = []
		dataObjectObserver.data.iceCandidates.forEach(candidate => {
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
		let options = {
			sdp: transform.write(sdp)
		}

		let context = new InviteClientContext(this.userAgent, 'sip:anton@xuaps.com', options)
		this.userAgent.afterConnected(context.invite.bind(context))
		return context;
		//console.log('invite')
		//this.userAgent.invite('sip:david.vilchez2@demo.quobis.com',
		//	{
		//		media: {
		//			constraints: {
		//				audio: true,
		//				video: true
		//			}
		//		}
		//	})
	}

	onMessage(callback) {
		// add the message callback
	}

	sendMessage(m) {

	}
}

export default ConnectionController
