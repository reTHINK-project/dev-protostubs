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
    _this._to = init.to;
    _this._id = init.id;
    _this._type = init.type;
    _this._body = [init.data];
    _this._totalPackates = init.missing+1;
  }

  receive(packet) {
    let _this = this;


    _this._body.push(packet.data);
    if (packet.last) {

        let fullBody =  JSON.parse(_this._body.join(''));

        // latency detection
        let receivingTime = new Date().getTime();
        let latency = receivingTime - packet.sendingTime;

        let message = {
          from: _this._from,
          to: _this._to,
          id: _this._id,
          type: _this._type,
          body: fullBody
        }

        _this._onReceived(message, latency);

    } else {
      console.debug('[P2PDataReceiver] progressing: ', packet.progress);
      //TODO: limit the rate of provisional responses to avoid overload the runtime.
      //if (_this._onProgress) _this._onProgress(parseInt(100*packet.progress.value/packet.progress.max));
    }

  }

  onReceived(callback) {
    let _this = this;
    _this._onReceived = callback;
  }

  onProgress(callback) {
    let _this = this;
    _this._onProgress = callback;
  }

}
export default P2PDataReceiver;
