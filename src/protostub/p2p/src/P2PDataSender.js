/**
  Data coder to manage the transfer of data between the two peer to peer protostubs.
  Adapted from https://github.com/webrtc/samples/blob/gh-pages/src/content/datachannel/datatransfer/js/main.js
**/
class P2PDataSender {

  /**
  * Constructor that should be used by the P2P Protostub
  * @param {Object} msg - Message to be sent in the Data Channel.
  * @param {RTCPeerConnection} channel - WebRTC Data Channel to be used to send the message.
  */

  constructor(msg, channel) {
    let _this = this;
    _this._msg = msg;
    _this._channel = channel;
    _this._packetSize = 16384;
    _this._bufferFullThreshold = 5 * _this._packetSize;
    _this._msgObject = msg;
    _this.isData = false;
    _this._init();
  }

  _init() {
    let _this = this;

    let uuid = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '-');

    let sendingTime = new Date().getTime();

    _this._initialPacket = {
      uuid: uuid,
      sendingTime: sendingTime,
    };

    if (_this._msg.body && _this._msg.body.value && _this._msg.body.value.content) _this.isData = true;

    if (_this.isData && _this._msg.body.value.mimetype && _this._msg.body.value.mimetype.split('/')[0] != 'text'){
      _this._send = _this._sendBinary;
      _this._initialPacket.dataSize = _this._msg.body.value.content.byteLength;
    } else {
      _this._send = _this._sendText;
      if (_this.isData) _this._initialPacket.dataSize = JSON.stringify(_this._msg.body.value.content).length;
    }
    _this._initialPacket.textMessage =  JSON.parse(JSON.stringify(_this._msg));

    if (_this.isData) {
      delete _this._initialPacket.textMessage.body.value.content;
      _this._data = _this._msg.body.value.content;
    } else _this._initialPacket.dataSize = 0;
  }

  _sendText(uuid, packet) {
    let _this = this;
    let newPacket = { uuid: uuid, data: packet};
    _this._channel.send(JSON.stringify(newPacket));
  }

  _sendBinary(uuid, packet) {
    let _this = this;

    let uuidAB = _this._str2ab(uuid);
    let newPacket = _this._appendBuffer(uuidAB, packet);

    _this._channel.send(newPacket);
  }

  _str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  _appendBuffer(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
  }

    sendData() {

        let _this = this;

        _this._size = _this._initialPacket.dataSize;

        console.log('[P2PDataSender] start sending to: ', _this._msg.to);

        //send Initial Packet
        _this._sendText(_this._initialPacket.uuid, _this._initialPacket);

        if (_this.isData) _this._sendData();
        else if (_this._onSent) _this._onSent();// We are done. Nothing else to be sent
      }

      _sendData() {
        let _this = this;

        let sendProgress = {};
        let receiveProgress ={};
        sendProgress.max = _this._size;
        receiveProgress.max = sendProgress.max;
        sendProgress.value = 0;
        receiveProgress.value = 0;
        let sendChannel = _this._channel;

        let chunkSize = _this._packetSize;
        let bufferFullThreshold = 5 * chunkSize;
        let usePolling = true;
        let packet;
        let last = false;

        if (typeof sendChannel.bufferedAmountLowThreshold === 'number') {
          console.info('[P2PDataSender] Using the bufferedamountlow event for flow control');
          usePolling = false;

          // Reduce the buffer fullness threshold, since we now have more efficient
          // buffer management.
          bufferFullThreshold = chunkSize / 2;

          // This is "overcontrol": our high and low thresholds are the same.
          sendChannel.bufferedAmountLowThreshold = bufferFullThreshold;
        }


        // Listen for one bufferedamountlow event.
        var listener = function() {
          sendChannel.removeEventListener('bufferedamountlow', listener);
          sendAllData();
        };

        var sendAllData = function() {
          // Try to queue up a bunch of data and back off when the channel starts to
          // fill up. We don't setTimeout after each send since this lowers our
          // throughput quite a bit (setTimeout(fn, 0) can take hundreds of milli-
          // seconds to execute).

          while (sendProgress.value < sendProgress.max) {
            if (sendChannel.bufferedAmount > bufferFullThreshold) {
              if (usePolling) {
                setTimeout(sendAllData, 250);
              } else {
                sendChannel.addEventListener('bufferedamountlow', listener);
              }
              return;
            }

            packet = _this._data.slice(sendProgress.value, sendProgress.value + chunkSize);

            if (sendProgress.value + chunkSize<sendProgress.max) {
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



  onSent(callback) {
    let _this = this;

    _this._onSent = callback;
  }

  onProgress(callback) {
    let _this = this;

    _this.onProgress = callback;
  }

}
export default P2PDataSender;
