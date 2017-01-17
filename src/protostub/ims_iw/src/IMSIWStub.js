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
 * Licensed under the Apache License, Version 2.0 (the "License")
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

import { Syncher } from 'service-framework/dist/Syncher'
import ConnectionController from './ConnectionController'


/**
 * ProtoStub Interface
 */
class IMSIWStub {

	/**
	 * Initialise the protocol stub including as input parameters its allocated
	 * component runtime url, the runtime BUS postMessage function to be invoked
	 * on messages received by the protocol stub and required configuration retrieved from protocolStub descriptor.
	 * @param  {URL.runtimeProtoStubURL}                   runtimeProtoStubURL runtimeProtoSubURL
	 * @param  {Message.Message}                           busPostMessage     configuration
	 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
	 */
	constructor(runtimeProtoStubURL, miniBus, configuration) {

		if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a required parameter')
		if (!miniBus) throw new Error('The bus is a required parameter')
		if (!configuration) throw new Error('The configuration is a required parameter')

		this._objectDescURL = 'hyperty-catalogue://catalogue.' + configuration.domain + '/.well-known/dataschema/Connection'
		this._runtimeProtoStubURL = runtimeProtoStubURL
		this._runtimeURL = configuration.runtimeURL
		this._connection = new ConnectionController(configuration)
		this._bus = miniBus
		this._syncher = new Syncher(runtimeProtoStubURL, miniBus, configuration)

		let that = this
		this._syncher.onNotification((event) => {
			event.ack(200)
			console.log('notification', event)

			if(event.type === 'create') {
				console.log('descriptor', that._objectDescURL)
				that._syncher.subscribe(that._objectDescURL, event.url)
					.then(dataObjectObserver => {
						console.log('subscribeaaa', dataObjectObserver)
						let context = that._connection.invite(dataObjectObserver)
						context.on('fail', (e) => console.log('fail', e))
						context.on('accepted', (e) => {
							console.log('accepted', e)
							let dataObject = {
								name : 'Connection',
								status : '',
								owner : event.url,
								connectionDescription : {},
								iceCandidates : []
							}
							that._syncher.create(that._objectDescURL, [event.from], dataObject).then((objReporter) => {
								objReporter.onSubscription(function(event) {
									console.info('-------- Receiver received subscription request --------- \n');
									event.accept(); // all subscription requested are accepted
								});
								objReporter.data.connectionDescription = e.body
							})
						})
						context.on('rejected', (e) => console.log('rejected', e))
					})
			}
			//case 'delete':
			//  // TODO: question regarding code in Connector: --> there it deletes all controllers --> why?
			//  console.log("+[P2PRequesterStub] deleting connection handler for " + event.from)

			//  //disconnect(); or clean dataobject
			//  break;

			//default:
		})
		this.connect()
	}

	/**
	 * Try to open the connection. Connection is auto managed, there is no need to call this explicitly.
	 * However, if "disconnect()" is called, it's necessary to call this to enable connections again.
	 * A status message is sent to "runtimeProtoStubURL/status", containing the value "connected" if successful, or "disconnected" if some error occurs.
	 */
	connect() {
		this._connection.connect()
	}

	/**
	 * It will disconnect and order to stay disconnected. Reconnection tries, will not be attempted, unless "connect()" is called.
	 * A status message is sent to "runtimeProtoStubURL/status" with value "disconnected".
	 */
	disconnect() {

	}
}

export default function activate(url, bus, config) {
	return {
		name: 'IMSIWStub',
		instance: new IMSIWStub(url, bus, config)
	}
}
