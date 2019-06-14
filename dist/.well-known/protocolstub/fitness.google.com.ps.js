"use strict";

System.register(["../fitness/FitnessProtoStub.js"], function (_export, _context) {
  "use strict";

  var FitnessProtoStub, protostubDescriptor, GoogleProtoStub;

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  return {
    setters: [function (_fitnessFitnessProtoStubJs) {
      FitnessProtoStub = _fitnessFitnessProtoStubJs.default;
    }],
    execute: function () {
      protostubDescriptor = {
        "name": "GoogleProtoStub",
        "language": "javascript",
        "description": "Protostub of Google",
        "signature": "",
        "configuration": {
          "sessions_query_interval": 300000,
          "domain": "localhost"
        },
        "constraints": {
          "browser": true
        },
        "interworking": true,
        "objectName": "fitness.google.com"
      };

      _export("default", GoogleProtoStub =
      /*#__PURE__*/
      function (_FitnessProtoStub) {
        _inherits(GoogleProtoStub, _FitnessProtoStub);

        function GoogleProtoStub() {
          _classCallCheck(this, GoogleProtoStub);

          return _possibleConstructorReturn(this, _getPrototypeOf(GoogleProtoStub).call(this));
        }

        _createClass(GoogleProtoStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, bus, config, factory) {
            _get(_getPrototypeOf(GoogleProtoStub.prototype), "init", this).call(this, runtimeProtoStubURL, bus, config, factory, 'GoogleProtoStub');
          }
        }, {
          key: "querySessions",
          value: function querySessions(startTime, lastModified) {
            var _this = this;

            if (startTime !== lastModified) {
              startTime = lastModified;
            } // current date


            var endDate = new Date();
            var endTime = endDate.toISOString();
            var endTimeMillis = endDate.getTime();
            var startTimeMillis = new Date(startTime).getTime(); // make request

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            _this.getDistanceForActivities(startTimeMillis, endTimeMillis).then(function (buckets) {
              for (var i = 0; i < buckets.length; i += 1) {
                var bucket = buckets[i];
                var activityType = bucket.activity;
                var distance = bucket.dataset[0].point[0].value[0].fpVal;
                var startISO = new Date(startTimeMillis).toISOString();

                switch (activityType) {
                  case 7:
                  case 8:
                    // walking/running
                    console.log("[GoogleProtoStub] walking/running distance (m): ", distance);

                    _this.writeToReporter('walk', distance, startISO, endTime);

                    break;

                  case 1:
                    // biking
                    console.log("[GoogleProtoStub] biking distance (m): ", distance);

                    _this.writeToReporter('bike', distance, startISO, endTime);

                    break;

                  default:
                    break;
                }
              }
            }, function (error) {
              if (error.hasOwnProperty('errorCode') && error.errorCode === 401) return _this.refreshAccessToken(startTime, lastModified, 'google.com');else throw error;
            })["catch"](function (onError) {
              _this._sendStatus('disconnected', onError);

              console.error("[GoogleProtoStub.querySessions] error: ", onError);
            });
          }
        }, {
          key: "getDistanceForActivities",
          value: function getDistanceForActivities(start, end) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
              var bodyData = {
                "aggregateBy": [{
                  "dataTypeName": "com.google.distance.delta"
                }],
                "bucketByActivityType": {
                  "minDurationMillis": 0
                },
                "startTimeMillis": start,
                "endTimeMillis": end
              }; // make request

              var xhr = new XMLHttpRequest();
              xhr.withCredentials = true;
              xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                  var response = JSON.parse(this.responseText);
                  console.log("[GoogleProtoStub.getDistanceForActivities] response: ", response);
                  if (response.hasOwnProperty('bucket')) resolve(response.bucket);else if (response.hasOwnProperty('code') && response.code > 299) reject({
                    errorCode: response.code
                  });else reject(response);
                }
              });
              xhr.open("POST", "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate");
              xhr.setRequestHeader("Content-Type", "application/json");
              xhr.setRequestHeader("Authorization", "Bearer " + _this2._accessToken);
              xhr.setRequestHeader("Cache-Control", "no-cache");
              xhr.send(JSON.stringify(bodyData));
            });
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
        }]);

        return GoogleProtoStub;
      }(FitnessProtoStub));
      /*export default function activate(url, bus, config, factory) {
        return {
          name: "GoogleProtoStub",
          instance: new GoogleProtoStub(url, bus, config, factory)
        };
      }*/

    }
  };
});