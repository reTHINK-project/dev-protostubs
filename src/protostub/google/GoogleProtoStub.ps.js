
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

class GoogleProtoStub extends FitnessProtoStub {


  constructor(runtimeProtoStubURL, bus, config, factory) {
    super(runtimeProtoStubURL, bus, config, factory, 'GoogleProtoStub');
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
            writeToReporter('walk', distance, startISO, endTime);
            break;
          case 1:
            // biking
            console.log("[GoogleProtoStub] biking distance (m): ", distance);
            writeToReporter('bike', distance, startISO, endTime);
            break;
          default:
            break;
        }
      }
    }, (error) => {
      if (error.hasOwnProperty('errorCode') && error.code === 401)
        return _this.refreshAccessToken(startTime, lastModified, 'google.com');
      else throw error;

    }).catch(onError => {
      _this._sendStatus('disconnected', onError);
      console.error("[GoogleProtoStub.querySessions] error: ", onError);

    });
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
          console.log("[GoogleProtoStub.getDistanceForActivities] response: ", response);
          if (response.hasOwnProperty('bucket')) resolve(response.bucket);
          else if (response.hasOwnProperty('code') && response.code > 299) reject({ errorCode: response.code });
          else reject(response);

        }
      });
      xhr.open("POST", "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + this._accessToken);
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.send(JSON.stringify(bodyData));
    });
  }

}

export default function activate(url, bus, config, factory) {
  return {
    name: "GoogleProtoStub",
    instance: new GoogleProtoStub(url, bus, config, factory)
  };
}
