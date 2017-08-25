/**
  Data coder to manage the transfer of data between the two peer to peer protostubs.
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
    _this._size = _this._msg.length;
    _this._packetSize = 16384;
    _this._msgObject = msg;
    _this._totalPackets = parseInt(_this._size / _this._packetSize);
  }

  send() {
      let uuid = (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '-');

      let sendingTime = new Date().getTime();

      let packet = {
          uuid: uuid,
          from: _this._msgObject.from,
          to: _this._msgObject.to,
          id: _this._msgObject.id,
          type: _this._msgObject.type,
          sendingTime: sendingTime
      };

      console.log('[P2PDataSender] start sending to: ', packet.to)

      sendData(_this._body);


        function sendData(initialData, data) {
          let _this = this;

            if (initialData) {
                data = initialData;
                packet.missing = parseInt(data.length / _this._packetSize); // number of packets to be sent missing
            }

            if (data.length > _this._packetSize) {
                packet.data = data.slice(0, _this._packetSize);
            } else {
                packet.data = data;
                packet.last = true;
            }

            _this._channel.send(JSON.stringify(packet));

            if (_this._onProgress) _this._onProgress(100 * parseInt(packet.missing / _this._totalSize));

            let dataToTransfer = data.slice(packet.data.length);

            if (dataToTransfer.length) {
                setTimeout(function() {
                    sendData(null, dataToTransfer);
                }, 100); //TODO: adapt according to browser used see: https://github.com/muaz-khan/WebRTC-Experiment/blob/master/DataChannel/DataChannel.js#L329
            } else if (_this._onSent) _this._onSent();
        }
  }

  onSent(callback) {
    _this._onSent = callback;
  }

  onProgress(callback) {
    _this.onProgress = callback;
  }

}
export default P2PDataSender;
