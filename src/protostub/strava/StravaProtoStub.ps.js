
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
import FitnessProtoStub from "../fitness/FitnessProtoStub";

class StravaProtoStub extends FitnessProtoStub {


  constructor(runtimeProtoStubURL, bus, config, factory) {
    super(runtimeProtoStubURL, bus, config, factory, 'StravaProtoStub');
  }

  querySessions(startTime, lastModified) {
    let _this = this;
    if (startTime !== lastModified) {
      startTime = lastModified;
    }

    var data = null;

    const startTimeSeconds = Math.round(new Date(startTime).getTime() / 1000);
    const endTimeSeconds = Math.round(new Date().getTime() / 1000);
    
    
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        const activities = JSON.parse(this.responseText);
        console.log("[StravaProtoStub] activities: ", activities);
        
        activities.map(activity => {
          
          // start, end
          const { type, distance, start_date, elapsed_time } = activity;
          const startDate = new Date(start_date);
          const startISO = startDate.toISOString();
          const endMillis = startDate.getTime() + elapsed_time * 1000;
          const endISO = new Date(endMillis).toISOString();

          switch (type) {
            case "Run":
              // walking/running
              console.log("[StravaProtoStub] walking/running distance (m): ", distance);
              _this.writeToReporter('walk', distance, startISO, endISO);
              break;
            case "Ride":
              // biking
              console.log("[StravaProtoStub] biking distance (m): ", distance);
              _this.writeToReporter('bike', distance, startISO, endISO);
              break;
            default:
              break;
          }

        })
      }
    });

    xhr.open("GET", `https://www.strava.com/api/v3/athlete/activities?after=${startTimeSeconds}&before=${endTimeSeconds}`);
    xhr.setRequestHeader("Authorization", `Bearer ${this._accessToken}`);
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);
  }

}

export default function activate(url, bus, config, factory) {
  return {
    name: "StravaProtoStub",
    instance: new StravaProtoStub(url, bus, config, factory)
  };
}
