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
class IMSIWProtoStub {

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

		this._runtimeProtoStubURL = runtimeProtoStubURL
		this._connection = new ConnectionController(configuration)
		this._bus = miniBus
		this._syncher = new Syncher(this._runtimeProtoStubURL, miniBus, configuration)

        miniBus.addListener('*', (msg) => { 
            console.log('NEW MSG ->', msg)
            if(msg.body.identity && this._filter(msg) && msg.body.value.schema) {
                this._subscribe(msg)
            }
        })
	}

    _subscribe(msg) {
        let schema = msg.body.value.schema
        let dataObjectUrl = msg.from.substring(0, msg.from.lastIndexOf('/'))

        this._syncher.subscribe(schema, dataObjectUrl)
            .then(dataObjectObserver => this._onCall(dataObjectObserver, dataObjectUrl, schema, msg))
    }

    _onCall(dataObjectObserver, dataObjectUrl, schema, msg) {
        console.log('call', dataObjectObserver)
        this._connection.connect(msg.body.identity)
            .then(() => {
                let context = this._connection.invite(msg.to, dataObjectObserver)
                context.on('accepted', (e) => this._returnSDP(e, dataObjectUrl, schema, msg))
                context.on('fail', (e) => console.log('fail', e))
                context.on('rejected', (e) => console.log('rejected', e))
            })
    }

    _returnSDP(e, dataObjectUrl, schema, msg) {
        let dataObject = new Connection(dataObjectUrl)

        this._syncher.create(schema, [msg.body.source], dataObject).then((objReporter) => {
            objReporter.onSubscription(function(event) {
                console.info('-------- Receiver received subscription request --------- \n')
                event.accept()
            });
            objReporter.data.connectionDescription = { type: 'answer', sdp: e.body }
        })
    }

    _filter(msg) {
        if (msg.body && msg.body.via === this._runtimeProtoStubURL)
            return false;
        return true;
    }
}

export default function activate(url, bus, config) {
	return {
		name: 'IMSIWProtoStub',
		instance: new IMSIWProtoStub(url, bus, config)
	}
}
