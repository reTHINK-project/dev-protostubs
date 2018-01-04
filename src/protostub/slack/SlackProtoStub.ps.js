import slack from 'slack';
import { Syncher, NotificationHandler } from 'service-framework/dist/Syncher';
import IdentityManager from 'service-framework/dist/IdentityManager';
import {ChatManager,ChatController} from 'service-framework/dist/ChatManager';
import MessageBodyIdentity from 'service-framework/dist/IdentityFactory';
import {ContextReporter} from 'service-framework/dist/ContextManager';

class SlackProtoStub {

  constructor(runtimeProtoStubURL, bus, config) {
//    super(runtimeProtoStubURL, bus, config);
    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
    if (!bus) throw new Error('The bus is a needed parameter');
    if (!config) throw new Error('The config is a needed parameter');

    console.log('[SlackProtostub] Constructor Loaded');

    let _this = this;
    this._addedUsersInfo = [];
    this._alreadyCreated = false;
    this._slack = slack;
    this._usersUpdated = false;
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
    this._chatController;
    this._chatControllersExtra = {};
    this._schemaURL;
    this._dataObjectReporterURL;
    this._contextReportersInfo = {};
    this._syncher = new Syncher(runtimeProtoStubURL, bus, config);
    this._chatManager = new ChatManager(runtimeProtoStubURL, bus, config, this._syncher);
    this._contextReporter = new ContextReporter(runtimeProtoStubURL, bus, config, this._syncher);

    this._myUrl = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    this._runtimeSessionURL = config.runtimeURL;
    this._reOpen = false;
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

              _this._getSlackInformation(event.to, event.identity.input.user_id).then((infoReturned) => {

                let userInfo = infoReturned.ownInfo;
                let toInvInfo = infoReturned.invInfo;
                console.log('Slack User information: ', infoReturned);

                // username, userURL, avatar, cn, locale, idp, assertion
                let identity = new MessageBodyIdentity(
                  userInfo.name,
                  'slack://slack.com/' + userInfo.name + '@slack.com',
                  userInfo.profile.image_192,
                  userInfo.name,
                  '', 'slack.com', undefined, userInfo.profile);

                let identityToInv = new MessageBodyIdentity(
                  toInvInfo.name,
                  'slack://slack.com/' + toInvInfo.name + '@slack.com',
                  toInvInfo.profile.image_192,
                  toInvInfo.name,
                  '', 'slack.com', undefined, toInvInfo.profile);

                  event.ack(200);

                  console.log('[SlackProtostub] subscribing object', event.url, identity);

                  if (! _this._alreadyCreated) {
                    _this._alreadyCreated = true;
                    _this._schemaURL = event.schema;
                    _this._dataObjectReporterURL = event.url;

                    _this._chatManager.join(event.url, false, identity).then((chatController) => {
                      _this._prepareChat(chatController);
                      let userToAdd = { user : 'slack://'+userInfo.name+'@slack.com', domain: 'slack.com', id: event.identity.input.user_id, userURL: 'slack://slack.com/'+userInfo.name+'@slack.com', identity: identity};
                      _this._addedUsersInfo.push(userToAdd);

                      _this._createNewContextReporter(identity.userProfile.userURL);

                      let subscription = {
                        urlDataObj: event.url,
                        schema: event.schema,
                        subscribed: true,
                        identity: identity,
                        chat: chatController
                      };

                      _this._subscribedList.push(subscription);

                      if (event.identity.input.user_id) {
                        _this._id = event.identity.input.user_id
                      }
                      _this._channelStatusInfo(event, toInvInfo.id, event.url, toInvInfo.name, identityToInv.userProfile.userURL, event.url, identityToInv, identity.userProfile.userURL, event.identity.input.user_id);
                      //_this._prepareChat(chatController);
                    });
                  }

              });
            } else event.error('Invalid Scheme: ' + schemaSplitted[schemaSplitted.length - 1]);
          } else event.error('Chat Name Missing');
        }
      });
    } else event.error('Access Token Missing');
  }

  _createNewContextReporter(userURL) {
    let _this = this;
    _this._resumeReporter(userURL).then(function(reporterResumed) {

      console.log('[SlackProtostub] TEST creating reporter for', userURL);
      _this._addedUsersInfo.forEach(function(currentUser) {

        if(currentUser.userURL == userURL ) {
          console.log('[SlackProtostub] TEST get presense for ', currentUser);

          let toGetPresence = { token: _this._token, user: currentUser.id };

          _this._slack.users.getPresence(toGetPresence, (err, data) => {

            if (err) {
              console.error('[SlackProtostub] error', err);
            } else {
              console.log('[SlackProtostub] PRESENCE OF USER', currentUser, data);
              if (data.ok) {
                console.log('[SlackProtostub] resumed obj', reporterResumed);
                if (!reporterResumed) {
                  let objPresence = _this._createNewObjPresence(data.presence);
                  console.log('[SlackProtostub] creating a new contextReporter for invitedUSER ', objPresence, currentUser);
                  _this._contextReporter.create(currentUser.userURL, objPresence, ['availability_context'], currentUser.userURL, currentUser.userURL).then(function(context) {
                    console.log('[SlackProtostub] CONTEXT RETURNED', context);
                    context.onSubscription(function(event) {
                      event.accept();
                      console.log('[SlackProtostub] new subs', event);
                    });
                    _this._contextReportersInfo[currentUser.id] = context;
                  }).catch(function(err) {
                    console.error('[SlackProtostub] err', err);
                  });
                } else {
                  _this._contextReportersInfo[currentUser.id] = reporterResumed;
                }

              }
            }
          });
        }
      });
    });



  }

  _createNewObjPresence(info) {
    let _this = this;

    return Object.assign({}, {
        id: '_' + Math.random().toString(36).substr(2, 9),// do we need this?
        values: [{
            value: _this._getPresence(info)
        }]
    });
  };

  _getPresence(info) {
    let status;

    if (info === "active") {
      return 'available';

    } else {
      return 'unavailable';
    }
  }

  get config() { return this._config; }

  get runtimeSession() { return this._runtimeSessionURL; }

  _getSlackInformation(to, ownID) {
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
        let invInfo = _this._usersList.filter(function(value) {
          return value.name === user;
        })[0];
        let ownInfo = _this._usersList.filter(function(value) {
          return value.id === ownID;
        })[0];
        let infotoReturn = {invInfo: invInfo, ownInfo:ownInfo}

        resolve(infotoReturn);

      }, function(error) {
        console.error('[SlackProtostub] ', error);
        reject(error);
      });

    });

  }

  _channelStatusInfo(msg, userID, channelObjUrl, userName, userURL, eventURL, identityToInv, ownUserURL, ownUserID) {
    let _this = this;
    let channelName = msg.value.name.split(' ').join('-').replace(/\//gi, '-');
    let channelExists = _this._channelsList.filter(function(value) { return value.name === channelName; })[0];
    let channelMembers = null;
    // if channel exist, invite user, else channel need to be created and then invite user
    if (channelExists) {
      console.log('[SlackProtostub] channel exist', channelExists);
      channelMembers = _this._channelsList.filter(function(value) { return value.name === channelName; })[0].members;

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
      if (! _this._usersUpdated) {
      _this._addAllUsersToHyperty(channelMembers,userID, userURL, eventURL, userName, identityToInv, ownUserURL, ownUserID);
    }

  }

  _addAllUsersToHyperty(channelMembers, userID, userURL, eventURL, userName, identityToInv, ownUserURL, ownUserID) {
    let _this = this;
    _this._usersUpdated = true;
    let usersInfo = {};
    let toADD = [];
    let userToAdd;
    console.log('[SlackProtostub] lets check if users needs to be added');
    if (channelMembers) {
      _this._usersList.forEach(function(currentUser) {
        channelMembers.forEach(function(s) {
          //console.log('[SlackProtostub] currentUser', currentUser);
          if (s === currentUser.id) {

            if (userID != currentUser.id && ownUserID != currentUser.id) {
              console.log('[SlackProtostub] to add ', currentUser.id);
              let identity = new MessageBodyIdentity(
                currentUser.name,
                'slack://slack.com/' + currentUser.name + '@slack.com',
                currentUser.profile.image_192,
                currentUser.name,
                '', 'slack.com', undefined, currentUser.profile);

              userToAdd = { user : 'slack://'+currentUser.name+'@slack.com', domain: 'slack.com', id: currentUser.id, userURL: 'slack://slack.com/'+currentUser.name+'@slack.com', identity: identity};
              _this._addedUsersInfo.push(userToAdd);

              toADD.push(userToAdd);
            }
          }
        });
      });
    }

    userToAdd = { user : 'slack://'+userName+'@slack.com', domain: 'slack.com', id: userID, userURL: 'slack://slack.com/'+userName+'@slack.com', identity: identityToInv};
    _this._addedUsersInfo.push(userToAdd);
    toADD.push(userToAdd);


    toADD.forEach(function(user) {
      console.log('[SlackProtostub] TEST joining with user', user);
      _this._chatManager.join(_this._dataObjectReporterURL, false, user.identity).then(function(result) {
        console.log('[SlackProtostub] chatmanager JOIN', result, user.userURL, ownUserURL);
        _this._prepareChat(result);
        if (user.userURL !== ownUserURL) {
          _this._createNewContextReporter(user.userURL);
        }

      }).catch(function(error) {
        console.log('[SlackProtostub] chatmanager JOIN error', error);
      });
    })

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
            } else if (msg.type == 'presence_change') {
              _this._handlePresenceChange(msg);
            } else if (msg.type == 'member_joined_channel') {
              _this._handleNewUser(msg);
            }
          };

        }
      });
      _this._sendStatus('live');

    } else {
      console.log('[SlackProtostub] session already exist');
    }
    setTimeout(() => {callback();});
  }

  _resumeReporter(reporterURL) {
    let _this = this;
    return new Promise(function(resolve,reject) {
      console.log('[SlackProtostub] resuming reporter of ', reporterURL);
      _this._syncher.resumeReporters({store: true, reporter: reporterURL}).then((reporters) => {
        let dataObjectReporter;
        let reportersList = Object.keys(reporters);

        console.log('[SlackProtostub] ', reporters, reportersList);
        return resolve(reporters[reportersList.find((key) => key.startsWith('context://'))]);
      });
    })

  }

  _handleNewUser(message) {
    let _this = this;
    let subcribed;
    _this._subscribedList.forEach(function(obj) {
      if (obj.channelID === message.channel) {
        subcribed = obj;
      }
    });
    if (subcribed) {
      let invInfo = _this._usersList.filter(function(value) {
        return value.id === message.user;
      })[0];

      let identity = new MessageBodyIdentity(
        invInfo.name,
        'slack://slack.com/' + invInfo.name + '@slack.com',
        invInfo.profile.image_192,
        invInfo.name,
        '', 'slack.com', undefined, invInfo.profile);

      let userToAdd = { user : 'slack://'+invInfo.name+'@slack.com', domain: 'slack.com', id: message.user, userURL: 'slack://slack.com/'+invInfo.name+'@slack.com', identity: identity};
      _this._addedUsersInfo.push(userToAdd);

      _this._chatManager.join(subcribed.urlDataObj, false, identity).then(function(result) {
        _this._prepareChat(result);
        _this._createNewContextReporter(identity.userProfile.userURL);
      });
    }


  }

  _handlePresenceChange(message) {
    let _this = this;
    if (_this._contextReportersInfo[message.user]) {
      let reporter = _this._contextReportersInfo[message.user];
      reporter.data.values[0].value = _this._getPresence(message.presence);
      console.log('[SlackProtostub] presence of user', message.user, ' updated to', reporter.data);
      //_this._contextReporter.setContext(newContext);
    }
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
    console.log('[SlackProtostub] chat', chat);
    chat.onMessage((msg) => {
      console.info('[SlackProtostub] onMessage: ', msg);
      console.info('[SlackProtostub] Observer - Message History Control ', _this._messageHistoryControl);

      //check if for each msg message has been delivered, and control that for when we have more than one slack user subscribed
      let currentID = chat.child_cseq;
      // check if this child already sent messages
      let channelObjUrl = chat._dataObjectObserver.url;
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

            if (err.message == 'not_in_channel') {
              let channelToJoin = _this._channelsList.filter(function(value) {
                return value.id === channelID;
              })[0];
              let objToJoin = { token: _this._token, name: channelToJoin.name};

              _this._slack.channels.join(objToJoin);
              _this._deliver(msg, channelID);
            }
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
    _this._bus.postMessage(msg);
  }
}


export default function activate(url, bus, config) {
  return {
    name: 'SlackProtoStub',
    instance: new SlackProtoStub(url, bus, config)
  };
}
