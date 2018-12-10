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
import URI from 'urijs';
//import { WalletReporter } from 'service-framework/dist/WalletManager';
//import { Syncher } from 'service-framework/dist/Syncher';


class VertxAppProtoStub {
  /**
   * Vertx ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {VertxAppProtoStub}
   */
  constructor(runtimeProtoStubURL, bus, config, factory) {
    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
    if (!bus) throw new Error('The bus is a needed parameter');
    if (!config) throw new Error('The config is a needed parameter');

    if (!config.url) throw new Error('The config.url is a needed parameter');
    if (!config.runtimeURL) throw new Error('The config.runtimeURL is a needed parameter');

    //https://vertx-runtime.hysmart.rethink.ptinovacao.pt/eventbus

    let _this = this;
    console.log("[VertxAppProtoStub] VERTX APP PROTOSTUB", _this, EventBus);

    console.log("[VertxAppProtoStub] VERTX APP PROTOSTUB eb", EventBus);

    this._id = 0;
    this._updating = false;
    this._version = config.version;

    let uri = new URI(config.runtimeURL);

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;
    this._domain = uri.hostname();
    this._streams = config.streams;
    this._publicWallets = config.publicWallets;
    this._identity = null;
    this._isHeartBeatON = false;
    this._timeOutValue = config.timeoutValue;
    //TODO: to be defined in the config
    this.walletDescURL = 'hyperty-catalogue://catalogue.' + this._domain + '/.well-known/dataschema/WalletData';

    this._runtimeSessionURL = config.runtimeURL;

    this._syncher = factory.createSyncher(this._runtimeProtoStubURL, this._bus, this._config);
    //    this._walletReporter = new WalletReporter(this._runtimeProtoStubURL, this._bus, this._config, factory, this._syncher);
    console.log('[VertxAppProtoStub] this._contextReporter', this._contextReporter, factory);
    this._eb = null;
    this._walletReporterDataObject = null;
    this._publicWalletsReporterDataObject = null;
    this._alreadyListening = [];
    this._dataObjectsURL = {};
    this._heartbeatRate = 90000;
    this._status = 'created';
    this._registeredHandlers = {};

    let connecting;

    _this._sendStatus(this._status);

    // used to save data of eachF observer saving data and timestamp to publish to vertx
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
      console.log('[VertxAppProtoStub] Outgoing Message ', msg, _this._eb, JSON.stringify(_this._dataStreamIdentity));
      if (!_this._identity && msg.hasOwnProperty('identity')) {
        _this._identity = msg.identity;
        _this._guid = msg.identity.guid ? msg.identity.guid : msg.identity.userProfile.guid;
      }
      if (!_this._identity && msg.hasOwnProperty('body') && msg.body.hasOwnProperty('body') && msg.body.body.hasOwnProperty('identity') && msg.body.body.identity.hasOwnProperty('guid')) {
        let constIdentity = { userProfile: { guid: msg.body.body.identity.guid } }
        _this._identity = constIdentity;
        _this._guid = constIdentity.userProfile.guid;
      }

      console.log('[VertxAppProtoStub] connection status ', _this._status);

      switch (_this._status) {
        case 'live':
          _this._SubscriptionManager(msg);
          break;
        case 'in-progress':
          connecting.then(() => {
            _this._SubscriptionManager(msg);
          });
          break;
        case 'created':
          connecting = _this._open(config).then(() => {
            _this._SubscriptionManager(msg);
          });
          _this._status = 'in-progress';
          break
      }

    });

  }

  _open(config) {

    let _this = this;

    //    let ready = new Promise((resolve,reject) => {
    return new Promise((resolve, reject) => {

      let options = {
        vertxbus_reconnect_attempts_max: Infinity, // Max reconnect attempts
        vertxbus_reconnect_delay_min: 1000, // Initial delay (in ms) before first reconnect attempt
        vertxbus_reconnect_delay_max: 3000, // Max delay (in ms) between reconnect attempts
        vertxbus_reconnect_exponent: 2, // Exponential backoff factor
        vertxbus_randomization_factor: 0.5, // Randomization factor between 0 and 1
        vertxbus_ping_interval: config.vertxbus_ping_interval
      };

      _this._eb = new EventBus(config.url, options);
      console.log('[VertxAppProtoStub] Eventbus', _this._eb);
      _this._eb.enableReconnect(true);
      _this._eb.onopen = () => {

        let timer1;

        let connect = function () {
          _this._status = 'live';
          clearTimeout(timer1);
          console.log('[VertxAppProtoStub._open] connected ', _this._eb.sockJSConn.readyState);
          //update status
          if (!_this._isHeartBeatON && _this._guid) {
            _this._setGUIDHandler(_this._guid);
            _this._sendStatusVertxRuntime();
            _this._heartBeat();
            _this._isHeartBeatON = true;
          }

          _this._configAvailableStreams().then(function () {

            /*
            if (! _this._isHeartBeatON) {
              _this._sendStatusVertxRuntime();
              _this._heartBeat();
              _this._isHeartBeatON = true;
            }*/


            let toCreatePub = {
              type: 'create',
              to: 'hyperty://sharing-cities-dsm/wallet-manager',
              from: _this._runtimeSessionURL,
              identity: _this._publicWallets.identity,
              body: { type: 'create' }
            }
            _this.createWalletPub(toCreatePub).then(function () {
              resolve();
            });
          });
        };

        if (_this._eb.sockJSConn.readyState === WebSocket.OPEN) connect();
        else {
          timer1 = setTimeout(() => {
            console.log('[VertxAppProtoStub._open] trying connect ', _this._eb.sockJSConn.readyState);
            if (_this._eb.sockJSConn.readyState === WebSocket.OPEN) connect();
          }, _this._timeOutValue);

        }


      };
    });



    //    });
  }

  _setGUIDHandler(guid) {

    let _this = this;

    console.log('[VertxAppProtoStub._setGUIDHandler] ', guid);

    function guidHandlerFunctionHandler(error, message) {
      console.log('[VertxAppProtoStub._setGUIDHandler] new msg on user GUID', message);
      // HACK: send reply instantly to CRM
      if (message) {
        let response = { body: { code: 200 } };
        message.reply(response);

        _this._bus.postMessage(message.body);
      } else {
        console.log('[VertxAppProtoStub._setGUIDHandler] error message');
      }
      // , (reply) => {
      //   debugger;
      //   console.log('[VertxAppProtoStub] reply to message', reply);
      //   // resolve(reply);
      // });
    }
    _this._registeredHandlers[guid] = guidHandlerFunctionHandler;
    _this._eb.registerHandler(guid, guidHandlerFunctionHandler);
  }


  updateResource(msg) {
    /**
    *
    *  let updateMessage = {
    *    type: 'forward', to: 'hyperty://sharing-cities-dsm/wallet-manager', from: _this.hypertyURL,
    *    identity: _this._identity,
    *    body: {
    *      type: 'update',
    *      from: _this.hypertyURL,
    *      resource: source,
    *      value: value
    *    }
    *  };
    *
    */
    let _this = this;
    const toAddress = msg.to;

    // 1 - send to wallet manager (request to create wallet)
    let hypertyURL = msg.from;
    msg.type = msg.body.type;
    msg.from = hypertyURL;
    delete msg.body.type;
    delete msg.body.from;

    _this._eb.send(toAddress, msg, function (reply_err, reply) {
      console.log('[VertxAppProtoStub] update response from vertx', reply);
      let responseMsg;
      if (reply != null && reply.hasOwnProperty('body')) {
        responseMsg = {
          id: msg.id,
          type: 'response',
          from: msg.to,
          to: hypertyURL,
          body: reply.body
        };
        _this._bus.postMessage(responseMsg);
      }




    });
  }

  createWallet(msg) {
    let _this = this;
    const walletManagerAddress = msg.to;

    // 1 - send to wallet manager (request to create wallet)
    let hypertyURL = msg.from;
    msg.type = msg.body.type;
    msg.from = hypertyURL;
    delete msg.body;

    _this._eb.send(walletManagerAddress, msg, function (reply_err, reply) {

      if (reply_err == null) {
        //  2 - call create() method on reporter (send as reply)
        console.log("[VertxAppProtoStub] Received reply ", reply, '\nfrom msg', msg);
        let bal = 0;
        if (reply.body.identity.userProfile.hasOwnProperty('info') && reply.body.identity.userProfile.info.hasOwnProperty('balance')) {
          bal = reply.body.identity.userProfile.info.balance;
        }
        _this._setUpReporter(reply.body.identity.userProfile.userURL, null, { balance: bal, transactions: [], ranking: 0, 'bonus-credit': bal }, ['wallet'], reply.body.identity.userProfile.userURL, null, true).then(function (result) {

          if (result != null) {

            // TODO 3 - send 200 OK to wallet manager
            let responseMsg = {};
            responseMsg.body = {};
            responseMsg.body.value = result.data;
            responseMsg.body.code = 200;

            reply.reply(responseMsg, function (reply_err, reply2) {

              // 4 - send reply back to the JS wallet hyperty

              let responseMsg = {
                id: msg.id,
                type: 'response',
                from: msg.to,
                to: hypertyURL,
                body: {
                  wallet: reply2.body.wallet,
                  code: 200,
                  reporter_url: result.url,
                  publics_url: _this._publicWalletsReporterDataObject.url,
                  role: reply2.body.role
                }
              };

              //update status
              /*              if (! _this._isHeartBeatON) {
                              _this._sendStatusVertxRuntime();
                              _this._heartBeat();
                              _this._isHeartBeatON = true;
                            }*/




              console.log('[VertxAppProtoStub] wallet returned from vertx', reply2.body.wallet);


              /*
              if (reply2.body.wallet.balance != 0) {
                let balance1 = JSON.parse(JSON.stringify(reply2.body.wallet.balance));
                _this._walletReporterDataObject.data.balance = balance1;
              }
              */

              let transactions = JSON.parse(JSON.stringify(reply2.body.wallet.transactions));
              _this._walletReporterDataObject.data.transactions = transactions;
              _this._walletReporterDataObject.data.accounts = reply2.body.wallet.accounts;
              _this._walletReporterDataObject.data.ranking = reply2.body.wallet.ranking;
              _this._walletReporterDataObject.data['bonus-credit'] = reply2.body.wallet['bonus-credit'];


              let addressChanges = reply2.body.wallet.address + '/changes';

              console.log('[VertxAppProtoStub.createWallet] Vertx event bus address', addressChanges);

              function individualWalletFunctionHandler(error, message) {
                console.log('[VertxAppProtoStub] new change on individual wallet', message);
                if (Array.isArray(message.body.body)) {
                  const [balance, transaction, accounts, ranking, bonusCredit] = message.body.body;
                  _this._walletReporterDataObject.data.balance = balance.value;
                  let tr = JSON.parse(JSON.stringify(_this._walletReporterDataObject.data.transactions));
                  tr.push(JSON.parse(JSON.stringify(transaction.value)));
                  const timeout = 50;
                  setTimeout(() => {
                    _this._walletReporterDataObject.data.transactions = tr;
                  }, timeout);
                  setTimeout(() => {
                    _this._walletReporterDataObject.data.ranking = ranking.value;
                  }, timeout * 2);
                  setTimeout(() => {
                    _this._walletReporterDataObject.data['bonus-credit'] = bonusCredit.value;
                  }, timeout * 3);
                  setTimeout(() => {
                    _this._walletReporterDataObject.data.accounts = accounts.value;
                  }, timeout * 4);
                }
                else {
                  const { balance, transactions, ranking, 'bonus-credit': bonusCredit, accounts } = message.body.body
                  if (balance) {
                    _this._walletReporterDataObject.data.balance = balance;
                  }
                  if (transactions) {
                    if (Array.isArray(transactions) === true) {
                      _this._walletReporterDataObject.data.transactions = transactions;
                    }
                    else {
                      // single value
                      const transactionsCopy = JSON.parse(JSON.stringify(_this._walletReporterDataObject.data.transactions));
                      transactionsCopy.push(transactions);
                      _this._walletReporterDataObject.data.transactions = transactionsCopy;
                    }
                  }
                  if (ranking) {
                    _this._walletReporterDataObject.data.ranking = ranking;
                  }
                  if (accounts) {
                    _this._walletReporterDataObject.data.accounts = accounts;
                  }
                  if (bonusCredit) {
                    _this._walletReporterDataObject.data['bonus-credit'] = bonusCredit;
                  }
                }

              }



              _this._registeredHandlers[addressChanges] = individualWalletFunctionHandler;
              _this._eb.registerHandler(addressChanges, individualWalletFunctionHandler);

              responseMsg = JSON.parse(JSON.stringify(responseMsg));
              console.log('[VertxAppProtoStub] sending reply back to wallet JS', responseMsg);

              _this._bus.postMessage(responseMsg);

            });
          }
        }).catch(function (result) {
          //debugger;
        });
      }
    });
  }


  createWalletPub(msg) {
    let _this = this;

    return new Promise(function (resolve) {

      const walletManagerAddress = msg.to;
      // 1 - send to wallet manager (request to create wallet)
      let hypertyURL = msg.from;
      msg.type = msg.body.type;
      msg.from = hypertyURL;
      delete msg.body;

      _this._eb.send(walletManagerAddress, msg, function (reply_err, reply) {

        if (reply_err == null) {
          //  2 - call create() method on reporter (send as reply)
          console.log("[VertxAppProtoStub] Received reply ", reply, '\nfrom msg', msg);

          _this._setUpReporter(reply.body.identity.userProfile.userURL, null, { wallets: [] }, ['wallet'], reply.body.identity.userProfile.userURL, null, true, true).then(function (result) {

            if (result != null) {

              // TODO 3 - send 200 OK to wallet manager
              let responseMsg = {};
              responseMsg.body = {};
              responseMsg.body.value = result.data;
              responseMsg.body.code = 200;

              reply.reply(responseMsg, function (reply_err, reply2) {

                // 4 - send reply back to the JS wallet hyperty

                console.log('[VertxAppProtoStub] wallet returned from vertx', reply2.body.wallet);

                _this._publicWalletsReporterDataObject.data.wallets = reply2.body.wallet.wallets;


                let pubWalletsHandler = 'wallet://public-wallets/changes';

                function pubWalletsFunctionHandler(error, message) {
                  console.log('[VertxAppProtoStub]  new change on wallet', message);

                  const { wallets } = message.body.body;
                  if (wallets) {
                    _this._publicWalletsReporterDataObject.data.wallets = wallets;
                  }
                  else {
                    const [walletToUpdateIdentity, transaction, accounts, value] = message.body.body;
                    const walletGuid = walletToUpdateIdentity.value.userProfile.guid;

                    let walletToUpdate = _this._publicWalletsReporterDataObject.data.wallets.filter(wallet => wallet.identity.userProfile.guid === walletGuid)[0];
                    walletToUpdate.balance = value.value;
                    let transactions = JSON.parse(JSON.stringify(walletToUpdate.transactions));
                    transactions.push(JSON.parse(JSON.stringify(transaction.value)));
                    walletToUpdate.transactions = transactions;
                    walletToUpdate.accounts = accounts.value;
                  }
                }

                _this._registeredHandlers[pubWalletsHandler] = pubWalletsFunctionHandler;
                _this._eb.registerHandler(pubWalletsHandler, pubWalletsFunctionHandler);

                console.log('[VertxAppProtoStub] sending reply back to wallet JS', responseMsg);
                return resolve(true);

              });
            }
          }).catch(function (result) {
            //debugger;
          });
        }
      });

    });

  }


  _SubscriptionManager(msg) {
    console.log('[VertxAppProtoStub] handling messages', msg);
    let _this = this;

    //check registered handlers
    if (msg.to.includes('/changes')) {
      console.log('[VertxAppProtoStub] to pub changes + check if is handler registered?!', _this);
      let urlToPublish = msg.to;

      let urlToCheck = urlToPublish.split('/changes')[0] + '/subscription';
      if (!_this._eb.handlers.hasOwnProperty(urlToCheck)) {
        console.log('[VertxAppProtoStub] Lets RewriteHandlers', Object.keys(_this._eb.handlers));
        _this._reWriteHandlers();
        console.log('[VertxAppProtoStub] After RewriteHandlers', Object.keys(_this._eb.handlers));
      }
    }

    if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('type')) {

      // To Handle Message read type to get for example shops List
      if (msg.body.type === 'read') {


        let to = msg.to;
        if (msg.body.to)
          to = msg.body.to;
        let toRead = {
          type: 'read',
          from: msg.body.from,
          to: msg.body.to,
          identity: msg.body.identity,
          body: msg.body.body
        };

        _this._eb.send(to, toRead, function (reply_err, reply) {
          if (reply_err == null) {
            console.log("[VertxAppProtoStub] Received reply ", reply.body);

            let responseMsg = {
              from: msg.to,
              to: msg.from,
              id: msg.id,
              type: 'response'
            };
            responseMsg.body = {};
            //debugger;
            if (reply.body.data) {
              responseMsg.body.value = JSON.parse(JSON.stringify(reply.body.data));
            }
            else {
              responseMsg.body.value = JSON.parse(JSON.stringify(reply.body));
            }
            //responseMsg.body.value = _this._dataStreamData[msg.to];
            responseMsg.body.code = 200;
            _this._bus.postMessage(responseMsg);
          }


        });
      }

      if (msg.body.type === 'create') {
        if (msg.body.resource == 'wallet') {
          _this.createWallet(msg);
        } else {
          _this.forwardToVertxRuntime(msg);
        }
      } else if (msg.body.type === 'delete') {
        _this.forwardToVertxRuntime(msg);
      } else if (msg.body.type === 'update') {
        _this.updateResource(msg);
      }

    } else if (msg.type === 'create' && msg.from.includes('/subscription')) {
      _this._processSubscription(msg);
    } else if (msg.to.includes('/changes') && !_this._alreadyListening.includes(msg.to)) {
      console.log('[VertxAppProtoStub] new change ', msg);

      _this._eb.publish(msg.to, msg.body.value, function (reply_err, reply) {
        if (reply_err == null) {
          console.log("[VertxAppProtoStub] Received reply from change ", reply);
        }
      });
    }
  }

  _processSubscription(msg) {
    let _this = this;
    console.log('[VertxAppProtoStub._processSubscription] New MSG', msg);
    if (msg.identity == null) { /*&& (msg.to == 'hyperty://sharing-cities-dsm/user-activity' || msg.to == 'hyperty://sharing-cities-dsm/elearning') ) {*/
      if (!_this._identity && msg.hasOwnProperty('body') && msg.body.hasOwnProperty('identity')) {
        _this._identity = msg.body.identity;
      }
      msg.identity = _this._identity;
    }

    let contextUrl = msg.from.split('/subscription')[0];

    _this._resumeObservers(contextUrl).then(function (result) {
      if (!result) {
        _this._processNewSubscription(msg, true);
      } else {
        let changesAddress = result.url + "/changes";
        _this._alreadyListening.push(changesAddress);
        _this._bus.addListener(changesAddress, (event) => {
          _this._eb.send(event.to, event.body.value, function (reply_err, reply) {
            if (reply_err == null) {
              console.log("[VertxAppProtoStub] Received reply from change ", reply);
            }
          });
        });
        // required to handle updates
        if (_this._updating) {
          _this._processNewSubscription(msg, false);
        }
      }
    }).catch(function (error) {
      //debugger;
    });



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


  }

  _processNewSubscription(msg, newObserver) {
    let _this = this;
    console.log('[VertxAppProtoStub._processNewSubscription] ', msg);


    function subscriptionFunctionHandler(error, messageFROMsubscription) {

      let response = { body: { code: 200 } };
      messageFROMsubscription.reply(response);
      console.log('[VertxAppProtoStub] subscription message: ', messageFROMsubscription);
      let messageToSubscribe = messageFROMsubscription.body;
      if (messageToSubscribe.to.includes('/subscription')) {
        let schema_url = 'hyperty-catalogue://catalogue.' + _this._domain + '/.well-known/dataschema/Context';
        let contextUrl = messageToSubscribe.to.split("/subscription")[0];

        // should resume observers, if dont have go to _setUpObserver

        if (newObserver) {
          _this._setUpObserver(messageToSubscribe.body.identity, contextUrl, schema_url).then(function (result) {
            console.log('[VertxAppProtoStub] _setUpObserver result ', result);
            if (result) {
              let response = { body: { code: 200 } };
              messageFROMsubscription.reply(response);
            } else {
              let response = { body: { code: 406 } };
              messageFROMsubscription.reply(response);
            }
          });
        } else {

          let response = { body: { code: 200 } };
          messageFROMsubscription.reply(response);

        }

        /*
                _this._setUpObserver(messageToSubscribe.body.identity, contextUrl, schema_url).then(function (result) {
                  if (result) {
                    let response = { body: { code: 200 } };
                    messageFROMsubscription.reply(response);
                  } else {
                    let response = { body: { code: 406 } };
                    messageFROMsubscription.reply(response);
                  }
                });*/
      }
    }


    // handle message subscribe before invite Vertx
    let subsHandler = msg.from;
    _this._registeredHandlers[subsHandler] = subscriptionFunctionHandler;
    _this._eb.registerHandler(subsHandler, subscriptionFunctionHandler);

    // check if identity exists
    //Message to invite Vertx to Subscribe a Reporter
    let userURL;
    let guid;
    if (msg.body.identity) {
      userURL = msg.body.identity.userProfile.userURL;
      guid = msg.body.identity.userProfile.guid;
    }
    else {
      userURL = msg.body.value.reporter;
    }

    // let inviteMessage = {
    //   type: 'create',
    //   from: msg.from,
    //   to: msg.to,
    //   identity: { userProfile: { userURL: userURL, guid: guid } }
    // };
    // if (msg.to == 'hyperty://sharing-cities-dsm/crm/tickets') {
    //   // inviteMessage.body ={
    //   //   ticket: {
    //   //     created: msg.body.value.created,
    //   //     lastModified: msg.body.value.lastModified,
    //   //     message: msg.body.value.name
    //   //   }
    //   // }
    // }
    console.log("[VertxAppProtoStub] MSG to INVITE", msg);
    //Invite Vertx to subscribe...
    _this._eb.publish(msg.to, msg);


  }

  forwardToVertxRuntime(msg) {

    let _this = this;
    const vertxAddress = msg.to;

    msg.type = msg.body.type;
    delete msg.body.from;
    delete msg.body.type;

    _this._eb.send(vertxAddress, msg, function (reply_err, reply) {
      console.log('[VertxAppProtoStub] forwardToVertxRuntime', reply, reply_err);
      if (reply_err == null) {

        _this._sendReplyMsg(msg, reply.body.body);
        /*
        if (msg.body.resource == 'device') {
          _this._sendReplyMsg(msg,reply.body.body);
        } else if (msg.body.resource == 'stream') {

          if (reply.body.body.code == 200) {
            let objUrl = 'context://sharing-cities-dsm/' + msg.body.platformID + '/' + msg.body.platformUID;
            let schemaURL = 'hyperty-catalogue://catalogue.' + _this._domain + '/.well-known/dataschema/Context';
            let onChangesObjURL = objUrl + '/changes';

            //TODO: we should save reporter->url? to associate it??!
            _this._eb.registerHandler(onChangesObjURL, function (error, message) {
              console.log('[VertxAppProtoStub] received a new change: ', JSON.stringify(message), _this._dataObjectsURL);
              //TODO new data on reporter,, to update?
            });


          _this._resumeReporters(objUrl, msg.identity.userProfile.userURL).then(function (reporterResumed) {
            console.log('[VertxAppProtoStub] reporter resumed', reporterResumed );
            if (reporterResumed != false) {

              _this._dataObjectsURL[reporterResumed.url] = reporterResumed;



              reporterResumed.onSubscription(function (event) {
                event.accept();
                console.log('[VertxAppProtoStub] new subs', event);
              });
              _this._sendReplyMsg(msg,reply.body.body);
            } else {
              _this._setUpReporter(msg.identity.userProfile.userURL, schemaURL, {}, ['smartiot_context'], objUrl, objUrl, false).then(function (result) {
                _this._dataObjectsURL[result.url] = result;
                result.onSubscription(function (event) {
                  event.accept();
                  console.log('[VertxAppProtoStub] new subs', event);
                });
                _this._sendReplyMsg(msg,reply.body.body);

              }).catch(function (result) {
                debugger;
              });
            }



          }).catch(function (error) {
            debugger;
          });

          }
        }
        */
      } else {
        console.log('[VertxAppProtoStub] no reply', msg);

      }
    });


  }
  _sendReplyMsg(msg, body) {
    let _this = this;

    let responseMsg = {
      id: msg.id,
      type: 'response',
      from: msg.to,
      to: msg.from,
      body: body
    };
    console.log('[VertxAppProtoStub] sending reply back to Device Manager', responseMsg);
    _this._bus.postMessage(responseMsg);
  }

  _configAvailableStreams() {
    let _this = this;
    return new Promise(function (resolve) {
      console.log('[VertxAppProtoStub] EB on readyState(OPEN) Streams', _this._streams);
      let count = 0;
      _this._streams.forEach(function (stream) {
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
            let schemaURL = 'hyperty-catalogue://catalogue.' + _this._domain + '/.well-known/dataschema/Context';
            //_this._setUpReporter(reply.body.identity.userProfile.userURL, reply.body.data, stream.resources, stream.name, reuseURL)


            _this._resumeReporters(stream.name, reply.body.identity.userProfile.userURL).then(function (reporter) {
              console.log('VertxAppProtoStub]._resumeReporters (result)  ', reporter);
              if (reporter == false) {
                _this._setUpReporter(reply.body.identity.userProfile.userURL, schemaURL, reply.body.data, stream.resources, stream.name, reuseURL).then(function (result) {
                  if (result) {

                    function reuseFunctionHandler(error, message) {
                      console.log('[VertxAppProtoStub] received a message on : ', result, JSON.stringify(message));
                      //TODO new data on reporter,, to update? or not? should be static?

                    }
                    _this._registeredHandlers[reuseURL] = reuseFunctionHandler;
                    _this._eb.registerHandler(reuseURL, reuseFunctionHandler);
                  }
                });
              } else {
                reporter.data.values = reply.body.data.values;
                reporter.onSubscription(function (event) {
                  event.accept();
                  console.log('[VertxAppProtoStub] new subs', event);
                });
              }

            }).catch(function (error) {
              //debugger;
            });

          } else {
            console.log("[VertxAppProtoStub] No reply", reply_err);
          }
        });
      });
      resolve();

    });

  }

  _setUpPublicWallets() {
    let _this = this;
    return new Promise(function (resolve) {

      let createPub = {
        type: 'create',
        to: 'hyperty://sharing-cities-dsm/wallet-manager',
        from: _this._runtimeSessionURL,
        identity: _this._publicWallets
      }

      _this._eb.send('hyperty://sharing-cities-dsm/wallet-manager', createPub, function (reply_err, reply) {
        if (reply_err == null) {

          console.log("[VertxAppProtoStub] Received reply public wallets", reply);

          let responseMsg = {};
          responseMsg.body = {};
          responseMsg.body.value = {};
          responseMsg.body.code = 200;

          reply.reply(responseMsg, function (reply_err, reply2) {

            console.log("[VertxAppProtoStub] Received reply2 public wallets", reply);

          });
          resolve();
        }
      });

    });
  }

  _resumeReporters(name, reporterURL) {
    console.log('[VertxAppProtoStub._resumeReporters] Resuming reporter out', name, reporterURL);
    let _this = this;
    //debugger;
    return new Promise((resolve, reject) => {
      _this._syncher.resumeReporters({ store: true, reporter: reporterURL }).then((reporters) => {
        console.log('[VertxAppProtoStub._resumeReporters] Resuming reporter in', name, reporterURL);
        console.log('[VertxAppProtoStub._resumeReporters] Reporters resumed', reporters);
        //debugger;

        let reportersList = Object.keys(reporters);

        if (reportersList.length > 0) {

          reportersList.forEach((dataObjectReporterURL) => {

            console.log('[VertxAppProtoStub._resumeReporters] ', name, dataObjectReporterURL);
            console.log('[VertxAppProtoStub._resumeReporters] ', name, reporters[dataObjectReporterURL]);

            if (reporterURL == reporters[dataObjectReporterURL].metadata.reporter && reporters[dataObjectReporterURL].metadata.name == name) {
              return resolve(reporters[dataObjectReporterURL]);
            }
          });
          return resolve(false);
        } else {
          return resolve(false);
        }
      }).catch((reason) => {
        console.info('[VertxAppProtoStub._resumeReporters] Reporters:', reason);
      });
    });
  }

  _resumeObservers(contextUrl) {
    let _this = this;

    let resumedObserver = false;

    return new Promise((resolve, reject) => {
      console.log('[VertxAppProtoStub._resumeObservers] requesting for ', contextUrl);
      //debugger;
      _this._syncher.resumeObservers({ store: true, resource: contextUrl }).then((observers) => {
        //debugger;
        console.log('[VertxAppProtoStub._resumeObservers] reply from syncManagers : ', observers);

        let observersList = Object.keys(observers);
        if (observersList.length > 0) {
          //debugger;
          observersList.forEach((dataObjectObserverURL) => {
            if (contextUrl === dataObjectObserverURL) {
              //              console.log('[VertxAppProtoStub] resuming: ', observers[dataObjectObserverURL]);
              resumedObserver = observers[dataObjectObserverURL];
            }
          });
        }
        console.log('[VertxAppProtoStub._resumeObservers] resuming: ', resumedObserver);
        resolve(resumedObserver);

      }).catch((reason) => {
        console.info('[GroupChatManager] Resume Observer | ', reason);
      });
    });
  }

  _formCtxUrl(stream) {
    let _this = this;
    let ID = _this._config.runtimeURL.split('/')[3];
    return 'context://' + _this._config.host + '/' + ID + '/' + stream.id;
  }

  _setUpReporter(identityURL, objectDescURL, data, resources, name, reuseURL, createWallet = false, isPubWallet = false) {
    let _this = this;
    return new Promise(function (resolve, reject) {

      if (!createWallet) {
        let input = {
          resources: resources,
          expires: 3600,
          reporter: identityURL,
          reuseURL: reuseURL,
          domain_registration: false,
          domain_routing: false
        }
        //debugger;
        _this._syncher.create(objectDescURL, [], data, true, false, name, null, input)
          .then((reporter) => {
            console.log('[VertxAppProtoStub] REPORTER RETURNED', reporter);
            reporter.onSubscription(function (event) {
              event.accept();
              console.log('[VertxAppProtoStub] new subs', event);
            });
            return resolve(reporter);

          }).catch(function (err) {
            console.error('[VertxAppProtoStub] err', err);
            return resolve(null);
          });
      } else {

        console.log('[VertxAppProtoStub._setUpReporter] Wallet RESUME/CREATE');
        _this._resumeReporters(name, name).then(function (wallet) {
          //debugger;
          console.log('[VertxAppProtoStub._setUpReporter] Wallet resumed', wallet);
          if (wallet) {

            if (isPubWallet) {
              if (!wallet.data.hasOwnProperty('version') ||
                (wallet.data.hasOwnProperty('version') && wallet.data.version === '27.11.2018') ||
                (wallet.data.hasOwnProperty('version') && wallet.data.version < _this._version)) { //Hack to manage updates
                wallet.data.version = _this._version;
                _this._updating = true;
              }
              _this._publicWalletsReporterDataObject = wallet;
            } else {
              _this._walletReporterDataObject = wallet;
            }


            wallet.onSubscription(function (event) {
              event.accept();
              console.log('[VertxAppProtoStub._setUpReporter] new subs', event);
            });
            return resolve(wallet);

          } else {
            _this._create(data, resources, name, identityURL, reuseURL, false).then(function (wallet) {
              console.log('[VertxAppProtoStub._setUpReporter] Wallet created', wallet);

              if (isPubWallet) {
                wallet.data.version = _this._version;
                _this._publicWalletsReporterDataObject = wallet;
              } else {
                _this._walletReporterDataObject = wallet;
              }


              wallet.onSubscription(function (event) {
                event.accept();
                console.log('[VertxAppProtoStub._setUpReporter] new subs', event);
              });
              return resolve(wallet);
            }).catch(function (err) {
              console.error('[VertxAppProtoStub] err', err);
              return resolve(null);
            });
          }
        }).catch(function (error) {

        });

      }

    });
  }

  /**
   * This function is used to create a new status object syncher
   * @return {Promise}
   */

  _create(init, resources, name = 'myWallet', reporter = null, reuseURL = null, domainRegistration = true) {
    //debugger;
    let _this = this;
    let input;
    return new Promise((resolve, reject) => {
      if (!reporter && !reuseURL) {
        input = { resources: resources };
      } else if (reporter && !reuseURL) {
        input = { resources: resources, reporter: reporter };
      } else if (!reporter && reuseURL) {
        input = { resources: resources, reuseURL: reuseURL };
      } else {
        input = { resources: resources, reuseURL: reuseURL, reporter: reporter };
      }

      input.domain_registration = domainRegistration;
      input.domain_routing = false;

      console.info('[VertxAppProtoStub._create] lets create a new Wallet Object ', input);
      _this._syncher.create(_this.walletDescURL, [], init, true, false, name, null, input)
        .then((wallet) => {
          _this.wallet = wallet;

          //          _this._onSubscription(wallet);
          return resolve(wallet);

        }).catch(function (reason) {
          return reject(reason);
        });

    });

  }

  /*  _onSubscription(wallet) {
      wallet.onSubscription((event) => {
        console.info('[VertxAppProtoStub._onSubscription] accepting: ', event);
        event.accept();
      });
    }*/

  //let schema_url = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Context';
  _setUpObserver(identityToUse, contextUrl, schemaUrl) {
    let _this = this;
    //MessageBodyIdentity Constructor
    return new Promise(function (resolve) {
      console.log('[VertxAppProtoStub._setUpObserver] ctxurl', contextUrl);
      let input = {
        schema: schemaUrl,
        resource: contextUrl,
        store: true,
        p2p: false,
        mutual: true,
        domain_subscription: false,
        identity: identityToUse
      };

      _this._syncher.subscribe(input).then(function (obj) {
        console.log('[VertxAppProtoStub._setUpObserver] subscribe success', obj);
        return resolve(obj);
      }).catch(function (error) {
        console.log('[VertxAppProtoStub._setUpObserver] error', error);
        return resolve(false);
      });
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

  _sendMessage(address, messageToSend) {

    //send to vertx, and wait to a reply
  }

  _heartBeat() {
    let _this = this;

    let id = setInterval(function () {

      _this._sendStatusVertxRuntime();

    }, _this._heartbeatRate);

    // returns function to stop the heart beat

    return function () {
      clearInterval(id);
    }

  }

  _sendStatusVertxRuntime() {
    let _this = this;
    console.log("[VertxAppProtoStub._sendStatusVertxRuntime] identity", _this._identity);
    if (_this._identity) {
      console.log("[VertxAppProtoStub._sendStatusVertxRuntime] update status of user");
      let msgUpdate = {
        to: "runtime://sharing-cities-dsm/registry",
        type: "update",
        identity: _this._identity,
        body: {
          resource: _this._identity.userProfile.guid,
          status: 'online'
        }
      }
      _this._eb.publish("runtime://sharing-cities-dsm/registry", msgUpdate);

      console.log('[VertxAppProtoStub._sendStatusVertxRuntime] ', msgUpdate);
    }
  }

  _reWriteHandlers() {
    let _this = this;
    Object.keys(_this._registeredHandlers).forEach(function (element) {
      if (!_this._eb.handlers.hasOwnProperty(element)) {
        console.log('[VertxAppProtoStub._reWriteHandlers] rewrite:', element);
        _this._eb.registerHandler(element, _this._registeredHandlers[element]);
      }
    });
  }

}

export default function activate(url, bus, config, factory) {
  return {
    name: 'VertxAppProtoStub',
    instance: new VertxAppProtoStub(url, bus, config, factory)
  };
}
