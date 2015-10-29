/**
 * © 2015 Cedexis Inc.
 * Radar JavaScript client
 * Application Version: 0.1.250
 * Build Timestamp: 1445280428
 */
(function(window,document){'use strict';function m(d){var h=d.Wa||18,g=d.Xa||18,b,f,k,l;this.g=d.w;this.ka=d.samplerId;this.J=[];this.g.cedexis=this.g.cedexis||{};this.g.cedexis.callbacks=this.g.cedexis.callbacks||[];this.Da=function(){return b};this.Ea=function(){return document};this.wa=function(a,c){for(var e=[],b=0;100>b&&(0<a.length||0<c.length);)0<a.length&&e.push(a.shift()),0<c.length&&e.push(c.shift()),b+=1;return e};this.H=function(){return(new Date).getTime()};this.l=function(a,c){return setTimeout(a,c)};this.j=function(a){clearTimeout(a)};
this.y64enc=this.P=function(){return function(a){var c="",e,b,f,d,g,h,k=0;a=a.replace(/\r\n/g,"\n");b="";for(f=0;f<a.length;f+=1)d=a.charCodeAt(f),128>d?b+=String.fromCharCode(d):(127<d&&2048>d?b+=String.fromCharCode(d>>6|192):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128)),b+=String.fromCharCode(d&63|128));for(a=b;k<a.length;)e=a.charCodeAt(k),k+=1,b=a.charCodeAt(k),k+=1,f=a.charCodeAt(k),k+=1,d=e>>2,e=(e&3)<<4|b>>4,g=(b&15)<<2|f>>6,h=f&63,isNaN(b)?g=h=64:isNaN(f)&&(h=64),
c=c+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-".charAt(d)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-".charAt(e)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-".charAt(h);return c}}();this.ba=function(a){var c=/radar_(tags|impact)_(\w{3,})/i,e;if(("radar_tags_"===a.slice(0,11)||"radar_impact_"===a.slice(0,13))&&(c=c.exec(a))&&3===c.length){try{e=p(window[a])}catch(b){return null}return c[2]+
":"+this.P(e)}return null};this.D=function(a){if(!a.includePartnerTags)return"0";if(!window.JSON||"function"!==typeof window.JSON.stringify)return"1";if(a=a.getImpactObject()){var c;try{c=p(a)}catch(b){return"error"}try{c=this.P(c)}catch(b){return"error"}return"impact_kpi:"+c}c=[];for(var e in window){a=null;if(void 0!==window.hasOwnProperty)window.hasOwnProperty(e)&&(a=this.ba(e));else try{void 0!==window[e]&&(a=this.ba(e))}catch(b){}a&&c.push(a)}return 1>c.length?"0":c.join("@")};this.C=function(a){var c=
document.getElementById("cdx");c||(c=document.createElement("div"),c.id="cdx",document.body.appendChild(c));c.appendChild(a)};this.ca=function(){return Math.random()};this.Ga=function(a){return Math.floor(this.ca()*(a-0+1))+0};this.M=function(a,c){var e,b=[];c=c||"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(e=0;e<a;e+=1)b.push(c.charAt(this.Ga(c.length-1)));return b.join("")};this.ta=function(a){return/http:/i.test(a)?"http":/https:/i.test(a)?"https":/\/\//.test(a)?window.location.protocol.replace(":",
""):null};this.ra=function(){var a=[],c=b.p.p,e,f;c.a&&c.a.a?a.push({a:"cold",b:1,f:!!c.d,t:c.a.a.t,u:c.a.a.u}):c.b&&c.b.a&&a.push({a:"cold",b:1,f:!!c.d,t:c.b.a.t,u:c.b.a.u});c.d&&a.push({a:"uni",t:c.d.t,u:c.d.u});if(c.a)for(c.a.b&&a.push({a:"rtt",b:0,f:!!c.d,t:c.a.b.t,u:c.a.b.u}),f=b.b,e=0;e<f;e++)c.a.c&&a.push({a:"kbps",b:14,f:!!c.d,t:c.a.c.t,u:c.a.c.u,report:f-1===e,probeIdSuffix:0===e?"":String.fromCharCode(97+e)});else if(c.b)for(c.b.b&&a.push({a:"rtt",b:0,f:!!c.d,t:c.b.b.t,u:c.b.b.u}),f=b.b,
e=0;e<f;e++)c.b.c&&a.push({a:"kbps",b:14,f:!!c.d,t:c.b.c.t,u:c.b.c.u,report:f-1===e,probeIdSuffix:0===e?"":String.fromCharCode(97+e)});c.c&&(e=this.ta(c.c.u))&&("http:"!==this.g.location.protocol&&"https"!==e||a.push({a:"custom",b:2,f:!!c.d,t:c.c.t,u:c.c.u}));b.L=a};this.sa=function(a){var c=[];a.connect&&c.push({a:"cold",b:1,f:!1,t:1,u:a.connect});a.response_time&&c.push({a:"rtt",b:0,f:!1,t:1,u:a.response_time});a.kbps&&c.push({a:"kbps",b:14,f:!1,t:1,u:a.kbps});b.L=c};this.Ua=function(a){return"uni"===
a?[b.requestor.zoneId,b.requestor.customerId,b.p.z,b.p.c,b.p.i,this.M(8),b.requestor.requestSignature].join("-"):[a,b.requestor.zoneId,b.requestor.customerId,b.p.z,b.p.c,b.p.i,b.requestor.transactionId,b.requestor.requestSignature].join("-")};this.v=function(a,c){var e="";a=a||f.u;if(!1!==b.a){e="?rnd=";-1<a.indexOf("?",0)&&(e="&rnd=");var d;"uni"===f.a?d="uni":d=f.b+(c||"");e+=this.Ua(d)}return a+e};this.Ka=function(a){var c=a.indexOf("//");if(-1<c){var e=a.substring(c+2),b="//";0<c&&(b=a.substring(0,
c)+"//");a=e.split("/");a[0]=this.M(63,"abcdefghijklmnopqrstuvwxyz")+"."+a[0];return b+a.join("/")}return null};this.Z=function(a,c){var e=/(\d+)kb\./i.exec(c);return!e||2>e.length?0:Math.floor(8E3*parseInt(e[1],10)/a)};this.G=function(a){var c,e,d;if(b&&f){b.c?(c=b.c.a,e=b.c.b,d=b.c.c):(c=b.p.z,e=b.p.c,d=b.p.i);q(this,"sendSuccessReport",{providerOwnerZoneId:c,providerOwnerCustomerId:e,providerId:d,probeId:f.b,resultCode:0,value:a});var g=b.requestor;a=[g.domains.report,"f1",g.requestSignature,c,
e,d,f.b,0,a,k||"0",this.D(g)];this.B("//"+a.join("/"));this.l(this.N(),200)}};this.N=function(){var a=this;return function(){a.h()}};this.Oa=function(){var a=this;return function(){a.A()}};this.o=function(a){var c,e,d;if(b&&f){b.c?(c=b.c.a,e=b.c.b,d=b.c.c):(c=b.p.z,e=b.p.c,d=b.p.i);q(this,"sendErrorReport",{providerOwnerZoneId:c,providerOwnerCustomerId:e,providerId:d,probeId:f.b,resultCode:a,value:0});var g=b.requestor;a=[g.domains.report,"f1",g.requestSignature,c,e,d,f.b,a,0,k||"0",this.D(g)];this.B("//"+
a.join("/"));this.l(this.Oa(),200)}};this.K=function(a){return!0===a.f&&null===k};this.$=function(a,c,e){a===f&&(c=e.call(null,c),0<c&&4E3>=c?(e=c,14===a.b&&(e=this.Z(c,a.u)),this.K(a)?(l={probe:a,measurement:e},this.h()):this.G(e)):this.o(1))};this.la=function(a,c,e){var b=this;return function(){a.c||(b.j(a.e),b.$(a,c,e))}};this.O=function(a){var c,e;c=document.createElement("script");c.async=!0;c.src=this.v();f.c=!1;f.d="loading";e=this.H();void 0!==c.onreadystatechange?c.onreadystatechange=function(c,
b){var d=!1;return function(){d||"loaded"!==this.readyState&&"complete"!==this.readyState||(d=!0,b!==f||b.c||(c.j(b.e),c.$(b,e,a)))}}(this,f):c.onload=this.la(f,e,a);c.onerror=function(a,c){return function(){c===f&&(a.j(c.e),c.c=!0,c.d="error",a.o(4))}}(this,f);f.e=this.l(this.F(),4E3);window.radar.stoppedAt=window.cedexis.radar.stopped_at=null;this.C(c)};this.ea=function(){var a=this;return function(c){return a.H()-c}};this.F=function(a){var c=this,e=f;return function(){var b=1;e.c||(a&&a.call(null),
e===f&&("loaded"===e.d&&(b=4),e.c=!0,e.d="timeout",c.o(b)))}};this.Ja=function(){var a=this;return function(){k="2";a.I()}};this.Ma=function(){var a=this,c=f,b;return b=function(){a.j(c.e);this.removeEventListener("load",b,!1);c.c||(c.d="loaded")}};this.Na=function(a,c){return function(){a.removeEventListener("load",c,!1)}};this.La=function(){var a=this,c=f,e;return e=function(d){if(c===f){var g;try{g=JSON.parse(d.data)}catch(h){}if(g&&g.source&&"dsa"===g.source&&"l"!==g.s&&"s"===g.s){if(!c.c){d=
g.m.responseEnd-g.m.domainLookupStart;var u=b.requestor,n=[u.domains.report,"f1",u.requestSignature,g.p.z,g.p.c,g.p.i,g.m.probe_id],v=0;if(4E3>=d){if(a.K(c)){l={probe:c,measurement:d,extraFields:[g.m.ciphertext]};a.h();return}}else v=1,d=0;n.push(v);n.push(d);q(a,"sendDsaReport",{providerOwnerZoneId:g.p.z,providerOwnerCustomerId:g.p.c,providerId:g.p.i,probeId:g.m.probe_id,resultCode:v,value:d});n.push(k||"0");n.push(a.D(u));n.push(g.m.ciphertext);a.B("//"+n.join("/"));a.l(a.N(),200)}window.removeEventListener("message",
e,!1)}}}};this.X=function(){var a=document.createElement("iframe"),c=this.v(),b=this.Ma();window.addEventListener("message",this.La(),!1);a.addEventListener("load",b,!1);a.src=c;a.style.display="none";f.c=!1;f.d="loading";f.e=this.l(this.F(this.Na(a,b)),4E3);this.C(a)};this.ia=function(){this.O(function(a){return window.radar.stoppedAt?window.radar.stoppedAt.getTime()-a:window.cedexis.radar.stopped_at?window.cedexis.radar.stopped_at.getTime()-a:null})};this.Pa=function(a,c){var b=this;return function(){b.j(a.e);
b.G(b.H()-c)}};this.ga=function(){var a=this.Ea().createElement("iframe"),c=this.H();a.src=this.v();a.style.display="none";f.c=!1;f.d="loading";a.onload=this.Pa(f,c);f.e=this.l(this.F(),4E3);this.C(a)};this.aa=function(a){if(this.g.performance&&this.g.performance.getEntriesByType)for(var c=this.g.performance.getEntriesByType("resource"),b=c.length;b--;)if(c[b].name===a)return c[b];return null};this.Qa=function(a){var c=this;return function(){c.j(a.e);if(!a.c)if("report"in a&&!a.report)c.h();else{var b=
c.aa(this.src);if(b){var d=14===a.b,b=0<b.requestStart?d?Math.round(b.responseEnd-b.requestStart):Math.round(b.responseStart-b.requestStart):Math.round(b.duration);if(1>b)c.A();else if(0<b&&4E3>=b){var f=b;d&&(f=c.Z(b,a.u));c.K(a)?(l={probe:a,measurement:f},c.h()):c.G(f)}else c.o(1)}}}};this.Sa=function(a,c){var b=(new Date).getTime(),d=this;return function(){d.j(a.e);var f=(new Date).getTime();a.c||(f-=b,f>c?d.o(1):d.K(a)?(l={probe:a,measurement:f},d.h()):d.G(f))}};this.Ra=function(a){var c=this;
return function(){c.j(a.e);if(!a.c){var b=c.aa(this.src);b&&(b=0<b.requestStart?Math.round(b.domainLookupEnd-b.domainLookupStart):Math.round(b.duration),1>b?c.A():4E3>=b?c.G(b):c.o(1))}}};this.fa=function(a){var c=this;return function(){c.j(a.e);a.c=!0;a.d="error";c.o(4)}};this.ha=function(){var a="cold"===f.a,c="performance"in this.g&&"getEntriesByType"in this.g.performance,e=a&&!c;a||c?(a=b.timeout||4E3,c=new Image,c.onload=e?this.Sa(f,a):this.Qa(f),c.onerror=this.fa(f),f.c=!1,f.d="loading",f.e=
this.l(this.F(),a),c.src=this.v(void 0,f.probeIdSuffix||null)):this.h()};this.qa=function(){var a=new Image;a.onload=this.Ra(f);a.onerror=this.fa(f);f.c=!1;f.d="loading";f.e=this.l(this.F(),4E3);var c=this.Ka(f.u);c?a.src=this.v(c):this.h()};this.I=function(){if(l){var a=b.requestor,a=[a.domains.report,"f1",a.requestSignature,b.p.z,b.p.c,b.p.i,l.probe.b,0,l.measurement,k||"0",this.D(a)];if("extraFields"in l)for(var c=0;c<l.extraFields.length;c+=1)a.push(l.extraFields[c]);this.B("//"+a.join("/"));
this.l(this.N(),200)}else this.h()};this.na=function(a){var c=this;return function(e){f!==a||b.p.i!==e.id||a.c||(a.d="loaded",k=e.node,c.I())}};this.pa=function(){return function(){}};this.oa=function(){return function(){}};this.za=function(){var a,c;a=document.createElement("script");c=this.v();window.cdx=window.cdx||{};window.cdx.s=window.cdx.s||{};window.cdx.s.b=this.na(f);a.onload=this.pa();a.onerror=this.oa();f.c=!1;f.d="loading";a.type="text/javascript";a.async=!0;a.src=c;this.C(a)};this.ma=
function(){var a=this;return function(c){var e,d,g;if(b&&f){try{e=JSON.parse(c.data)}catch(h){}e&&"uni"===e.source&&(c=parseInt(e.p.z,10),d=parseInt(e.p.c,10),g=parseInt(e.p.i,10),g===b.p.i&&d===b.p.c&&c===b.p.z&&e.r.z===b.requestor.zoneId&&e.r.c===b.requestor.customerId&&(a.j(f.e),"l"===e.s?f.d="loaded":-1<"es".indexOf(e.s)&&("e"===e.s?(f.d="error",k="2"):"s"===e.s&&(k=e.node_id),a.I())))}}};this.Aa=function(){return"function"===typeof window.postMessage&&"function"===typeof window.addEventListener};
this.ya=function(){var a;this.Aa()?(f.c=!1,f.d="loading",a=document.createElement("iframe"),a.style.display="none",a.src=this.v(),f.e=this.l(this.Ja(),4E3),this.C(a)):(k="1",this.I())};this.Fa=function(a){a=a.slice(a.lastIndexOf("/")+1);var c=[/cdx10b/,/rdr12/,/radar\.js/,/r\d+(-\d+kb)?\.js/i,/r\d+\w+(-\d+kb)?\.js/i],b;if("d17.html"===a)return 4;for(b=0;b<c.length;b+=1)if(c[b].test(a))return 1;return/\.js(\?)?/i.test(a)?5:/\.(ico|png|bmp|gif|jpg|jpeg)(\?)?/i.test(a)?2:/\.(htm(l)?)(\?)?/i.test(a)?
3:null};this.xa=function(){var a;if(f)switch(f.t){case 1:this.ia();break;case 2:this.ha();break;case 3:this.ga();break;case 4:this.X();break;case 5:this.O(this.ea());break;case 6:a=this.Fa(f.u);switch(a){case 1:this.ia();break;case 2:this.ha();break;case 3:this.ga();break;case 4:this.X();break;case 5:this.O(this.ea());break;default:this.o(5)}break;case 7:this.ya();break;case 8:this.za();break;case 9:this.qa();break;default:this.o(6)}};this.h=function(){b&&(0<b.L.length?(f=b.L.shift(),this.xa()):(b=
null,this.A()))};this.A=function(){b=f=null;0<this.J.length?(l=k=null,b=this.J.shift(),q(this,"measureProvider",{providerOwnerZoneId:b.p.z,providerOwnerCustomerId:b.p.c,providerId:b.p.i}),b.p.source_url?this.ua():(this.ra(),this.h())):q(this,"radarSessionFinished")};this.ua=function(){var a,c,e;window.XMLHttpRequest&&(c=new window.XMLHttpRequest)&&(a=b.p.source_url,e=Math.ceil(99999999*this.ca()),a=0>a.indexOf("?",0)?a+("?rnd="+e):a+("&rnd="+e),c.open("GET",a,!0),c.onreadystatechange=this.Va(),c.send())};
this.Va=function(){var a=this,c=b;return function(){var e;200===this.status&&4===this.readyState&&(e=JSON.parse(this.responseText),c===b&&(a.sa(e),0<b.L.length?a.h():a.A()))}};this.Ha=function(){var a=0;window.chrome&&window.chrome.loadTimes?(a=window.chrome.loadTimes(),a=Math.round(1E3*a.firstPaintTime)):window.performance&&window.performance.timing&&window.performance.timing.msFirstPaint&&(a=Math.round(window.performance.timing.msFirstPaint));return a};this.Ta=function(a){return this.da(a,a.transactionId)};
this.da=function(a,b){if(this.g.location&&this.g.location.protocol){var e="https:"===this.g.location.protocol?"s":"i",d=[];d.push("i1");d.push(this.ka);d.push(h);d.push(g);d.push(a.zoneId);d.push(a.customerId);d.push(b.toString(10));d.push(e);d=d.join("-");e=[];e.push(d+".init."+a.domains.init);e.push("i1");e.push(Math.floor((new Date).getTime()/1E3).toString(10));e.push(b.toString(10));e.push("xml");e="//"+e.join("/");return e+("?seed="+d)}return""};this.Ia=function(a,b){for(var d=0;d<a.length;d+=
1)a[d].requestor=b;this.J=this.wa(this.J,a);this.Da()||this.A()};this.run=this.va=function(a){a.runCalledAt=(new Date).getTime();var b=this.g.performance;if(b){var d=b.setResourceTimingBufferSize||b.webkitSetResourceTimingBufferSize;d&&d.call(b,300)}r({a:this.Ta(a),b:t(this,a)});"afterRun"in a&&a.afterRun()};"function"===typeof window.addEventListener&&window.addEventListener("message",this.ma(),!1)}m.prototype.ja="navigationStart unloadEventStart unloadEventEnd redirectStart redirectEnd fetchStart domainLookupStart domainLookupEnd connectStart connectEnd secureConnectionStart requestStart responseStart responseEnd domLoading domInteractive domContentLoadedEventStart domContentLoadedEventEnd domComplete loadEventStart loadEventEnd".split(" ");
function q(d,h,g){for(var b=d.g.cedexis,f=b.callbacks,k=f.length;k--;)"function"===typeof f[k]&&f[k].call(d.g,h,g);for(var l in b.requestors)b.requestors.hasOwnProperty(l)&&b.requestors[l].sendParentMessages&&d.g.parent&&"function"===typeof d.g.parent.postMessage&&d.g.parent.postMessage({radar:{type:"status",data:{messageName:h,messageData:g}}},"*")}m.prototype.log=function(d){var h=this.g.console;h&&h.log&&h.log.call(h,(new Date).toUTCString()+": "+d)};
m.prototype.Ca=function(){if(this.g.performance&&this.g.performance.getEntriesByType){for(var d=this.g.performance.getEntriesByType("resource"),h=d.length,g={},b;h--;){var f=d[h];b=f.name.split("//");if(b[1]){b=b[1].split("/");b=g[b[0]]=g[b[0]]||{V:0,W:0,R:0,S:0};var k,l;0<f.requestStart?(l=Math.round(f.responseEnd-f.requestStart),k=Math.round(f.responseStart-f.requestStart)):k=l=Math.round(f.duration);9<k&&(b.V+=k,b.R+=1);9<l&&(b.W+=l,b.S+=1);k=Math.round(f.startTime);b.U="undefined"===typeof b.U?
k:Math.min(k,b.U);k=Math.round(f.responseEnd);b.T="undefined"===typeof b.T?k:Math.max(k,b.T)}}var d=[],a;for(a in g)g.hasOwnProperty(a)&&(b=g[a],d.push([a,b.V,b.W,b.R,b.U,b.T,b.S]));return d}return null};m.prototype.getDomainPerformance=m.prototype.Ca;
function w(d,h){var g=(d.g.performance||{}).timing;if(g){if(0===g.loadEventEnd){d.Y=d.g.setInterval(x(d,h),1E3);return}for(var b=[h.domains.report,"n1",0],f=0;f<d.ja.length;f+=1){var k=g[d.ja[f]];b.push(void 0===k?0:k)}b.push(h.requestSignature);b.push(d.D(h));b.push(d.Ha());g.connectEnd<g.connectStart||g.domainLookupEnd<g.domainLookupStart||g.domComplete<g.domLoading||g.fetchStart<g.navigationStart||g.loadEventEnd<g.loadEventStart||g.loadEventEnd<g.navigationStart||g.responseEnd<g.responseStart||
g.responseStart<g.requestStart||d.B("//"+b.join("/"))}Math.random()<h.remoteProbingSampleRate&&y(d,h)}function x(d,h){var g=20;return function(){0<g--?0<d.g.performance.timing.loadEventEnd&&(d.g.clearInterval(d.Y),w(d,h)):(d.g.clearInterval(d.Y),Math.random()<h.remoteProbingSampleRate&&y(d,h))}}
function p(d){function h(d,b){for(var f="",h=0;h<d.length;h++)f=b(f,d[h],h);return f}switch(typeof d){case "string":return'"'+(""+d).replace(/\"/g,'\\"')+'"';case "number":return isNaN(d)?"null":d;case "boolean":return d?"true":"false";case "undefined":return"null";default:return null===d?"null":""+d!==d&&"[object Array]"==Object.prototype.toString.call(d)?"["+h(d,function(d,b){return d+","+p(b)}).substring(1)+"]":"{"+h(function(d){var b=[],f;for(f in d)b.push(f);return b}(d),function(g,b){void 0!==
d[b]&&"function"!==typeof d[b]&&(g+=","+p(b)+":"+p(d[b]));return g}).substring(1)+"}"}};m.prototype.ka="j1";function r(d){var h=new XMLHttpRequest;d.c=d.c||{};if(h)try{h.open("GET",d.a,!0),"b"in d&&(h.onreadystatechange=function(){200===this.status&&4===this.readyState&&d.b.call(this)}),d.d&&(h.timeout=d.d),h.send()}catch(g){}}
function t(d,h){return function(){if(this.responseText){var g=/<requestSignature>([\w@]+)</.exec(this.responseText);g&&2===g.length&&(h.requestSignature=g[1],h.requestSignatureTimestamp=(new Date).getTime(),h.notify("init"),h.sendPLT&&Math.random()<h.pltSampleRate?w(d,h):Math.random()<h.remoteProbingSampleRate&&y(d,h))}}}m.prototype.B=function(d){r({a:d})};m.prototype.send_report=m.prototype.B;
function y(d,h){var g,b;g=[];var f="",k=h.deviceCaps.call(h),l=Object.keys(k);for(b=l.length;b--;)g.push(l[b]+"="+k[l[b]]);if(window.location&&window.location.search)for((b=/radar-location=\w+-\w+-\w+/.exec(window.location.search))&&g.push(b[0]),k=window.location.search.slice(1).split("&"),b=k.length;b--;)l=k[b].split("="),2===l.length&&("radar-geo"===l[0]?(l=l[1].split("-"),g.push("country="+l[0]),g.push("asn="+l[1])):"radar-provider-count"===l[0]&&g.push("providerCount="+l[1]));0<g.length&&(f="?"+
g.join("&"));g=[h.domains.code,h.zoneId,h.customerId,"radar",h.buildTimestamp,d.M(20),"providers.json"];g="//"+g.join("/")+f;r({a:g,b:function(a){return function(){var b;try{b=JSON.parse(this.responseText)}catch(d){return}a.Ia(b,h)}}(d)})}m.prototype.Ba=function(d,h){if("function"===typeof h){var g;var b;(b=this.g.crypto||this.g.msCrypto)&&b.getRandomValues?(g=new Uint32Array(1),b.getRandomValues(g),g=g[0]):g=Math.floor(1E9*Math.random());r({a:this.da(d,g),b:h})}};m.prototype.doInitWithCallback=m.prototype.Ba;window.cedexis.main=window.cedexis.main||new m({w:window,d:document,samplerId:"j1"});var z,A,B;if(window.cedexis.requestors)for(z=Object.keys(window.cedexis.requestors),A=z.length;A--;)B=window.cedexis.requestors[z[A]],B.transactionId&&!B.runCalledAt&&window.cedexis.main.run(B);}(window,document));