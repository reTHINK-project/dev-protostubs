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
    console.log("[VertxAppProtoStub] VERTX APP PROTOSTUB", _this);
    this._id = 0;

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;
    this._streams = config.streams;

    this._runtimeSessionURL = config.runtimeURL;
    this._syncher = new Syncher(runtimeProtoStubURL, bus, config);
    this._contextReporter = new ContextReporter(runtimeProtoStubURL, bus, config, this._syncher);
    console.log('[VertxAppProtoStub] this._contextReporter', this._contextReporter);
    this._eb = null;




    _this._sendStatus('created');

    // used to save data of each observer saving data and timestamp to publish to vertx
    _this._dataObservers = {};

    //used to save identity of each stream url
    _this._dataStreamIdentity = {};

    //used to save data of each stream url
    _this._dataStreamData = {};

    //used to save hypertyWallet of each AddressWallet
    _this._hypertyWalletAddress = {};

    //used to save contextUrl of vertxRemote Stream
    _this._contextUrlToRemoveStream = {};



    //Listener to accept subscribe request of ContextReporters
    bus.addListener('domain://msg-node.sharing-cities-dsm/sm', (msg) => {
      console.log('[VertxAppProtoStub] Message on (domain://msg-node.sharing-cities-dsm/sm) : ', msg);
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


    bus.addListener('*', (msg) => {
      console.log('[VertxAppProtoStub] Message ', msg, _this._eb, JSON.stringify(_this._dataStreamIdentity));
      if (_this._eb === null) {
        _this._eb = new EventBus(config.url, {"vertxbus_ping_interval": config.vertxbus_ping_interval});
        console.log('[VertxAppProtoStub] Eventbus', _this._eb);
        _this._eventBusUsage().then(function(result){
          console.log('[VertxAppProtoStub] Message _eventBusUsage', result);
          if(result) {
            _this._handleNewMessage(msg);
          }
        });
      } else {
        _this._handleNewMessage(msg);
      }
    });
  }

  _handleNewMessage(msg) {

    let _this = this;
    if (msg.body.hasOwnProperty('type')) {

      debugger;
      // To Handle Message read type to get for example shops List
      if (msg.body.type === 'read') {

        console.log('[VertxAppProtoStub]  New Read Message', msg.body.type);
        let responseMsg = {
          from: msg.to,
          to: msg.from,
          id: msg.id,
          type: 'response'
        };
        responseMsg.body = {};
        responseMsg.body.value =  _this._dataStreamData[msg.to];
        responseMsg.body.code = 200;
        _this._bus.postMessage(responseMsg);
      }

      /*
      if (msg.type === 'forward' && msg.body.type === 'create') {

        let hypertyURL = msg.from;
        msg.type = msg.body.type;
        msg.from = hypertyURL;
        msg.to = msg.body.to;

        if (msg.body.hasOwnProperty('data')) {
          msg.latitude = msg.body.data.latitude;
          msg.longitude = msg.body.data.longitude;
          msg.shopID = msg.body.data.shopID;
          msg.userID = msg.body.data.userID;
        }
        delete msg.body;



        _this._eb.send(msg.to, msg, function (reply_err, reply) {
          if (reply_err == null) {
            console.log("[VertxAppProtoStub] Received reply ", reply, '   from msg', msg);

            let responseMsg = {
              id: msg.id,
              type: 'response',
              from : msg.to,
              to : hypertyURL,
              body : reply.body
            };
            console.log('send reply', responseMsg);

            //
            if (msg.to.includes('/subscription') && reply.body.body.code == 200 ) {

              let addressChanges = msg.address + '/changes';
              _this._hypertyWalletAddress[addressChanges] = msg.from;

              console.log('[VertxAppProtoStub] waiting for changes on', addressChanges);
              _this._eb.registerHandler(addressChanges, function(error, message) {
                console.log('[VertxAppProtoStub] received a message on Changes Handler: ' + JSON.stringify(message), message, _this._hypertyWalletAddress);
                //enviar para o _this._hypertyWalletAddress[message.address] a message
                let changeMessage = message.body;
                changeMessage.to = _this._hypertyWalletAddress[message.address];
                changeMessage.from = message.address;

                _this._bus.postMessage(changeMessage);

              });
            }


            _this._bus.postMessage(responseMsg);
          } else {
            console.log("[VertxAppProtoStub] No reply", reply_err);
          }
        });
      } else if (msg.body.type === 'read') {

        console.log('[VertxAppProtoStub]  New Read Message', msg.body.type);
        let responseMsg = {
          from: msg.to,
          to: msg.from,
          id: msg.id,
          type: 'response'
        };
        responseMsg.body = {};
        responseMsg.body.value =  _this._dataStreamData[msg.to];
        responseMsg.body.code = 200;
        _this._bus.postMessage(responseMsg);
      }*/
    } else {


      if(msg.type === 'create' && msg.from.includes('/subscription')) {
        console.log('[VertxAppProtoStub] TO INVITE MSG', msg);
        //debugger;
        _this._eb.registerHandler(msg.from, function(error, messageFROMsubscription) {

          console.log('[VertxAppProtoStub] subscription message: ', messageFROMsubscription);
          let messageToSubscribe = messageFROMsubscription.body;
          if (messageToSubscribe.to.includes('/subscription')) {
            let schema_url = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Context';
            let contextUrl = messageToSubscribe.to.split("/subscription")[0];

            _this._setUpObserver(messageToSubscribe.body.identity, contextUrl, schema_url).then(function(result) {
              if (result) {
                let response = { body: { code : 200 }};
                messageFROMsubscription.reply(response);
              } else {
                let response = { body: { code : 406 }};
                messageFROMsubscription.reply(response);
              }
            });
          }




        });

        let inviteMessage = {
          type: 'create',
          from: msg.from,
          to: msg.to,
          identity: { userProfile: { userURL: msg.body.identity.userProfile.userURL }}
        }
        //Invite Vertx Stream...
        _this._eb.publish(msg.to, inviteMessage);
        /*_this._eb.publish(msg.to, inviteMessage, function (reply_err, reply) {
          if (reply_err == null) {
            console.log("[VertxAppProtoStub] Received reply Invitation ", reply, '   from msg', inviteMessage);
            if (reply.body.body.code == 200) {
              let contextUrl = msg.body.value.url;
              let schema_url = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Context';
              let name = msg.body.value.name;
              let toAddIdentity = { userProfile: {userURL: msg.body.identity.userProfile.userURL }};
              _this._contextUrlToRemoveStream[contextUrl] = msg.to;
              _this._dataStreamIdentity[contextUrl] = toAddIdentity;
              _this._setUpObserver(name, contextUrl, schema_url);
            }
          }
        });*/

      }
    }


  }

  _configAvailableStreams() {
    let _this = this;
    return new Promise(function(resolve) {
      console.log('[VertxAppProtoStub] EB on readyState(OPEN) Streams', _this._streams);
      let count = 0;
      _this._streams.forEach(function(stream) {
        console.log('[VertxAppProtoStub] Stream', stream, _this._eb.sockJSConn.readyState);
        let msg = { type: 'read' };

        _this._eb.send(stream.stream, msg, function (reply_err, reply) {
          if (reply_err == null) {
            count++;
            console.log("[VertxAppProtoStub] Received reply ", reply.body);

            _this._dataStreamIdentity[stream.stream] = reply.body.identity;
            _this._dataStreamData[stream.stream] = reply.body.data;

            if (count == _this._streams.length) {
              resolve();
            }

            let reuseURL = _this._formCtxUrl(stream);
            _this._setUpContextReporter(reply.body.identity.userProfile.userURL, reply.body.data, stream.resources, stream.name, reuseURL).then(function(result) {
              if (result) {

                _this._eb.registerHandler(reuseURL, function(error, message) {
                  console.log('[VertxAppProtoStub] received a message: ' + JSON.stringify(message));
                  //TODO Check if message.body.values is compatible to just setContext Like that
                  _this._contextReporter.setContext(reply.body.identity.userProfile.userURL, message.body.values);
                });
              }
            });
          } else {
            console.log("[VertxAppProtoStub] No reply", reply_err);
          }
        });
      });

    });

  }

  _sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  _formCtxUrl(stream) {
    let _this = this;
    let ID = _this._config.runtimeURL.split('/')[3];
    return 'context://' + _this._config.host + '/' + ID + '/' + stream.id;
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

  //let schema_url = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Context';
  _setUpObserver(identityToUse, contextUrl, schemaUrl) {
    let _this = this;
    //MessageBodyIdentity Constructor
    return new Promise(function(resolve) {
      _this._syncher.subscribe(schemaUrl, contextUrl, true, false, true, identityToUse).then(function(obj) {
        console.log('[VertxAppProtoStub] subscribe success', obj);
        resolve(true);
        obj.onChange('*', (event) => {
          console.log('[VertxAppProtoStub] onChange :', event);
          //debugger;
          let changesAddress = obj.url + "/changes";
          _this._eb.send(changesAddress, event.data, function (reply_err, reply) {
            if (reply_err == null) {
              console.log("[VertxAppProtoStub] Received reply from change ", reply);

            }
          });
          /*
          if (event.field == 'values') {
            let filter_checkin = event.data.filter(function( obj ) { return obj.name == "checkin"; });

            if (filter_checkin.length == 1) {

              let shopID = filter_checkin[0].value;
              let latitude = event.data.filter(function( obj ) { return obj.name == "latitude"; })[0].value;
              let longitude = event.data.filter(function( obj ) { return obj.name == "longitude"; })[0].value;
              let checkInMessage = {
                from: _this._runtimeProtoStubURL,
                to: _this._contextUrlToRemoveStream[obj.url],
                identity : _this._dataStreamIdentity[obj.url],
                type : 'create',
                userID: _this._dataStreamIdentity[obj.url].userProfile.userURL,
                latitude : latitude,
                longitude : longitude,
                shopID : shopID
              }
              console.log('[VertxAppProtoStub] Do CheckIN', _this._eb, checkInMessage);


              _this._eb.send(checkInMessage.userID, checkInMessage, function (reply_err, reply) {
                if (reply_err == null) {
                  console.log("[VertxAppProtoStub] Received reply ", reply, '   from msg', checkInMessage);

                }
              });
            }
          }*/
        });

      }).catch(function(error) {
        resolve(false);
        console.log('[VertxAppProtoStub] error', error);
      });
    });
  }

  _eventBusUsage() {
    let _this = this;

    return new Promise(function(resolve, reject) {
      console.log('[VertxAppProtoStub] waiting for eb Open', _this._eb);

      _this._eb.onopen = () => {
        console.log('[VertxAppProtoStub] _this._eb-> open');
        let done = false;
        while (! done) {
          console.log('[VertxAppProtoStub] Waiting for SockJS readyState', _this._eb.sockJSConn.readyState, '(',WebSocket.OPEN,')');
          if (WebSocket.OPEN === _this._eb.sockJSConn.readyState) {
            done = true;
            _this._configAvailableStreams().then(function() {
              resolve(true);
            });
          } else {
            _this._sleep(1000);
          }
        }
      }
      _this._eb.onerror = function(e) {
          console.log('[VertxAppProtoStub] General error: ', e); // this does happen
      }
    });
  }


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
