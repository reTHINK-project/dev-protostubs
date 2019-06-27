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

//import { Syncher } from 'service-framework/dist/Syncher'
//import { Discovery } from 'service-framework/dist/Discovery'
import ConnectionController from './ConnectionController.js'
//import MessageBodyIdentity from 'service-framework/dist/IdentityFactory'


class Connection {
    constructor(dataObjectUrl) {
        this.name = 'Connection'
        this.status = ''
        this.owner = dataObjectUrl
        this.connectionDescription = {}
        this.iceCandidates = []
    }
}

/**
 * ProtoStub Interface
 */
export default class IMSIWProtoStub {

	/**
	 * Initialise the protocol stub including as input parameters its allocated
	 * component runtime url, the runtime BUS postMessage function to be invoked
	 * on messages received by the protocol stub and required configuration retrieved from protocolStub descriptor.
	 * @param  {URL.runtimeProtoStubURL}                   runtimeProtoStubURL runtimeProtoSubURL
	 * @param  {Message.Message}                           busPostMessage     configuration
	 * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
	 */
	constructor() {}

	_start(runtimeProtoStubURL, miniBus, configuration, factory) {

		if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a required parameter')
		if (!miniBus) throw new Error('The bus is a required parameter')
		if (!configuration) throw new Error('The configuration is a required parameter')
		if (!configuration.domain) throw new Error('The domain is a required parameter')

		this._runtimeProtoStubURL = runtimeProtoStubURL
		this._discovery = factory.createDiscovery(runtimeProtoStubURL, miniBus)
		this.schema = `hyperty-catalogue://catalogue.${configuration.domain}/.well-known/dataschema/Connection`
		this._connection = new ConnectionController(configuration,
				(to, offer) =>{
					this._returnSDP(offer, this._runtimeProtoStubURL, this.schema, this.source, 'offer')
				},
				()=> {
					this.dataObjectObserver.delete()
					this.dataObjectReporter.delete()
				})
		this._bus = miniBus
		this._syncher = factory.createSyncher(this._runtimeProtoStubURL, miniBus, configuration)

        miniBus.addListener('*', (msg) => {
            console.log('NEW MSG ->', msg)
				switch (msg.type) {
				  case 'create':
					if(this._filter(msg) && msg.body.schema) {
            console.log('subscribe: ', msg.body.schema)
						this._subscribe(msg)
					}
					break
				  case 'init':
					this._identity = factory.createMessageBodyIdentity('anton',
							'sip://rethink-project.eu/anton@rethink-project.eu',
							'',
							'anton',
							'',
							'rethink-project.eu')
					console.log('myidentity', this._identity)
					this._connection.connect(msg.body.identity.access_token)
					this.source = msg.body.source
					break
				  case 'delete':
					this._connection.disconnect()
					break
				}
        })
  this._sendStatus('created');
	}

  _sendStatus(value, reason) {
    let _this = this;

    console.log('[IMSIWProtostub status changed] to ', value);

    _this._state = value;

    let msg = {
      type: 'update',
      from: _this._runtimeProtoStubURL,
      to: _this._runtimeProtoStubURL + '/status',
      body: {
        value: value
      }
    };

    if (reason) {
      msg.body.desc = reason;
    }

    _this._bus.postMessage(msg);
  }

    _subscribe(msg) {
				let dataObjectUrl = msg.from.substring(0, msg.from.lastIndexOf('/'))
				
				let input = {
					schema: this.schema,
					resource: dataObjectUrl
				};

        this._syncher.subscribe(input)
			.then(dataObjectObserver => {
				this.dataObjectObserver = dataObjectObserver
        console.log('dataObjectObserver:' , dataObjectObserver);
				// dataObjectObserver.onChange('*', (event) => this._onCall(dataObjectObserver, dataObjectUrl, this.schema, msg))
				return dataObjectObserver
			}).then(dataObjectObserver => this._onCall(dataObjectObserver, dataObjectUrl, this.schema, msg))
    }

    _onCall(dataObjectObserver, dataObjectUrl, schema, msg) {
        console.log('_onCall', dataObjectObserver)
		if(dataObjectObserver.data.connectionDescription) {
			if(dataObjectObserver.data.connectionDescription.type === 'offer') {
				console.log('_onCallUpdate offer')
				this._connection.connect(msg.body.identity.access_token)
					.then(() => {
						console.log('sad', msg)
						this._connection.invite(msg.to, dataObjectObserver)
							.then((e) => this._returnSDP(e.body, dataObjectUrl, schema, msg.body.source, 'answer'))
							.catch((e) => { console.error('fail', e); this.dataObjectObserver.delete() })
					})
			} else if(dataObjectObserver.data.connectionDescription.type === 'answer') {
				console.log('_onCallUpdate offer')
				this._connection.accept(dataObjectObserver)
			}
		}
    }

    _returnSDP(offer, dataObjectUrl, schema, source, type) {
        console.log('offer received', offer)
        let dataObject = new Connection(dataObjectUrl)

        let input = Object.assign({resources: ['audio']}, {} );

        this._syncher.create(schema, [source], dataObject, false, false, '', this._identity, input).then((objReporter) => {
			this.dataObjectReporter = objReporter
            objReporter.onSubscription(function(event) {
                console.info('-------- Receiver received subscription request --------- \n')
                event.accept()
            });
            objReporter.data.connectionDescription = { type: type, sdp: offer }
        }).catch(function(error) {
          console.error(error);
        })
    }

    _filter(msg) {
        if (msg.body && msg.body.via === this._runtimeProtoStubURL)
            return false;
        return true;
    }
}

/*export default function activate(url, bus, config, factory) {
	return {
		name: 'IMSIWProtoStub',
		instance: new IMSIWProtoStub(url, bus, config, factory)
	}
}
*/