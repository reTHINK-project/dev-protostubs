"use strict";

System.register(["./ConnectionController.js"], function (_export, _context) {
  "use strict";

  var ConnectionController, protostubDescriptor, P2PRequesterStub;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_ConnectionControllerJs) {
      ConnectionController = _ConnectionControllerJs.default;
    }],
    execute: function () {
      // TODO: integrate the status eventing
      protostubDescriptor = {
        "name": "P2PRequesterStub",
        "language": "javascript",
        "description": "P2P Requester Protostub ",
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
        "objectName": "P2PRequesterProtoStub"
        /**
         * ProtoStub Interface
         */

      };

      _export("default", P2PRequesterStub =
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
        function P2PRequesterStub() {
          _classCallCheck(this, P2PRequesterStub);
        }

        _createClass(P2PRequesterStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, miniBus, configuration, factory) {
            var _this2 = this;

            if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a required parameter');
            if (!miniBus) throw new Error('The bus is a required parameter');
            if (!configuration) throw new Error('The configuration is a required parameter'); // if (!configuration.p2pHandler) throw new Error('The p2pHandler is a required attribute in the configuration parameter');

            console.log('+[P2PRequesterStub.constructor] config is: ', configuration);
            this._runtimeProtoStubURL = runtimeProtoStubURL;
            this._runtimeURL = configuration.runtimeURL;
            this._remoteRuntimeURL = configuration.remoteRuntimeURL; // required for status events

            this._configuration = configuration;
            this._bus = miniBus;

            this._bus.addListener('*', function (msg) {
              if (msg.to === _this2._runtimeProtoStubURL) {
                if (msg.type = 'execute') _this2._onExecute(msg.body.method, msg.body.params);
              } else _this2._sendChannelMsg(msg);
            });

            this._syncher = factory.createSyncher(runtimeProtoStubURL, miniBus, configuration);
            this._connectionController = new ConnectionController(this._runtimeProtoStubURL, this._syncher, this._configuration, true);

            this._connectionController.onStatusUpdate(function (status, reason) {
              _this2._sendStatus(status, reason);

              if (status === 'disconnected') _this2.disconnect(); // to ensure the ConnectionController is in the right status
            });

            this._syncher.onNotification(function (event) {
              console.log('+[P2PRequesterStub] On Syncher Notification: ', event);
              event.ack(200);

              switch (event.type) {
                case 'create':
                  // incoming observe invitation from peer
                  if (_this2._connectionController) {
                    _this2._connectionController.observe(event).then(function () {
                      console.log("+[P2PRequesterStub] observer created ");
                    });
                  }

                  break;

                case 'delete':
                  // TODO: question regarding code in Connector: --> there it deletes all controllers --> why?
                  console.log("+[P2PRequesterStub] deleting connection handler for " + event.from);
                  disconnect();
                  break;

                default:
              }
            });

            this._sendStatus("create"); // the target handler stub url must be present in the configuration as "p2pHandler" attribute


            if (this._configuration.p2pHandler) this.connect(this._configuration.p2pHandler);
          }
        }, {
          key: "_onExecute",
          value: function _onExecute(method, params) {
            var _this = this;

            console.log('[P2PRequesterStub._onExecute] request to execute: ', method, ' with parms ', params);
            if (method === 'connect') _this.connect(params[0]);
          }
        }, {
          key: "connect",
          value: function connect(handlerURL) {
            var _this3 = this;

            this._connectionController.report(handlerURL, this._runtimeURL).then(function () {
              // send "in-progress" event, if the syncher.create was done
              _this3._sendStatus("in-progress");

              _this3._connectionController.onMessage(function (m) {
                console.log("+[P2PRequesterStub] onMessage: ", m);

                _this3._deliver(m);
              });

              console.log("+[P2PRequesterStub] setup reporter object successfully");
            });
          }
          /**
           * To disconnect the protocol stub.
           */

        }, {
          key: "disconnect",
          value: function disconnect() {
            if (this._connectionController) {
              this._connectionController.cleanup(); //      this._connectionController = null;

            }
          }
        }, {
          key: "_sendChannelMsg",
          value: function _sendChannelMsg(msg) {
            if (this._filter(msg)) {
              if (this._connectionController) {
                this._connectionController.sendMessage(msg);
              }
            }
          }
        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason) {
            var msg = {
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

        }, {
          key: "_filter",
          value: function _filter(msg) {
            if (msg.body && msg.body.via === this._runtimeProtoStubURL) return false;
            return true;
          }
          /**
           * Method that should be used to deliver the message in direction: Protostub -> MessageBus (core)
           * @param  {Message} msg Original message from the MessageNode
           */

        }, {
          key: "_deliver",
          value: function _deliver(msg) {
            console.log("+[P2PrequesterStub] posting message to msg bus: ", msg); //let message = JSON.parse(msg.data);

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

        return P2PRequesterStub;
      }());
      /*export default function activate(url, bus, config, factory) {
        return {
          name: 'P2PRequesterStub',
          instance: new P2PRequesterStub(url, bus, config, factory)
        };
      }*/

    }
  };
});