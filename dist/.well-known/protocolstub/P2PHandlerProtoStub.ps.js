"use strict";

System.register(["./ConnectionController.js"], function (_export, _context) {
  "use strict";

  var ConnectionController, protostubDescriptor, P2PHandlerStub;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_ConnectionControllerJs) {
      ConnectionController = _ConnectionControllerJs.default;
    }],
    execute: function () {
      protostubDescriptor = {
        "name": "P2PHandlerStub",
        "language": "javascript",
        "description": "P2P Handler Protostub ",
        "signature": "",
        "configuration": {
          "iceServers": [{
            "urls": "turn:numb.viagenie.ca",
            "credential": "zJcH3erd9cUv5Zh",
            "username": "luis-t-duarte@telecom.pt"
          }, {
            "urls": ["stun:stun.voiparound.com", "stun:stun.voipbuster.com", "stun:stun.voipstunt.com", "stun:stun.voxgratia.org", "stun:stun.ekiga.net", "stun:stun.schlund.de", "stun:stun.iptel.org", "stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun.ideasip.com", "stun:stun4.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun3.l.google.com:19302"]
          }],
          "iceTransportPolicy": "all"
        },
        "constraints": {
          "windowSandbox": true
        },
        "interworking": false,
        "objectName": "P2PHandlerProtoStub"
        /**
         * ProtoStub Interface
         */

      };

      _export("default", P2PHandlerStub =
      /*#__PURE__*/
      function () {
        /**
         * Initialise the protocol stub including as input parameters its allocated
         * component runtime url, the runtime BUS postMessage function to be invoked
         * on messages received by the protocol stub and required configuration retrieved from protocolStub descriptor.
         * @param  {URL.runtimeProtoStubURL}                   runtimeProtoStubURL runtimeProtoSubURL
         * @param  {Message.Message}                           busPostMessage     configuration
         * @param  {ProtoStubDescriptor.ConfigurationDataList} configuration      configuration
         */
        function P2PHandlerStub() {
          _classCallCheck(this, P2PHandlerStub);
        }

        _createClass(P2PHandlerStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, miniBus, configuration, factory) {
            var _this = this;

            if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a required parameter');
            if (!miniBus) throw new Error('The bus is a required parameter');
            if (!configuration) throw new Error('The configuration is a required parameter');
            console.log('[P2PHandlerProtoStub.constructor] config is: ', configuration);
            this._runtimeProtoStubURL = runtimeProtoStubURL;
            this._runtimeURL = configuration.runtimeURL;
            this._configuration = configuration;
            this._bus = miniBus;

            this._bus.addListener('*', function (msg) {
              _this._sendChannelMsg(msg);
            });

            this._connectionControllers = {};
            this._syncher = factory.createSyncher(runtimeProtoStubURL, miniBus, configuration);

            this._syncher.onNotification(function (event) {
              console.log('+[P2PHandlerProtoStub] On Syncher Notification ', event);
              event.ack(200);

              switch (event.type) {
                case 'create':
                  // as discussed with Paulo, we expect the "remoteRuntimeURL" as field "runtime" in the initial dataObject
                  // emit the "create" event as requested in issue: https://github.com/reTHINK-project/dev-protostubs/issues/5
                  _this._sendStatus("create", undefined, event.value.runtime);

                  _this._createConnectionController(event).then(function (connectionController) {
                    _this._connectionControllers[event.value.runtime] = connectionController;
                    connectionController.onStatusUpdate(function (status, reason, remoteRuntimeURL) {
                      _this._sendStatus(status, reason, remoteRuntimeURL); // to ensure the ConnectionController is in the right status


                      if (status === 'disconnected') {
                        connectionController.cleanup();
                        delete _this._connectionControllers[event.value.runtime];
                      }
                    });
                    connectionController.onMessage(function (m) {
                      _this._deliver(m);
                    });
                  });

                  break;

                case 'delete':
                  // TODO: question code in Connector --> there it deletes all controllers --> why?
                  console.log("+[P2PHandlerStub] deleting connection handler for " + event.from);
                  var connectionController = _this._connectionControllers[event.from];

                  if (connectionController) {
                    connectionController.cleanup();
                    delete _this._connectionControllers[event.from];
                  }

                  break;

                default:
              }
            });
          }
        }, {
          key: "disconnect",

          /**
           * To disconnect the protocol stub.
           */
          value: function disconnect() {
            var _this2 = this;

            // cleanup ALL connectionControllers
            Object.keys(this._connectionControllers).forEach(function (key) {
              _this2._controllers[key].cleanup();

              ;
              delete _this2._controllers[key];
            });
          }
        }, {
          key: "_createConnectionController",
          value: function _createConnectionController(invitationEvent) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
              var connectionController = new ConnectionController(_this3._runtimeProtoStubURL, _this3._syncher, _this3._configuration, false);
              connectionController.observe(invitationEvent).then(function () {
                console.log("+[P2PHandlerStub] observer setup successful"); // create the reporter automatically

                connectionController.report(invitationEvent.from, _this3._runtimeURL).then(function () {
                  console.log("+[P2PHandlerStub] reporter setup successful");

                  _this3._sendStatus("in-progress", undefined, invitationEvent.value.runtime);

                  resolve(connectionController);
                });
              });
            });
          }
        }, {
          key: "_sendChannelMsg",
          value: function _sendChannelMsg(msg) {
            if (this._filter(msg)) {
              // TODO: verify: is this selection correct?
              var connectionController = this._connectionControllers[msg.body.peer];
              if (connectionController) connectionController.sendMessage(msg);
            }
          }
        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason, remoteRuntimeURL) {
            var msg = {
              type: 'update',
              from: this._runtimeProtoStubURL,
              to: this._runtimeProtoStubURL + '/status',
              body: {
                value: value
              }
            };
            if (remoteRuntimeURL) msg.body.resource = remoteRuntimeURL;

            if (reason) {
              msg.body.desc = reason;
            }

            console.log("+[P2PHandlerStub] sending status update: ", msg);

            this._bus.postMessage(msg);
          }
          /**
           * Filter method that should be used for every messages in direction: Protostub -> MessageNode
           * @param  {Message} msg Original message from the MessageBus
           * @return {boolean} true if it's to be deliver in the MessageNode
           */

        }, {
          key: "_filter",
          value: function _filter(msg) {
            // todo: only try to send when connected (live status)
            if (msg.body && msg.body.via === this._runtimeProtoStubURL) return false;
            return true;
          }
          /**
           * Method that should be used to deliver the message in direction: Protostub -> MessageBus (core)
           * @param  {Message} msg Original message from the DataChannel
           */

        }, {
          key: "_deliver",
          value: function _deliver(msg) {
            console.log("+[P2PHandlerStub] posting message to msg bus: ", msg); // let message = JSON.parse(msg.data);

            if (!msg.body) msg.body = {};
            msg.body.via = this._runtimeProtoStubURL;

            this._bus.postMessage(msg);
          }
        }, {
          key: "descriptor",
          get: function get() {
            return protostubDescriptor;
          }
        }, {
          key: "name",
          get: function get() {
            return protostubDescriptor.name;
          }
        }]);

        return P2PHandlerStub;
      }());
      /*
      export default function activate(url, bus, config, factory) {
        return {
          name: 'P2PHandlerStub',
          instance: new P2PHandlerStub(url, bus, config, factory)
        };
      }*/

    }
  };
});