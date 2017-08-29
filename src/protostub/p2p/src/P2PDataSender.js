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
    _this._body = JSON.stringify(msg.body);
    _this._channel = channel;
    _this._size = _this._body.length;
    _this._packetSize = 16384;
    _this._bufferFullThreshold = 5 * _this._packetSize;
    _this._msgObject = msg;
  }

      sendData() {
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

        let uuid = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '-');

        let sendingTime = new Date().getTime();

        let packet = {
            uuid: uuid,
            from: _this._msgObject.from,
            to: _this._msgObject.to,
            id: _this._msgObject.id,
            type: _this._msgObject.type,
            sendingTime: sendingTime,
            last: false,
            progress: sendProgress

        };

        if (typeof sendChannel.bufferedAmountLowThreshold === 'number') {
          console.info('[P2PDataSender] Using the bufferedamountlow event for flow control');
          usePolling = false;

          // Reduce the buffer fullness threshold, since we now have more efficient
          // buffer management.
          bufferFullThreshold = chunkSize / 2;

          // This is "overcontrol": our high and low thresholds are the same.
          sendChannel.bufferedAmountLowThreshold = bufferFullThreshold;
        }


        console.log('[P2PDataSender] start sending to: ', packet.to);

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

            packet.data = _this._body.slice(sendProgress.value, sendProgress.value + chunkSize);

            if (sendProgress.value + chunkSize<sendProgress.max) {
                sendProgress.value += chunkSize;
            } else {
                packet.last = true;
                sendProgress.value = sendProgress.max;
            }

            sendChannel.send(JSON.stringify(packet));

            if (packet.last && _this._onSent) _this._onSent();

          }
        };
        let data = _this._body;
        setTimeout(sendAllData, 0);
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
