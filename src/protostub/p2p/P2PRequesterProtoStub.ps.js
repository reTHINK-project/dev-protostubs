
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

//import {Syncher} from 'service-framework/dist/Syncher';
import ConnectionController from './ConnectionController.js';

// TODO: integrate the status eventing


/**
 * ProtoStub Interface
 */
export default class P2PRequesterStub {

  /**
   * Initialise the protocol stub including as input parameters its allocated
   * component runtime url, the runtime BUS postMessage function to be invoked
   * on messages received by the protocol stub and required configuration retrieved from protocolStub descriptor.
   * @param  {URL.runtimeProtoStubURL}                   runtimeProtoStubURL runtimeProtoSubURL
   * @param  {Message.Message}                           busPostMessage     configuration
   * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
   */
  constructor() {

  }

    _start(runtimeProtoStubURL, miniBus, configuration, factory) {

    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a required parameter');
    if (!miniBus) throw new Error('The bus is a required parameter');
    if (!configuration) throw new Error('The configuration is a required parameter');
    // if (!configuration.p2pHandler) throw new Error('The p2pHandler is a required attribute in the configuration parameter');

    console.log('+[P2PRequesterStub.constructor] config is: ', configuration);
    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._runtimeURL = configuration.runtimeURL;
    this._remoteRuntimeURL = configuration.remoteRuntimeURL;  // required for status events
    this._configuration = configuration;
    this._bus = miniBus;
    this._bus.addListener('*', (msg) => {

      if (msg.to === this._runtimeProtoStubURL ) {
        if (msg.type = 'execute') this._onExecute(msg.body.method, msg.body.params);
      } else this._sendChannelMsg(msg);
    });

    this._syncher = factory.createSyncher(runtimeProtoStubURL, miniBus, configuration);
    this._connectionController = new ConnectionController(this._runtimeProtoStubURL, this._syncher, this._configuration, true);
    this._connectionController.onStatusUpdate( (status, reason) => {
      this._sendStatus(status, reason);
      if (status === 'disconnected') this.disconnect(); // to ensure the ConnectionController is in the right status
    });

    this._syncher.onNotification((event) => {
      console.log('+[P2PRequesterStub] On Syncher Notification: ', event);
      event.ack(200);

      switch (event.type) {

        case 'create':
          // incoming observe invitation from peer
          if ( this._connectionController ) {
            this._connectionController.observe( event ).then( () => {
              console.log("+[P2PRequesterStub] observer created ");
            });
          }
          break;

        case 'delete':
          // TODO: question regarding code in Connector: --> there it deletes all controllers --> why?
          console.log("+[P2PRequesterStub] deleting connection handler for " + event.from)

          disconnect();
          break;

        default:
      }
    });

    this._sendStatus("create");

    // the target handler stub url must be present in the configuration as "p2pHandler" attribute
    if ( this._configuration.p2pHandler )
      this.connect( this._configuration.p2pHandler );
  }

  _onExecute(method, params) {
    let _this = this;

    console.log('[P2PRequesterStub._onExecute] request to execute: ', method, ' with parms ', params);

    if (method === 'connect') _this.connect(params[0]);

  }

  connect(handlerURL) {
    this._connectionController.report( handlerURL, this._runtimeURL ).then( () => {
      // send "in-progress" event, if the syncher.create was done
      this._sendStatus("in-progress");
      this._connectionController.onMessage( (m) => {
        console.log("+[P2PRequesterStub] onMessage: ", m);
        this._deliver(m);
      });
      console.log("+[P2PRequesterStub] setup reporter object successfully");
    });
  }

  /**
   * To disconnect the protocol stub.
   */
  disconnect() {
    if ( this._connectionController ) {
      this._connectionController.cleanup();
//      this._connectionController = null;
    }
  }


  _sendChannelMsg(msg) {
    if ( this._filter(msg) ) {
      if ( this._connectionController ) {
        this._connectionController.sendMessage(msg);
      }
    }
  }

  _sendStatus(value, reason) {
    let msg = {
      type: 'update',
      from: this._runtimeProtoStubURL,
      to: this._runtimeProtoStubURL + '/status',
      body: {
        value: value,
        resource: this._remoteRuntimeURL
      }
    };
    if (reason) {
      msg.body.desc = reason;
    }
    this._bus.postMessage(msg);
    console.log("+[P2PrequesterStub] sending status update: ", msg);
  }

  /**
   * Filter method that should be used for every messages in direction: Protostub -> MessageNode
   * @param  {Message} msg Original message from the MessageBus
   * @return {boolean} true if it's to be deliver in the MessageNode
   */
  _filter(msg) {
    if (msg.body && msg.body.via === this._runtimeProtoStubURL)
      return false;
    return true;
  }

  /**
   * Method that should be used to deliver the message in direction: Protostub -> MessageBus (core)
   * @param  {Message} msg Original message from the MessageNode
   */
  _deliver(msg) {
    console.log("+[P2PrequesterStub] posting message to msg bus: ", msg);

    //let message = JSON.parse(msg.data);

    if (!msg.body) msg.body = {};

    msg.body.via = this._runtimeProtoStubURL;
    this._bus.postMessage(msg);
  }

}

/*export default function activate(url, bus, config, factory) {
  return {
    name: 'P2PRequesterStub',
    instance: new P2PRequesterStub(url, bus, config, factory)
  };
}*/
