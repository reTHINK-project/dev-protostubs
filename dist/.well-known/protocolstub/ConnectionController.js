"use strict";

System.register(["webrtc-adapter", "./P2PDataReceiver", "./P2PDataSender"], function (_export, _context) {
  "use strict";

  var P2PDataReceiver, P2PDataSender, ConnectionController;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_webrtcAdapter) {}, function (_P2PDataReceiver) {
      P2PDataReceiver = _P2PDataReceiver.default;
    }, function (_P2PDataSender) {
      P2PDataSender = _P2PDataSender.default;
    }],
    execute: function () {
      /**
        The ConnectionController has a generic design so that it can be used in both stubs.
        It manages a single DataChannel, it is not requesting access to media input, i.e.
        does not have audio/video streams.
        TODO: use the configuration constructor input parameter to also pass DataChannel settings including _maxSize and bufferedAmountLowThreshold
      **/
      ConnectionController =
      /*#__PURE__*/
      function () {
        function ConnectionController(myUrl, syncher, configuration, caller) {
          _classCallCheck(this, ConnectionController);

          if (!myUrl) throw new Error('The own url (myUrl) is a needed parameter');
          if (!syncher) throw new Error('The syncher is a needed parameter');
          if (!configuration) throw new Error('The configuration is a needed parameter');
          this._domain = this._divideURL(myUrl)["domain"];
          this._objectDescURL = 'hyperty-catalogue://catalogue.' + this._domain + '/.well-known/dataschema/Connection';
          this._myUrl = myUrl;
          this._syncher = syncher;
          this._configuration = configuration;
          this._caller = caller;
          this._dataObjectObserver;
          this._dataObjectReporter;
          this._peerUrl;
          this._dataChannel;
          this._onStatusUpdate;
          this._remoteRuntimeURL;
          this._receivers = {}; // currently active P2PDataReceivers

          this._senders = {}; // currently active P2PDataSenders

          this._maxSize = 16384;
          this._threshold = 0;
          this._peerConnection = this._createPeerConnection();
        } //create a peer connection with its event handlers


        _createClass(ConnectionController, [{
          key: "_createPeerConnection",
          value: function _createPeerConnection() {
            var _this2 = this;

            var pc = this._peerConnection;

            if (!pc) {
              pc = new RTCPeerConnection(this._configuration);
              console.log("[P2P-ConnectionController]: created PeerConnection"); // add handler for datachannel creation from peer side

              pc.ondatachannel = function (event) {
                console.log("[P2P-ConnectionController]: ondatachannel -> remote side has created a datachannel");
                _this2._dataChannel = event.channel;

                _this2._addDataChannelListeners();
              }; // event handler for local ice candidates


              pc.onicecandidate = function (e) {
                console.log("[P2P-ConnectionController]: icecandidateevent occured: ", e);
                if (!e.candidate) return;
                var icecandidate = {
                  type: 'candidate',
                  candidate: e.candidate.candidate,
                  sdpMid: e.candidate.sdpMid,
                  sdpMLineIndex: e.candidate.sdpMLineIndex
                }; // send candidate to remote peer by pushing it to the reporter object

                _this2._dataObjectReporter.data.iceCandidates.push(icecandidate);
              };
            }

            return pc;
          }
          /**
          React to the given invitation event by subscribing to the provided invitationEvent.url.
          **/

        }, {
          key: "observe",
          value: function observe(invitationEvent) {
            var _this3 = this;

            this._peerUrl = invitationEvent.from;
            this._remoteRuntimeURL = invitationEvent.value.runtime;
            return new Promise(function (resolve, reject) {
              var input = {
                schema: _this3._objectDescURL,
                resource: invitationEvent.url
              };

              _this3._syncher.subscribe(input).then(function (dataObjectObserver) {
                console.info('+[P2P-ConnectionController] got Data Object Observer', dataObjectObserver);

                _this3._setupObserver(dataObjectObserver);

                resolve();
              })["catch"](function (reason) {
                console.error(reason);
                reject();
              });
            });
          }
          /**
          Creates a syncher object and invite the given peerUrl to subscribe for it.
          Also creates the local offer, performs setLocalDescription and publishes the offer via the reporter object.
          **/

        }, {
          key: "report",
          value: function report(peerUrl, ownRuntimeUrl) {
            var _this4 = this;

            if (!this._peerUrl) this._peerUrl = peerUrl;
            return new Promise(function (resolve, reject) {
              // ensure peer connection is created in case this is a reconnect
              if (!_this4._peerConnection) _this4._peerConnection = _this4._createPeerConnection(); //  if we are the caller (i.e. no reporter object present yet, initalize the creation of the DataChannel)

              if (_this4._caller) {
                console.log("[P2P-ConnectionController]: we are in caller role --> createDataChannel ...");
                _this4._dataChannel = _this4._peerConnection.createDataChannel("P2PChannel");
                _this4._dataChannel.binaryType = 'arraybuffer';
                _this4._dataChannel.bufferedAmountLowThreshold = _this4._threshold;
                console.log("P2P: datachannel object", _this4._dataChannel);

                _this4._addDataChannelListeners();
              } // initial data for reporter sync object


              var dataObject = {
                name: "P2PConnection",
                status: "",
                owner: _this4._myUrl,
                runtimeURL: ownRuntimeUrl,
                // put the own runtimeURL to the dataObject (as discussed with Paulo)
                connectionDescription: {},
                iceCandidates: []
              };
              var input = Object.assign({
                resources: ['data']
              }); // ensure this the objReporter object is created before we create the offer

              _this4._syncher.create(_this4._objectDescURL, [_this4._peerUrl], dataObject, false, false, 'p2p connection', {}, input).then(function (objReporter) {
                console.info('[P2P-ConnectionController] Created WebRTC Object Reporter', objReporter);
                _this4._dataObjectReporter = objReporter;

                _this4._dataObjectReporter.onSubscription(function (event) {
                  event.accept(); // all subscription requested are accepted
                });

                var constraints = {
                  offerToReceiveAudio: false,
                  offerToReceiveVideo: false
                }; // either invoke createOffer or createAnswer, depending on the roles

                var sdpPromise = _this4._caller ? _this4._peerConnection.createOffer(constraints) : _this4._peerConnection.createAnswer();
                sdpPromise.then(function (sdp) {
                  console.log("[P2P-ConnectionController] SDP created", sdp);

                  _this4._peerConnection.setLocalDescription(new RTCSessionDescription(sdp), function () {
                    console.info('[P2P-ConnectionController] localDescription set successfully');
                    _this4._dataObjectReporter.data.connectionDescription.sdp = sdp.sdp;
                    _this4._dataObjectReporter.data.connectionDescription.type = sdp.type;
                    resolve();
                  })["catch"](function (e) {
                    reject("setting of localDescription failed: ", e);
                  });
                })["catch"](function (reason) {
                  console.error(reason);
                  reject(reason);
                });
              });
            });
          }
        }, {
          key: "onMessage",
          value: function onMessage(callback) {
            // add the message callback
            this._onDataChannelMessage = callback;
          }
        }, {
          key: "onStatusUpdate",
          value: function onStatusUpdate(callback) {
            // add a connection status update callback
            this._onStatusUpdate = callback;
          }
        }, {
          key: "sendMessage",
          value: function sendMessage(m) {
            var _this = this; // todo: only send if data channel is connected


            console.log("[P2P-ConnectionController] --> starting sending data to ", m.to);
            if (_this._dataChannel.readyState != 'open') throw Error('[P2PStub.ConnectionController.sendMessage] data channel is not opened. droping message: ', m); //TODO: use queue to manage concurrency with a limit length and a single sender instance

            var sender = new P2PDataSender(m, _this._dataChannel);
            var senderKey = m.from + m.to + m.id;
            _this._senders[senderKey] = sender;
            sender.sendData();
            sender.onProgress(function (progress) {
              console.debug('[P2P-ConnectionController] sending progress ', progress);
            });
            sender.onSent(function () {
              console.debug('[P2P-ConnectionController] data was sent to:', m.to);
              delete _this._senders[senderKey];
            });
          }
        }, {
          key: "cleanup",
          value: function cleanup() {
            delete this._dataObjectReporter;
            delete this._dataObjectObserver;
            if (this._dataChannel) this._dataChannel.close();
            if (this._peerConnection) this._peerConnection.close();
            this._dataChannel = null;
            this._peerConnection = null;
          }
        }, {
          key: "_addDataChannelListeners",
          value: function _addDataChannelListeners() {
            var _this5 = this;

            var _this = this;

            this._dataChannel.onopen = function () {
              _this5._onDataChannelOpen();
            };

            this._dataChannel.onerror = function (e) {
              _this5._onDataChannelError(e);
            };

            this._dataChannel.onmessage = function (m) {
              var _this = _this5;
              var data = m.data; //TODO: use a single P2PDataReceiver instance
              // checks if m.data is text and if yes if it is an initial packet.
              // if an initial packet with dataSize = 0, just process it
              // if an initial packet with dataSize != 0 set it at  P2PDataReceiver to handle it
              // if not an initial packet ask the P2PDataReceiver to handle it

              if (_typeof(data) != 'object') _this._onTextMessage(data); //this is not a binary packet
              else _this._onBinaryMessage(data);
            };

            this._dataChannel.onclose = function () {
              _this5._onDataChannelClose();
            };
          }
        }, {
          key: "_onTextMessage",
          value: function _onTextMessage(data) {
            var _this = this;

            var packet = JSON.parse(data);
            if (!packet.uuid) throw Error('[P2P-ConnectionController.onmessage] message is invalid', packet);
            if (packet.data.textMessage.hasOwnProperty('to') && packet.data.textMessage.to === _this._myUrl) _this._onMyMessage(packet.data.textMessage);else if (_this._receivers[packet.uuid]) _this._receivers[packet.uuid].receiveText(packet); // received text packet is from an ongoing receiver session
            else {
                //this is an initial packet
                if (!packet.data || !packet.data.textMessage || !packet.data.textMessage.from) throw Error('[P2P-ConnectionController.onmessage] initial packet is invalid', packet);
                console.debug("[P2P-ConnectionController] <-- incoming msg : ", packet);

                if (packet.data.dataSize === 0) {
                  //  received packet is for a complete reTHINK message
                  var message = packet.data.textMessage;

                  this._onDataChannelMessage(message);
                } else {
                  // initial packet from a message with Hyperty Resource content that will be sent in next messages. A new P2PDataReceiver session is needed
                  var newReceiver = new P2PDataReceiver(packet.data);
                  newReceiver.onReceived(function (message, latency) {
                    console.debug('[P2P-ConnectionController] complete message received from: ' + message.from + ' latency: ' + latency);

                    _this._onDataChannelMessage(message);

                    delete _this._receivers[packet.uuid];
                  });
                  newReceiver.onProgress(function (progress) {
                    var provisionalReply = {
                      from: newReceiver.from,
                      to: newReceiver.to,
                      id: newReceiver.id,
                      type: newReceiver.type,
                      body: {
                        code: 183,
                        desc: 'Message reception is progressing',
                        value: progress
                      }
                    };
                    console.debug('[P2P-ConnectionController] onprogress sending provisional response: ', provisionalReply);

                    _this._syncher._bus.postMessage(provisionalReply);
                  });
                  _this._receivers[packet.uuid] = newReceiver;
                }
              }
          }
        }, {
          key: "_onMyMessage",
          value: function _onMyMessage(msg) {
            if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('resource')) {
              var resource = msg.body.resource;

              if (this._senders[resource] && msg.type === 'delete') {
                console.log('[ConnectionController._onMyMessage] cancelling: ', this._senders[resource]);
                this._senders[resource].cancel;
                delete this._senders[resource];
              }
            }
          }
        }, {
          key: "_onBinaryMessage",
          value: function _onBinaryMessage(data) {
            var _this = this; // extract uuid from ArrayBuffer and convert to string


            var uuid = String.fromCharCode.apply(null, new Uint16Array(data.slice(0, 24)));

            if (!_this._receivers[uuid]) {
              var receiverKeys = Object.keys(_this._receivers);

              if (receiverKeys.length === 1) {
                var id = receiverKeys[0];
                var errorMessage = {
                  from: _this._receivers[id].from,
                  to: _this._receivers[id].to,
                  id: _this._receivers[id].id,
                  type: _this._receivers[id].type,
                  body: {
                    code: 500,
                    desc: 'Reception error'
                  }
                };
                console.error('[P2P-ConnectionController.onBinaryMessage] malformed packet: ', data);

                _this._syncher._bus.postMessage(errorMessage);

                _this._cancelSent(errorMessage.from + errorMessage.to + errorMessage.id);

                delete _this._receivers[id];
              } else throw Error('[P2P-ConnectionController.onBinaryMessage] invalid binary packet', data);
            } else _this._receivers[uuid].receiveBinary(data.slice(24));
          }
        }, {
          key: "_cancelSent",
          value: function _cancelSent(key) {
            var _this = this;

            var msg = {
              from: _this._myUrl,
              to: _this._peerUrl,
              type: 'delete',
              body: {
                resource: key
              }
            };
            console.info('[P2P-ConnectionController._cancelSent] : ', msg);

            _this.sendMessage(msg);
          }
        }, {
          key: "_setupObserver",
          value: function _setupObserver(dataObjectObserver) {
            var _this6 = this;

            this._dataObjectObserver = dataObjectObserver;
            var peerData = this._dataObjectObserver.data;
            console.info("[P2P-ConnectionController]: _setupObserver Peer Data: ", peerData);

            if (peerData.hasOwnProperty('connectionDescription')) {
              this._processPeerInformation(peerData.connectionDescription);
            }

            if (peerData.hasOwnProperty('iceCandidates')) {
              peerData.iceCandidates.forEach(function (ice) {
                console.log("[P2P-ConnectionController]: handleObserverObject for ice", ice);

                _this6._processPeerInformation(ice);
              });
            } // setup listener for future changes on the observed data object


            dataObjectObserver.onChange('*', function (event) {
              console.debug('[P2P-ConnectionController]: Observer on change message: ', event); // we need to process the answer from event.data and the candidates which might trickle
              // from event.data[0]

              if (event.data[0]) {
                // [0] this does the trick when ice candidates are trickling ;)
                console.log('>>event.data[0]', event.data[0]);

                _this6._processPeerInformation(event.data[0]);
              } else {
                console.log('[P2P-ConnectionController]: >>event', event);

                _this6._processPeerInformation(event.data);
              }
            });
          }
        }, {
          key: "_processPeerInformation",
          value: function _processPeerInformation(data) {
            console.info("[P2P-ConnectionController]: processPeerInformation: ", JSON.stringify(data));

            if (!this._peerConnection) {
              console.info("[P2P-ConnectionController]: processPeerInformation: no PeerConnection existing --> maybe in disconnecting process. --> ignoring this update");
              return;
            }

            if (data.type === 'offer' || data.type === 'answer') {
              console.info('[P2P-ConnectionController]: Process Connection Description: ', data);

              this._peerConnection.setRemoteDescription(new RTCSessionDescription(data)).then(function () {
                console.log("[P2P-ConnectionController]: remote success");
              })["catch"](function (e) {
                console.log("[P2P-ConnectionController]: remote error: ", e);
              });
            }

            if (data.candidate) {
              console.info('Process Ice Candidate: ', data);

              this._peerConnection.addIceCandidate(new RTCIceCandidate({
                candidate: data.candidate
              }));
            }
          }
        }, {
          key: "_onDataChannelOpen",
          value: function _onDataChannelOpen() {
            console.log('[P2P-ConnectionController] DataChannel opened');
            if (this._onStatusUpdate) this._onStatusUpdate("live", undefined, this._remoteRuntimeURL);
          }
        }, {
          key: "_onDataChannelError",
          value: function _onDataChannelError(e) {
            console.log('[P2P-ConnectionController] DataChannel error: ', e);
            if (this._onStatusUpdate) this._onStatusUpdate("disconnected", "" + e, this._remoteRuntimeURL);
          }
        }, {
          key: "_onDataChannelClose",
          value: function _onDataChannelClose() {
            console.log('[P2P-ConnectionController] DataChannel closed: ');
            if (this._onStatusUpdate) this._onStatusUpdate("disconnected", "closed", this._remoteRuntimeURL);
          }
          /**
           * Divide an url in type, domain and identity
           * @param  {URL.URL} url - url address
           * @return {divideURL} the result of divideURL
           */

        }, {
          key: "_divideURL",
          value: function _divideURL(url) {
            // let re = /([a-zA-Z-]*)?:\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*/gi;
            var re = /([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;
            var subst = '$1,$2,$3';
            var parts = url.replace(re, subst).split(','); // If the url has no protocol, the default protocol set is https

            if (parts[0] === url) {
              parts[0] = 'https';
              parts[1] = url;
            }

            var result = {
              type: parts[0],
              domain: parts[1],
              identity: parts[2]
            };
            return result;
          }
        }]);

        return ConnectionController;
      }();

      _export("default", ConnectionController);
    }
  };
});