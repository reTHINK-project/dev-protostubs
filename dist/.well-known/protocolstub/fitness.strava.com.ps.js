System.register([],function(e){return{execute:function(){e(function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=100)}({100:function(e,t,r){"use strict";r.r(t),r.d(t,"default",function(){return n});var s=r(13);class n extends s.a{constructor(){super()}_start(e,t,r,s){super._init(e,t,r,s,"StravaProtoStub")}querySessions(e,t){let r=this;e!==t&&(e=t);const s=Math.round(new Date(e).getTime()/1e3),n=Math.round((new Date).getTime()/1e3);var o=new XMLHttpRequest;o.withCredentials=!0,o.addEventListener("readystatechange",function(){if(4===this.readyState){const s=JSON.parse(this.responseText);if(console.log("[StravaProtoStub] response: ",s),401===this.status)return r.refreshAccessToken(e,t,"strava.com");s.map(e=>{const{type:t,distance:s,start_date:n,elapsed_time:o}=e,i=new Date(n),a=i.toISOString(),u=i.getTime()+1e3*o,c=new Date(u).toISOString();switch(t){case"Run":console.log("[StravaProtoStub] walking/running distance (m): ",s),r.writeToReporter("walk",s,a,c);break;case"Ride":console.log("[StravaProtoStub] biking distance (m): ",s),r.writeToReporter("bike",s,a,c)}})}}),o.open("GET",`https://www.strava.com/api/v3/athlete/activities?after=${s}&before=${n}`),o.setRequestHeader("Authorization",`Bearer ${this._accessToken}`),o.setRequestHeader("cache-control","no-cache"),o.send(null)}}},13:function(e,t,r){"use strict";r.d(t,"a",function(){return s});class s{constructor(){}_init(e,t,r,s,n){if(this._stubName=n,!e)throw new Error("The runtimeProtoStubURL is a needed parameter");if(!t)throw new Error("The bus is a needed parameter");if(!r)throw new Error("The config is a needed parameter");if(!r.runtimeURL)throw new Error("The config.runtimeURL is a needed parameter");let o=this;console.log(`[${this._stubName}] PROTOSTUB`,o),this._id=0,this._runtimeProtoStubURL=e,this._bus=t,this._config=r,this._domain=r.domain,this._runtimeSessionURL=r.runtimeURL,this._syncher=s.createSyncher(e,t,r),this._userActivityVertxHypertyURL="hyperty://sharing-cities-dsm/user-activity",o._sendStatus("created"),o.started=!1;t.addListener("*",e=>{if(console.log(`${o._stubName} new Message  : `,e),e.identity&&(o._identity=e.identity),"delete"===e.type)return void o.stopWorking();if(e.hasOwnProperty("body")&&e.body.hasOwnProperty("identity")){if(e.body.identity.accessToken){o._accessToken=e.body.identity.accessToken;let t={id:e.id,type:"response",from:e.to,to:e.from,body:{code:200,runtimeURL:o._runtimeSessionURL}};console.log(o),o._bus.postMessage(t)}o.hypertyJSUrl=e.from}const t="hyperty-catalogue://catalogue."+o._domain+"/.well-known/dataschema/Context",r={id:"1276020076",values:[{type:"user_walking_context",name:"walking distance in meters",unit:"meter",value:0,startTime:"2018-03-25T12:00:00Z",endTime:"2018-03-25T12:10:00Z"},{type:"user_biking_context",name:"biking distance in meters",unit:"meter",value:0,startTime:"2018-03-26T12:00:00Z",endTime:"2018-03-26T12:10:00Z"}]};o._accessToken&&!o.started&&"create"===e.type&&o._resumeReporters("user_activity",e.to).then(function(s){console.log(`[${o._stubName}._resumeReporters (result)  `,s),0==s?o._setUpReporter(o._identity,t,r,["context"],"user_activity",e.to).then(function(e){e&&o.startWorking(e,!1)}):o.startWorking(s,!0)}).catch(function(e){})})}get descriptor(){return protostubDescriptor}get name(){return protostubDescriptor.name}startWorking(e,t){let r=this;function s(){const t=e.metadata.created;let s=e.metadata.lastModified;s||(s=t),r.querySessions(t,s),r.startInterval=setInterval(function(){(s=e.metadata.lastModified)||(s=t),r.querySessions(t,s)},r.config.sessions_query_interval),r.started=!0}r.reporter=e,r.hasStartedQuerying=!1,t&&(r.hasStartedQuerying=!0,s()),e.onSubscription(function(e){e.accept(),console.log(`${r._stubName} new subs`,e),r.hasStartedQuerying||(r.hasStartedQuerying=!0,s())}),console.log(`${r._stubName} User activity DO created: `,e),e.inviteObservers([r._userActivityVertxHypertyURL])}stopWorking(){clearInterval(this.startInterval),this.started=!1}_setUpReporter(e,t,r,s,n,o){let i=this;return new Promise(function(a,u){let c={resources:s,expires:3600,reporter:o,domain_registration:!1,domain_routing:!1};i._syncher.create(t,[],r,!0,!1,n,e,c).then(e=>{console.log(`${i._stubName} REPORTER RETURNED`,e),a(e)}).catch(function(e){console.error(`${i._stubName} err`,e),a(null)})})}_resumeReporters(e,t){let r=this;return new Promise((s,n)=>{r._syncher.resumeReporters({store:!0,reporter:t}).then(n=>{console.log(`[${r._stubName} Reporters resumed`,n);let o=Object.keys(n);if(!(o.length>0))return s(!1);o.forEach(o=>{if(console.log(`[${r._stubName}`,o),console.log(`[${r._stubName}`,n[o]),t==n[o].metadata.reporter&&n[o].metadata.name==e)return s(n[o])})}).catch(e=>{console.info(`[${r._stubName} Reporters:`,e)})})}querySessions(e,t){}writeToReporter(e,t,r,s){let n,o;"bike"===e?(n="user_biking_context",o="biking distance in meters"):"walk"===e&&(n="user_walking_context",o="walking distance in meters"),this.reporter.data.values=[{type:n,name:o,unit:"meter",value:t,startTime:r,endTime:s}]}refreshAccessToken(e,t,r){let s=this;return new Promise((n,o)=>{let i={type:"execute",from:s._runtimeProtoStubURL,to:s._runtimeSessionURL+"/idm",body:{method:"refreshAccessToken",params:{resources:["user_activity_context"],domain:r}}};s._bus.postMessage(i,r=>{console.log(`[${s._stubName}.refreshAccessToken] reply `,r),r.body.hasOwnProperty("value")?(s._accessToken=r.body.value,s.querySessions(e,t),n()):o(r.body)})})}get config(){return this._config}get runtimeSession(){return this._runtimeSessionURL}_sendStatus(e,t){console.log(`[[${this._stubName}] status changed] to `,e),this._state=e;let r={type:"update",from:this._runtimeProtoStubURL,to:this._runtimeProtoStubURL+"/status",body:{value:e}};t&&(r.body.desc=t),this._bus.postMessage(r)}}}}))}}});