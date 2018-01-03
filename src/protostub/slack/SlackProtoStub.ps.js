import slack from 'slack';
import { Syncher, NotificationHandler } from 'service-framework/dist/Syncher';
import IdentityManager from 'service-framework/dist/IdentityManager';
import {ChatManager,ChatController} from 'service-framework/dist/ChatManager';
import MessageBodyIdentity from 'service-framework/dist/IdentityFactory';

class SlackProtoStub {

  constructor(runtimeProtoStubURL, bus, config) {
//    super(runtimeProtoStubURL, bus, config);
    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
    if (!bus) throw new Error('The bus is a needed parameter');
    if (!config) throw new Error('The config is a needed parameter');

    console.log('[SlackProtostub] Constructor Loaded');

    let _this = this;
    this._slack = slack;
    console.log('slack->', slack);
    this._subscribedList = [];
    this._messageHistoryControl = {};
    this._usersList = [];
    this._groupsList = [];
    this._channelsList = [];
    this._imsList = [];
    this._observer;
    this._id = 0;
    this._continuousOpen = true;
    this._token = '';

    this._chatManager = new ChatManager(runtimeProtoStubURL, bus, config);

    this._myUrl = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    this._runtimeSessionURL = config.runtimeURL;
    this._reOpen = false;

    console.log('[SlackProtostub] instantiate syncher with runtimeUrl', runtimeProtoStubURL);
//    this._syncher = new Syncher(runtimeProtoStubURL, bus, config);

/*    this._syncher.onNotification((event) => {
      console.log('[SlackProtostub] On Syncher Notification', event);
    });*/

    this._chatManager.onInvitation((event) => {
      _this._onSlackInvitation(event);
    });

    this._notificationHandler = new NotificationHandler(bus);

    this._notificationHandler.onNotification('comm', (event) => {
      _this._chatManager.processNotification(event);
    });



    bus.addListener('*', (msg) => {
      //ignore msg sent by himself
      if (msg.from !== runtimeProtoStubURL) {
        console.log('[SlackProtostub] new msg ', msg);
        switch (msg.type) {
          case 'create': _this._notificationHandler.onCreate(msg); break;
          case 'delete': _this._notificationHandler.onDelete(msg); break;
        }
      }
    });

    _this._sendStatus('created');

  }

  _onSlackInvitation(event) {
    let _this = this;

    if (event.identity.hasOwnProperty('accessToken') && event.identity.accessToken) {

      this._token = event.identity.accessToken;

      _this._open(this._token, ()=> {
        if (_this._filter(event)) {

          console.log('[SlackProtostub] After Filter', event);

          let schemaUrl = event.schema;
          if (event.value.name) {

            let schemaSplitted =  schemaUrl.split('/');

            if (schemaSplitted[schemaSplitted.length - 1] === 'Communication') {

              _this._getSlackInformation(event.to).then((userInfo) => {

                console.log('Slack User information: ', userInfo);

                // username, userURL, avatar, cn, locale, idp, assertion
                let identity = new MessageBodyIdentity(
                  userInfo.name,
                  'slack://slack.com/' + userInfo.name + '@slack.com',
                  userInfo.profile.image_192,
                  userInfo.name,
                  '', 'slack.com', undefined, userInfo.profile);

                  //TODO: add channelId to userProfile and remove _subscribedList

                  event.ack(200);
                  console.log('[SlackProtostub] subscribing object', event.url);

                  _this._chatManager.join(event.url, false, identity).then((chatController) => {

                    let subscription = {
                      urlDataObj: event.url,
                      schema: event.schema,
                      subscribed: true,
                      identity: identity,
                      chat: chatController
                    };

                    _this._subscribedList.push(subscription);

                    if (event.identity.input.user_id) {
                      _this._id = event.identity.input.user_id;
                    }

                    _this._channelStatusInfo(event, userInfo.id, event.url);

                    _this._prepareChat(chatController);
                });
              });
            } else event.error('Invalid Scheme: ' + schemaSplitted[schemaSplitted.length - 1]);
          } else event.error('Chat Name Missing');
        }
      });
    } else event.error('Access Token Missing');
  }

  // To acknowledge the invitation received

/*  _ack(msg) {

    let _this = this;

    //send ack response message
     _this._bus.postMessage({
       id: msg.id, type: 'response', from: msg.to, to: msg.from,
       body: { code: 200 }
     });

  }*/

  get config() { return this._config; }

  get runtimeSession() { return this._runtimeSessionURL; }

  _getSlackInformation(to) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let URLUsersList = 'https://slack.com/api/users.list?token=' + _this._token;
      let URLGroupsList = 'https://slack.com/api/groups.list?token=' + _this._token;
      let URLChannelsList = 'https://slack.com/api/channels.list?token=' + _this._token;
      let URLImsList = 'https://slack.com/api/im.list?token=' + _this._token;

      let UsersListPromise = _this._sendHTTPRequest('GET', URLUsersList);
      let GroupsListPromise = _this._sendHTTPRequest('GET', URLGroupsList);
      let ChannelsListPromise = _this._sendHTTPRequest('GET', URLChannelsList);
      let ImsListPromise = _this._sendHTTPRequest('GET', URLImsList);

      Promise.all([UsersListPromise, GroupsListPromise, ChannelsListPromise, ImsListPromise]).then(function(result) {
        _this._usersList = result[0].members;
        _this._groupsList = result[1].groups;
        _this._channelsList = result[2].channels;
        _this._imsList = result[3].ims;

        //get userID to invite
        let toSplitted = to.split('://')[1];
        let user = toSplitted.split('@')[0];
        let userInfo = _this._usersList.filter(function(value) {
          return value.name === user;
        })[0];

        resolve(userInfo);

      }, function(error) {
        console.error('[SlackProtostub] ', error);
        reject(error);
      });

    });

  }

  _channelStatusInfo(msg, userID, channelObjUrl) {
    let _this = this;
    let channelName = msg.value.name.split(' ').join('-').replace(/\//gi, '-');
    let channelExists = _this._channelsList.filter(function(value) { return value.name === channelName; })[0];

    // if channel exist, invite user, else channel need to be created and then invite user
    if (channelExists) {
      console.log('[SlackProtostub] channel exist', channelExists);

      let channelMembers = _this._channelsList.filter(function(value) { return value.name === channelName; })[0].members;
      let alreadyOnChannel = false;

      channelMembers.forEach(function(s) {
        if (s === userID) {
          alreadyOnChannel = true;
        }
      });
      console.log('[SlackProtostub] channel members', channelMembers, '   ->', alreadyOnChannel);

      let count = 0;
      let key = 0;
      _this._subscribedList.forEach(function(obj) {
        if (obj.urlDataObj === channelObjUrl ) {
          key = count;
        }
        count++;
      });
      _this._subscribedList[key].channelID = channelExists.id;

      // if user isnt on Channel invite, else just set channelID
      if (!alreadyOnChannel) {
        _this._invite(userID, channelExists.id);
      }

    } else {
      _this._createChannel(channelName, channelObjUrl).then(function(result) {
        console.log('[SlackProtostub]  after create channel ', result );
        if (result) {
          _this._invite(userID,'',channelObjUrl);
        }
      });
    }
  }

  _filter(msg) {
    if (msg.via === this._myUrl) {
      return false;
    } else {
      return true;
    }
  }

  _open(token, callback) {
    let _this = this;

    if (!_this._session) {
      console.log('[SlackProtostub] creating Session for token:', token);
      _this._sendStatus('in-progress');


      _this._session = this._slack.rtm.connect({token});
      console.log('[SlackProtostub] session', _this._session);
      _this._session.createdTime = new Date().getTime() / 1000;

      _this._session.then(function(result) {
        if (result.ok) {
          let ws = new WebSocket(result.url);
          ws.onmessage = function (event) {
            let msg = JSON.parse(event.data);
            console.log('[SlackProtostub] new msg on ws', msg);
            if (msg.type == 'message') {
              _this._handleNewMessage(msg);

            }
          };

        }
      });
      //
      // //_this._session.listen({token});
      // _this._session.message(message=> {
      //   console.log('[SlackProtostub] new message on session', message);
      //   _this._handleNewMessage(message);
      // });
      _this._sendStatus('live');

    } else {
      console.log('[SlackProtostub] session already exist');
    }
    setTimeout(() => {callback();});
  }

  _handleNewMessage(message) {
    let _this = this;
    let channelID = '';
    let chat;
    _this._subscribedList.forEach(function(obj) {
      if (obj.channelID === message.channel) {
        channelID = obj.channelID;
        chat = obj.chat;
      }
    });

    if (message.channel && message.ts > _this._session.createdTime ) {
      if (message.channel === channelID && message.user !== _this._id || (!message.hasOwnProperty('bot_id') && message.user === _this._id && message.channel === channelID)) {

        _this._getUserInfo(message.user).then((identity) => {
          console.log('[SlackProtostub] msg to addChild',  message.text, '     identity:', identity);
          chat.send( message.text, identity);
        });
      }
    }
  }

/*****************************************************************************************************
* It retrieves information from a slack user and creates a reTHINK Identity object with it
* @param {string} user - slack user id
* @return {Promise<Object>} Returns a promise with an Identity object resolved
*******************************************************************************************************/

  _getUserInfo(user) {
    let _this = this;

    return new Promise(function(resolve) {
      _this._slack.users.info({token: _this._token, user: user}, (err, data) => {
        if (err) {
          console.error('[SlackProtostub] error', err);
        } else {

          console.log('[SlackProtostub getUserInfo] ', data);
          let identity = new MessageBodyIdentity(
                    data.user.name,
                    'slack://slack.com/' + data.user.name + '@slack.com',
                    data.user.profile.image_192,
                    data.user.name,
                    '', 'slack.com');

          resolve(identity);
        }
      });
    });

  }

  _prepareChat(chat) {
    let _this = this;
    chat.onMessage((msg) => {
      console.info('[SlackProtostub] onMessage: ', msg);
      console.info('[SlackProtostub] Observer - Message History Control ', _this._messageHistoryControl);

      //check if for each msg message has been delivered, and control that for when we have more than one slack user subscribed
      let currentID = chat.child_cseq;
      // check if this child already sent messages
      let channelObjUrl = chat.url;
      let channelID;

      _this._subscribedList.forEach(function(obj) {
        if (obj.urlDataObj === channelObjUrl ) {
          channelID = obj.channelID;
        }
      });

      if( _this._messageHistoryControl.hasOwnProperty(channelObjUrl)) {

        // in that case check if the currentID its equal to oldID
        let oldID = _this._messageHistoryControl[channelObjUrl].id;
        if ( _this._messageHistoryControl[channelObjUrl].id !== currentID ) {
          _this._messageHistoryControl[channelObjUrl].id = currentID;
          _this._deliver(msg, channelID);
        }
      } else {
        _this._messageHistoryControl[channelObjUrl] = {id: currentID};
        _this._deliver(msg, channelID);
      }

    });
  }


  _invite(idUser, idChannel = '', channelObjUrl) {
    let _this = this;

    if (idChannel == '') {
      _this._subscribedList.forEach(function(obj) {
        if (obj.urlDataObj === channelObjUrl ) {
          idChannel = obj.channelID;
        }
      });
    }

    let toInvite = { token: _this._token, channel: idChannel, user: idUser };

    _this._slack.channels.invite(toInvite, (err, data) => {
      if (err) {
        console.error('[SlackProtostub] error', err);
      } else {

        console.log('[SlackProtostub] user invited with sucess', data);
      }
    });
  }

  _deliver(msg, channelID) {
    let _this = this;


    if (channelID && msg.value) {

      if (msg.hasOwnProperty('identity') && msg.identity.hasOwnProperty('userProfile')
      && msg.identity.userProfile.hasOwnProperty('name') && msg.identity.userProfile.name) {

        let text = '' + msg.identity.userProfile.name + ': ' + msg.value.content;
        let message = { as_user: true, token: _this._token, channel: channelID, text: text};
        console.log('[SlackProtostub] (PostMessage slack api) token(', _this._token, ')  channel(', channelID, ') text(',  msg.value.content, ')');

        _this._slack.chat.postMessage(message, function(err, data) {
          if (err) {
            console.error('[SlackProtostub] error', err);
          } else {
            console.log('[SlackProtostub] PostMessage with Sucess', data);
          }
        });
      }
    }
  }

  _createChannel(channelName, channelObjUrl) {
    let _this = this;

    return new Promise(function(resolve) {

      let toCreate = { token: _this._token, name: channelName };
      _this._slack.channels.create(toCreate, (err, data) => {
        if (err) {
          console.error('[SlackProtostub] ', err);
        } else {
          if (data.ok) {
            console.log('[SlackProtostub] Channel Created with Sucess ', data);
            let count = 0;
            let key = 0;
            _this._subscribedList.forEach(function(obj) {
              if (obj.urlDataObj === channelObjUrl ) {
                key = count;
              }
              count++;
            });
            _this._subscribedList[key].channelID = data.channel.id;
            resolve(true);
          }
        }
      });
    });
  }

  _sendHTTPRequest(method, url) {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      if ('withCredentials' in xhr) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== 'undefined') {
        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        // Otherwise, CORS is not supported by the browser.
        xhr = null;
      }
      if (xhr) {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              let info = JSON.parse(xhr.responseText);
              resolve(info);
            } else if (xhr.status === 400) {
              reject('There was an error processing the token');
            } else {
              reject('something else other than 200 was returned');
            }
          }
        };
        xhr.send();
      } else {
        reject('CORS not supported');
      }
    });
  }

  _sendStatus(value, reason) {
    let _this = this;

    console.log('[SlackProtostub status changed] to ', value);

    _this._state = value;

    let msg = {
      type: 'update',
      from: _this._myUrl,
      to: _this._myUrl + '/status',
      body: {
        value: value
      }
    };

    if (reason) {
      msg.body.desc = reason;
    }
    debugger;
    _this._bus.postMessage(msg);
  }
}


export default function activate(url, bus, config) {
  return {
    name: 'SlackProtoStub',
    instance: new SlackProtoStub(url, bus, config)
  };
}
