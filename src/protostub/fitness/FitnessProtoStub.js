export default class FitnessProtoStub {

    /**
   * Fitness ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {FitnessProtoStub}
   */
    constructor(runtimeProtoStubURL, bus, config, factory, name) {
        this._stubName = name;
        if (!runtimeProtoStubURL)
            throw new Error("The runtimeProtoStubURL is a needed parameter");
        if (!bus) throw new Error("The bus is a needed parameter");
        if (!config) throw new Error("The config is a needed parameter");


        if (!config.runtimeURL)
            throw new Error("The config.runtimeURL is a needed parameter");

        let _this = this;
        console.log(`${this._stubName} PROTOSTUB`, _this);
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

        const dataObjectName = "user_activity";

        bus.addListener("*", msg => {
            console.log(`${_this._stubName} new Message  : `, msg);
            if (msg.identity) {
                _this._identity = msg.identity;
            }

            if (msg.type === 'delete') {
                _this.stopWorking();
                return;
            }

            if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('identity')) {
                if (msg.body.identity.accessToken) {
                    _this._accessToken = msg.body.identity.accessToken;
                    // reply to hyperty
                    let msgResponse = {
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
                }
                // get JS hyperty
                _this.hypertyJSUrl = msg.from;
            }



            const objectSchema = "hyperty-catalogue://catalogue." + _this._domain + "/.well-known/dataschema/Context";
            const initialData = {
                id: "1276020076",
                values: [
                    {
                        type: "user_walking_context",
                        name: "walking distance in meters",
                        unit: "meter",
                        value: 0,
                        startTime: "2018-03-25T12:00:00Z",
                        endTime: "2018-03-25T12:10:00Z"
                    },
                    {
                        type: "user_biking_context",
                        name: "biking distance in meters",
                        unit: "meter",
                        value: 0,
                        startTime: "2018-03-26T12:00:00Z",
                        endTime: "2018-03-26T12:10:00Z"
                    }
                ]
            };

            if (_this._accessToken && !_this.started && msg.type === 'create') {
                _this._resumeReporters(dataObjectName, msg.to).then(function (reporter) {
                    console.log(`[${_this._stubName}._resumeReporters (result)  `, reporter);
                    if (reporter == false) {
                        _this._setUpReporter(_this._identity, objectSchema, initialData, ["context"], dataObjectName, msg.to)
                            .then(function (reporter) {
                                if (reporter) {
                                    _this.startWorking(reporter, false);
                                }
                            });
                    } else {
                        _this.startWorking(reporter, true);

                    }
                }).catch(function (error) {
                });
            }
        });
    }

    startWorking(reporter, resumedReporter) {
        let _this = this;
        _this.reporter = reporter;
        _this.hasStartedQuerying = false;

        function startQuerying() {
            const startTime = reporter.metadata.created;
            let lastModified = reporter.metadata.lastModified;
            if (!lastModified) {
                lastModified = startTime;
            }
            // query when starting
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
            console.log(`${_this._stubName} new subs`, event);
            if (!_this.hasStartedQuerying) {
                _this.hasStartedQuerying = true;
                startQuerying();
            }
        });

        console.log(`${_this._stubName} User activity DO created: `, reporter);
        reporter.inviteObservers([_this._userActivityVertxHypertyURL]);

    }

    stopWorking() {
        clearInterval(this.startInterval);
        this.started = false;
    }

    _setUpReporter(identity, objectDescURL, data, resources, name, reporterURL) {

        let _this = this;
        return new Promise(function (resolve, reject) {
            let input = {
                resources: resources,
                expires: 3600,
                reporter: reporterURL,
                domain_registration: false,
                domain_routing: false
            };

            _this._syncher
                .create(objectDescURL, [], data, true, false, name, identity, input)
                .then(reporter => {
                    console.log(`${_this._stubName} REPORTER RETURNED`, reporter);

                    resolve(reporter);
                })
                .catch(function (err) {
                    console.error(`${_this._stubName} err`, err);
                    resolve(null);
                });
        });
    }

    _resumeReporters(name, reporterURL) {
        let _this = this;
        return new Promise((resolve, reject) => {
            _this._syncher.resumeReporters({ store: true, reporter: reporterURL }).then((reporters) => {
                console.log(`[${_this._stubName} Reporters resumed`, reporters);
                let reportersList = Object.keys(reporters);

                if (reportersList.length > 0) {

                    reportersList.forEach((dataObjectReporterURL) => {

                        console.log(`[${_this._stubName}`, dataObjectReporterURL);
                        console.log(`[${_this._stubName}`, reporters[dataObjectReporterURL]);

                        if (reporterURL == reporters[dataObjectReporterURL].metadata.reporter && reporters[dataObjectReporterURL].metadata.name == name) {
                            return resolve(reporters[dataObjectReporterURL]);
                        }
                    });

                } else {
                    return resolve(false);
                }
            }).catch((reason) => {
                console.info(`[${_this._stubName} Reporters:`, reason);
            });
        });
    }

    querySessions(startTime, lastModified) {

    }

    writeToReporter(activityType, distance, startISO, endTime) {

        let type, name;
        if (activityType === 'bike') {
            type = "user_biking_context";
            name = "biking distance in meters";
        }
        else if (activityType === 'walk') {
            type = "user_walking_context";
            name = "walking distance in meters";
        }

        this.reporter.data.values = [
            {
                type: type,
                name: name,
                unit: "meter",
                value: distance,
                startTime: startISO,
                endTime: endTime
            }
        ];


    }

    refreshAccessToken(startTime, lastModified, domain) {
        let _this = this;
        return new Promise((resolve, reject) => {

            let msg = {
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
            }

            _this._bus.postMessage(msg, (reply) => {
                console.log(`[${_this._stubName}.refreshAccessToken] reply `, reply);
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
    get config() {
        return this._config;
    }

    get runtimeSession() {
        return this._runtimeSessionURL;
    }

    _sendStatus(value, reason) {
        let _this = this;
        console.log(`[GoogleProtoStub status changed] to `, value);
        _this._state = value;
        let msg = {
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

}
