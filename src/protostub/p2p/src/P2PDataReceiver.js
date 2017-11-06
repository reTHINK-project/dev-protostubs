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
    _this._progressPercentage = 0;

      if (!_this._textMessage.body || !_this._textMessage.body.value) throw Error('[P2PDataReceiver constructor] invalid Hyperty Resource message. Does not comtain a body.value', init);
  }

  get from() {
    return this._textMessage.from;
  }

  get to() {
    return this._textMessage.to;
  }

  get id() {
    return this._textMessage.id;
  }

  get type() {
    return this._textMessage.type;
  }

  receiveText(packet) {
    let _this = this;

    _this._data.push(packet.data);

    _this._progress = _this._progress + packet.data.length;

    if (_this._progress === _this._dataSize){
      let content =  _this._data.join('');
      _this._processLastMessage(content);
    } else {
      let currentProgressPercentage = parseInt(100*_this._progress/_this._dataSize);
      let reportProgress = currentProgressPercentage - _this._progressPercentage > 0;

      if (reportProgress) {
        _this._progressPercentage = currentProgressPercentage;
        console.debug('[P2PDataReceiver] progressing: ', _this._progressPercentage);

        _this._onProgress(_this._progressPercentage);
    }
  }
}

  receiveBinary(packet) {
    let _this = this;

    _this._data.push(packet);

    _this._progress = _this._progress + packet.byteLength;

    if (_this._progress === _this._dataSize){
      _this._processLastMessage(_this._data);
    } else {
      if (_this._onProgress) {
        let currentProgressPercentage = parseInt(100*_this._progress/_this._dataSize);
        let reportProgress = currentProgressPercentage - _this._progressPercentage > 0;

        if (reportProgress) {
          _this._progressPercentage = currentProgressPercentage;
          console.debug('[P2PDataReceiver] progressing: ', _this._progressPercentage);

          _this._onProgress(_this._progressPercentage);
        }

      }
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
