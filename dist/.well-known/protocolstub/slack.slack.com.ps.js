"use strict";

System.register(["slack"], function (_export, _context) {
  "use strict";

  var slack, protostubDescriptor, SlackProtoStub;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [function (_slack) {
      slack = _slack.default;
    }],
    execute: function () {
      //import { Syncher, NotificationHandler } from 'service-framework/dist/Syncher';
      //import IdentityManager from 'service-framework/dist/IdentityManager';
      //import {ChatManager} from 'runtime-core/dist/ChatManager';
      //import MessageBodyIdentity from 'service-framework/dist/IdentityFactory';
      //import {ContextReporter} from 'service-framework/dist/ContextManager';
      protostubDescriptor = {
        "name": "SlackProtoStub",
        "language": "javascript",
        "description": "Protostub to exchange messages with slack",
        "signature": "",
        "configuration": {},
        "constraints": {
          "browser": true
        },
        "interworking": true,
        "objectName": "slack.slack.com"
      };

      _export("default", SlackProtoStub =
      /*#__PURE__*/
      function () {
        function SlackProtoStub() {
          _classCallCheck(this, SlackProtoStub);
        }

        _createClass(SlackProtoStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, bus, config, factory) {
            if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
            if (!bus) throw new Error('The bus is a needed parameter');
            if (!config) throw new Error('The config is a needed parameter');
            console.log('[SlackProtostub] Constructor Loaded');

            var _this = this;

            this._ws = null;
            this._toSubscribePresence = [];
            this._addedUsersInfo = [];
            this._alreadyCreated = false;
            this._slack = slack;
            this._usersUpdated = false;
            this._subscribedList = [];
            this._messageHistoryControl = {};
            this._usersList = []; //this._groupsList = [];

            this._channelsList = []; //this._imsList = [];
            //this._observer;

            this._id = 0; //this._continuousOpen = true;

            this._token = ''; //this._chatController;
            //this._chatControllersExtra = {};
            //this._schemaURL;

            this._dataObjectReporterURL;
            this._factory = factory;
            this._contextReportersInfo = {};
            this._syncher = factory.createSyncher(runtimeProtoStubURL, bus, config);
            this._chatManager = factory.createChatManager(runtimeProtoStubURL, bus, config, this._syncher);
            this._contextReporter = factory.createContextReporter(runtimeProtoStubURL, bus, config, this._syncher);
            this._myUrl = runtimeProtoStubURL;
            this._bus = bus;
            this._config = config;
            this._runtimeSessionURL = config.runtimeURL;
            this._reOpen = false;

            this._chatManager.onInvitation(function (event) {
              _this._onSlackInvitation(event);
            });

            this._notificationHandler = factory.createNotificationHandler(bus);

            this._notificationHandler.onNotification('comm', function (event) {
              _this._chatManager.processNotification(event);
            });

            bus.addListener('*', function (msg) {
              //ignore msg sent by himself
              if (msg.from !== runtimeProtoStubURL) {
                console.log('[SlackProtostub] new msg ', msg);

                switch (msg.type) {
                  case 'create':
                    _this._notificationHandler.onCreate(msg);

                    break;

                  case 'delete':
                    _this._notificationHandler.onDelete(msg);

                    break;
                }
              }
            });

            _this._sendStatus('created');
          }
        }, {
          key: "_filter",
          value: function _filter(msg) {
            if (msg.via === this._myUrl) {
              return false;
            } else {
              return true;
            }
          }
          /*****************************************************************************************************
          * It Open a new Session using received token connect to a webSocket Url,
          *  where handle all received messages on this socket
          * @param {string} token - message with a new user added
          *******************************************************************************************************/

        }, {
          key: "_open",
          value: function _open(token, callback) {
            var _this = this;

            if (!_this._session) {
              console.log('[SlackProtostub] creating Session for token:', token);

              _this._sendStatus('in-progress');

              _this._session = this._slack.rtm.connect({
                token: token,
                batch_presence_aware: 1,
                presence_sub: true
              });
              console.log('[SlackProtostub] session', _this._session);
              _this._session.createdTime = new Date().getTime() / 1000;

              _this._session.then(function (result) {
                console.log('[SlackProtostub] Session result', result);

                if (result.ok) {
                  _this._ws = new WebSocket(result.url);
                  console.log('[SlackProtostub] websocket', _this._ws);
                  console.log('[SlackProtostub] websocket url ', _this._ws.url);

                  _this._ws.onmessage = function (event) {
                    var msg = JSON.parse(event.data);
                    console.log('[SlackProtostub] new msg on webSocket', msg);

                    if (msg.type == 'message') {
                      _this._handleNewMessage(msg);
                    } else if (msg.type == 'presence_change') {
                      _this._handlePresenceChange(msg);
                    } else if (msg.type == 'member_joined_channel') {
                      _this._handleNewUser(msg);
                    }
                  };

                  _this._ws.onerror = function (error) {
                    console.log('[SlackProtostub] websocker Error', error);
                  };
                }
              });

              _this._sendStatus('live');
            } else {
              console.log('[SlackProtostub] session already exist');
            }

            setTimeout(function () {
              callback();
            });
          }
          /*****************************************************************************************************
          * It Resumes all reporters including contextreporters
          * @param {string} reporterURL - message with a new user added
          * @return {Promise<Object>} Returns a promise with a reporter DataObject
          *******************************************************************************************************/

        }, {
          key: "_resumeReporter",
          value: function _resumeReporter(reporterURL) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              console.log('[SlackProtostub] resuming reporter of ', reporterURL);

              _this._syncher.resumeReporters({
                store: true,
                reporter: reporterURL
              }).then(function (reporters) {
                var dataObjectReporter;
                var reportersList = Object.keys(reporters);
                console.log('[SlackProtostub] ', reporters, reportersList);
                var i = 0;
                reportersList.forEach(function (key) {
                  if (reporters[key]._name === reporterURL && key.startsWith('context://')) {
                    console.log('[SlackProtostub] reporter to return', reporters[key]);
                    return resolve(reporters[key]);
                  }
                });
                return resolve(false);
              });
            });
          }
          /*****************************************************************************************************
          * It is called when a event ocurred related with a invitation of a slack User
          * @param {Object} event - Object event
          *******************************************************************************************************/

        }, {
          key: "_onSlackInvitation",
          value: function _onSlackInvitation(event) {
            var _this = this;

            if (event.identity.hasOwnProperty('accessToken') && event.identity.accessToken) {
              this._token = event.identity.accessToken;

              _this._open(this._token, function () {
                if (_this._filter(event)) {
                  console.log('[SlackProtostub] After Filter', event);
                  var schemaUrl = event.schema;

                  if (event.value.name) {
                    var schemaSplitted = schemaUrl.split('/');

                    if (schemaSplitted[schemaSplitted.length - 1] === 'Communication') {
                      _this._getSlackInformation(event.to, event.identity.input.user_id).then(function (infoReturned) {
                        var userInfo = infoReturned.ownInfo;
                        var toInvInfo = infoReturned.invInfo;
                        console.log('Slack User information: ', infoReturned, event); // username, userURL, avatar, cn, locale, idp, assertion

                        var identity = _this._factory.createMessageBodyIdentity(userInfo.name, 'slack://slack.com/' + userInfo.name + '@slack.com', userInfo.profile.image_192, userInfo.name, '', 'slack.com', undefined, userInfo.profile);

                        var identityToInv = _this._factory.createMessageBodyIdentity(toInvInfo.name, 'slack://slack.com/' + toInvInfo.name + '@slack.com', toInvInfo.profile.image_192, toInvInfo.name, '', 'slack.com', undefined, toInvInfo.profile);

                        event.ack(200);
                        console.log('[SlackProtostub] subscribing object', event.url, identity);
                        var neededInfoInvited = {
                          id: toInvInfo.id,
                          name: toInvInfo.name,
                          userURL: identityToInv.userProfile.userURL,
                          identity: identityToInv
                        };
                        var neededOwnInfo = {
                          id: event.identity.input.user_id,
                          userURL: identity.userProfile.userURL
                        };

                        if (!_this._alreadyCreated) {
                          console.log('[SlackProtostub] Not Already created', event);
                          _this._alreadyCreated = true; //_this._schemaURL = event.schema;

                          _this._dataObjectReporterURL = event.url;
                          var userToAdd = {
                            user: 'slack://' + userInfo.name + '@slack.com',
                            domain: 'slack.com',
                            id: event.identity.input.user_id,
                            userURL: 'slack://slack.com/' + userInfo.name + '@slack.com',
                            identity: identity
                          };

                          _this._addedUsersInfo.push(userToAdd);

                          _this._createNewContextReporter(identity.userProfile.userURL).then(function (creation) {
                            //debugger;
                            if (creation == true) {
                              _this._chatManager.join(event.url, false, identity).then(function (chatController) {
                                _this._prepareChat(chatController);

                                var msgQuery = {
                                  "type": "presence_sub",
                                  "ids": _this._toSubscribePresence
                                };
                                console.log('[SlackProtostub] websocket sentmessage', _this._ws.readyState, msgQuery);

                                _this._ws.send(JSON.stringify(msgQuery)); //_this._createNewContextReporter(identity.userProfile.userURL);


                                var subscription = {
                                  urlDataObj: event.url,
                                  schema: event.schema,
                                  subscribed: true,
                                  identity: identity,
                                  chat: chatController
                                };

                                _this._subscribedList.push(subscription);

                                console.log('[SlackProtostub] subscribed list', _this._subscribedList);

                                if (event.identity.input.user_id) {
                                  _this._id = event.identity.input.user_id;
                                } //_this._channelStatusInfo(event, toInvInfo.id, event.url, toInvInfo.name, identityToInv.userProfile.userURL, event.url, identityToInv, identity.userProfile.userURL, event.identity.input.user_id);


                                _this._channelStatusInfo(event, neededInfoInvited, neededOwnInfo);
                              });
                            }
                          });
                        } else {
                          console.log('[SlackProtostub] Already created', event);
                          console.log(_this._subscribedList.length);

                          if (_this._subscribedList.length != 0) {
                            _this._channelStatusInfo(event, neededInfoInvited, neededOwnInfo);
                          } else {
                            var testURL = event.to.split('//')[0] + '//slack.com/' + event.to.split('//')[1];

                            _this._createNewContextReporter(testURL);
                          }
                        }
                      });
                    } else event.error('Invalid Scheme: ' + schemaSplitted[schemaSplitted.length - 1]);
                  } else event.error('Chat Name Missing');
                }
              });
            } else event.error('Access Token Missing');
          }
          /*****************************************************************************************************
          * It creates a new contextReporter with userURL
          * @param {string} userURL - userURL of user to create a new ContextReporter
          *******************************************************************************************************/

        }, {
          key: "_createNewContextReporter",
          value: function _createNewContextReporter(userURL) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              _this._resumeReporter(userURL).then(function (reporterResumed) {
                console.log('[SlackProtostub] TEST creating reporter for', userURL);

                _this._addedUsersInfo.forEach(function (currentUser) {
                  if (currentUser.userURL == userURL) {
                    console.log('[SlackProtostub] TEST get presense for ', currentUser);
                    var toGetPresence = {
                      token: _this._token,
                      user: currentUser.id
                    };

                    _this._slack.users.getPresence(toGetPresence, function (err, data) {
                      if (err) {
                        console.error('[SlackProtostub] error', err);
                        return resolve(false);
                      } else {
                        console.log('[SlackProtostub] PRESENCE OF USER', currentUser, data);

                        if (data.ok) {
                          _this._toSubscribePresence.push(currentUser.id);

                          console.log('[SlackProtostub] toSubscribeArray', _this._toSubscribePresence, 'intext', JSON.stringify(_this._toSubscribePresence));
                          console.log('[SlackProtostub] resumed obj', reporterResumed);

                          if (!reporterResumed) {
                            var objPresence = _this._createNewObjPresence(data.presence);

                            console.log('[SlackProtostub] creating a new contextReporter for invitedUSER ', objPresence, currentUser); //debugger;

                            _this._contextReporter.create(currentUser.userURL, objPresence, ['availability_context'], currentUser.userURL, currentUser.userURL).then(function (context) {
                              console.log('[SlackProtostub] CONTEXT RETURNED', context);
                              context.onSubscription(function (event) {
                                event.accept();
                                console.log('[SlackProtostub] new subs', event);
                              });
                              _this._contextReportersInfo[currentUser.id] = context;
                              return resolve(true);
                            })["catch"](function (err) {
                              console.error('[SlackProtostub] err', err);
                            });
                          } else {
                            console.log('[SlackProtostub] reporter for this userURL:', userURL, ' already exists ', reporterResumed);
                            _this._contextReportersInfo[currentUser.id] = reporterResumed;
                            return resolve(true);
                          }

                          console.log('[SlackProtostub] websocket readyState', _this._ws.readyState);
                        } else {
                          return resolve(false);
                        }
                      }
                    });
                  }
                });
              })["catch"](function (error) {
                console.log('[SlackProtostub] error', error);
                return resolve(false);
              });
            });
          }
          /*****************************************************************************************************
          * It returns a dataobject with info of a slack User
          * @param {string} info - status info of a slackUser
          * @return {object} return a object related with info of a slackUser
          *******************************************************************************************************/

        }, {
          key: "_createNewObjPresence",
          value: function _createNewObjPresence(info) {
            var _this = this;

            return Object.assign({}, {
              id: '_' + Math.random().toString(36).substr(2, 9),
              // do we need this?
              values: [{
                value: _this._getPresence(info),
                name: 'availability',
                type: 'availability_status',
                unit: 'pres'
              }]
            });
          }
        }, {
          key: "_getPresence",

          /*****************************************************************************************************
          * It returns a string with info related with presence of a user
          * @param {string} info - status info of a slackUser
          * @return {string} return info of presence of a slack user
          *******************************************************************************************************/
          value: function _getPresence(info) {
            var status;

            if (info === "active") {
              return 'available';
            } else {
              return 'unavailable';
            }
          }
          /*****************************************************************************************************
          * It get some info about channels, users, and groups of slack using token and returns info
          * of who invite and who was invited
          * @param {string} to - status info of a slackUser
          * @param {string} ownID - status info of a slackUser
          * @return {object} return object with info of who invite and who was invited
          *******************************************************************************************************/

        }, {
          key: "_getSlackInformation",
          value: function _getSlackInformation(to, ownID) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              var URLUsersList = 'https://slack.com/api/users.list?token=' + _this._token; //let URLGroupsList = 'https://slack.com/api/groups.list?token=' + _this._token;

              var URLChannelsList = 'https://slack.com/api/channels.list?token=' + _this._token; //let URLImsList = 'https://slack.com/api/im.list?token=' + _this._token;

              var UsersListPromise = _this._sendHTTPRequest('GET', URLUsersList); //let GroupsListPromise = _this._sendHTTPRequest('GET', URLGroupsList);


              var ChannelsListPromise = _this._sendHTTPRequest('GET', URLChannelsList); //let ImsListPromise = _this._sendHTTPRequest('GET', URLImsList);


              Promise.all([UsersListPromise, ChannelsListPromise]).then(function (result) {
                //Promise.all([UsersListPromise, GroupsListPromise, ChannelsListPromise, ImsListPromise]).then(function(result) {
                _this._usersList = result[0].members; //_this._groupsList = result[1].groups;

                _this._channelsList = result[1].channels; //_this._imsList = result[2].ims;
                //get userID to invite

                var toSplitted = to.split('://')[1];
                var user = toSplitted.split('@')[0];

                var invInfo = _this._usersList.filter(function (value) {
                  return value.name === user;
                })[0];

                var ownInfo = _this._usersList.filter(function (value) {
                  return value.id === ownID;
                })[0];

                var infotoReturn = {
                  invInfo: invInfo,
                  ownInfo: ownInfo
                };
                resolve(infotoReturn);
              }, function (error) {
                console.error('[SlackProtostub] ', error);
                reject(error);
              });
            });
          }
          /*****************************************************************************************************
          * It check if channelexist, if user is on channel and check which users need to be invited
          * @param {string} msg - message related with event received
          * @param {Object} neededInfoInvited - info about user to be invited
          * @param {Object} neededOwnInfo - info about user own info
          *******************************************************************************************************/

        }, {
          key: "_channelStatusInfo",
          value: function _channelStatusInfo(msg, neededInfoInvited, neededOwnInfo) {
            //_channelStatusInfo(msg, userID, channelObjUrl, userName, userURL, eventURL, identityToInv, ownUserURL, ownUserID) {
            var _this = this;

            var channelName = msg.value.name.split(' ').join('-').replace(/\//gi, '-');

            var channelExists = _this._channelsList.filter(function (value) {
              return value.name === channelName;
            })[0];

            var channelMembers = null; // if channel exist, invite user, else channel need to be created and then invite user

            if (channelExists) {
              console.log('[SlackProtostub] channel exist', channelExists);
              channelMembers = _this._channelsList.filter(function (value) {
                return value.name === channelName;
              })[0].members;
              var alreadyOnChannel = false;
              channelMembers.forEach(function (s) {
                if (s === neededInfoInvited.id) {
                  alreadyOnChannel = true;
                }
              });
              console.log('[SlackProtostub] channel members', channelMembers, '   ->', alreadyOnChannel);
              var count = 0;
              var key = 0;

              _this._subscribedList.forEach(function (obj) {
                if (obj.urlDataObj === msg.url) {
                  key = count;
                }

                count++;
              });

              console.log('[SlackProtostub] channels', _this._subscribedList, _this._subscribedList.length, key);
              _this._subscribedList[key].channelID = channelExists.id; //debugger;
              // if user isnt on Channel invite, else just set channelID

              if (!alreadyOnChannel) {
                _this._invite(neededInfoInvited.id, channelExists.id);
              }
            } else {
              _this._createChannel(channelName, msg.url).then(function (result) {
                console.log('[SlackProtostub]  after create channel ', result);

                if (result) {
                  _this._invite(neededInfoInvited.id, '', msg.url);
                }
              });
            }

            if (!_this._usersUpdated) {
              _this._addAllUsersToHyperty(channelMembers, neededInfoInvited, neededOwnInfo); //_this._addAllUsersToHyperty(channelMembers,userID, userURL, eventURL, userName, identityToInv, ownUserURL, ownUserID);

            } else {
              console.log('[SlackProtostub] users Already Updated');
            }
          }
          /*****************************************************************************************************
          * It add all users to dataobject and  create contextReporters for each one
          * @param {Object[]} channelMembers - List of channel Members
          * @param {Object} neededInfoInvited - info about user to be invited
          * @param {Object} neededOwnInfo - info about user own info
          *******************************************************************************************************/

        }, {
          key: "_addAllUsersToHyperty",
          value: function _addAllUsersToHyperty(channelMembers, neededInfoInvited, neededOwnInfo) {
            //_addAllUsersToHyperty(channelMembers, userID, userURL, eventURL, userName, identityToInv, ownUserURL, ownUserID) {
            var _this = this;

            _this._usersUpdated = true;
            var usersInfo = {};
            var toADD = [];
            var userToAdd;
            console.log('[SlackProtostub] lets check if users needs to be added');

            if (channelMembers) {
              _this._usersList.forEach(function (currentUser) {
                channelMembers.forEach(function (s) {
                  //console.log('[SlackProtostub] currentUser', currentUser);
                  if (s === currentUser.id) {
                    if (neededInfoInvited.id != currentUser.id && neededOwnInfo.id != currentUser.id) {
                      console.log('[SlackProtostub] to add ', currentUser.id);

                      var identity = _this._factory.createMessageBodyIdentity(currentUser.name, 'slack://slack.com/' + currentUser.name + '@slack.com', currentUser.profile.image_192, currentUser.name, '', 'slack.com', undefined, currentUser.profile);

                      userToAdd = {
                        user: 'slack://' + currentUser.name + '@slack.com',
                        domain: 'slack.com',
                        id: currentUser.id,
                        userURL: 'slack://slack.com/' + currentUser.name + '@slack.com',
                        identity: identity
                      };

                      _this._addedUsersInfo.push(userToAdd);

                      toADD.push(userToAdd);
                    }
                  }
                });
              });
            }

            userToAdd = {
              user: 'slack://' + neededInfoInvited.name + '@slack.com',
              domain: 'slack.com',
              id: neededInfoInvited.id,
              userURL: 'slack://slack.com/' + neededInfoInvited.name + '@slack.com',
              identity: neededInfoInvited.identity
            };

            _this._addedUsersInfo.push(userToAdd);

            toADD.push(userToAdd);
            toADD.forEach(function (user) {
              console.log('[SlackProtostub] TEST joining with user', user);

              if (user.userURL !== neededOwnInfo.userURL) {
                _this._createNewContextReporter(user.userURL).then(function (creation) {
                  //debugger;
                  if (creation == true) {
                    _this._chatManager.join(_this._dataObjectReporterURL, false, user.identity).then(function (result) {
                      console.log('[SlackProtostub] chatmanager JOIN', result, user.userURL, neededOwnInfo.userURL);

                      _this._prepareChat(result); // if (user.userURL !== neededOwnInfo.userURL) {
                      //   _this._createNewContextReporter(user.userURL);
                      // }


                      var msgQuery = {
                        "type": "presence_sub",
                        "ids": _this._toSubscribePresence
                      };
                      console.log('[SlackProtostub] websocket sentmessage', _this._ws.readyState, msgQuery);

                      _this._ws.send(JSON.stringify(msgQuery));
                    })["catch"](function (error) {
                      console.log('[SlackProtostub] chatmanager JOIN error', error);
                    });
                  }
                });
              } else {//TODO pode faltar aqui o chatmanager join
              }
            });
          }
          /*****************************************************************************************************
          * It handle a new user added to a Slack channel, and add him to DataObject.participants
          * @param {Object} message - message with a new user added
          *******************************************************************************************************/

        }, {
          key: "_handleNewUser",
          value: function _handleNewUser(message) {
            console.log('[SlackProtostub] Handling a new user', message);

            var _this = this;

            var subcribed;

            _this._subscribedList.forEach(function (obj) {
              if (obj.channelID === message.channel) {
                subcribed = obj;
              }
            });

            if (subcribed) {
              var invInfo = _this._usersList.filter(function (value) {
                return value.id === message.user;
              })[0];

              var identity = _this._factory.createMessageBodyIdentity(invInfo.name, 'slack://slack.com/' + invInfo.name + '@slack.com', invInfo.profile.image_192, invInfo.name, '', 'slack.com', undefined, invInfo.profile);

              var userToAdd = {
                user: 'slack://' + invInfo.name + '@slack.com',
                domain: 'slack.com',
                id: message.user,
                userURL: 'slack://slack.com/' + invInfo.name + '@slack.com',
                identity: identity
              };

              _this._addedUsersInfo.push(userToAdd);

              console.log('[SlackProtostub] Joining chat', subcribed.urlDataObj, ' with', identity);

              _this._createNewContextReporter(identity.userProfile.userURL).then(function (creation) {
                //debugger;
                if (creation == true) {
                  _this._chatManager.join(subcribed.urlDataObj, false, identity).then(function (result) {
                    _this._prepareChat(result);

                    var msgQuery = {
                      "type": "presence_sub",
                      "ids": _this._toSubscribePresence
                    };
                    console.log('[SlackProtostub] websocket sentmessage', _this._ws.readyState, msgQuery);

                    _this._ws.send(JSON.stringify(msgQuery)); //_this._createNewContextReporter(identity.userProfile.userURL);

                  });
                }
              });
            }
          }
          /*****************************************************************************************************
          * It handle a new Presence change of Slack user, and change his status
          * @param {Object} message - message with info about user and his status
          *******************************************************************************************************/

        }, {
          key: "_handlePresenceChange",
          value: function _handlePresenceChange(message) {
            var _this = this;

            console.log('[SlackProtostub] updating presence of user');

            if (_this._contextReportersInfo[message.user]) {
              var reporter = _this._contextReportersInfo[message.user];
              reporter.data.values[0].value = _this._getPresence(message.presence);
              console.log('[SlackProtostub] presence of user', message.user, ' updated to', reporter.data);
            }
          }
          /*****************************************************************************************************
          * It handle a new message received on channel, and send it to hyperty
          * @param {Object} message - message with info about channel and text to send
          *******************************************************************************************************/

        }, {
          key: "_handleNewMessage",
          value: function _handleNewMessage(message) {
            console.log('[SlackProtostub] Handling a new message', message);

            var _this = this;

            var channelID = '';
            var chat;

            _this._subscribedList.forEach(function (obj) {
              if (obj.channelID === message.channel) {
                channelID = obj.channelID;
                chat = obj.chat;
              }
            });

            console.log('[SlackProtostub] subscribed list', _this._subscribedList);

            if (message.channel && message.ts > _this._session.createdTime) {
              if (message.channel === channelID && message.user !== _this._id || !message.hasOwnProperty('bot_id') && message.user === _this._id && message.channel === channelID) {
                _this._getUserInfo(message.user).then(function (identity) {
                  console.log('[SlackProtostub] msg to addChild', message.text, '     identity:', identity);
                  chat.send(message.text, identity);
                });
              }
            }
          }
          /*****************************************************************************************************
          * It retrieves information from a slack user and creates a reTHINK Identity object with it
          * @param {string} user - slack user id
          * @return {Promise<Object>} Returns a promise with an Identity object resolved
          *******************************************************************************************************/

        }, {
          key: "_getUserInfo",
          value: function _getUserInfo(user) {
            var _this = this;

            return new Promise(function (resolve) {
              _this._slack.users.info({
                token: _this._token,
                user: user
              }, function (err, data) {
                if (err) {
                  console.error('[SlackProtostub] error', err);
                } else {
                  console.log('[SlackProtostub getUserInfo] ', data);

                  var identity = _this._factory.createMessageBodyIdentity(data.user.name, 'slack://slack.com/' + data.user.name + '@slack.com', data.user.profile.image_192, data.user.name, '', 'slack.com');

                  resolve(identity);
                }
              });
            });
          }
        }, {
          key: "_prepareChat",
          value: function _prepareChat(chat) {
            var _this = this;

            console.log('[SlackProtostub] chat', chat);
            chat.onMessage(function (msg) {
              console.info('[SlackProtostub] onMessage: ', msg);
              console.info('[SlackProtostub] Observer - Message History Control ', _this._messageHistoryControl); //check if for each msg message has been delivered, and control that for when we have more than one slack user subscribed

              var currentID = chat.child_cseq; // check if this child already sent messages

              var channelObjUrl = chat._dataObjectObserver.url;
              var channelID;

              _this._subscribedList.forEach(function (obj) {
                if (obj.urlDataObj === channelObjUrl) {
                  channelID = obj.channelID;
                }
              });

              if (_this._messageHistoryControl.hasOwnProperty(channelObjUrl)) {
                // in that case check if the currentID its equal to oldID
                var oldID = _this._messageHistoryControl[channelObjUrl].id;

                if (oldID !== currentID) {
                  _this._messageHistoryControl[channelObjUrl].id = currentID;

                  _this._deliver(msg, channelID);
                }
              } else {
                _this._messageHistoryControl[channelObjUrl] = {
                  id: currentID
                };

                _this._deliver(msg, channelID);
              }
            });
          }
          /*****************************************************************************************************
          * It retrieves information from a slack user and creates a reTHINK Identity object with it
          * @param {string} idUser - slack user ID to be invited
          * @param {string} idChannel - channelID for user will be invited
          * @param {string} channelObjUrl - DataObjectURL from where user is invited
          *******************************************************************************************************/

        }, {
          key: "_invite",
          value: function _invite(idUser) {
            var idChannel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
            var channelObjUrl = arguments.length > 2 ? arguments[2] : undefined;

            var _this = this;

            if (idChannel == '') {
              _this._subscribedList.forEach(function (obj) {
                if (obj.urlDataObj === channelObjUrl) {
                  idChannel = obj.channelID;
                }
              });
            }

            var toInvite = {
              token: _this._token,
              channel: idChannel,
              user: idUser
            };

            _this._slack.channels.invite(toInvite, function (err, data) {
              if (err) {
                console.error('[SlackProtostub] error', err);
              } else {
                console.log('[SlackProtostub] user invited with sucess', data);
              }
            });
          }
          /*****************************************************************************************************
          * It deliver a message to a slack channel
          * @param {Object} msg - Message Object
          * @param {String} channelID - channelID to deliver message
          *******************************************************************************************************/

        }, {
          key: "_deliver",
          value: function _deliver(msg, channelID) {
            var _this = this;

            console.log('[SlackProtostub] Msg to Deliver: ', msg, ' on channel:', channelID);

            if (channelID && msg.value) {
              if (msg.hasOwnProperty('identity') && msg.identity.hasOwnProperty('userProfile') && msg.identity.userProfile.hasOwnProperty('name') && msg.identity.userProfile.name) {
                var text = '' + msg.identity.userProfile.name + ': ' + msg.value.content;
                var message = {
                  as_user: true,
                  token: _this._token,
                  channel: channelID,
                  text: text
                };
                console.log('[SlackProtostub] (PostMessage slack api) token(', _this._token, ')  channel(', channelID, ') text(', msg.value.content, ')'); // call Slack postMessage method to deliver msg on slack channel

                _this._slack.chat.postMessage(message, function (err, data) {
                  if (err) {
                    if (err.message == 'not_in_channel') {
                      console.error('[SlackProtostub] Channel exist, but user is not on channel', err);

                      var channelToJoin = _this._channelsList.filter(function (value) {
                        return value.id === channelID;
                      })[0];

                      var objToJoin = {
                        token: _this._token,
                        name: channelToJoin.name
                      };

                      _this._slack.channels.join(objToJoin);

                      _this._deliver(msg, channelID);
                    } else {
                      console.error('[SlackProtostub] error', err);
                    }
                  } else {
                    console.log('[SlackProtostub] PostMessage with Sucess', data);
                  }
                });
              }
            }
          }
          /*****************************************************************************************************
          * It create a new slackChannel using channelName
          * @param {String} channelName - name to be used to create a new channel
          * @param {String} channelObjUrl - Dataobject URL of a channel to be used to associate this channel to this dataobject
          *******************************************************************************************************/

        }, {
          key: "_createChannel",
          value: function _createChannel(channelName, channelObjUrl) {
            var _this = this;

            return new Promise(function (resolve) {
              var toCreate = {
                token: _this._token,
                name: channelName
              };
              console.log('[SlackProtostub] Creating a new channel toCreate:', toCreate, '  channelObjUrl:', channelObjUrl);

              _this._slack.channels.create(toCreate, function (err, data) {
                if (err) {
                  console.error('[SlackProtostub] ', err);
                } else {
                  if (data.ok) {
                    console.log('[SlackProtostub] Channel Created with Sucess ', data);
                    console.log('[SlackProtostub] Associate a new channel ID', data.channel.id, 'to urlDataObj', channelObjUrl);
                    var count = 0;
                    var key = 0; //Associate a channel to comm dataObject

                    _this._subscribedList.forEach(function (obj) {
                      if (obj.urlDataObj === channelObjUrl) {
                        key = count;
                      }

                      count++;
                    });

                    _this._subscribedList[key].channelID = data.channel.id;
                    console.log('[SlackProtostub] subscribed list', _this._subscribedList);
                    resolve(true);
                  }
                }
              });
            });
          }
        }, {
          key: "_sendHTTPRequest",
          value: function _sendHTTPRequest(method, url) {
            return new Promise(function (resolve, reject) {
              var xhr = new XMLHttpRequest();

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
                xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                      var info = JSON.parse(xhr.responseText);
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
          /*****************************************************************************************************
          * It Updates the state of ProtoStub
          * @param {String} value - status of protostub to be updated
          * @param {String} reason - reason of this update, optional
          *******************************************************************************************************/

        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason) {
            var _this = this;

            console.log('[SlackProtostub status changed] to ', value);
            _this._state = value;
            var msg = {
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
        }, {
          key: "descriptor",
          get: function get() {
            return protostubDescriptor;
          }
        }, {
          key: "name",
          get: function get() {
            return protostubDescriptor.name;
          }
        }, {
          key: "config",
          get: function get() {
            return this._config;
          }
        }, {
          key: "runtimeSession",
          get: function get() {
            return this._runtimeSessionURL;
          }
        }]);

        return SlackProtoStub;
      }());
      /*export default function activate(url, bus, config, factory) {
        return {
          name: 'SlackProtoStub',
          instance: new SlackProtoStub(url, bus, config, factory)
        };
      }*/

    }
  };
});