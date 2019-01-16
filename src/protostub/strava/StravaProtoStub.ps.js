
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


  constructor(runtimeProtoStubURL, bus, config, factory) {
    super(runtimeProtoStubURL, bus, config, factory, 'StravaProtoStub');
  }

  querySessions(startTime, lastModified) {
    if (startTime !== lastModified) {
      startTime = lastModified;
    }

    var data = null;

    const endDate = new Date();
    const endTime = endDate.toISOString();
    const endTimeMillis = endDate.getTime();
    const startTimeMillis = new Date(startTime).getTime();
    const startISO = new Date(startTimeMillis).toISOString();


    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        const activities = JSON.parse(this.responseText);
        console.log("[StravaProtoStub] activities: ", activities);
        
        activities.map(activity => {

          const { type: activityType, distance, start_date, elapsed_time } = activity;
          switch (activityType) {
            case "Run":
              // walking/running
              console.log("[StravaProtoStub] walking/running distance (m): ", distance);
              writeToReporter('walk', distance, startISO, endTime);
              break;
            case "Ride":
              // biking
              console.log("[StravaProtoStub] biking distance (m): ", distance);
              writeToReporter('bike', distance, startISO, endTime);
              break;
            default:
              break;
          }

        })
      }
    });

    xhr.open("GET", `https://www.strava.com/api/v3/athlete/activities?after=${startTimeMillis}&before=${endTimeMillis}`);
    xhr.setRequestHeader("Authorization", "Bearer 3da3d0e1675f44b17b820f7dedcfa159a87302f9");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader("Postman-Token", "32054eea-5a88-4543-8238-c0814d3e567e");
    xhr.send(data);
  }

}

export default function activate(url, bus, config, factory) {
  return {
    name: "StravaProtoStub",
    instance: new StravaProtoStub(url, bus, config, factory)
  };
}
