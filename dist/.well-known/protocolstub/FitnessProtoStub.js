"use strict";

System.register([], function (_export, _context) {
  "use strict";

  var FitnessProtoStub;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  return {
    setters: [],
    execute: function () {
      _export("default", FitnessProtoStub =
      /*#__PURE__*/
      function () {
        /**
        * Fitness ProtoStub creation
        * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
        * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
        * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
        * @return {FitnessProtoStub}
        */
        function FitnessProtoStub() {
          _classCallCheck(this, FitnessProtoStub);
        }

        _createClass(FitnessProtoStub, [{
          key: "_init",
          value: function _init(runtimeProtoStubURL, bus, config, factory, name) {
            this._stubName = name;
            if (!runtimeProtoStubURL) throw new Error("The runtimeProtoStubURL is a needed parameter");
            if (!bus) throw new Error("The bus is a needed parameter");
            if (!config) throw new Error("The config is a needed parameter");
            if (!config.runtimeURL) throw new Error("The config.runtimeURL is a needed parameter");

            var _this = this;

            console.log("[".concat(this._stubName, "] PROTOSTUB"), _this);
            this._id = 0;
            this._runtimeProtoStubURL = runtimeProtoStubURL;
            this._bus = bus;
            this._config = config;
            this._domain = config.domain;
            this._runtimeSessionURL = config.runtimeURL;
            this._syncher = factory.createSyncher(runtimeProtoStubURL, bus, config);
            this._userActivityVertxHypertyURL = "hyperty://sharing-cities-dsm/user-activity";

            _this._sendStatus("created");

            _this.started = false;
            var dataObjectName = "user_activity";
            bus.addListener("*", function (msg) {
              console.log("".concat(_this._stubName, " new Message  : "), msg);

              if (msg.identity) {
                _this._identity = msg.identity;
              }

              if (msg.type === 'delete') {
                _this.stopWorking();

                return;
              }

              if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('identity')) {
                if (msg.body.identity.accessToken) {
                  _this._accessToken = msg.body.identity.accessToken; // reply to hyperty

                  var msgResponse = {
                    id: msg.id,
                    type: 'response',
                    from: msg.to,
                    to: msg.from,
                    body: {
                      code: 200,
                      runtimeURL: _this._runtimeSessionURL
                    }
                  };
                  console.log(_this);

                  _this._bus.postMessage(msgResponse);
                } // get JS hyperty


                _this.hypertyJSUrl = msg.from;
              }

              var objectSchema = "hyperty-catalogue://catalogue." + _this._domain + "/.well-known/dataschema/Context";
              var initialData = {
                id: "1276020076",
                values: [{
                  type: "user_walking_context",
                  name: "walking distance in meters",
                  unit: "meter",
                  value: 0,
                  startTime: "2018-03-25T12:00:00Z",
                  endTime: "2018-03-25T12:10:00Z"
                }, {
                  type: "user_biking_context",
                  name: "biking distance in meters",
                  unit: "meter",
                  value: 0,
                  startTime: "2018-03-26T12:00:00Z",
                  endTime: "2018-03-26T12:10:00Z"
                }]
              };

              if (_this._accessToken && !_this.started && msg.type === 'create') {
                _this._resumeReporters(dataObjectName, msg.to).then(function (reporter) {
                  console.log("[".concat(_this._stubName, "._resumeReporters (result)  "), reporter);

                  if (reporter == false) {
                    _this._setUpReporter(_this._identity, objectSchema, initialData, ["context"], dataObjectName, msg.to).then(function (reporter) {
                      if (reporter) {
                        _this.startWorking(reporter, false);
                      }
                    });
                  } else {
                    _this.startWorking(reporter, true);
                  }
                })["catch"](function (error) {});
              }
            });
          }
        }, {
          key: "startWorking",
          value: function startWorking(reporter, resumedReporter) {
            var _this = this;

            _this.reporter = reporter;
            _this.hasStartedQuerying = false;

            function startQuerying() {
              var startTime = reporter.metadata.created;
              var lastModified = reporter.metadata.lastModified;

              if (!lastModified) {
                lastModified = startTime;
              } // query when starting


              _this.querySessions(startTime, lastModified);

              _this.startInterval = setInterval(function () {
                lastModified = reporter.metadata.lastModified;

                if (!lastModified) {
                  lastModified = startTime;
                }

                _this.querySessions(startTime, lastModified);
              }, _this.config.sessions_query_interval);
              _this.started = true;
            }

            if (resumedReporter) {
              _this.hasStartedQuerying = true;
              startQuerying();
            }

            reporter.onSubscription(function (event) {
              event.accept();
              console.log("".concat(_this._stubName, " new subs"), event);

              if (!_this.hasStartedQuerying) {
                _this.hasStartedQuerying = true;
                startQuerying();
              }
            });
            console.log("".concat(_this._stubName, " User activity DO created: "), reporter);
            reporter.inviteObservers([_this._userActivityVertxHypertyURL]);
          }
        }, {
          key: "stopWorking",
          value: function stopWorking() {
            clearInterval(this.startInterval);
            this.started = false;
          }
        }, {
          key: "_setUpReporter",
          value: function _setUpReporter(identity, objectDescURL, data, resources, name, reporterURL) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              var input = {
                resources: resources,
                expires: 3600,
                reporter: reporterURL,
                domain_registration: false,
                domain_routing: false
              };

              _this._syncher.create(objectDescURL, [], data, true, false, name, identity, input).then(function (reporter) {
                console.log("".concat(_this._stubName, " REPORTER RETURNED"), reporter);
                resolve(reporter);
              })["catch"](function (err) {
                console.error("".concat(_this._stubName, " err"), err);
                resolve(null);
              });
            });
          }
        }, {
          key: "_resumeReporters",
          value: function _resumeReporters(name, reporterURL) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              _this._syncher.resumeReporters({
                store: true,
                reporter: reporterURL
              }).then(function (reporters) {
                console.log("[".concat(_this._stubName, " Reporters resumed"), reporters);
                var reportersList = Object.keys(reporters);

                if (reportersList.length > 0) {
                  reportersList.forEach(function (dataObjectReporterURL) {
                    console.log("[".concat(_this._stubName), dataObjectReporterURL);
                    console.log("[".concat(_this._stubName), reporters[dataObjectReporterURL]);

                    if (reporterURL == reporters[dataObjectReporterURL].metadata.reporter && reporters[dataObjectReporterURL].metadata.name == name) {
                      return resolve(reporters[dataObjectReporterURL]);
                    }
                  });
                } else {
                  return resolve(false);
                }
              })["catch"](function (reason) {
                console.info("[".concat(_this._stubName, " Reporters:"), reason);
              });
            });
          }
        }, {
          key: "querySessions",
          value: function querySessions(startTime, lastModified) {}
        }, {
          key: "writeToReporter",
          value: function writeToReporter(activityType, distance, startISO, endTime) {
            var type, name;

            if (activityType === 'bike') {
              type = "user_biking_context";
              name = "biking distance in meters";
            } else if (activityType === 'walk') {
              type = "user_walking_context";
              name = "walking distance in meters";
            }

            this.reporter.data.values = [{
              type: type,
              name: name,
              unit: "meter",
              value: distance,
              startTime: startISO,
              endTime: endTime
            }];
          }
        }, {
          key: "refreshAccessToken",
          value: function refreshAccessToken(startTime, lastModified, domain) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              var msg = {
                type: 'execute',
                from: _this._runtimeProtoStubURL,
                to: _this._runtimeSessionURL + '/idm',
                body: {
                  method: 'refreshAccessToken',
                  params: {
                    resources: ['user_activity_context'],
                    domain: domain
                  }
                }
              };

              _this._bus.postMessage(msg, function (reply) {
                console.log("[".concat(_this._stubName, ".refreshAccessToken] reply "), reply);

                if (reply.body.hasOwnProperty('value')) {
                  _this._accessToken = reply.body.value;

                  _this.querySessions(startTime, lastModified);

                  resolve();
                } else reject(reply.body);
              });
            });
          }
          /**
          * Get the configuration for this ProtoStub
          * @return {Object} - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
          */

        }, {
          key: "_sendStatus",
          value: function _sendStatus(value, reason) {
            var _this = this;

            console.log("[[".concat(this._stubName, "] status changed] to "), value);
            _this._state = value;
            var msg = {
              type: "update",
              from: _this._runtimeProtoStubURL,
              to: _this._runtimeProtoStubURL + "/status",
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

        return FitnessProtoStub;
      }());
    }
  };
});