"use strict";

System.register(["../fitness/FitnessProtoStub.js"], function (_export, _context) {
  "use strict";

  var FitnessProtoStub, protostubDescriptor, StravaProtoStub;

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
        "name": "StravaProtoStub",
        "language": "javascript",
        "description": "Protostub of Strava",
        "signature": "",
        "configuration": {
          "sessions_query_interval": 300000,
          "domain": "localhost"
        },
        "constraints": {
          "browser": true
        },
        "interworking": true,
        "objectName": "fitness.strava.com"
      };

      _export("default", StravaProtoStub =
      /*#__PURE__*/
      function (_FitnessProtoStub) {
        _inherits(StravaProtoStub, _FitnessProtoStub);

        function StravaProtoStub() {
          _classCallCheck(this, StravaProtoStub);

          return _possibleConstructorReturn(this, _getPrototypeOf(StravaProtoStub).call(this));
        }

        _createClass(StravaProtoStub, [{
          key: "_start",
          value: function _start(runtimeProtoStubURL, bus, config, factory) {
            _get(_getPrototypeOf(StravaProtoStub.prototype), "init", this).call(this, runtimeProtoStubURL, bus, config, factory, 'StravaProtoStub');
          }
        }, {
          key: "querySessions",
          value: function querySessions(startTime, lastModified) {
            var _this = this;

            if (startTime !== lastModified) {
              startTime = lastModified;
            }

            var data = null;
            var startTimeSeconds = Math.round(new Date(startTime).getTime() / 1000);
            var endTimeSeconds = Math.round(new Date().getTime() / 1000);
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            xhr.addEventListener("readystatechange", function () {
              if (this.readyState === 4) {
                var response = JSON.parse(this.responseText);
                console.log("[StravaProtoStub] response: ", response);

                if (this.status === 401) {
                  return _this.refreshAccessToken(startTime, lastModified, 'strava.com');
                }

                response.map(function (activity) {
                  // start, end
                  var type = activity.type,
                      distance = activity.distance,
                      start_date = activity.start_date,
                      elapsed_time = activity.elapsed_time;
                  var startDate = new Date(start_date);
                  var startISO = startDate.toISOString();
                  var endMillis = startDate.getTime() + elapsed_time * 1000;
                  var endISO = new Date(endMillis).toISOString();

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
                });
              }
            });
            xhr.open("GET", "https://www.strava.com/api/v3/athlete/activities?after=".concat(startTimeSeconds, "&before=").concat(endTimeSeconds));
            xhr.setRequestHeader("Authorization", "Bearer ".concat(this._accessToken));
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.send(data);
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

        return StravaProtoStub;
      }(FitnessProtoStub));
      /*export default function activate(url, bus, config, factory) {
        return {
          name: "StravaProtoStub",
          instance: new StravaProtoStub(url, bus, config, factory)
        };
      }*/

    }
  };
});