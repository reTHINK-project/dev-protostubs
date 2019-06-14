"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var P2PDataReceiver;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      /**
        Data coder to manage the transfer of data between the two peer to peer protostubs.
      **/
      P2PDataReceiver =
      /*#__PURE__*/
      function () {
        /**
        * Constructor that should be used by the P2P Protostub
        * @param {Object} msg - Message to be sent in the Data Channel.
        * @param {RTCPeerConnection} channel - WebRTC Data Channel to be used to send the message.
        */
        function P2PDataReceiver(init) {
          _classCallCheck(this, P2PDataReceiver);

          var _this = this;

          _this._textMessage = init.textMessage;
          _this._dataSize = init.dataSize;
          _this._data = [];
          _this._progress = 0;
          _this._sendingTime = init.sendingTime;
          _this._progressPercentage = 0;
          if (!_this._textMessage.body || !_this._textMessage.body.value) throw Error('[P2PDataReceiver constructor] invalid Hyperty Resource message. Does not comtain a body.value', init);
        }

        _createClass(P2PDataReceiver, [{
          key: "receiveText",
          value: function receiveText(packet) {
            var _this = this;

            _this._data.push(packet.data);

            _this._progress = _this._progress + packet.data.length;

            if (_this._progress === _this._dataSize) {
              var content = _this._data.join('');

              _this._processLastMessage(content);
            } else {
              var currentProgressPercentage = parseInt(100 * _this._progress / _this._dataSize);
              var reportProgress = currentProgressPercentage - _this._progressPercentage > 0;

              if (reportProgress) {
                _this._progressPercentage = currentProgressPercentage;
                console.debug('[P2PDataReceiver] progressing: ', _this._progressPercentage);

                _this._onProgress(_this._progressPercentage);
              }
            }
          }
        }, {
          key: "receiveBinary",
          value: function receiveBinary(packet) {
            var _this = this;

            _this._data.push(packet);

            _this._progress = _this._progress + packet.byteLength;

            if (_this._progress === _this._dataSize) {
              _this._processLastMessage(_this._data);
            } else {
              if (_this._onProgress) {
                var currentProgressPercentage = parseInt(100 * _this._progress / _this._dataSize);
                var reportProgress = currentProgressPercentage - _this._progressPercentage > 0;

                if (reportProgress) {
                  _this._progressPercentage = currentProgressPercentage;
                  console.debug('[P2PDataReceiver] progressing: ', _this._progressPercentage);

                  _this._onProgress(_this._progressPercentage);
                }
              }
            }
          }
        }, {
          key: "_processLastMessage",
          value: function _processLastMessage(content) {
            var _this = this; // latency detection


            var receivingTime = new Date().getTime();
            var latency = receivingTime - _this._sendingTime;
            var message = _this._textMessage;
            message.body.value.content = content;

            _this._onReceived(message, latency);
          }
        }, {
          key: "onReceived",
          value: function onReceived(callback) {
            var _this = this;

            _this._onReceived = callback;
          }
        }, {
          key: "onProgress",
          value: function onProgress(callback) {
            var _this = this;

            _this._onProgress = callback;
          }
        }, {
          key: "from",
          get: function get() {
            return this._textMessage.from;
          }
        }, {
          key: "to",
          get: function get() {
            return this._textMessage.to;
          }
        }, {
          key: "id",
          get: function get() {
            return this._textMessage.id;
          }
        }, {
          key: "type",
          get: function get() {
            return this._textMessage.type;
          }
        }]);

        return P2PDataReceiver;
      }();

      _export("default", P2PDataReceiver);
    }
  };
});