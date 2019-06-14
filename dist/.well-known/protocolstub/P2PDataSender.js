"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var P2PDataSender;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      /**
        Data coder to manage the transfer of data between the two peer to peer protostubs.
        Adapted from https://github.com/webrtc/samples/blob/gh-pages/src/content/datachannel/datatransfer/js/main.js
      **/
      P2PDataSender =
      /*#__PURE__*/
      function () {
        /**
        * Constructor that should be used by the P2P Protostub
        * @param {Object} msg - Message to be sent in the Data Channel.
        * @param {RTCPeerConnection} channel - WebRTC Data Channel to be used to send the message.
        */
        function P2PDataSender(msg, channel) {
          _classCallCheck(this, P2PDataSender);

          var _this = this;

          _this._msg = msg;
          _this._channel = channel;
          _this._packetSize = 16384;
          _this._bufferFullThreshold = 5 * _this._packetSize;
          _this._msgObject = msg;
          _this.isData = false;

          _this._init();

          _this._cancel = false;
        }

        _createClass(P2PDataSender, [{
          key: "cancel",
          value: function cancel() {
            this._cancel = true;
          }
        }, {
          key: "_init",
          value: function _init() {
            var _this = this;

            var uuid = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '-');
            var sendingTime = new Date().getTime();
            _this._initialPacket = {
              uuid: uuid,
              sendingTime: sendingTime
            };
            if (_this._msg.body && _this._msg.body.value && _this._msg.body.value.content) _this.isData = true;

            if (_this.isData && _this._msg.body.value.mimetype && _this._msg.body.value.mimetype.split('/')[0] != 'text') {
              _this._send = _this._sendBinary;
              _this._initialPacket.dataSize = _this._msg.body.value.content.byteLength;
            } else {
              _this._send = _this._sendText;
              if (_this.isData) _this._initialPacket.dataSize = _this._msg.body.value.content.length;
            }

            _this._initialPacket.textMessage = JSON.parse(JSON.stringify(_this._msg));

            if (_this.isData) {
              delete _this._initialPacket.textMessage.body.value.content;
              _this._data = _this._msg.body.value.content;
            } else _this._initialPacket.dataSize = 0;
          }
        }, {
          key: "_sendText",
          value: function _sendText(uuid, packet) {
            var _this = this;

            var newPacket = {
              uuid: uuid,
              data: packet
            };

            _this._channel.send(JSON.stringify(newPacket));
          }
        }, {
          key: "_sendBinary",
          value: function _sendBinary(uuid, packet) {
            var _this = this;

            var uuidAB = _this._str2ab(uuid); //let uuidAB = _this._str2ab(123);


            var newPacket = _this._appendBuffer(uuidAB, packet);

            _this._channel.send(newPacket);
          }
        }, {
          key: "_str2ab",
          value: function _str2ab(str) {
            var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char

            var bufView = new Uint16Array(buf);

            for (var i = 0, strLen = str.length; i < strLen; i++) {
              bufView[i] = str.charCodeAt(i);
            }

            return buf;
          }
        }, {
          key: "_appendBuffer",
          value: function _appendBuffer(buffer1, buffer2) {
            var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
            tmp.set(new Uint8Array(buffer1), 0);
            tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
            return tmp.buffer;
          }
        }, {
          key: "sendData",
          value: function sendData() {
            var _this = this;

            _this._size = _this._initialPacket.dataSize;
            console.log('[P2PDataSender] start sending to: ', _this._msg.to); //send Initial Packet

            _this._sendText(_this._initialPacket.uuid, _this._initialPacket);

            if (_this.isData) _this._sendData();else if (_this._onSent) _this._onSent(); // We are done. Nothing else to be sent
          }
        }, {
          key: "_sendData",
          value: function _sendData() {
            var _this = this;

            var sendProgress = {};
            var receiveProgress = {};
            sendProgress.max = _this._size;
            receiveProgress.max = sendProgress.max;
            sendProgress.value = 0;
            receiveProgress.value = 0;
            var sendChannel = _this._channel;
            var chunkSize = _this._packetSize;
            var bufferFullThreshold = 5 * chunkSize;
            var usePolling = true;
            var packet;
            var last = false;

            if (typeof sendChannel.bufferedAmountLowThreshold === 'number') {
              console.info('[P2PDataSender] Using the bufferedamountlow event for flow control');
              usePolling = false; // Reduce the buffer fullness threshold, since we now have more efficient
              // buffer management.

              bufferFullThreshold = chunkSize / 2; // This is "overcontrol": our high and low thresholds are the same.

              sendChannel.bufferedAmountLowThreshold = bufferFullThreshold;
            } // Listen for one bufferedamountlow event.


            var listener = function listener() {
              sendChannel.removeEventListener('bufferedamountlow', listener);
              sendAllData();
            };

            var sendAllData = function sendAllData() {
              // Try to queue up a bunch of data and back off when the channel starts to
              // fill up. We don't setTimeout after each send since this lowers our
              // throughput quite a bit (setTimeout(fn, 0) can take hundreds of milli-
              // seconds to execute).
              while (sendProgress.value < sendProgress.max && !_this._cancel) {
                if (sendChannel.bufferedAmount > bufferFullThreshold) {
                  if (usePolling) {
                    setTimeout(sendAllData, 250);
                  } else {
                    sendChannel.addEventListener('bufferedamountlow', listener);
                  }

                  return;
                }

                packet = _this._data.slice(sendProgress.value, sendProgress.value + chunkSize);

                if (sendProgress.value + chunkSize < sendProgress.max) {
                  sendProgress.value += chunkSize;
                } else {
                  last = true;
                  sendProgress.value = sendProgress.max;
                }

                _this._send(_this._initialPacket.uuid, packet);

                if (last && _this._onSent) _this._onSent();
              }
            };

            setTimeout(sendAllData, 5);
          }
        }, {
          key: "onSent",
          value: function onSent(callback) {
            var _this = this;

            _this._onSent = callback;
          }
        }, {
          key: "onProgress",
          value: function onProgress(callback) {
            var _this = this;

            _this.onProgress = callback;
          }
        }]);

        return P2PDataSender;
      }();

      _export("default", P2PDataSender);
    }
  };
});