System.register([],function(e){return{execute:function(){e(function(e){var t={};function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,o){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(r.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(o,n,function(t){return e[t]}.bind(null,n));return o},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=49)}({49:function(e,t,r){"use strict";r.r(t);var o={name:"hello",hello:"Hello buddy!!"};t.default=class{constructor(){}set name(e){this._name=e}get name(){return this._name}_start(e,t,r,o){if(!e)throw new Error("The hypertyURL is a needed parameter");if(!t)throw new Error("The MiniBus is a needed parameter");if(!r)throw new Error("The configuration is a needed parameter");if(!o)throw new Error("The factory is a needed parameter");let n=o.divideURL(e).domain;this._domain=n,this._objectDescURL="hyperty-catalogue://catalogue."+n+"/.well-known/dataschema/HelloWorldDataSchema",this._factory=o,this._backup=!!r.hasOwnProperty("backup")&&r.backup,console.log("HelloWorldReporter configuration",r);let a=this._factory.createSyncher(e,t,r);this._syncher=a,this._runtimeHypertyURL=e}get runtimeHypertyURL(){return this._runtimeHypertyURL}hello(e){let t=this,r=t._syncher;return new Promise(function(n,a){let i=Object.assign({resources:["hello"]},{});i.backup=t._backup,i.reuseURL=!0,i.mutual=!1,i.domain_registration=!1,r.create(t._objectDescURL,[e],o,!0,!1,"hello",{},i).then(function(e){console.info("1. Return Created Hello World Data Object Reporter",e),t.helloObjtReporter=e,t.prepareDataObjectReporter(e),n(e)}).catch(function(e){console.error(e),a(e)})})}prepareDataObjectReporter(e){e.onSubscription(function(e){console.info("-------- Hello World Reporter received subscription request --------- \n"),e.accept()}),e.onRead(e=>{e.accept()})}bye(e){let t=this;console.log("bye:",t.helloObjtReporter),t.helloObjtReporter.data.hello=e||"bye, bye"}onReporterResume(e){this._onReporterResume=e}}}}))}}});