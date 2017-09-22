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

    _this._textMessage = init.textMessage;
    _this._dataSize = init.dataSize;
    _this._data = [];
    _this._progress = 0;
    _this._sendingTime = init.sendingTime;

      if (!_this._textMessage.body || !_this._textMessage.body.value) throw Error('[P2PDataReceiver constructor] invalid Hyperty Resource message. Does not comtain a body.value', init);
  }

  receiveText(packet) {
    let _this = this;

    _this._data.push(packet.data);

    _this._progress = _this._progress + packet.data.size;

    if (_this._progress === _this._dataSize){
      let content =  JSON.parse(_this._data.join(''));
      _this._processLastMessage(content);
    } else {
//      console.debug('[P2PDataReceiver] progressing: ', _this._progress);
      //TODO: limit the rate of provisional responses to avoid overload the runtime.
      //if (_this._onProgress) _this._onProgress(parseInt(100*packet.progress.value/packet.progress.max));
    }
  }

  receiveBinary(packet) {
    let _this = this;

    _this._data.push(packet);

    _this._progress = _this._progress + packet.byteLength;

    if (_this._progress === _this._dataSize){
      _this._processLastMessage(_this._data);
    } else {
//      console.debug('[P2PDataReceiver] progressing: ', _this._progress);
      //TODO: limit the rate of provisional responses to avoid overload the runtime.
      //if (_this._onProgress) _this._onProgress(parseInt(100*packet.progress.value/packet.progress.max));
    }
  }

  _processLastMessage(content){
      let _this = this;

        // latency detection
        let receivingTime = new Date().getTime();
        let latency = receivingTime - _this._sendingTime;

        let message = _this._textMessage;

        message.body.value.content = content;

        _this._onReceived(message, latency);

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
