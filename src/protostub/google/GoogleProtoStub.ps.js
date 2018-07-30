/**
 * Copyright 2016 PT Inovação e Sistemas SA
 * Copyright 2016 INESC-ID
 * Copyright 2016 QUOBIS NETWORKS SL
 * Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
 * Copyright 2016 ORANGE SA
 * Copyright 2016 Deutsche Telekom AG
 * Copyright 2016 Apizee
 * Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import { Syncher } from "service-framework/dist/Syncher";

class GoogleProtoStub {
  /**
   * Vertx ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {GoogleProtoStub}
   */
  constructor(runtimeProtoStubURL, bus, config) {
    if (!runtimeProtoStubURL)
      throw new Error("The runtimeProtoStubURL is a needed parameter");
    if (!bus) throw new Error("The bus is a needed parameter");
    if (!config) throw new Error("The config is a needed parameter");


    if (!config.runtimeURL)
      throw new Error("The config.runtimeURL is a needed parameter");

    let _this = this;
    console.log("[GoogleProtoStub] Google PROTOSTUB", _this);
    this._id = 0;

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;
    this._domain = config.domain;

    this._runtimeSessionURL = config.runtimeURL;
    this._syncher = new Syncher(runtimeProtoStubURL, bus, config);

    this._userActivityVertxHypertyURL = "hyperty://sharing-cities-dsm/user-activity";

    _this._sendStatus("created");

    _this.started = false;

    const dataObjectName = "user_activity";

    bus.addListener("*", msg => {
      console.log("[GoogleProtoStub] new Message  : ", msg);
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
              code: 200
            }
          };
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
          console.log('GoogleProtoStub]._resumeReporters (result)  ', reporter);
          if (reporter == false) {
            _this._setUpReporter(_this._identity, objectSchema, initialData, ["context"], dataObjectName, msg.to)
              .then(function (reporter) {
                if (reporter) {
                  _this.startWorking(reporter);
                }
              });
          } else {
            _this.startWorking(reporter);
          }
        }).catch(function (error) {
        });
      }
    });
  }

  startWorking(reporter) {
    let _this = this;
    _this.reporter = reporter;
    _this.hasStartedQuerying = false;

    function startQuerying() {
      const startTime = reporter.metadata.created;
      let lastModified = reporter.metadata.lastModified;
      // query when starting
      _this.querySessions(startTime, lastModified);
      _this.startInterval = setInterval(function () {
        lastModified = reporter.metadata.lastModified;
        _this.querySessions(startTime, lastModified);
      }, _this.config.sessions_query_interval);

      _this.started = true;
    }

    reporter.onSubscription(function (event) {
      event.accept();
      console.log("[GoogleProtoStub] new subs", event);
      if (!_this.hasStartedQuerying) {
        _this.hasStartedQuerying = true;
        startQuerying();
      }
    });

    console.log("[GoogleProtoStub] User activity DO created: ", reporter);
    reporter.inviteObservers([_this._userActivityVertxHypertyURL]);

  }

  stopWorking() {
    let _this = this;
    clearInterval(this.startInterval);
    _this.started = false;
  }


  _setUpReporter(identity, objectDescURL, data, resources, name, reporterURL) {

    let _this = this;
    return new Promise(function (resolve, reject) {
      let input = {
        resources: resources,
        expires: 3600,
        reporter: reporterURL,
        domain_registration: false
      };

      _this._syncher
        .create(objectDescURL, [], data, true, false, name, identity, input)
        .then(reporter => {
          console.log("[GoogleProtoStub] REPORTER RETURNED", reporter);

          resolve(reporter);
        })
        .catch(function (err) {
          console.error("[GoogleProtoStub] err", err);
          resolve(null);
        });
    });
  }

  _resumeReporters(name, reporterURL) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this._syncher.resumeReporters({ store: true, reporter: reporterURL }).then((reporters) => {
        console.log('[GoogleProtoStub] Reporters resumed', reporters);
        let reportersList = Object.keys(reporters);

        if (reportersList.length > 0) {

          reportersList.forEach((dataObjectReporterURL) => {

            console.log('[GoogleProtoStub] ', dataObjectReporterURL);
            console.log('[GoogleProtoStub] ', reporters[dataObjectReporterURL]);

            if (reporterURL == reporters[dataObjectReporterURL].metadata.reporter && reporters[dataObjectReporterURL].metadata.name == name) {

              return resolve(reporters[dataObjectReporterURL]);
            } else {
              return resolve(false);
            }
          });

        } else {
          return resolve(false);
        }
      }).catch((reason) => {
        console.info('[GoogleProtoStub] Reporters:', reason);
      });
    });
  }

  querySessions(startTime, lastModified) {
    let _this = this;
    if (startTime !== lastModified) {
      startTime = lastModified;
    }
    // current date
    const endDate = new Date();
    const endTime = endDate.toISOString();
    const endTimeMillis = endDate.getTime();
    const startTimeMillis = new Date(startTime).getTime();

    // make request
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    _this.getDistanceForActivities(startTimeMillis, endTimeMillis).then(buckets => {
      for (let i = 0; i < buckets.length; i += 1) {
        const bucket = buckets[i];
        const activityType = bucket.activity;
        const distance = bucket.dataset[0].point[0].value[0].fpVal;
        const startISO = new Date(startTimeMillis).toISOString();
        switch (activityType) {
          case 7:
          case 8:
            // walking/running
            console.log("[GoogleProtoStub] walking/running distance (m): ", distance);
            _this.reporter.data.values = [
              {
                type: "user_walking_context",
                name: "walking distance in meters",
                unit: "meter",
                value: distance,
                startTime: startISO,
                endTime: endTime
              }
              //_this.reporter.data.values[1]
            ];
            break;
          case 1:
            // biking
            console.log("[GoogleProtoStub] biking distance (m): ", distance);
            _this.reporter.data.values = [
              //_this.reporter.data.values[0],
              {
                type: "user_biking_context",
                name: "biking distance in meters",
                unit: "meter",
                value: distance,
                startTime: startISO,
                endTime: endTime
              }
            ];
            break;
          default:
            break;
        }
      }
    }).catch(onError => {
      console.info("[GoogleProtoStub] error: ", onError, " requesting new access token ");

      return _this.refreshAccessToken(startTime, lastModified);

    });

    /*
    xhr.open("GET", "https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=" + startTime + "&endTime=" + endTime);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(null);

    xhr.addEventListener("readystatechange", function () {

      if (this.readyState === 4) {
        const response = JSON.parse(this.responseText);
        console.log("[GoogleProtoStub] sessions: ", response);
        for (let index = 0; index < response.session.length; index++) {


          const currentSession = response.session[index];
          const activityType = currentSession["activityType"];
          const start = currentSession["startTimeMillis"];
          const end = Number(currentSession["endTimeMillis"]);
          // const modified = currentSession["modifiedTimeMillis"];

          if (end < endTimeMillis && end > startTimeMillis) {
            // get distance for session
            _this.getDistanceForActivity(start, end).then(distance => {
              const startISO = new Date(Number(start)).toISOString();
              const endISO = new Date(Number(end)).toISOString();
              switch (activityType) {
                case 7:
                case 8:
                  // walking/running
                  _this.reporter.data.values = [
                    {
                      type: "user_walking_context",
                      name: "walking distance in meters",
                      unit: "meter",
                      value: distance,
                      startTime: startISO,
                      endTime: endISO
                    }
                    //_this.reporter.data.values[1]
                  ];
                  break;
                case 1:
                  // biking
                  _this.reporter.data.values = [
                    //_this.reporter.data.values[0],
                    {
                      type: "user_biking_context",
                      name: "biking distance in meters",
                      unit: "meter",
                      value: distance,
                      startTime: startISO,
                      endTime: endISO
                    }
                  ];
                  break;
                default:
                  break;
              }
            });
          }
        }
      }
    });

    */



  }

  getDistanceForActivities(start, end) {
    return new Promise((resolve, reject) => {

      const bodyData = {
        "aggregateBy": [{ "dataTypeName": "com.google.distance.delta" }],
        "bucketByActivityType": { "minDurationMillis": 0 },
        "startTimeMillis": start,
        "endTimeMillis": end
      };


      // make request
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          const response = JSON.parse(this.responseText);
          console.log("[GoogleProtoStub] distance for activities: ", response);
          return resolve(response.bucket);
        }
      });
      xhr.open("POST", "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + this._accessToken);
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.send(JSON.stringify(bodyData));
    });
  }

  refreshAccessToken(startTime, lastModified) {
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
            domain: 'google.com'
          }
        }
      }

      _this._bus.postMessage(msg, (reply) => {
        console.log('[GoogleProtoStub.refreshAccessToken] reply ', reply);
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
    console.log("[GoogleProtoStub status changed] to ", value);
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

export default function activate(url, bus, config) {
  return {
    name: "GoogleProtoStub",
    instance: new GoogleProtoStub(url, bus, config)
  };
}
