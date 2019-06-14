"use strict";

System.register(["./ConnectionController.js"], function (_export, _context) {
  "use strict";

  var ConnectionController, protostubDescriptor, Connection, IMSIWProtoStub;

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  return {
    setters: [function (_ConnectionControllerJs) {
      ConnectionController = _ConnectionControllerJs.default;
    }],
    execute: function () {
      //import MessageBodyIdentity from 'service-framework/dist/IdentityFactory'
      protostubDescriptor = {
        "name": "IMSIWProtoStub",
        "language": "javascript",
        "description": "Description of IMSIWProtoStub",
        "objectName": "sip.rethink-project.eu",
        "configuration": {
          "credential_server": "https://ims.rethink-project.eu/credential",
          "domain": "hysmart.rethink.ptinovacao.pt"
        },
        "messageSchemas": "",
        "dataObjects": ["hyperty-catalogue://catalogue.hysmart.rethink.ptinovacao.pt/.well-known/dataschema/Connection"],
        "signature": "",
        "accessControlPolicy": "somePolicy",
        "constraints": {
          "browser": true
        },
        "interworking": true
      };

      Connection = function Connection(dataObjectUrl) {
        _classCallCheck(this, Connection);

        this.name = 'Connection';
        this.status = '';
        this.owner = dataObjectUrl;
        this.connectionDescription = {};
        this.iceCandidates = [];
      };
      /**
       * ProtoStub Interface
       */


      _export("default", IMSIWProtoStub =
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
        function IMSIWProtoStub() {
          _classCallCheck(this, IMSIWProtoStub);
        }

        _createClass(IMSIWProtoStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, miniBus, configuration, factory) {
            var _this2 = this;

            if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a required parameter');
            if (!miniBus) throw new Error('The bus is a required parameter');
            if (!configuration) throw new Error('The configuration is a required parameter');
            if (!configuration.domain) throw new Error('The domain is a required parameter');
            this._runtimeProtoStubURL = runtimeProtoStubURL;
            this._discovery = factory.createDiscovery(runtimeProtoStubURL, miniBus);
            this.schema = "hyperty-catalogue://catalogue.".concat(configuration.domain, "/.well-known/dataschema/Connection");
            this._connection = new ConnectionController(configuration, function (to, offer) {
              _this2._returnSDP(offer, _this2._runtimeProtoStubURL, _this2.schema, _this2.source, 'offer');
            }, function () {
              _this2.dataObjectObserver["delete"]();

              _this2.dataObjectReporter["delete"]();
            });
            this._bus = miniBus;
            this._syncher = factory.createSyncher(this._runtimeProtoStubURL, miniBus, configuration);
            miniBus.addListener('*', function (msg) {
              console.log('NEW MSG ->', msg);

              switch (msg.type) {
                case 'create':
                  if (_this2._filter(msg) && msg.body.schema) {
                    console.log('subscribe: ', msg.body.schema);

                    _this2._subscribe(msg);
                  }

                  break;

                case 'init':
                  _this2._identity = factory.createMessageBodyIdentity('anton', 'sip://rethink-project.eu/anton@rethink-project.eu', '', 'anton', '', 'rethink-project.eu');
                  console.log('myidentity', _this2._identity);

                  _this2._connection.connect(msg.body.identity.access_token);

                  _this2.source = msg.body.source;
                  break;

                case 'delete':
                  _this2._connection.disconnect();

                  break;
              }
            });

            this._sendStatus('created');
          }
        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason) {
            var _this = this;

            console.log('[IMSIWProtostub status changed] to ', value);
            _this._state = value;
            var msg = {
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
        }, {
          key: "_subscribe",
          value: function _subscribe(msg) {
            var _this3 = this;

            var dataObjectUrl = msg.from.substring(0, msg.from.lastIndexOf('/'));
            var input = {
              schema: this.schema,
              resource: dataObjectUrl
            };

            this._syncher.subscribe(input).then(function (dataObjectObserver) {
              _this3.dataObjectObserver = dataObjectObserver;
              console.log('dataObjectObserver:', dataObjectObserver); // dataObjectObserver.onChange('*', (event) => this._onCall(dataObjectObserver, dataObjectUrl, this.schema, msg))

              return dataObjectObserver;
            }).then(function (dataObjectObserver) {
              return _this3._onCall(dataObjectObserver, dataObjectUrl, _this3.schema, msg);
            });
          }
        }, {
          key: "_onCall",
          value: function _onCall(dataObjectObserver, dataObjectUrl, schema, msg) {
            var _this4 = this;

            console.log('_onCall', dataObjectObserver);

            if (dataObjectObserver.data.connectionDescription) {
              if (dataObjectObserver.data.connectionDescription.type === 'offer') {
                console.log('_onCallUpdate offer');

                this._connection.connect(msg.body.identity.access_token).then(function () {
                  console.log('sad', msg);

                  _this4._connection.invite(msg.to, dataObjectObserver).then(function (e) {
                    return _this4._returnSDP(e.body, dataObjectUrl, schema, msg.body.source, 'answer');
                  })["catch"](function (e) {
                    console.error('fail', e);

                    _this4.dataObjectObserver["delete"]();
                  });
                });
              } else if (dataObjectObserver.data.connectionDescription.type === 'answer') {
                console.log('_onCallUpdate offer');

                this._connection.accept(dataObjectObserver);
              }
            }
          }
        }, {
          key: "_returnSDP",
          value: function _returnSDP(offer, dataObjectUrl, schema, source, type) {
            var _this5 = this;

            console.log('offer received', offer);
            var dataObject = new Connection(dataObjectUrl);
            var input = Object.assign({
              resources: ['audio']
            }, {});

            this._syncher.create(schema, [source], dataObject, false, false, '', this._identity, input).then(function (objReporter) {
              _this5.dataObjectReporter = objReporter;
              objReporter.onSubscription(function (event) {
                console.info('-------- Receiver received subscription request --------- \n');
                event.accept();
              });
              objReporter.data.connectionDescription = {
                type: type,
                sdp: offer
              };
            })["catch"](function (error) {
              console.error(error);
            });
          }
        }, {
          key: "_filter",
          value: function _filter(msg) {
            if (msg.body && msg.body.via === this._runtimeProtoStubURL) return false;
            return true;
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

        return IMSIWProtoStub;
      }());
      /*export default function activate(url, bus, config, factory) {
      	return {
      		name: 'IMSIWProtoStub',
      		instance: new IMSIWProtoStub(url, bus, config, factory)
      	}
      }
      */

    }
  };
});