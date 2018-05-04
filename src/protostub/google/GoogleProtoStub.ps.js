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

import { WalletReporter } from 'service-framework/dist/WalletManager';
import { Syncher } from 'service-framework/dist/Syncher';
import MessageBodyIdentity from 'service-framework/dist/IdentityFactory';

class GoogleProtoStub {
  /**
   * Vertx ProtoStub creation
   * @param  {string} runtimeProtoStubURL - URL used internally for message delivery point. Not used for MessageNode deliver.
   * @param  {MiniBus} bus - MiniBus used to send/receive messages. Normally connected to the MessageBus.
   * @param  {Object} config - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
   * @return {GoogleProtoStub}
   */
  constructor(runtimeProtoStubURL, bus, config) {
    if (!runtimeProtoStubURL) throw new Error('The runtimeProtoStubURL is a needed parameter');
    if (!bus) throw new Error('The bus is a needed parameter');
    if (!config) throw new Error('The config is a needed parameter');

    if (!config.url) throw new Error('The config.url is a needed parameter');
    if (!config.runtimeURL) throw new Error('The config.runtimeURL is a needed parameter');

    let _this = this;
    console.log("[GoogleProtoStub] Google PROTOSTUB", _this);
    this._id = 0;

    this._runtimeProtoStubURL = runtimeProtoStubURL;
    this._bus = bus;
    this._config = config;

    this._runtimeSessionURL = config.runtimeURL;
    this._syncher = new Syncher(runtimeProtoStubURL, bus, config);
    // TODO
    this._accessToken = 'ya29.GlujBfu0l0fyXXEojAyQ-8nHcj1llbCRawxlS3EyJcF-2_d0_Jmp64XCylsMmEWRprM628BaClSUirBXpvb-vJnM1OoD1zi6g-yYSXrkR4-xMPd9Mi4bKcLNQ3hO';

    _this._sendStatus('created');

    bus.addListener('*', (msg) => {
      console.log('[GoogleProtoStub] new Message  : ', msg);

      if (msg.identity) {
        _this._identity = msg.identity;
      }

      if (msg.body.identity) {
        if (msg.body.identity.accessToken) {
          _this._accessToken = msg.body.identity.accessToken;
        }
      }

      if (_this._eb === null) {
        _this._eb = new EventBus(config.url, { "vertxbus_ping_interval": config.vertxbus_ping_interval });
        console.log('[GoogleProtoStub] Eventbus', _this._eb);

        _this._eventBusUsage().then(function (result) {

          const objectSchema = 'hyperty-catalogue://catalogue.localhost/.well-known/dataschema/Context';
          const initialData = {
            "id": "1276020076",
            "values": [
              {
                "type": "user_walking_context",
                "name": "walking distance in meters",
                "unit": "meter",
                "value": 1500,
                "startTime": "2018-03-25T12:00:00Z",
                "endTime": "2018-03-25T12:10:00Z"
              },
              {
                "type": "user_biking_context",
                "name": "biking distance in meters",
                "unit": "meter",
                "value": 5000,
                "startTime": "2018-03-26T12:00:00Z",
                "endTime": "2018-03-26T12:10:00Z"
              }
            ]
          };

          if (_this._identity.userProfile && _this._accessToken) {
            _this._setUpReporter(_this._identity, objectSchema, initialData, ['context'], 'user_walking', _this._userURL).then(function (reporter) {
              if (reporter) {
                reporter.onSubscription((event) => event.accept());
                console.log('[GoogleProtoStub] User activity DO created: ', reporter);
                const startTime = reporter._created;

                // invite observers
                const observer = 'hyperty://sharing-cities-dsm/user-activity';
                reporter.inviteObservers([observer]);

                setInterval(function () { _this.querySessions(_this._accessToken, _this._identity.userProfile.userURL, startTime); }, config.sessions_query_interval);
              }
            });
          }

        });
      }
    });
  }


  getWalkDistance() {


    // total time
    const durationMillis = 86400000;
    const startTimeMillis = 1520812800000;
    const endTimeMillis = 1521072000000;

    const bodyData = {
      "aggregateBy": [{
        "dataTypeName": "com.google.distance.delta"
      }],
      "bucketByTime": {
        "durationMillis": durationMillis
      },
      "startTimeMillis": startTimeMillis,
      "endTimeMillis": endTimeMillis
    };

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken,
        "Cache-Control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(bodyData)
    }




    $.ajax(settings).done(function (response) {
      console.log("[GoogleProtoStub] sessions: ", response);


      // TODO - check if new session (last timestamp more recent than the one stored)
      const lastSession = response.session[0];
      const activityType = lastSession["activityType"];
      const start = lastSession["startTimeMillis"];
      const end = lastSession["endTimeMillis"];
      const modified = lastSession["modifiedTimeMillis"];

      let activity;

      switch (activityType) {
        case 7:
          activity = "walking";
          break;
        case 8:
          activity = "running";
          break;
        case 1:
          activity = "biking";
          break;
        default:
          break;
      }
      // get distance for session
      _this.getDistanceForActivity(start, end, activity).then((result) => {
        // console.log(result);
        // send message to vertx
        let msg = {
          type: 'create',
          to: userURL,
          from: "me",
          identity: { userProfile: { userURL: userURL } },
          activity: activity,
          distance: result
        }
        _this._eb.send(userURL, msg, function (reply_err, reply) {


        });
      });


    });

  }

  getDistanceForActivity(start, end, activity) {

    return new Promise((resolve, reject) => {

      // total time
      const durationMillis = end - start;

      const bodyData = {
        "aggregateBy": [{
          "dataTypeName": "com.google.distance.delta"
        }],
        "bucketByTime": {
          "durationMillis": durationMillis
        },
        "startTimeMillis": start,
        "endTimeMillis": end
      };

      var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + this._accessToken,
          "Cache-Control": "no-cache"
        },
        "processData": false,
        "data": JSON.stringify(bodyData)
      }

      $.ajax(settings).done(function (response) {
        console.log("[GoogleProtoStub] distance for activity: ", response);

        return resolve(response.bucket[0].dataset[0].point[0].value[0].fpVal);
      });
    });
  }




  /**
   * Get the configuration for this ProtoStub
  * @return {Object} - Mandatory fields are: "url" of the MessageNode address and "runtimeURL".
      */
  get config() { return this._config; }

  get runtimeSession() { return this._runtimeSessionURL; }

  _sendStatus(value, reason) {
    let _this = this;
    console.log('[GoogleProtoStub status changed] to ', value);
    _this._state = value;
    let msg = {
      type: 'update',
      from: _this._runtimeProtoStubURL,
      to: _this._runtimeProtoStubURL + '/status',
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
    name: 'GoogleProtoStub',
    instance: new GoogleProtoStub(url, bus, config)
  };
}





