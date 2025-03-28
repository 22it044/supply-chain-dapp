/*! For license information please see producer.bundle.js.LICENSE.txt */
(()=>{"use strict";var e={56:(e,t,n)=>{e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},72:e=>{var t=[];function n(e){for(var n=-1,r=0;r<t.length;r++)if(t[r].identifier===e){n=r;break}return n}function r(e,r){for(var a={},i=[],u=0;u<e.length;u++){var c=e[u],s=r.base?c[0]+r.base:c[0],l=a[s]||0,d="".concat(s," ").concat(l);a[s]=l+1;var p=n(d),y={css:c[1],media:c[2],sourceMap:c[3],supports:c[4],layer:c[5]};if(-1!==p)t[p].references++,t[p].updater(y);else{var m=o(y,r);r.byIndex=u,t.splice(u,0,{identifier:d,updater:m,references:1})}i.push(d)}return i}function o(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,o){var a=r(e=e||[],o=o||{});return function(e){e=e||[];for(var i=0;i<a.length;i++){var u=n(a[i]);t[u].references--}for(var c=r(e,o),s=0;s<a.length;s++){var l=n(a[s]);0===t[l].references&&(t[l].updater(),t.splice(l,1))}a=c}}},113:e=>{e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},174:(e,t,n)=>{n.d(t,{HW:()=>v,x3:()=>g});var r=n(72),o=n.n(r),a=n(825),i=n.n(a),u=n(659),c=n.n(u),s=n(56),l=n.n(s),d=n(540),p=n.n(d),y=n(113),m=n.n(y),f=n(523),h={};function g(){return null!==localStorage.getItem("currentUser")}function v(){var e=localStorage.getItem("currentUser");return e?JSON.parse(e):null}h.styleTagTransform=m(),h.setAttributes=l(),h.insert=c().bind(null,"head"),h.domAPI=i(),h.insertStyleElement=p(),o()(f.A,h),f.A&&f.A.locals&&f.A.locals,document.addEventListener("DOMContentLoaded",(function(){var e,t=document.getElementById("login-button"),n=document.getElementById("register-button"),r=document.getElementById("connect-button"),o=document.getElementById("user-status"),a=document.getElementById("metamask-status"),i=document.getElementById("wallet-info"),u=new bootstrap.Modal(document.getElementById("login-modal"),{backdrop:"static"}),c=document.getElementById("login-form"),s=document.getElementById("login-email"),l=document.getElementById("login-password"),d=document.getElementById("verification-code-section"),p=document.getElementById("send-code-btn"),y=document.getElementById("verification-code"),m=document.getElementById("sso-google"),f=new bootstrap.Modal(document.getElementById("register-modal"),{backdrop:"static"}),h=document.getElementById("register-form"),g=document.getElementById("register-name"),v=document.getElementById("register-email"),b=document.getElementById("register-mobile"),w=document.getElementById("register-password"),T=document.getElementById("confirm-password"),_=document.getElementById("producer-type"),x=document.getElementById("consumer-type"),E=document.getElementById("terms-agree");function P(e){o&&(o.textContent="Welcome, ".concat(e.name)),t&&(t.style.display="none"),n&&(n.style.display="none"),a&&(a.style.display="inline-block"),i&&(i.style.display="inline-block"),r&&(r.style.display="inline-block"),localStorage.setItem("currentUser",JSON.stringify(e)),document.dispatchEvent(new CustomEvent("userLoggedIn",{detail:e}))}function I(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(e).toLowerCase())}function k(e,t){e.classList.add("is-invalid");var n=e.nextElementSibling;n&&n.classList.contains("invalid-feedback")&&(n.textContent=t)}t&&t.addEventListener("click",(function(){u.show()})),n&&n.addEventListener("click",(function(){f.show()})),c&&c.addEventListener("submit",(function(e){e.preventDefault(),c.classList.remove("was-validated"),I(s.value)?l.value.length<8?k(l,"Password must be at least 8 characters"):"none"!==d.style.display?y.value&&6===y.value.length?(P({name:"Test User",email:s.value,userType:"producer"}),u.hide()):k(y,"Please enter the 6-digit verification code"):d.style.display="block":k(s,"Please enter a valid email address")})),p&&p.addEventListener("click",(function(){I(s.value)?(p.disabled=!0,p.textContent="Sending...",setTimeout((function(){p.textContent="Code Sent",alert("Verification code sent to your email/mobile. Check your inbox.");var e=60,t=setInterval((function(){e--,p.textContent="Resend (".concat(e,"s)"),e<=0&&(clearInterval(t),p.textContent="Resend Code",p.disabled=!1)}),1e3)}),2e3)):k(s,"Please enter a valid email address")})),m&&m.addEventListener("click",(function(){alert("Redirecting to Google for authentication..."),setTimeout((function(){P({name:"Google User",email:"google.user@example.com",userType:"consumer"}),u.hide()}),2e3)})),h&&h.addEventListener("submit",(function(e){e.preventDefault(),h.classList.remove("was-validated");var t,n=!0;g.value.trim()||(k(g,"Name is required"),n=!1),I(v.value)||(k(v,"Please enter a valid email address"),n=!1),t=b.value,/^[0-9]{10}$/.test(String(t))||(k(b,"Please enter a valid 10-digit mobile number"),n=!1),w.value.length<8&&(k(w,"Password must be at least 8 characters"),n=!1),T.value!==w.value&&(k(T,"Passwords do not match"),n=!1),_.checked||x.checked||(document.querySelector('[name="user-type"]').parentElement.classList.add("was-validated"),n=!1),E.checked||(E.classList.add("is-invalid"),n=!1),n&&(f.hide(),alert("A verification email and SMS have been sent to your registered email and mobile number. Please verify to complete registration."),setTimeout((function(){var e=_.checked?"producer":"consumer";P({name:g.value,email:v.value,userType:e}),"producer"===e?"/producer.html"!==window.location.pathname&&(window.location.href="producer.html"):"/consumer.html"!==window.location.pathname&&(window.location.href="consumer.html")}),3e3))})),(e=localStorage.getItem("currentUser"))&&P(JSON.parse(e))}))},314:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",r=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),r&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),r&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,r,o,a){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(r)for(var u=0;u<this.length;u++){var c=this[u][0];null!=c&&(i[c]=!0)}for(var s=0;s<e.length;s++){var l=[].concat(e[s]);r&&i[l[0]]||(void 0!==a&&(void 0===l[5]||(l[1]="@layer".concat(l[5].length>0?" ".concat(l[5]):""," {").concat(l[1],"}")),l[5]=a),n&&(l[2]?(l[1]="@media ".concat(l[2]," {").concat(l[1],"}"),l[2]=n):l[2]=n),o&&(l[4]?(l[1]="@supports (".concat(l[4],") {").concat(l[1],"}"),l[4]=o):l[4]="".concat(o)),t.push(l))}},t}},523:(e,t,n)=>{n.d(t,{A:()=>u});var r=n(601),o=n.n(r),a=n(314),i=n.n(a)()(o());i.push([e.id,"/* Basic Styles for Supply Chain DApp */\n\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  background-color: #f8f9fa;\n}\n\n.navbar {\n  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.card {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  margin-bottom: 20px;\n}\n\n.btn-action {\n  margin-right: 5px;\n}\n\n/* Timeline styles */\n.timeline-event {\n  border-left: 3px solid #0d6efd;\n  padding-left: 20px;\n  margin-bottom: 15px;\n  position: relative;\n}\n\n.timeline-event:before {\n  content: '';\n  display: block;\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background-color: #0d6efd;\n  position: absolute;\n  left: -7px;\n  top: 5px;\n}\n\ncode {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, \"Courier New\",\n    monospace;\n}\n  ",""]);const u=i},540:e=>{e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},601:e=>{e.exports=function(e){return e[1]}},659:e=>{var t={};e.exports=function(e,n){var r=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(n)}},825:e=>{e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var r="";n.supports&&(r+="@supports (".concat(n.supports,") {")),n.media&&(r+="@media ".concat(n.media," {"));var o=void 0!==n.layer;o&&(r+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),r+=n.css,o&&(r+="}"),n.media&&(r+="}"),n.supports&&(r+="}");var a=n.sourceMap;a&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a))))," */")),t.styleTagTransform(r,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={id:r,exports:{}};return e[r](a,a.exports,n),a.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nc=void 0;var r=n(174);function o(e){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},o(e)}function a(){a=function(){return t};var e,t={},n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(e,t,n){e[t]=n.value},u="function"==typeof Symbol?Symbol:{},c=u.iterator||"@@iterator",s=u.asyncIterator||"@@asyncIterator",l=u.toStringTag||"@@toStringTag";function d(e,t,n){return Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{d({},"")}catch(e){d=function(e,t,n){return e[t]=n}}function p(e,t,n,r){var o=t&&t.prototype instanceof b?t:b,a=Object.create(o.prototype),u=new O(r||[]);return i(a,"_invoke",{value:L(e,n,u)}),a}function y(e,t,n){try{return{type:"normal",arg:e.call(t,n)}}catch(e){return{type:"throw",arg:e}}}t.wrap=p;var m="suspendedStart",f="suspendedYield",h="executing",g="completed",v={};function b(){}function w(){}function T(){}var _={};d(_,c,(function(){return this}));var x=Object.getPrototypeOf,E=x&&x(x(B([])));E&&E!==n&&r.call(E,c)&&(_=E);var P=T.prototype=b.prototype=Object.create(_);function I(e){["next","throw","return"].forEach((function(t){d(e,t,(function(e){return this._invoke(t,e)}))}))}function k(e,t){function n(a,i,u,c){var s=y(e[a],e,i);if("throw"!==s.type){var l=s.arg,d=l.value;return d&&"object"==o(d)&&r.call(d,"__await")?t.resolve(d.__await).then((function(e){n("next",e,u,c)}),(function(e){n("throw",e,u,c)})):t.resolve(d).then((function(e){l.value=e,u(l)}),(function(e){return n("throw",e,u,c)}))}c(s.arg)}var a;i(this,"_invoke",{value:function(e,r){function o(){return new t((function(t,o){n(e,r,t,o)}))}return a=a?a.then(o,o):o()}})}function L(t,n,r){var o=m;return function(a,i){if(o===h)throw Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:e,done:!0}}for(r.method=a,r.arg=i;;){var u=r.delegate;if(u){var c=$(u,r);if(c){if(c===v)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===m)throw o=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=h;var s=y(t,n,r);if("normal"===s.type){if(o=r.done?g:f,s.arg===v)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(o=g,r.method="throw",r.arg=s.arg)}}}function $(t,n){var r=n.method,o=t.iterator[r];if(o===e)return n.delegate=null,"throw"===r&&t.iterator.return&&(n.method="return",n.arg=e,$(t,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),v;var a=y(o,t.iterator,n.arg);if("throw"===a.type)return n.method="throw",n.arg=a.arg,n.delegate=null,v;var i=a.arg;return i?i.done?(n[t.resultName]=i.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=e),n.delegate=null,v):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,v)}function M(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(M,this),this.reset(!0)}function B(t){if(t||""===t){var n=t[c];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,i=function n(){for(;++a<t.length;)if(r.call(t,a))return n.value=t[a],n.done=!1,n;return n.value=e,n.done=!0,n};return i.next=i}}throw new TypeError(o(t)+" is not iterable")}return w.prototype=T,i(P,"constructor",{value:T,configurable:!0}),i(T,"constructor",{value:w,configurable:!0}),w.displayName=d(T,l,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,T):(e.__proto__=T,d(e,l,"GeneratorFunction")),e.prototype=Object.create(P),e},t.awrap=function(e){return{__await:e}},I(k.prototype),d(k.prototype,s,(function(){return this})),t.AsyncIterator=k,t.async=function(e,n,r,o,a){void 0===a&&(a=Promise);var i=new k(p(e,n,r,o),a);return t.isGeneratorFunction(n)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},I(P),d(P,l,"Generator"),d(P,c,(function(){return this})),d(P,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),n=[];for(var r in t)n.push(r);return n.reverse(),function e(){for(;n.length;){var r=n.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},t.values=B,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(S),!t)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function o(r,o){return u.type="throw",u.arg=t,n.next=r,o&&(n.method="next",n.arg=e),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],u=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),s=r.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,v):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),v},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.finallyLoc===e)return this.complete(n.completion,n.afterLoc),S(n),v}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var n=this.tryEntries[t];if(n.tryLoc===e){var r=n.completion;if("throw"===r.type){var o=r.arg;S(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:B(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=e),v}},t}function i(e,t,n,r,o,a,i){try{var u=e[a](i),c=u.value}catch(e){return void n(e)}u.done?t(c):Promise.resolve(c).then(r,o)}function u(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function u(e){i(a,r,o,u,c,"next",e)}function c(e){i(a,r,o,u,c,"throw",e)}u(void 0)}))}}var c=[{inputs:[{internalType:"string",name:"_pname",type:"string"},{internalType:"uint256",name:"_price",type:"uint256"},{internalType:"uint256",name:"_quantity",type:"uint256"}],name:"addNewProductsInList",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_oid",type:"uint256"},{internalType:"string",name:"_status",type:"string"}],name:"giveOrderItsStatus",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_pid",type:"uint256"},{internalType:"uint256",name:"_newPrice",type:"uint256"}],name:"newPrice",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"_pid",type:"uint256"},{internalType:"uint256",name:"_quantity",type:"uint256"},{internalType:"string",name:"_cname",type:"string"},{internalType:"string",name:"_daddress",type:"string"}],name:"placeAnOrder",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"string",name:"_name",type:"string"}],name:"registerNewProducer",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_addr",type:"address"}],name:"getMyTotalOrder",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_addr",type:"address"},{internalType:"uint256",name:"_oid",type:"uint256"}],name:"getOrderByIdConsumer",outputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"string",name:"",type:"string"},{internalType:"string",name:"",type:"string"},{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_addr",type:"address"},{internalType:"uint256",name:"_oid",type:"uint256"}],name:"getOrderByIdProducer",outputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"uint256",name:"",type:"uint256"},{internalType:"string",name:"",type:"string"},{internalType:"string",name:"",type:"string"},{internalType:"string",name:"",type:"string"},{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_addr",type:"address"}],name:"getTotalOrder",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getTotalOrder",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_addr",type:"address"}],name:"getTotalProduct",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"getTotalProduct",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"_addr",type:"address"}],name:"isProducerRegistered",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"orders",outputs:[{internalType:"uint256",name:"id",type:"uint256"},{internalType:"uint256",name:"product_id",type:"uint256"},{internalType:"uint256",name:"quantity",type:"uint256"},{internalType:"string",name:"customer_name",type:"string"},{internalType:"string",name:"status",type:"string"},{internalType:"string",name:"delivery_address",type:"string"},{internalType:"address",name:"customer_address",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"producers",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"products",outputs:[{internalType:"uint256",name:"id",type:"uint256"},{internalType:"uint256",name:"price",type:"uint256"},{internalType:"uint256",name:"quantity",type:"uint256"},{internalType:"string",name:"product_name",type:"string"},{internalType:"address",name:"producer_address",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalOrder",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalProduct",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"}],s="0xCc10D8a7687051Ec063347555d7EA2Ee5722F26a";web3=new Web3(web3.currentProvider);var l=new web3.eth.Contract(c,s);function d(){web3&&ethereum.request({method:"eth_accounts"}).then((function(e){l.methods.getTotalProduct(e[0]).call().then((function(t){if($("#_myproduct_table tbody").empty(),0!=t)for(var n=1;n<=t;n++)loadProductByID(n,e[0])}))}))}function p(){web3&&ethereum.request({method:"eth_accounts"}).then((function(e){l.methods.getMyTotalOrder(e[0]).call().then((function(t){if($("#_order_table tbody").empty(),0!=t)for(var n=1;n<=t;n++)loadOrderByID(n,e[0])}))}))}console.log("blockchain connected"),$(document).ready((function(){return $("#_updatebtn").hide(),(0,r.x3)()?"producer"!==(0,r.HW)().userType?($("#producer-registration-section").hide(),$("#add-product-section").hide(),$("#my-products-section").hide(),$("#orders-section").hide(),void $('<div class="alert alert-danger mt-4">You need to be registered as a producer to access this dashboard.</div>').insertAfter(".lead")):($("#connect-button").click(u(a().mark((function e(){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,connectMetaMask();case 2:case"end":return e.stop()}}),e)})))),window.initContract=u(a().mark((function e(){var t,n;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0===window.ethereum){e.next=18;break}return e.prev=1,window.web3=new Web3(ethereum),console.log("Using modern Web3 with ethereum provider"),t=new web3.eth.Contract(c,s),e.next=7,ethereum.request({method:"eth_accounts"});case 7:return(n=e.sent).length>0&&t.methods.isProducerRegistered(n[0]).call().then((function(e){e?($("#_regdiv").hide(),d(),p()):$("#_regdiv").show()})),e.abrupt("return",t);case 12:return e.prev=12,e.t0=e.catch(1),console.error("Error initializing contract:",e.t0),e.abrupt("return",null);case 16:e.next=27;break;case 18:if(!window.web3){e.next=25;break}return window.web3=new Web3(web3.currentProvider),console.log("Using legacy Web3"),t=new web3.eth.Contract(c,s),e.abrupt("return",t);case 25:return console.log("Non-Ethereum browser detected. Consider using MetaMask!"),e.abrupt("return",null);case 27:case"end":return e.stop()}}),e,null,[[1,12]])}))),checkConnection(),$("#_regbutton").click((function(){var e;e=document.getElementById("_regname").value,web3?ethereum.request({method:"eth_accounts"}).then((function(t){l.methods.registerNewProducer(e).send({from:t[0]}).then((function(e){console.log(e),alert("Registration successful!"),$("#_regdiv").hide(),d()}))})):alert("Please connect to MetaMask first!")})),$("#_addbtn").click((function(){var e,t,n;e=document.getElementById("_pname").value,t=document.getElementById("_price").value,n=document.getElementById("_pquantity").value,web3?ethereum.request({method:"eth_accounts"}).then((function(r){l.methods.addNewProductsInList(e,t,n).send({from:r[0]}).then((function(e){console.log(e),alert("Product added successfully!"),d()})).catch((function(e){console.error("Error adding product:",e),alert("Failed to add product. Make sure you are registered as a producer.")}))})):alert("Please connect to MetaMask first!")})),web3.eth.getAccounts().then((function(e){var t=e[0];l.methods.getTotalProduct(t).call().then((function(e){console.log("totalProduct my : "+e),$("#_totalproduct").html(e)})),l.methods.getTotalProduct().call().then((function(e){console.log("totalProduct (global): "+e);var n=1;for(n=1;n<=e;n++)l.methods.getProductbyId(t,n).call().then((function(e){if(console.log(e),e[4]){var t="<tr><th>"+e[0]+"</th><td>"+e[3]+"</td><td>"+e[1]+"</td><td>"+e[2]+'</td><td><button type="button" class="btn btn-secondary btn-sm" onclick="updateProductPrice('+e[0]+')">Change price</button></td></tr>';$("#_myproduct_table").find("tbody").append(t)}}))})),l.methods.getMyTotalOrder(t).call().then((function(e){console.log("totalOrder my : "+e),$("#_total_order").html(e)})),l.methods.getTotalOrder().call().then((function(e){console.log("totalOrder (global): "+e);var n=1;for(n=1;n<=e;n++)l.methods.getOrderByIdProducer(t,n).call().then((function(e){if(console.log(e),e[6]){var t="<tr><th>"+e[0]+"</th><td>"+e[1]+"</td><td>"+e[2]+"</td><td>"+e[3]+"</td><td>"+e[5]+"</td><td>"+e[4]+'</td><td><button type="button" class="btn btn-primary btn-sm" onclick="delivered('+e[0]+')">Delivered</button>\n<button type="button" class="btn btn-secondary btn-sm" onclick="reject('+e[0]+')">Reject</button></td></tr>';$("#_order_table").find("tbody").append(t)}}))}))})),$("#_regbutton").click((function(){web3.eth.getAccounts().then((function(e){var t=e[0],n=$("#_regname").val();return l.methods.registerNewProducer(n).send({from:t})})).then((function(e){console.log(e),e.status&&$("#_regdiv").hide()}))})),$("#_addbtn").click((function(){web3.eth.getAccounts().then((function(e){var t=e[0],n=$("#_pname").val(),r=$("#_price").val(),o=$("#_pquantity").val();return console.log(n+r+o),l.methods.addNewProductsInList(n,r,o).send({from:t})})).then((function(e){console.log(e),e.status&&(alert("Product added!"),$("#_pname").val(""),$("#_price").val(""),$("#_pquantity").val(""),location.reload())}))})),void $("#_updatebtn").click((function(){web3.eth.getAccounts().then((function(e){var t=e[0],n=$("#_pname").val(),r=$("#_price").val();return console.log("update button click "+n+r),l.methods.newPrice(n,r).send({from:t})})).then((function(e){console.log(e),e.status&&(alert("New Price updated!"),$("#_nameidlabel").html("Name"),$("#_pricelabel").html("Price"),$("#_quantitylabel").show(),$("#_addbtn").show(),$("#_updatebtn").hide(),$("#_pname").val(""),$("#_price").val(""),location.reload())}))}))):($("#producer-registration-section").hide(),$("#add-product-section").hide(),$("#my-products-section").hide(),$("#orders-section").hide(),void $('<div class="alert alert-warning mt-4">Please login to access the producer dashboard.</div>').insertAfter(".lead"))}))})();