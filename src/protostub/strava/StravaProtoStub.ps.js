
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
//import { Syncher } from "service-framework/dist/Syncher";
import FitnessProtoStub from "../fitness/FitnessProtoStub";

class StravaProtoStub extends FitnessProtoStub {


  querySessions(start, end) {

    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        const activities = JSON.parse(this.responseText);

        activities.map(activity => {

          const { type: activityType, distance, start_date, elapsed_time } = activity;
          console.log(activityType);
          const startISO = new Date(start_date).toISOString();
          switch (activityType) {
            case "Run":
              // walking/running
              console.log("[StravaProtoStub] walking/running distance (m): ", distance);
              // _this.reporter.data.values = [
              //     {
              //         type: "user_walking_context",
              //         name: "walking distance in meters",
              //         unit: "meter",
              //         value: distance,
              //         startTime: startISO,
              //         endTime: endTime
              //     }
              //     //_this.reporter.data.values[1]
              // ];
              break;
            case "Ride":
              // biking
              console.log("[StravaProtoStub] biking distance (m): ", distance);
              // _this.reporter.data.values = [
              //     //_this.reporter.data.values[0],
              //     {
              //         type: "user_biking_context",
              //         name: "biking distance in meters",
              //         unit: "meter",
              //         value: distance,
              //         startTime: startISO,
              //         endTime: endTime
              //     }
              // ];
              break;
            default:
              break;
          }

        })
      }
    });

    xhr.open("GET", "https://www.strava.com/api/v3/athlete/activities");
    xhr.setRequestHeader("Authorization", "Bearer 3da3d0e1675f44b17b820f7dedcfa159a87302f9");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "32054eea-5a88-4543-8238-c0814d3e567e");

    xhr.send(data);
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
            domain: 'Strava.com'
          }
        }
      }

      _this._bus.postMessage(msg, (reply) => {
        console.log('[StravaProtoStub.refreshAccessToken] reply ', reply);
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
    console.log("[StravaProtoStub status changed] to ", value);
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

export default function activate(url, bus, config, factory) {
  return {
    name: "StravaProtoStub",
    instance: new StravaProtoStub(url, bus, config, factory)
  };
}
