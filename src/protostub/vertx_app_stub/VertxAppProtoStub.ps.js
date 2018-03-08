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
import EventBus from 'vertx3-eventbus-client';
import {ContextReporter} from 'service-framework/dist/ContextManager';
import {Syncher} from 'service-framework/dist/Syncher';
import MessageBodyIdentity from 'service-framework/dist/IdentityFactory';

class VertxAppProtoStub {
  /**
   * Vertx ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {VertxAppProtoStub}
   */
  constructor(runtimeProtoStubURL, bus, config) {
    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
    if (!bus) throw new Error('The bus is a needed parameter');
    if (!config) throw new Error('The config is a needed parameter');

    if (!config.url) throw new Error('The config.url is a needed parameter');
    if (!config.runtimeURL) throw new Error('The config.runtimeURL is a needed parameter');

    let _this = this;
    this._alreadySubscribe = false;
    console.log("[VertxAppProtoStub] VERTX APP PROTOSTUB", _this);
    this._id = 0;
    this._continuousOpen = true;

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;
    this._streams = config.streams;

    this._runtimeSessionURL = config.runtimeURL;
    this._reOpen = false;
    this._syncher = new Syncher(runtimeProtoStubURL, bus, config);
    this._contextReporter = new ContextReporter(runtimeProtoStubURL, bus, config, this._syncher);
    console.log('[VertxAppProtoStub] this._contextReporter', this._contextReporter);


    this._eb = new EventBus(config.url, {"vertxbus_ping_interval": config.vertxbus_ping_interval});
    console.log('[VertxAppProtoStub] Eventbus', _this._eb);

    _this._sendStatus('created');



    _this._latitude = 0;
    _this._longitude = 0;
    _this._timestamp = 0;
    _this._data;



    //Listener to accept subscribe request of ContextReporters
    bus.addListener('domain://msg-node.sharing-cities-dsm/sm', (msg) => {
      console.log('[VertxAppProtoStub] Message on (domain://msg-node.sharing-cities-ds/sm) : ', msg);
      let msgResponse = {
        id: msg.id,
        type: 'response',
        from: msg.to,
        to: msg.from,
        body: {
          code: 200
        }
      };
      _this._bus.postMessage(msgResponse);

    });


    /*bus.addListener('school://vertx-app/announcement', (msg) => {
      console.log('[VertxAppProtoStub] Message on (school://vertx-app/announcement)', msg, _this._eb.state);
      if (_this._eb.state === 1) {
        _this._eb.publish('school://vertx-app/announcements', JSON.stringify(msg.body));
      }
    });*/

    _this._eventBusUsage();
    //_this._setUpContextReporter();

    //_this._configAvailableStreams();

  }

  _configAvailableStreams() {
    let _this = this;
    console.log('[VertxAppProtoStub] Streams', _this._streams);
    let done = false;
    while (! done) {
      if (WebSocket.OPEN === _this._eb.sockJSConn.readyState) {
        console.log('[VertxAppProtoStub] EB on readyState(OPEN)');
        done = true;

        _this._streams.forEach(function(stream) {
          console.log('[VertxAppProtoStub] Stream', stream, _this._eb.sockJSConn.readyState);
          let msg = { type: 'read' };

          _this._eb.send(stream.stream, msg, function (reply_err, reply) {
            if (reply_err == null) {
              console.log("[VertxAppProtoStub] Received reply ", reply.body);
              _this._setUpContextReporter(reply.body.identity, reply.body.data, stream.resources, stream.name, stream.stream).then(function(result) {
                if (result) {

                  _this._eb.registerHandler(stream.stream, function(error, message) {
                    console.log('[VertxAppProtoStub] received a message: ' + JSON.stringify(message));
                    _this._contextReporter.setContext('testIntegration@vetxapp.com', message.body.values);
                  });

                }
              });

            } else {
              console.log("[VertxAppProtoStub] No reply", reply_err);
            }
          });
        });

      } else {
        console.log('[VertxAppProtoStub] Waiting for readyState');
        _this._sleep(2000);
      }
    }






  }

  _sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  _setUpContextReporter(identity, data, resources, name, reuseURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._contextReporter.create(identity, data, resources, identity, identity, reuseURL).then(function(context) {
        console.log('[VertxAppProtoStub] CONTEXT RETURNED', context);
        context.onSubscription(function(event) {
          event.accept();
          console.log('[VertxAppProtoStub] new subs', event);
        });
        resolve(true);

      }).catch(function(err) {
        console.error('[VertxAppProtoStub] err', err);
        resolve(false);
      });
    });
  }

  _eventBusUsage() {
    let _this = this;
    console.log('[VertxAppProtoStub] waiting for eb Open');
    _this._eb.onopen = () => {
      console.log('[VertxAppProtoStub] _this._eb-> open');
      _this._configAvailableStreams();






/*
      _this._eb.registerHandler('school://vertx-app/stream', function(error, message) {
        console.log('[VertxAppProtoStub] received a message: ' + JSON.stringify(message));

        let objUpdated = _this._createNewObj(JSON.stringify(message.body));
        _this._contextReporter.setContext('testIntegration@vetxapp.com', objUpdated.values);
      });
      _this._eb.registerHandler('school://vertx-app/subscription', function(error, message) {
        console.log('[VertxAppProtoStub] received a message: (toSubscription) ' + JSON.stringify(message));

        if (!_this._alreadySubscribe) {
          _this._alreadySubscribe = true;

          let body_obj = JSON.parse(message.body);
          let context_url = body_obj.url;
          let identity_url = body_obj.identity;

          let identityToUse = new MessageBodyIdentity(
            'Vertx Location',
            identity_url,
            undefined,
            'Vertx Location',
            '', 'vertx-app', undefined, undefined);

          let schema_url = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Context';
          _this._syncher.subscribe(schema_url, context_url, true, false, true, identityToUse).then(function(obj) {
            console.log('[VertxAppProtoStub] subscribe success', obj);
            obj.onChange('*', (event) => {
              console.log('[VertxAppProtoStub] onChange :', event);
              if (event.field === 'values') {

                  _this._data = event.data;

                let lat = event.data[0].value;
                let long = event.data[1].value;

                if (_this._latitude != lat || _this._longitude != long) {
                  _this._latitude = lat;
                  _this._longitude = long;


                }
              } else if(event.field === 'time') {

                if (_this._timestamp != event.data) {
                  _this._timestamp = event.data;
                  let valuesToPublish = {
                    url : obj.url,
                    values: _this._data,
                    timestamp: _this._timestamp
                  };
                  console.log('url to publish', obj.url);
                  _this._eb.publish(obj.url, JSON.stringify(valuesToPublish));
                }
              }

            });
          }).catch(function(error) {
            console.log('[VertxAppProtoStub] error', error);
          });

        }
      });
      _this._eb.publish('school://vertx-app', "write last value");
      */
    }

    _this._eb.onerror = function(e) {
        console.log('[VertxAppProtoStub] General error: ', e); // this does happen
    }
  }

  _createNewObj(value) {
    let _this = this;

    return Object.assign({}, {
        id: '_' + Math.random().toString(36).substr(2, 9),// do we need this?
        values: [{
            value: value || 0,
            name: 'kwh',
            type: 'kwh',
            unit: 'kwh'
        }]
    });
  };

  /**
   * Get the configuration for this ProtoStub
   * @return {Object} - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   */
  get config() { return this._config; }

  get runtimeSession() { return this._runtimeSessionURL; }


  _sendStatus(value, reason) {
    let _this = this;

    console.log('[VertxAppProtoStub status changed] to ', value);

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
}

export default function activate(url, bus, config) {
  return {
    name: 'VertxAppProtoStub',
    instance: new VertxAppProtoStub(url, bus, config)
  };
}

/**
* Callback used to send messages
* @callback PostMessage
* @param {Message} msg - Message to send
*/
