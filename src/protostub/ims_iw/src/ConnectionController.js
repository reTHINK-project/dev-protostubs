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
import InviteClientContext from './InviteClientContext'
import InviteServerContext from './InviteServerContext'
import { addCandidatesToSDP } from './SIPUtils'

class ConnectionController {
	constructor(configuration, onCall, onDisconnect) {
		if (!configuration) throw new Error('The configuration is a needed parameter')

        SIP.WebRTC.isSupported = ()=>true;
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
							if(this.context)
								return

							context.on('bye', () => {
								delete this.context
								this.onDisconnect()
							})
							context.on('failed', console.log)
							context.on('rejected', console.log)
							this.context = context
							this.onCall(context.request.to.friendlyName, context.body)
						})
						resolve()
					})
			}).catch(reject)
		})
	}

	accept(dataObjectObserver) {
		this.context.accept({
			sdp: addCandidatesToSDP(dataObjectObserver.data.connectionDescription.sdp,
                         dataObjectObserver.data.iceCandidates)
		})
	}

	invite(to, dataObjectObserver) {
		let options = {
			sdp: addCandidatesToSDP(dataObjectObserver.data.connectionDescription.sdp,
                         dataObjectObserver.data.iceCandidates)
		}

		return new Promise((resolve, reject) => {
			if(this.context)
				reject(new Error('Previous context', this.context))

			let context = new InviteClientContext(this.userAgent, to.replace('//', ''), options)
			this.userAgent.afterConnected(context.invite.bind(context))
			context.on('bye', () => {
				delete this.context
				this.onDisconnect()
			})
			context.on('accepted', resolve)
			context.on('failed', reject)
			context.on('rejected', reject)

			this.context = context
		})
	}

	disconnect() {
		console.log('disconnecting from ims')
		if (this.context && !this.context.endTime){
			this.context.bye()
			delete this.context
		}
	}
}

export default ConnectionController
