/**
  Data coder to manage the transfer of data between the two peer to peer protostubs.
**/
class P2PDataReceiver {

  /**
  * Constructor that should be used by the P2P Protostub
  * @param {Object} msg - Message to be sent in the Data Channel.
  * @param {RTCPeerConnection} channel - WebRTC Data Channel to be used to send the message.
  */

  constructor(init) {
    let _this = this;

    _this._from = init.from;
    _this.to = init.to;
    _this._id = init.id;
    _this._type = init.type;
    _this._body = [init.body];
    _this._totalPackates = init.missing+1;
  }

  receive(packet) {

    console.debug('[P2PDataReceiver] receive: ', packet)

    _this._body.push(packet.data);
    if (packet.missing === 0) {
        _this._body =  JSON.parse(_this._body.join(''));

        // latency detection
        let receivingTime = new Date().getTime();
        let latency = receivingTime - packet.sendingTime;

        let message = {
          from: _this._from,
          to: _this._to,
          id: _this._id,
          type: _this._type,
          body: _this._body
        }

        _this._onReceived(message, latency);

    } else {
      if (_this._onProgress) _this._onProgress(100*parseInt(packet.missing/_this._totalPackates);
    }
}

return {
    receive: receive
};
  }

  onReceived(callback) {
    _this._onReceived = callback;
  }

  onProgress(callback) {
    _this.onProgress = callback;
  }

}
export default P2PDataSender;
