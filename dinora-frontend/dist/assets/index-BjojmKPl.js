function Dc(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const i in r)if(i!=="default"&&!(i in e)){const l=Object.getOwnPropertyDescriptor(r,i);l&&Object.defineProperty(e,i,l.get?l:{enumerable:!0,get:()=>r[i]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const a of l.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(i){if(i.ep)return;i.ep=!0;const l=n(i);fetch(i.href,l)}})();function Ic(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var eu={exports:{}},Li={},tu={exports:{}},D={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wr=Symbol.for("react.element"),Mc=Symbol.for("react.portal"),Fc=Symbol.for("react.fragment"),$c=Symbol.for("react.strict_mode"),Uc=Symbol.for("react.profiler"),Ac=Symbol.for("react.provider"),Bc=Symbol.for("react.context"),Wc=Symbol.for("react.forward_ref"),Vc=Symbol.for("react.suspense"),Qc=Symbol.for("react.memo"),Hc=Symbol.for("react.lazy"),Lo=Symbol.iterator;function Kc(e){return e===null||typeof e!="object"?null:(e=Lo&&e[Lo]||e["@@iterator"],typeof e=="function"?e:null)}var nu={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ru=Object.assign,iu={};function Cn(e,t,n){this.props=e,this.context=t,this.refs=iu,this.updater=n||nu}Cn.prototype.isReactComponent={};Cn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Cn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function lu(){}lu.prototype=Cn.prototype;function La(e,t,n){this.props=e,this.context=t,this.refs=iu,this.updater=n||nu}var Oa=La.prototype=new lu;Oa.constructor=La;ru(Oa,Cn.prototype);Oa.isPureReactComponent=!0;var Oo=Array.isArray,au=Object.prototype.hasOwnProperty,Da={current:null},ou={key:!0,ref:!0,__self:!0,__source:!0};function su(e,t,n){var r,i={},l=null,a=null;if(t!=null)for(r in t.ref!==void 0&&(a=t.ref),t.key!==void 0&&(l=""+t.key),t)au.call(t,r)&&!ou.hasOwnProperty(r)&&(i[r]=t[r]);var s=arguments.length-2;if(s===1)i.children=n;else if(1<s){for(var u=Array(s),d=0;d<s;d++)u[d]=arguments[d+2];i.children=u}if(e&&e.defaultProps)for(r in s=e.defaultProps,s)i[r]===void 0&&(i[r]=s[r]);return{$$typeof:wr,type:e,key:l,ref:a,props:i,_owner:Da.current}}function Yc(e,t){return{$$typeof:wr,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Ia(e){return typeof e=="object"&&e!==null&&e.$$typeof===wr}function qc(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var Do=/\/+/g;function rl(e,t){return typeof e=="object"&&e!==null&&e.key!=null?qc(""+e.key):t.toString(36)}function Hr(e,t,n,r,i){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var a=!1;if(e===null)a=!0;else switch(l){case"string":case"number":a=!0;break;case"object":switch(e.$$typeof){case wr:case Mc:a=!0}}if(a)return a=e,i=i(a),e=r===""?"."+rl(a,0):r,Oo(i)?(n="",e!=null&&(n=e.replace(Do,"$&/")+"/"),Hr(i,t,n,"",function(d){return d})):i!=null&&(Ia(i)&&(i=Yc(i,n+(!i.key||a&&a.key===i.key?"":(""+i.key).replace(Do,"$&/")+"/")+e)),t.push(i)),1;if(a=0,r=r===""?".":r+":",Oo(e))for(var s=0;s<e.length;s++){l=e[s];var u=r+rl(l,s);a+=Hr(l,t,n,u,i)}else if(u=Kc(e),typeof u=="function")for(e=u.call(e),s=0;!(l=e.next()).done;)l=l.value,u=r+rl(l,s++),a+=Hr(l,t,n,u,i);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return a}function Pr(e,t,n){if(e==null)return e;var r=[],i=0;return Hr(e,r,"","",function(l){return t.call(n,l,i++)}),r}function Gc(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var he={current:null},Kr={transition:null},Xc={ReactCurrentDispatcher:he,ReactCurrentBatchConfig:Kr,ReactCurrentOwner:Da};function uu(){throw Error("act(...) is not supported in production builds of React.")}D.Children={map:Pr,forEach:function(e,t,n){Pr(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return Pr(e,function(){t++}),t},toArray:function(e){return Pr(e,function(t){return t})||[]},only:function(e){if(!Ia(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};D.Component=Cn;D.Fragment=Fc;D.Profiler=Uc;D.PureComponent=La;D.StrictMode=$c;D.Suspense=Vc;D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Xc;D.act=uu;D.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var r=ru({},e.props),i=e.key,l=e.ref,a=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,a=Da.current),t.key!==void 0&&(i=""+t.key),e.type&&e.type.defaultProps)var s=e.type.defaultProps;for(u in t)au.call(t,u)&&!ou.hasOwnProperty(u)&&(r[u]=t[u]===void 0&&s!==void 0?s[u]:t[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){s=Array(u);for(var d=0;d<u;d++)s[d]=arguments[d+2];r.children=s}return{$$typeof:wr,type:e.type,key:i,ref:l,props:r,_owner:a}};D.createContext=function(e){return e={$$typeof:Bc,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Ac,_context:e},e.Consumer=e};D.createElement=su;D.createFactory=function(e){var t=su.bind(null,e);return t.type=e,t};D.createRef=function(){return{current:null}};D.forwardRef=function(e){return{$$typeof:Wc,render:e}};D.isValidElement=Ia;D.lazy=function(e){return{$$typeof:Hc,_payload:{_status:-1,_result:e},_init:Gc}};D.memo=function(e,t){return{$$typeof:Qc,type:e,compare:t===void 0?null:t}};D.startTransition=function(e){var t=Kr.transition;Kr.transition={};try{e()}finally{Kr.transition=t}};D.unstable_act=uu;D.useCallback=function(e,t){return he.current.useCallback(e,t)};D.useContext=function(e){return he.current.useContext(e)};D.useDebugValue=function(){};D.useDeferredValue=function(e){return he.current.useDeferredValue(e)};D.useEffect=function(e,t){return he.current.useEffect(e,t)};D.useId=function(){return he.current.useId()};D.useImperativeHandle=function(e,t,n){return he.current.useImperativeHandle(e,t,n)};D.useInsertionEffect=function(e,t){return he.current.useInsertionEffect(e,t)};D.useLayoutEffect=function(e,t){return he.current.useLayoutEffect(e,t)};D.useMemo=function(e,t){return he.current.useMemo(e,t)};D.useReducer=function(e,t,n){return he.current.useReducer(e,t,n)};D.useRef=function(e){return he.current.useRef(e)};D.useState=function(e){return he.current.useState(e)};D.useSyncExternalStore=function(e,t,n){return he.current.useSyncExternalStore(e,t,n)};D.useTransition=function(){return he.current.useTransition()};D.version="18.3.1";tu.exports=D;var v=tu.exports;const du=Ic(v),Jc=Dc({__proto__:null,default:du},[v]);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zc=v,ef=Symbol.for("react.element"),tf=Symbol.for("react.fragment"),nf=Object.prototype.hasOwnProperty,rf=Zc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,lf={key:!0,ref:!0,__self:!0,__source:!0};function cu(e,t,n){var r,i={},l=null,a=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(a=t.ref);for(r in t)nf.call(t,r)&&!lf.hasOwnProperty(r)&&(i[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps,t)i[r]===void 0&&(i[r]=t[r]);return{$$typeof:ef,type:e,key:l,ref:a,props:i,_owner:rf.current}}Li.Fragment=tf;Li.jsx=cu;Li.jsxs=cu;eu.exports=Li;var o=eu.exports,Ol={},fu={exports:{}},Ee={},pu={exports:{}},mu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(T,L){var O=T.length;T.push(L);e:for(;0<O;){var q=O-1>>>1,ee=T[q];if(0<i(ee,L))T[q]=L,T[O]=ee,O=q;else break e}}function n(T){return T.length===0?null:T[0]}function r(T){if(T.length===0)return null;var L=T[0],O=T.pop();if(O!==L){T[0]=O;e:for(var q=0,ee=T.length,br=ee>>>1;q<br;){var Ot=2*(q+1)-1,nl=T[Ot],Dt=Ot+1,Er=T[Dt];if(0>i(nl,O))Dt<ee&&0>i(Er,nl)?(T[q]=Er,T[Dt]=O,q=Dt):(T[q]=nl,T[Ot]=O,q=Ot);else if(Dt<ee&&0>i(Er,O))T[q]=Er,T[Dt]=O,q=Dt;else break e}}return L}function i(T,L){var O=T.sortIndex-L.sortIndex;return O!==0?O:T.id-L.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;e.unstable_now=function(){return l.now()}}else{var a=Date,s=a.now();e.unstable_now=function(){return a.now()-s}}var u=[],d=[],m=1,p=null,g=3,w=!1,y=!1,k=!1,S=typeof setTimeout=="function"?setTimeout:null,h=typeof clearTimeout=="function"?clearTimeout:null,c=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function f(T){for(var L=n(d);L!==null;){if(L.callback===null)r(d);else if(L.startTime<=T)r(d),L.sortIndex=L.expirationTime,t(u,L);else break;L=n(d)}}function x(T){if(k=!1,f(T),!y)if(n(u)!==null)y=!0,el(j);else{var L=n(d);L!==null&&tl(x,L.startTime-T)}}function j(T,L){y=!1,k&&(k=!1,h(z),z=-1),w=!0;var O=g;try{for(f(L),p=n(u);p!==null&&(!(p.expirationTime>L)||T&&!_());){var q=p.callback;if(typeof q=="function"){p.callback=null,g=p.priorityLevel;var ee=q(p.expirationTime<=L);L=e.unstable_now(),typeof ee=="function"?p.callback=ee:p===n(u)&&r(u),f(L)}else r(u);p=n(u)}if(p!==null)var br=!0;else{var Ot=n(d);Ot!==null&&tl(x,Ot.startTime-L),br=!1}return br}finally{p=null,g=O,w=!1}}var b=!1,E=null,z=-1,M=5,C=-1;function _(){return!(e.unstable_now()-C<M)}function R(){if(E!==null){var T=e.unstable_now();C=T;var L=!0;try{L=E(!0,T)}finally{L?re():(b=!1,E=null)}}else b=!1}var re;if(typeof c=="function")re=function(){c(R)};else if(typeof MessageChannel<"u"){var Rt=new MessageChannel,Lt=Rt.port2;Rt.port1.onmessage=R,re=function(){Lt.postMessage(null)}}else re=function(){S(R,0)};function el(T){E=T,b||(b=!0,re())}function tl(T,L){z=S(function(){T(e.unstable_now())},L)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(T){T.callback=null},e.unstable_continueExecution=function(){y||w||(y=!0,el(j))},e.unstable_forceFrameRate=function(T){0>T||125<T?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):M=0<T?Math.floor(1e3/T):5},e.unstable_getCurrentPriorityLevel=function(){return g},e.unstable_getFirstCallbackNode=function(){return n(u)},e.unstable_next=function(T){switch(g){case 1:case 2:case 3:var L=3;break;default:L=g}var O=g;g=L;try{return T()}finally{g=O}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(T,L){switch(T){case 1:case 2:case 3:case 4:case 5:break;default:T=3}var O=g;g=T;try{return L()}finally{g=O}},e.unstable_scheduleCallback=function(T,L,O){var q=e.unstable_now();switch(typeof O=="object"&&O!==null?(O=O.delay,O=typeof O=="number"&&0<O?q+O:q):O=q,T){case 1:var ee=-1;break;case 2:ee=250;break;case 5:ee=1073741823;break;case 4:ee=1e4;break;default:ee=5e3}return ee=O+ee,T={id:m++,callback:L,priorityLevel:T,startTime:O,expirationTime:ee,sortIndex:-1},O>q?(T.sortIndex=O,t(d,T),n(u)===null&&T===n(d)&&(k?(h(z),z=-1):k=!0,tl(x,O-q))):(T.sortIndex=ee,t(u,T),y||w||(y=!0,el(j))),T},e.unstable_shouldYield=_,e.unstable_wrapCallback=function(T){var L=g;return function(){var O=g;g=L;try{return T.apply(this,arguments)}finally{g=O}}}})(mu);pu.exports=mu;var af=pu.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var of=v,be=af;function N(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var hu=new Set,Zn={};function Yt(e,t){xn(e,t),xn(e+"Capture",t)}function xn(e,t){for(Zn[e]=t,e=0;e<t.length;e++)hu.add(t[e])}var nt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Dl=Object.prototype.hasOwnProperty,sf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Io={},Mo={};function uf(e){return Dl.call(Mo,e)?!0:Dl.call(Io,e)?!1:sf.test(e)?Mo[e]=!0:(Io[e]=!0,!1)}function df(e,t,n,r){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function cf(e,t,n,r){if(t===null||typeof t>"u"||df(e,t,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function ge(e,t,n,r,i,l,a){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=a}var ae={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){ae[e]=new ge(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];ae[t]=new ge(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){ae[e]=new ge(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){ae[e]=new ge(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){ae[e]=new ge(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){ae[e]=new ge(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){ae[e]=new ge(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){ae[e]=new ge(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){ae[e]=new ge(e,5,!1,e.toLowerCase(),null,!1,!1)});var Ma=/[\-:]([a-z])/g;function Fa(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Ma,Fa);ae[t]=new ge(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Ma,Fa);ae[t]=new ge(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Ma,Fa);ae[t]=new ge(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){ae[e]=new ge(e,1,!1,e.toLowerCase(),null,!1,!1)});ae.xlinkHref=new ge("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){ae[e]=new ge(e,1,!1,e.toLowerCase(),null,!0,!0)});function $a(e,t,n,r){var i=ae.hasOwnProperty(t)?ae[t]:null;(i!==null?i.type!==0:r||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(cf(t,n,i,r)&&(n=null),r||i===null?uf(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):i.mustUseProperty?e[i.propertyName]=n===null?i.type===3?!1:"":n:(t=i.attributeName,r=i.attributeNamespace,n===null?e.removeAttribute(t):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?e.setAttributeNS(r,t,n):e.setAttribute(t,n))))}var at=of.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,_r=Symbol.for("react.element"),Jt=Symbol.for("react.portal"),Zt=Symbol.for("react.fragment"),Ua=Symbol.for("react.strict_mode"),Il=Symbol.for("react.profiler"),gu=Symbol.for("react.provider"),xu=Symbol.for("react.context"),Aa=Symbol.for("react.forward_ref"),Ml=Symbol.for("react.suspense"),Fl=Symbol.for("react.suspense_list"),Ba=Symbol.for("react.memo"),dt=Symbol.for("react.lazy"),vu=Symbol.for("react.offscreen"),Fo=Symbol.iterator;function Tn(e){return e===null||typeof e!="object"?null:(e=Fo&&e[Fo]||e["@@iterator"],typeof e=="function"?e:null)}var K=Object.assign,il;function $n(e){if(il===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);il=t&&t[1]||""}return`
`+il+e}var ll=!1;function al(e,t){if(!e||ll)return"";ll=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var r=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){r=d}e.call(t.prototype)}else{try{throw Error()}catch(d){r=d}e()}}catch(d){if(d&&r&&typeof d.stack=="string"){for(var i=d.stack.split(`
`),l=r.stack.split(`
`),a=i.length-1,s=l.length-1;1<=a&&0<=s&&i[a]!==l[s];)s--;for(;1<=a&&0<=s;a--,s--)if(i[a]!==l[s]){if(a!==1||s!==1)do if(a--,s--,0>s||i[a]!==l[s]){var u=`
`+i[a].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=a&&0<=s);break}}}finally{ll=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?$n(e):""}function ff(e){switch(e.tag){case 5:return $n(e.type);case 16:return $n("Lazy");case 13:return $n("Suspense");case 19:return $n("SuspenseList");case 0:case 2:case 15:return e=al(e.type,!1),e;case 11:return e=al(e.type.render,!1),e;case 1:return e=al(e.type,!0),e;default:return""}}function $l(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Zt:return"Fragment";case Jt:return"Portal";case Il:return"Profiler";case Ua:return"StrictMode";case Ml:return"Suspense";case Fl:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case xu:return(e.displayName||"Context")+".Consumer";case gu:return(e._context.displayName||"Context")+".Provider";case Aa:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Ba:return t=e.displayName||null,t!==null?t:$l(e.type)||"Memo";case dt:t=e._payload,e=e._init;try{return $l(e(t))}catch{}}return null}function pf(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return $l(t);case 8:return t===Ua?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function bt(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function yu(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function mf(e){var t=yu(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),r=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(a){r=""+a,l.call(this,a)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(a){r=""+a},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function zr(e){e._valueTracker||(e._valueTracker=mf(e))}function wu(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r="";return e&&(r=yu(e)?e.checked?"true":"false":e.value),e=r,e!==n?(t.setValue(e),!0):!1}function ii(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ul(e,t){var n=t.checked;return K({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function $o(e,t){var n=t.defaultValue==null?"":t.defaultValue,r=t.checked!=null?t.checked:t.defaultChecked;n=bt(t.value!=null?t.value:n),e._wrapperState={initialChecked:r,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function ku(e,t){t=t.checked,t!=null&&$a(e,"checked",t,!1)}function Al(e,t){ku(e,t);var n=bt(t.value),r=t.type;if(n!=null)r==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(r==="submit"||r==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Bl(e,t.type,n):t.hasOwnProperty("defaultValue")&&Bl(e,t.type,bt(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Uo(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var r=t.type;if(!(r!=="submit"&&r!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Bl(e,t,n){(t!=="number"||ii(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var Un=Array.isArray;function cn(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t["$"+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty("$"+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=""+bt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Wl(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(N(91));return K({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Ao(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(N(92));if(Un(n)){if(1<n.length)throw Error(N(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:bt(n)}}function Su(e,t){var n=bt(t.value),r=bt(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),r!=null&&(e.defaultValue=""+r)}function Bo(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function ju(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Vl(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?ju(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Tr,Nu=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,r,i){MSApp.execUnsafeLocalFunction(function(){return e(t,n,r,i)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Tr=Tr||document.createElement("div"),Tr.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Tr.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function er(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var Wn={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},hf=["Webkit","ms","Moz","O"];Object.keys(Wn).forEach(function(e){hf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),Wn[t]=Wn[e]})});function Cu(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||Wn.hasOwnProperty(e)&&Wn[e]?(""+t).trim():t+"px"}function bu(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=Cu(n,t[n],r);n==="float"&&(n="cssFloat"),r?e.setProperty(n,i):e[n]=i}}var gf=K({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ql(e,t){if(t){if(gf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(N(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(N(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(N(61))}if(t.style!=null&&typeof t.style!="object")throw Error(N(62))}}function Hl(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Kl=null;function Wa(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Yl=null,fn=null,pn=null;function Wo(e){if(e=jr(e)){if(typeof Yl!="function")throw Error(N(280));var t=e.stateNode;t&&(t=Fi(t),Yl(e.stateNode,e.type,t))}}function Eu(e){fn?pn?pn.push(e):pn=[e]:fn=e}function Pu(){if(fn){var e=fn,t=pn;if(pn=fn=null,Wo(e),t)for(e=0;e<t.length;e++)Wo(t[e])}}function _u(e,t){return e(t)}function zu(){}var ol=!1;function Tu(e,t,n){if(ol)return e(t,n);ol=!0;try{return _u(e,t,n)}finally{ol=!1,(fn!==null||pn!==null)&&(zu(),Pu())}}function tr(e,t){var n=e.stateNode;if(n===null)return null;var r=Fi(n);if(r===null)return null;n=r[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(e=e.type,r=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!r;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(N(231,t,typeof n));return n}var ql=!1;if(nt)try{var Rn={};Object.defineProperty(Rn,"passive",{get:function(){ql=!0}}),window.addEventListener("test",Rn,Rn),window.removeEventListener("test",Rn,Rn)}catch{ql=!1}function xf(e,t,n,r,i,l,a,s,u){var d=Array.prototype.slice.call(arguments,3);try{t.apply(n,d)}catch(m){this.onError(m)}}var Vn=!1,li=null,ai=!1,Gl=null,vf={onError:function(e){Vn=!0,li=e}};function yf(e,t,n,r,i,l,a,s,u){Vn=!1,li=null,xf.apply(vf,arguments)}function wf(e,t,n,r,i,l,a,s,u){if(yf.apply(this,arguments),Vn){if(Vn){var d=li;Vn=!1,li=null}else throw Error(N(198));ai||(ai=!0,Gl=d)}}function qt(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function Ru(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Vo(e){if(qt(e)!==e)throw Error(N(188))}function kf(e){var t=e.alternate;if(!t){if(t=qt(e),t===null)throw Error(N(188));return t!==e?null:e}for(var n=e,r=t;;){var i=n.return;if(i===null)break;var l=i.alternate;if(l===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===l.child){for(l=i.child;l;){if(l===n)return Vo(i),e;if(l===r)return Vo(i),t;l=l.sibling}throw Error(N(188))}if(n.return!==r.return)n=i,r=l;else{for(var a=!1,s=i.child;s;){if(s===n){a=!0,n=i,r=l;break}if(s===r){a=!0,r=i,n=l;break}s=s.sibling}if(!a){for(s=l.child;s;){if(s===n){a=!0,n=l,r=i;break}if(s===r){a=!0,r=l,n=i;break}s=s.sibling}if(!a)throw Error(N(189))}}if(n.alternate!==r)throw Error(N(190))}if(n.tag!==3)throw Error(N(188));return n.stateNode.current===n?e:t}function Lu(e){return e=kf(e),e!==null?Ou(e):null}function Ou(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Ou(e);if(t!==null)return t;e=e.sibling}return null}var Du=be.unstable_scheduleCallback,Qo=be.unstable_cancelCallback,Sf=be.unstable_shouldYield,jf=be.unstable_requestPaint,G=be.unstable_now,Nf=be.unstable_getCurrentPriorityLevel,Va=be.unstable_ImmediatePriority,Iu=be.unstable_UserBlockingPriority,oi=be.unstable_NormalPriority,Cf=be.unstable_LowPriority,Mu=be.unstable_IdlePriority,Oi=null,He=null;function bf(e){if(He&&typeof He.onCommitFiberRoot=="function")try{He.onCommitFiberRoot(Oi,e,void 0,(e.current.flags&128)===128)}catch{}}var Ue=Math.clz32?Math.clz32:_f,Ef=Math.log,Pf=Math.LN2;function _f(e){return e>>>=0,e===0?32:31-(Ef(e)/Pf|0)|0}var Rr=64,Lr=4194304;function An(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function si(e,t){var n=e.pendingLanes;if(n===0)return 0;var r=0,i=e.suspendedLanes,l=e.pingedLanes,a=n&268435455;if(a!==0){var s=a&~i;s!==0?r=An(s):(l&=a,l!==0&&(r=An(l)))}else a=n&~i,a!==0?r=An(a):l!==0&&(r=An(l));if(r===0)return 0;if(t!==0&&t!==r&&!(t&i)&&(i=r&-r,l=t&-t,i>=l||i===16&&(l&4194240)!==0))return t;if(r&4&&(r|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=r;0<t;)n=31-Ue(t),i=1<<n,r|=e[n],t&=~i;return r}function zf(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Tf(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,l=e.pendingLanes;0<l;){var a=31-Ue(l),s=1<<a,u=i[a];u===-1?(!(s&n)||s&r)&&(i[a]=zf(s,t)):u<=t&&(e.expiredLanes|=s),l&=~s}}function Xl(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Fu(){var e=Rr;return Rr<<=1,!(Rr&4194240)&&(Rr=64),e}function sl(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function kr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ue(t),e[t]=n}function Rf(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var r=e.eventTimes;for(e=e.expirationTimes;0<n;){var i=31-Ue(n),l=1<<i;t[i]=0,r[i]=-1,e[i]=-1,n&=~l}}function Qa(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-Ue(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}var F=0;function $u(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Uu,Ha,Au,Bu,Wu,Jl=!1,Or=[],xt=null,vt=null,yt=null,nr=new Map,rr=new Map,ft=[],Lf="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ho(e,t){switch(e){case"focusin":case"focusout":xt=null;break;case"dragenter":case"dragleave":vt=null;break;case"mouseover":case"mouseout":yt=null;break;case"pointerover":case"pointerout":nr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":rr.delete(t.pointerId)}}function Ln(e,t,n,r,i,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:l,targetContainers:[i]},t!==null&&(t=jr(t),t!==null&&Ha(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Of(e,t,n,r,i){switch(t){case"focusin":return xt=Ln(xt,e,t,n,r,i),!0;case"dragenter":return vt=Ln(vt,e,t,n,r,i),!0;case"mouseover":return yt=Ln(yt,e,t,n,r,i),!0;case"pointerover":var l=i.pointerId;return nr.set(l,Ln(nr.get(l)||null,e,t,n,r,i)),!0;case"gotpointercapture":return l=i.pointerId,rr.set(l,Ln(rr.get(l)||null,e,t,n,r,i)),!0}return!1}function Vu(e){var t=Ft(e.target);if(t!==null){var n=qt(t);if(n!==null){if(t=n.tag,t===13){if(t=Ru(n),t!==null){e.blockedOn=t,Wu(e.priority,function(){Au(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Yr(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Zl(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);Kl=r,n.target.dispatchEvent(r),Kl=null}else return t=jr(n),t!==null&&Ha(t),e.blockedOn=n,!1;t.shift()}return!0}function Ko(e,t,n){Yr(e)&&n.delete(t)}function Df(){Jl=!1,xt!==null&&Yr(xt)&&(xt=null),vt!==null&&Yr(vt)&&(vt=null),yt!==null&&Yr(yt)&&(yt=null),nr.forEach(Ko),rr.forEach(Ko)}function On(e,t){e.blockedOn===t&&(e.blockedOn=null,Jl||(Jl=!0,be.unstable_scheduleCallback(be.unstable_NormalPriority,Df)))}function ir(e){function t(i){return On(i,e)}if(0<Or.length){On(Or[0],e);for(var n=1;n<Or.length;n++){var r=Or[n];r.blockedOn===e&&(r.blockedOn=null)}}for(xt!==null&&On(xt,e),vt!==null&&On(vt,e),yt!==null&&On(yt,e),nr.forEach(t),rr.forEach(t),n=0;n<ft.length;n++)r=ft[n],r.blockedOn===e&&(r.blockedOn=null);for(;0<ft.length&&(n=ft[0],n.blockedOn===null);)Vu(n),n.blockedOn===null&&ft.shift()}var mn=at.ReactCurrentBatchConfig,ui=!0;function If(e,t,n,r){var i=F,l=mn.transition;mn.transition=null;try{F=1,Ka(e,t,n,r)}finally{F=i,mn.transition=l}}function Mf(e,t,n,r){var i=F,l=mn.transition;mn.transition=null;try{F=4,Ka(e,t,n,r)}finally{F=i,mn.transition=l}}function Ka(e,t,n,r){if(ui){var i=Zl(e,t,n,r);if(i===null)vl(e,t,r,di,n),Ho(e,r);else if(Of(i,e,t,n,r))r.stopPropagation();else if(Ho(e,r),t&4&&-1<Lf.indexOf(e)){for(;i!==null;){var l=jr(i);if(l!==null&&Uu(l),l=Zl(e,t,n,r),l===null&&vl(e,t,r,di,n),l===i)break;i=l}i!==null&&r.stopPropagation()}else vl(e,t,r,null,n)}}var di=null;function Zl(e,t,n,r){if(di=null,e=Wa(r),e=Ft(e),e!==null)if(t=qt(e),t===null)e=null;else if(n=t.tag,n===13){if(e=Ru(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return di=e,null}function Qu(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Nf()){case Va:return 1;case Iu:return 4;case oi:case Cf:return 16;case Mu:return 536870912;default:return 16}default:return 16}}var mt=null,Ya=null,qr=null;function Hu(){if(qr)return qr;var e,t=Ya,n=t.length,r,i="value"in mt?mt.value:mt.textContent,l=i.length;for(e=0;e<n&&t[e]===i[e];e++);var a=n-e;for(r=1;r<=a&&t[n-r]===i[l-r];r++);return qr=i.slice(e,1<r?1-r:void 0)}function Gr(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Dr(){return!0}function Yo(){return!1}function Pe(e){function t(n,r,i,l,a){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=l,this.target=a,this.currentTarget=null;for(var s in e)e.hasOwnProperty(s)&&(n=e[s],this[s]=n?n(l):l[s]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?Dr:Yo,this.isPropagationStopped=Yo,this}return K(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Dr)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Dr)},persist:function(){},isPersistent:Dr}),t}var bn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},qa=Pe(bn),Sr=K({},bn,{view:0,detail:0}),Ff=Pe(Sr),ul,dl,Dn,Di=K({},Sr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ga,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Dn&&(Dn&&e.type==="mousemove"?(ul=e.screenX-Dn.screenX,dl=e.screenY-Dn.screenY):dl=ul=0,Dn=e),ul)},movementY:function(e){return"movementY"in e?e.movementY:dl}}),qo=Pe(Di),$f=K({},Di,{dataTransfer:0}),Uf=Pe($f),Af=K({},Sr,{relatedTarget:0}),cl=Pe(Af),Bf=K({},bn,{animationName:0,elapsedTime:0,pseudoElement:0}),Wf=Pe(Bf),Vf=K({},bn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Qf=Pe(Vf),Hf=K({},bn,{data:0}),Go=Pe(Hf),Kf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Yf={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},qf={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Gf(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=qf[e])?!!t[e]:!1}function Ga(){return Gf}var Xf=K({},Sr,{key:function(e){if(e.key){var t=Kf[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Gr(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Yf[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ga,charCode:function(e){return e.type==="keypress"?Gr(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Gr(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Jf=Pe(Xf),Zf=K({},Di,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Xo=Pe(Zf),ep=K({},Sr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ga}),tp=Pe(ep),np=K({},bn,{propertyName:0,elapsedTime:0,pseudoElement:0}),rp=Pe(np),ip=K({},Di,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),lp=Pe(ip),ap=[9,13,27,32],Xa=nt&&"CompositionEvent"in window,Qn=null;nt&&"documentMode"in document&&(Qn=document.documentMode);var op=nt&&"TextEvent"in window&&!Qn,Ku=nt&&(!Xa||Qn&&8<Qn&&11>=Qn),Jo=" ",Zo=!1;function Yu(e,t){switch(e){case"keyup":return ap.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function qu(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var en=!1;function sp(e,t){switch(e){case"compositionend":return qu(t);case"keypress":return t.which!==32?null:(Zo=!0,Jo);case"textInput":return e=t.data,e===Jo&&Zo?null:e;default:return null}}function up(e,t){if(en)return e==="compositionend"||!Xa&&Yu(e,t)?(e=Hu(),qr=Ya=mt=null,en=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Ku&&t.locale!=="ko"?null:t.data;default:return null}}var dp={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function es(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!dp[e.type]:t==="textarea"}function Gu(e,t,n,r){Eu(r),t=ci(t,"onChange"),0<t.length&&(n=new qa("onChange","change",null,n,r),e.push({event:n,listeners:t}))}var Hn=null,lr=null;function cp(e){od(e,0)}function Ii(e){var t=rn(e);if(wu(t))return e}function fp(e,t){if(e==="change")return t}var Xu=!1;if(nt){var fl;if(nt){var pl="oninput"in document;if(!pl){var ts=document.createElement("div");ts.setAttribute("oninput","return;"),pl=typeof ts.oninput=="function"}fl=pl}else fl=!1;Xu=fl&&(!document.documentMode||9<document.documentMode)}function ns(){Hn&&(Hn.detachEvent("onpropertychange",Ju),lr=Hn=null)}function Ju(e){if(e.propertyName==="value"&&Ii(lr)){var t=[];Gu(t,lr,e,Wa(e)),Tu(cp,t)}}function pp(e,t,n){e==="focusin"?(ns(),Hn=t,lr=n,Hn.attachEvent("onpropertychange",Ju)):e==="focusout"&&ns()}function mp(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Ii(lr)}function hp(e,t){if(e==="click")return Ii(t)}function gp(e,t){if(e==="input"||e==="change")return Ii(t)}function xp(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Be=typeof Object.is=="function"?Object.is:xp;function ar(e,t){if(Be(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Dl.call(t,i)||!Be(e[i],t[i]))return!1}return!0}function rs(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function is(e,t){var n=rs(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=rs(n)}}function Zu(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Zu(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function ed(){for(var e=window,t=ii();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ii(e.document)}return t}function Ja(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function vp(e){var t=ed(),n=e.focusedElem,r=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&Zu(n.ownerDocument.documentElement,n)){if(r!==null&&Ja(n)){if(t=r.start,e=r.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var i=n.textContent.length,l=Math.min(r.start,i);r=r.end===void 0?l:Math.min(r.end,i),!e.extend&&l>r&&(i=r,r=l,l=i),i=is(n,l);var a=is(n,r);i&&a&&(e.rangeCount!==1||e.anchorNode!==i.node||e.anchorOffset!==i.offset||e.focusNode!==a.node||e.focusOffset!==a.offset)&&(t=t.createRange(),t.setStart(i.node,i.offset),e.removeAllRanges(),l>r?(e.addRange(t),e.extend(a.node,a.offset)):(t.setEnd(a.node,a.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var yp=nt&&"documentMode"in document&&11>=document.documentMode,tn=null,ea=null,Kn=null,ta=!1;function ls(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ta||tn==null||tn!==ii(r)||(r=tn,"selectionStart"in r&&Ja(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),Kn&&ar(Kn,r)||(Kn=r,r=ci(ea,"onSelect"),0<r.length&&(t=new qa("onSelect","select",null,t,n),e.push({event:t,listeners:r}),t.target=tn)))}function Ir(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var nn={animationend:Ir("Animation","AnimationEnd"),animationiteration:Ir("Animation","AnimationIteration"),animationstart:Ir("Animation","AnimationStart"),transitionend:Ir("Transition","TransitionEnd")},ml={},td={};nt&&(td=document.createElement("div").style,"AnimationEvent"in window||(delete nn.animationend.animation,delete nn.animationiteration.animation,delete nn.animationstart.animation),"TransitionEvent"in window||delete nn.transitionend.transition);function Mi(e){if(ml[e])return ml[e];if(!nn[e])return e;var t=nn[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in td)return ml[e]=t[n];return e}var nd=Mi("animationend"),rd=Mi("animationiteration"),id=Mi("animationstart"),ld=Mi("transitionend"),ad=new Map,as="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Pt(e,t){ad.set(e,t),Yt(t,[e])}for(var hl=0;hl<as.length;hl++){var gl=as[hl],wp=gl.toLowerCase(),kp=gl[0].toUpperCase()+gl.slice(1);Pt(wp,"on"+kp)}Pt(nd,"onAnimationEnd");Pt(rd,"onAnimationIteration");Pt(id,"onAnimationStart");Pt("dblclick","onDoubleClick");Pt("focusin","onFocus");Pt("focusout","onBlur");Pt(ld,"onTransitionEnd");xn("onMouseEnter",["mouseout","mouseover"]);xn("onMouseLeave",["mouseout","mouseover"]);xn("onPointerEnter",["pointerout","pointerover"]);xn("onPointerLeave",["pointerout","pointerover"]);Yt("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Yt("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Yt("onBeforeInput",["compositionend","keypress","textInput","paste"]);Yt("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Yt("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Yt("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Bn="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Sp=new Set("cancel close invalid load scroll toggle".split(" ").concat(Bn));function os(e,t,n){var r=e.type||"unknown-event";e.currentTarget=n,wf(r,t,void 0,e),e.currentTarget=null}function od(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;e:{var l=void 0;if(t)for(var a=r.length-1;0<=a;a--){var s=r[a],u=s.instance,d=s.currentTarget;if(s=s.listener,u!==l&&i.isPropagationStopped())break e;os(i,s,d),l=u}else for(a=0;a<r.length;a++){if(s=r[a],u=s.instance,d=s.currentTarget,s=s.listener,u!==l&&i.isPropagationStopped())break e;os(i,s,d),l=u}}}if(ai)throw e=Gl,ai=!1,Gl=null,e}function U(e,t){var n=t[aa];n===void 0&&(n=t[aa]=new Set);var r=e+"__bubble";n.has(r)||(sd(t,e,2,!1),n.add(r))}function xl(e,t,n){var r=0;t&&(r|=4),sd(n,e,r,t)}var Mr="_reactListening"+Math.random().toString(36).slice(2);function or(e){if(!e[Mr]){e[Mr]=!0,hu.forEach(function(n){n!=="selectionchange"&&(Sp.has(n)||xl(n,!1,e),xl(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Mr]||(t[Mr]=!0,xl("selectionchange",!1,t))}}function sd(e,t,n,r){switch(Qu(t)){case 1:var i=If;break;case 4:i=Mf;break;default:i=Ka}n=i.bind(null,t,n,e),i=void 0,!ql||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),r?i!==void 0?e.addEventListener(t,n,{capture:!0,passive:i}):e.addEventListener(t,n,!0):i!==void 0?e.addEventListener(t,n,{passive:i}):e.addEventListener(t,n,!1)}function vl(e,t,n,r,i){var l=r;if(!(t&1)&&!(t&2)&&r!==null)e:for(;;){if(r===null)return;var a=r.tag;if(a===3||a===4){var s=r.stateNode.containerInfo;if(s===i||s.nodeType===8&&s.parentNode===i)break;if(a===4)for(a=r.return;a!==null;){var u=a.tag;if((u===3||u===4)&&(u=a.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;a=a.return}for(;s!==null;){if(a=Ft(s),a===null)return;if(u=a.tag,u===5||u===6){r=l=a;continue e}s=s.parentNode}}r=r.return}Tu(function(){var d=l,m=Wa(n),p=[];e:{var g=ad.get(e);if(g!==void 0){var w=qa,y=e;switch(e){case"keypress":if(Gr(n)===0)break e;case"keydown":case"keyup":w=Jf;break;case"focusin":y="focus",w=cl;break;case"focusout":y="blur",w=cl;break;case"beforeblur":case"afterblur":w=cl;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":w=qo;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":w=Uf;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":w=tp;break;case nd:case rd:case id:w=Wf;break;case ld:w=rp;break;case"scroll":w=Ff;break;case"wheel":w=lp;break;case"copy":case"cut":case"paste":w=Qf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":w=Xo}var k=(t&4)!==0,S=!k&&e==="scroll",h=k?g!==null?g+"Capture":null:g;k=[];for(var c=d,f;c!==null;){f=c;var x=f.stateNode;if(f.tag===5&&x!==null&&(f=x,h!==null&&(x=tr(c,h),x!=null&&k.push(sr(c,x,f)))),S)break;c=c.return}0<k.length&&(g=new w(g,y,null,n,m),p.push({event:g,listeners:k}))}}if(!(t&7)){e:{if(g=e==="mouseover"||e==="pointerover",w=e==="mouseout"||e==="pointerout",g&&n!==Kl&&(y=n.relatedTarget||n.fromElement)&&(Ft(y)||y[rt]))break e;if((w||g)&&(g=m.window===m?m:(g=m.ownerDocument)?g.defaultView||g.parentWindow:window,w?(y=n.relatedTarget||n.toElement,w=d,y=y?Ft(y):null,y!==null&&(S=qt(y),y!==S||y.tag!==5&&y.tag!==6)&&(y=null)):(w=null,y=d),w!==y)){if(k=qo,x="onMouseLeave",h="onMouseEnter",c="mouse",(e==="pointerout"||e==="pointerover")&&(k=Xo,x="onPointerLeave",h="onPointerEnter",c="pointer"),S=w==null?g:rn(w),f=y==null?g:rn(y),g=new k(x,c+"leave",w,n,m),g.target=S,g.relatedTarget=f,x=null,Ft(m)===d&&(k=new k(h,c+"enter",y,n,m),k.target=f,k.relatedTarget=S,x=k),S=x,w&&y)t:{for(k=w,h=y,c=0,f=k;f;f=Gt(f))c++;for(f=0,x=h;x;x=Gt(x))f++;for(;0<c-f;)k=Gt(k),c--;for(;0<f-c;)h=Gt(h),f--;for(;c--;){if(k===h||h!==null&&k===h.alternate)break t;k=Gt(k),h=Gt(h)}k=null}else k=null;w!==null&&ss(p,g,w,k,!1),y!==null&&S!==null&&ss(p,S,y,k,!0)}}e:{if(g=d?rn(d):window,w=g.nodeName&&g.nodeName.toLowerCase(),w==="select"||w==="input"&&g.type==="file")var j=fp;else if(es(g))if(Xu)j=gp;else{j=mp;var b=pp}else(w=g.nodeName)&&w.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(j=hp);if(j&&(j=j(e,d))){Gu(p,j,n,m);break e}b&&b(e,g,d),e==="focusout"&&(b=g._wrapperState)&&b.controlled&&g.type==="number"&&Bl(g,"number",g.value)}switch(b=d?rn(d):window,e){case"focusin":(es(b)||b.contentEditable==="true")&&(tn=b,ea=d,Kn=null);break;case"focusout":Kn=ea=tn=null;break;case"mousedown":ta=!0;break;case"contextmenu":case"mouseup":case"dragend":ta=!1,ls(p,n,m);break;case"selectionchange":if(yp)break;case"keydown":case"keyup":ls(p,n,m)}var E;if(Xa)e:{switch(e){case"compositionstart":var z="onCompositionStart";break e;case"compositionend":z="onCompositionEnd";break e;case"compositionupdate":z="onCompositionUpdate";break e}z=void 0}else en?Yu(e,n)&&(z="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(z="onCompositionStart");z&&(Ku&&n.locale!=="ko"&&(en||z!=="onCompositionStart"?z==="onCompositionEnd"&&en&&(E=Hu()):(mt=m,Ya="value"in mt?mt.value:mt.textContent,en=!0)),b=ci(d,z),0<b.length&&(z=new Go(z,e,null,n,m),p.push({event:z,listeners:b}),E?z.data=E:(E=qu(n),E!==null&&(z.data=E)))),(E=op?sp(e,n):up(e,n))&&(d=ci(d,"onBeforeInput"),0<d.length&&(m=new Go("onBeforeInput","beforeinput",null,n,m),p.push({event:m,listeners:d}),m.data=E))}od(p,t)})}function sr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ci(e,t){for(var n=t+"Capture",r=[];e!==null;){var i=e,l=i.stateNode;i.tag===5&&l!==null&&(i=l,l=tr(e,n),l!=null&&r.unshift(sr(e,l,i)),l=tr(e,t),l!=null&&r.push(sr(e,l,i))),e=e.return}return r}function Gt(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function ss(e,t,n,r,i){for(var l=t._reactName,a=[];n!==null&&n!==r;){var s=n,u=s.alternate,d=s.stateNode;if(u!==null&&u===r)break;s.tag===5&&d!==null&&(s=d,i?(u=tr(n,l),u!=null&&a.unshift(sr(n,u,s))):i||(u=tr(n,l),u!=null&&a.push(sr(n,u,s)))),n=n.return}a.length!==0&&e.push({event:t,listeners:a})}var jp=/\r\n?/g,Np=/\u0000|\uFFFD/g;function us(e){return(typeof e=="string"?e:""+e).replace(jp,`
`).replace(Np,"")}function Fr(e,t,n){if(t=us(t),us(e)!==t&&n)throw Error(N(425))}function fi(){}var na=null,ra=null;function ia(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var la=typeof setTimeout=="function"?setTimeout:void 0,Cp=typeof clearTimeout=="function"?clearTimeout:void 0,ds=typeof Promise=="function"?Promise:void 0,bp=typeof queueMicrotask=="function"?queueMicrotask:typeof ds<"u"?function(e){return ds.resolve(null).then(e).catch(Ep)}:la;function Ep(e){setTimeout(function(){throw e})}function yl(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"){if(r===0){e.removeChild(i),ir(t);return}r--}else n!=="$"&&n!=="$?"&&n!=="$!"||r++;n=i}while(n);ir(t)}function wt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function cs(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var En=Math.random().toString(36).slice(2),Qe="__reactFiber$"+En,ur="__reactProps$"+En,rt="__reactContainer$"+En,aa="__reactEvents$"+En,Pp="__reactListeners$"+En,_p="__reactHandles$"+En;function Ft(e){var t=e[Qe];if(t)return t;for(var n=e.parentNode;n;){if(t=n[rt]||n[Qe]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=cs(e);e!==null;){if(n=e[Qe])return n;e=cs(e)}return t}e=n,n=e.parentNode}return null}function jr(e){return e=e[Qe]||e[rt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function rn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(N(33))}function Fi(e){return e[ur]||null}var oa=[],ln=-1;function _t(e){return{current:e}}function B(e){0>ln||(e.current=oa[ln],oa[ln]=null,ln--)}function $(e,t){ln++,oa[ln]=e.current,e.current=t}var Et={},ce=_t(Et),ye=_t(!1),Wt=Et;function vn(e,t){var n=e.type.contextTypes;if(!n)return Et;var r=e.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===t)return r.__reactInternalMemoizedMaskedChildContext;var i={},l;for(l in n)i[l]=t[l];return r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=i),i}function we(e){return e=e.childContextTypes,e!=null}function pi(){B(ye),B(ce)}function fs(e,t,n){if(ce.current!==Et)throw Error(N(168));$(ce,t),$(ye,n)}function ud(e,t,n){var r=e.stateNode;if(t=t.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in t))throw Error(N(108,pf(e)||"Unknown",i));return K({},n,r)}function mi(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Et,Wt=ce.current,$(ce,e),$(ye,ye.current),!0}function ps(e,t,n){var r=e.stateNode;if(!r)throw Error(N(169));n?(e=ud(e,t,Wt),r.__reactInternalMemoizedMergedChildContext=e,B(ye),B(ce),$(ce,e)):B(ye),$(ye,n)}var Ge=null,$i=!1,wl=!1;function dd(e){Ge===null?Ge=[e]:Ge.push(e)}function zp(e){$i=!0,dd(e)}function zt(){if(!wl&&Ge!==null){wl=!0;var e=0,t=F;try{var n=Ge;for(F=1;e<n.length;e++){var r=n[e];do r=r(!0);while(r!==null)}Ge=null,$i=!1}catch(i){throw Ge!==null&&(Ge=Ge.slice(e+1)),Du(Va,zt),i}finally{F=t,wl=!1}}return null}var an=[],on=0,hi=null,gi=0,_e=[],ze=0,Vt=null,Xe=1,Je="";function It(e,t){an[on++]=gi,an[on++]=hi,hi=e,gi=t}function cd(e,t,n){_e[ze++]=Xe,_e[ze++]=Je,_e[ze++]=Vt,Vt=e;var r=Xe;e=Je;var i=32-Ue(r)-1;r&=~(1<<i),n+=1;var l=32-Ue(t)+i;if(30<l){var a=i-i%5;l=(r&(1<<a)-1).toString(32),r>>=a,i-=a,Xe=1<<32-Ue(t)+i|n<<i|r,Je=l+e}else Xe=1<<l|n<<i|r,Je=e}function Za(e){e.return!==null&&(It(e,1),cd(e,1,0))}function eo(e){for(;e===hi;)hi=an[--on],an[on]=null,gi=an[--on],an[on]=null;for(;e===Vt;)Vt=_e[--ze],_e[ze]=null,Je=_e[--ze],_e[ze]=null,Xe=_e[--ze],_e[ze]=null}var Ne=null,je=null,W=!1,$e=null;function fd(e,t){var n=Re(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function ms(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ne=e,je=wt(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ne=e,je=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=Vt!==null?{id:Xe,overflow:Je}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=Re(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,Ne=e,je=null,!0):!1;default:return!1}}function sa(e){return(e.mode&1)!==0&&(e.flags&128)===0}function ua(e){if(W){var t=je;if(t){var n=t;if(!ms(e,t)){if(sa(e))throw Error(N(418));t=wt(n.nextSibling);var r=Ne;t&&ms(e,t)?fd(r,n):(e.flags=e.flags&-4097|2,W=!1,Ne=e)}}else{if(sa(e))throw Error(N(418));e.flags=e.flags&-4097|2,W=!1,Ne=e}}}function hs(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ne=e}function $r(e){if(e!==Ne)return!1;if(!W)return hs(e),W=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!ia(e.type,e.memoizedProps)),t&&(t=je)){if(sa(e))throw pd(),Error(N(418));for(;t;)fd(e,t),t=wt(t.nextSibling)}if(hs(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(N(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){je=wt(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}je=null}}else je=Ne?wt(e.stateNode.nextSibling):null;return!0}function pd(){for(var e=je;e;)e=wt(e.nextSibling)}function yn(){je=Ne=null,W=!1}function to(e){$e===null?$e=[e]:$e.push(e)}var Tp=at.ReactCurrentBatchConfig;function In(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(N(309));var r=n.stateNode}if(!r)throw Error(N(147,e));var i=r,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(a){var s=i.refs;a===null?delete s[l]:s[l]=a},t._stringRef=l,t)}if(typeof e!="string")throw Error(N(284));if(!n._owner)throw Error(N(290,e))}return e}function Ur(e,t){throw e=Object.prototype.toString.call(t),Error(N(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function gs(e){var t=e._init;return t(e._payload)}function md(e){function t(h,c){if(e){var f=h.deletions;f===null?(h.deletions=[c],h.flags|=16):f.push(c)}}function n(h,c){if(!e)return null;for(;c!==null;)t(h,c),c=c.sibling;return null}function r(h,c){for(h=new Map;c!==null;)c.key!==null?h.set(c.key,c):h.set(c.index,c),c=c.sibling;return h}function i(h,c){return h=Nt(h,c),h.index=0,h.sibling=null,h}function l(h,c,f){return h.index=f,e?(f=h.alternate,f!==null?(f=f.index,f<c?(h.flags|=2,c):f):(h.flags|=2,c)):(h.flags|=1048576,c)}function a(h){return e&&h.alternate===null&&(h.flags|=2),h}function s(h,c,f,x){return c===null||c.tag!==6?(c=El(f,h.mode,x),c.return=h,c):(c=i(c,f),c.return=h,c)}function u(h,c,f,x){var j=f.type;return j===Zt?m(h,c,f.props.children,x,f.key):c!==null&&(c.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===dt&&gs(j)===c.type)?(x=i(c,f.props),x.ref=In(h,c,f),x.return=h,x):(x=ri(f.type,f.key,f.props,null,h.mode,x),x.ref=In(h,c,f),x.return=h,x)}function d(h,c,f,x){return c===null||c.tag!==4||c.stateNode.containerInfo!==f.containerInfo||c.stateNode.implementation!==f.implementation?(c=Pl(f,h.mode,x),c.return=h,c):(c=i(c,f.children||[]),c.return=h,c)}function m(h,c,f,x,j){return c===null||c.tag!==7?(c=Bt(f,h.mode,x,j),c.return=h,c):(c=i(c,f),c.return=h,c)}function p(h,c,f){if(typeof c=="string"&&c!==""||typeof c=="number")return c=El(""+c,h.mode,f),c.return=h,c;if(typeof c=="object"&&c!==null){switch(c.$$typeof){case _r:return f=ri(c.type,c.key,c.props,null,h.mode,f),f.ref=In(h,null,c),f.return=h,f;case Jt:return c=Pl(c,h.mode,f),c.return=h,c;case dt:var x=c._init;return p(h,x(c._payload),f)}if(Un(c)||Tn(c))return c=Bt(c,h.mode,f,null),c.return=h,c;Ur(h,c)}return null}function g(h,c,f,x){var j=c!==null?c.key:null;if(typeof f=="string"&&f!==""||typeof f=="number")return j!==null?null:s(h,c,""+f,x);if(typeof f=="object"&&f!==null){switch(f.$$typeof){case _r:return f.key===j?u(h,c,f,x):null;case Jt:return f.key===j?d(h,c,f,x):null;case dt:return j=f._init,g(h,c,j(f._payload),x)}if(Un(f)||Tn(f))return j!==null?null:m(h,c,f,x,null);Ur(h,f)}return null}function w(h,c,f,x,j){if(typeof x=="string"&&x!==""||typeof x=="number")return h=h.get(f)||null,s(c,h,""+x,j);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case _r:return h=h.get(x.key===null?f:x.key)||null,u(c,h,x,j);case Jt:return h=h.get(x.key===null?f:x.key)||null,d(c,h,x,j);case dt:var b=x._init;return w(h,c,f,b(x._payload),j)}if(Un(x)||Tn(x))return h=h.get(f)||null,m(c,h,x,j,null);Ur(c,x)}return null}function y(h,c,f,x){for(var j=null,b=null,E=c,z=c=0,M=null;E!==null&&z<f.length;z++){E.index>z?(M=E,E=null):M=E.sibling;var C=g(h,E,f[z],x);if(C===null){E===null&&(E=M);break}e&&E&&C.alternate===null&&t(h,E),c=l(C,c,z),b===null?j=C:b.sibling=C,b=C,E=M}if(z===f.length)return n(h,E),W&&It(h,z),j;if(E===null){for(;z<f.length;z++)E=p(h,f[z],x),E!==null&&(c=l(E,c,z),b===null?j=E:b.sibling=E,b=E);return W&&It(h,z),j}for(E=r(h,E);z<f.length;z++)M=w(E,h,z,f[z],x),M!==null&&(e&&M.alternate!==null&&E.delete(M.key===null?z:M.key),c=l(M,c,z),b===null?j=M:b.sibling=M,b=M);return e&&E.forEach(function(_){return t(h,_)}),W&&It(h,z),j}function k(h,c,f,x){var j=Tn(f);if(typeof j!="function")throw Error(N(150));if(f=j.call(f),f==null)throw Error(N(151));for(var b=j=null,E=c,z=c=0,M=null,C=f.next();E!==null&&!C.done;z++,C=f.next()){E.index>z?(M=E,E=null):M=E.sibling;var _=g(h,E,C.value,x);if(_===null){E===null&&(E=M);break}e&&E&&_.alternate===null&&t(h,E),c=l(_,c,z),b===null?j=_:b.sibling=_,b=_,E=M}if(C.done)return n(h,E),W&&It(h,z),j;if(E===null){for(;!C.done;z++,C=f.next())C=p(h,C.value,x),C!==null&&(c=l(C,c,z),b===null?j=C:b.sibling=C,b=C);return W&&It(h,z),j}for(E=r(h,E);!C.done;z++,C=f.next())C=w(E,h,z,C.value,x),C!==null&&(e&&C.alternate!==null&&E.delete(C.key===null?z:C.key),c=l(C,c,z),b===null?j=C:b.sibling=C,b=C);return e&&E.forEach(function(R){return t(h,R)}),W&&It(h,z),j}function S(h,c,f,x){if(typeof f=="object"&&f!==null&&f.type===Zt&&f.key===null&&(f=f.props.children),typeof f=="object"&&f!==null){switch(f.$$typeof){case _r:e:{for(var j=f.key,b=c;b!==null;){if(b.key===j){if(j=f.type,j===Zt){if(b.tag===7){n(h,b.sibling),c=i(b,f.props.children),c.return=h,h=c;break e}}else if(b.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===dt&&gs(j)===b.type){n(h,b.sibling),c=i(b,f.props),c.ref=In(h,b,f),c.return=h,h=c;break e}n(h,b);break}else t(h,b);b=b.sibling}f.type===Zt?(c=Bt(f.props.children,h.mode,x,f.key),c.return=h,h=c):(x=ri(f.type,f.key,f.props,null,h.mode,x),x.ref=In(h,c,f),x.return=h,h=x)}return a(h);case Jt:e:{for(b=f.key;c!==null;){if(c.key===b)if(c.tag===4&&c.stateNode.containerInfo===f.containerInfo&&c.stateNode.implementation===f.implementation){n(h,c.sibling),c=i(c,f.children||[]),c.return=h,h=c;break e}else{n(h,c);break}else t(h,c);c=c.sibling}c=Pl(f,h.mode,x),c.return=h,h=c}return a(h);case dt:return b=f._init,S(h,c,b(f._payload),x)}if(Un(f))return y(h,c,f,x);if(Tn(f))return k(h,c,f,x);Ur(h,f)}return typeof f=="string"&&f!==""||typeof f=="number"?(f=""+f,c!==null&&c.tag===6?(n(h,c.sibling),c=i(c,f),c.return=h,h=c):(n(h,c),c=El(f,h.mode,x),c.return=h,h=c),a(h)):n(h,c)}return S}var wn=md(!0),hd=md(!1),xi=_t(null),vi=null,sn=null,no=null;function ro(){no=sn=vi=null}function io(e){var t=xi.current;B(xi),e._currentValue=t}function da(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,r!==null&&(r.childLanes|=t)):r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t),e===n)break;e=e.return}}function hn(e,t){vi=e,no=sn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(ve=!0),e.firstContext=null)}function Oe(e){var t=e._currentValue;if(no!==e)if(e={context:e,memoizedValue:t,next:null},sn===null){if(vi===null)throw Error(N(308));sn=e,vi.dependencies={lanes:0,firstContext:e}}else sn=sn.next=e;return t}var $t=null;function lo(e){$t===null?$t=[e]:$t.push(e)}function gd(e,t,n,r){var i=t.interleaved;return i===null?(n.next=n,lo(t)):(n.next=i.next,i.next=n),t.interleaved=n,it(e,r)}function it(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var ct=!1;function ao(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function xd(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function et(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function kt(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,I&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,it(e,n)}return i=r.interleaved,i===null?(t.next=t,lo(r)):(t.next=i.next,i.next=t),r.interleaved=t,it(e,n)}function Xr(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Qa(e,n)}}function xs(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?i=l=a:l=l.next=a,n=n.next}while(n!==null);l===null?i=l=t:l=l.next=t}else i=l=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:l,shared:r.shared,effects:r.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function yi(e,t,n,r){var i=e.updateQueue;ct=!1;var l=i.firstBaseUpdate,a=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var u=s,d=u.next;u.next=null,a===null?l=d:a.next=d,a=u;var m=e.alternate;m!==null&&(m=m.updateQueue,s=m.lastBaseUpdate,s!==a&&(s===null?m.firstBaseUpdate=d:s.next=d,m.lastBaseUpdate=u))}if(l!==null){var p=i.baseState;a=0,m=d=u=null,s=l;do{var g=s.lane,w=s.eventTime;if((r&g)===g){m!==null&&(m=m.next={eventTime:w,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var y=e,k=s;switch(g=t,w=n,k.tag){case 1:if(y=k.payload,typeof y=="function"){p=y.call(w,p,g);break e}p=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=k.payload,g=typeof y=="function"?y.call(w,p,g):y,g==null)break e;p=K({},p,g);break e;case 2:ct=!0}}s.callback!==null&&s.lane!==0&&(e.flags|=64,g=i.effects,g===null?i.effects=[s]:g.push(s))}else w={eventTime:w,lane:g,tag:s.tag,payload:s.payload,callback:s.callback,next:null},m===null?(d=m=w,u=p):m=m.next=w,a|=g;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;g=s,s=g.next,g.next=null,i.lastBaseUpdate=g,i.shared.pending=null}}while(!0);if(m===null&&(u=p),i.baseState=u,i.firstBaseUpdate=d,i.lastBaseUpdate=m,t=i.shared.interleaved,t!==null){i=t;do a|=i.lane,i=i.next;while(i!==t)}else l===null&&(i.shared.lanes=0);Ht|=a,e.lanes=a,e.memoizedState=p}}function vs(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var r=e[t],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(N(191,i));i.call(r)}}}var Nr={},Ke=_t(Nr),dr=_t(Nr),cr=_t(Nr);function Ut(e){if(e===Nr)throw Error(N(174));return e}function oo(e,t){switch($(cr,t),$(dr,e),$(Ke,Nr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Vl(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Vl(t,e)}B(Ke),$(Ke,t)}function kn(){B(Ke),B(dr),B(cr)}function vd(e){Ut(cr.current);var t=Ut(Ke.current),n=Vl(t,e.type);t!==n&&($(dr,e),$(Ke,n))}function so(e){dr.current===e&&(B(Ke),B(dr))}var V=_t(0);function wi(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var kl=[];function uo(){for(var e=0;e<kl.length;e++)kl[e]._workInProgressVersionPrimary=null;kl.length=0}var Jr=at.ReactCurrentDispatcher,Sl=at.ReactCurrentBatchConfig,Qt=0,Q=null,J=null,te=null,ki=!1,Yn=!1,fr=0,Rp=0;function oe(){throw Error(N(321))}function co(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Be(e[n],t[n]))return!1;return!0}function fo(e,t,n,r,i,l){if(Qt=l,Q=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Jr.current=e===null||e.memoizedState===null?Ip:Mp,e=n(r,i),Yn){l=0;do{if(Yn=!1,fr=0,25<=l)throw Error(N(301));l+=1,te=J=null,t.updateQueue=null,Jr.current=Fp,e=n(r,i)}while(Yn)}if(Jr.current=Si,t=J!==null&&J.next!==null,Qt=0,te=J=Q=null,ki=!1,t)throw Error(N(300));return e}function po(){var e=fr!==0;return fr=0,e}function Ve(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return te===null?Q.memoizedState=te=e:te=te.next=e,te}function De(){if(J===null){var e=Q.alternate;e=e!==null?e.memoizedState:null}else e=J.next;var t=te===null?Q.memoizedState:te.next;if(t!==null)te=t,J=e;else{if(e===null)throw Error(N(310));J=e,e={memoizedState:J.memoizedState,baseState:J.baseState,baseQueue:J.baseQueue,queue:J.queue,next:null},te===null?Q.memoizedState=te=e:te=te.next=e}return te}function pr(e,t){return typeof t=="function"?t(e):t}function jl(e){var t=De(),n=t.queue;if(n===null)throw Error(N(311));n.lastRenderedReducer=e;var r=J,i=r.baseQueue,l=n.pending;if(l!==null){if(i!==null){var a=i.next;i.next=l.next,l.next=a}r.baseQueue=i=l,n.pending=null}if(i!==null){l=i.next,r=r.baseState;var s=a=null,u=null,d=l;do{var m=d.lane;if((Qt&m)===m)u!==null&&(u=u.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),r=d.hasEagerState?d.eagerState:e(r,d.action);else{var p={lane:m,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};u===null?(s=u=p,a=r):u=u.next=p,Q.lanes|=m,Ht|=m}d=d.next}while(d!==null&&d!==l);u===null?a=r:u.next=s,Be(r,t.memoizedState)||(ve=!0),t.memoizedState=r,t.baseState=a,t.baseQueue=u,n.lastRenderedState=r}if(e=n.interleaved,e!==null){i=e;do l=i.lane,Q.lanes|=l,Ht|=l,i=i.next;while(i!==e)}else i===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function Nl(e){var t=De(),n=t.queue;if(n===null)throw Error(N(311));n.lastRenderedReducer=e;var r=n.dispatch,i=n.pending,l=t.memoizedState;if(i!==null){n.pending=null;var a=i=i.next;do l=e(l,a.action),a=a.next;while(a!==i);Be(l,t.memoizedState)||(ve=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,r]}function yd(){}function wd(e,t){var n=Q,r=De(),i=t(),l=!Be(r.memoizedState,i);if(l&&(r.memoizedState=i,ve=!0),r=r.queue,mo(jd.bind(null,n,r,e),[e]),r.getSnapshot!==t||l||te!==null&&te.memoizedState.tag&1){if(n.flags|=2048,mr(9,Sd.bind(null,n,r,i,t),void 0,null),ne===null)throw Error(N(349));Qt&30||kd(n,t,i)}return i}function kd(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=Q.updateQueue,t===null?(t={lastEffect:null,stores:null},Q.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Sd(e,t,n,r){t.value=n,t.getSnapshot=r,Nd(t)&&Cd(e)}function jd(e,t,n){return n(function(){Nd(t)&&Cd(e)})}function Nd(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Be(e,n)}catch{return!0}}function Cd(e){var t=it(e,1);t!==null&&Ae(t,e,1,-1)}function ys(e){var t=Ve();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:pr,lastRenderedState:e},t.queue=e,e=e.dispatch=Dp.bind(null,Q,e),[t.memoizedState,e]}function mr(e,t,n,r){return e={tag:e,create:t,destroy:n,deps:r,next:null},t=Q.updateQueue,t===null?(t={lastEffect:null,stores:null},Q.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e)),e}function bd(){return De().memoizedState}function Zr(e,t,n,r){var i=Ve();Q.flags|=e,i.memoizedState=mr(1|t,n,void 0,r===void 0?null:r)}function Ui(e,t,n,r){var i=De();r=r===void 0?null:r;var l=void 0;if(J!==null){var a=J.memoizedState;if(l=a.destroy,r!==null&&co(r,a.deps)){i.memoizedState=mr(t,n,l,r);return}}Q.flags|=e,i.memoizedState=mr(1|t,n,l,r)}function ws(e,t){return Zr(8390656,8,e,t)}function mo(e,t){return Ui(2048,8,e,t)}function Ed(e,t){return Ui(4,2,e,t)}function Pd(e,t){return Ui(4,4,e,t)}function _d(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function zd(e,t,n){return n=n!=null?n.concat([e]):null,Ui(4,4,_d.bind(null,t,e),n)}function ho(){}function Td(e,t){var n=De();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&co(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Rd(e,t){var n=De();t=t===void 0?null:t;var r=n.memoizedState;return r!==null&&t!==null&&co(t,r[1])?r[0]:(e=e(),n.memoizedState=[e,t],e)}function Ld(e,t,n){return Qt&21?(Be(n,t)||(n=Fu(),Q.lanes|=n,Ht|=n,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,ve=!0),e.memoizedState=n)}function Lp(e,t){var n=F;F=n!==0&&4>n?n:4,e(!0);var r=Sl.transition;Sl.transition={};try{e(!1),t()}finally{F=n,Sl.transition=r}}function Od(){return De().memoizedState}function Op(e,t,n){var r=jt(e);if(n={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null},Dd(e))Id(t,n);else if(n=gd(e,t,n,r),n!==null){var i=pe();Ae(n,e,r,i),Md(n,t,r)}}function Dp(e,t,n){var r=jt(e),i={lane:r,action:n,hasEagerState:!1,eagerState:null,next:null};if(Dd(e))Id(t,i);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var a=t.lastRenderedState,s=l(a,n);if(i.hasEagerState=!0,i.eagerState=s,Be(s,a)){var u=t.interleaved;u===null?(i.next=i,lo(t)):(i.next=u.next,u.next=i),t.interleaved=i;return}}catch{}finally{}n=gd(e,t,i,r),n!==null&&(i=pe(),Ae(n,e,r,i),Md(n,t,r))}}function Dd(e){var t=e.alternate;return e===Q||t!==null&&t===Q}function Id(e,t){Yn=ki=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Md(e,t,n){if(n&4194240){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,Qa(e,n)}}var Si={readContext:Oe,useCallback:oe,useContext:oe,useEffect:oe,useImperativeHandle:oe,useInsertionEffect:oe,useLayoutEffect:oe,useMemo:oe,useReducer:oe,useRef:oe,useState:oe,useDebugValue:oe,useDeferredValue:oe,useTransition:oe,useMutableSource:oe,useSyncExternalStore:oe,useId:oe,unstable_isNewReconciler:!1},Ip={readContext:Oe,useCallback:function(e,t){return Ve().memoizedState=[e,t===void 0?null:t],e},useContext:Oe,useEffect:ws,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Zr(4194308,4,_d.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Zr(4194308,4,e,t)},useInsertionEffect:function(e,t){return Zr(4,2,e,t)},useMemo:function(e,t){var n=Ve();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var r=Ve();return t=n!==void 0?n(t):t,r.memoizedState=r.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},r.queue=e,e=e.dispatch=Op.bind(null,Q,e),[r.memoizedState,e]},useRef:function(e){var t=Ve();return e={current:e},t.memoizedState=e},useState:ys,useDebugValue:ho,useDeferredValue:function(e){return Ve().memoizedState=e},useTransition:function(){var e=ys(!1),t=e[0];return e=Lp.bind(null,e[1]),Ve().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var r=Q,i=Ve();if(W){if(n===void 0)throw Error(N(407));n=n()}else{if(n=t(),ne===null)throw Error(N(349));Qt&30||kd(r,t,n)}i.memoizedState=n;var l={value:n,getSnapshot:t};return i.queue=l,ws(jd.bind(null,r,l,e),[e]),r.flags|=2048,mr(9,Sd.bind(null,r,l,n,t),void 0,null),n},useId:function(){var e=Ve(),t=ne.identifierPrefix;if(W){var n=Je,r=Xe;n=(r&~(1<<32-Ue(r)-1)).toString(32)+n,t=":"+t+"R"+n,n=fr++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=Rp++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Mp={readContext:Oe,useCallback:Td,useContext:Oe,useEffect:mo,useImperativeHandle:zd,useInsertionEffect:Ed,useLayoutEffect:Pd,useMemo:Rd,useReducer:jl,useRef:bd,useState:function(){return jl(pr)},useDebugValue:ho,useDeferredValue:function(e){var t=De();return Ld(t,J.memoizedState,e)},useTransition:function(){var e=jl(pr)[0],t=De().memoizedState;return[e,t]},useMutableSource:yd,useSyncExternalStore:wd,useId:Od,unstable_isNewReconciler:!1},Fp={readContext:Oe,useCallback:Td,useContext:Oe,useEffect:mo,useImperativeHandle:zd,useInsertionEffect:Ed,useLayoutEffect:Pd,useMemo:Rd,useReducer:Nl,useRef:bd,useState:function(){return Nl(pr)},useDebugValue:ho,useDeferredValue:function(e){var t=De();return J===null?t.memoizedState=e:Ld(t,J.memoizedState,e)},useTransition:function(){var e=Nl(pr)[0],t=De().memoizedState;return[e,t]},useMutableSource:yd,useSyncExternalStore:wd,useId:Od,unstable_isNewReconciler:!1};function Me(e,t){if(e&&e.defaultProps){t=K({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function ca(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:K({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ai={isMounted:function(e){return(e=e._reactInternals)?qt(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var r=pe(),i=jt(e),l=et(r,i);l.payload=t,n!=null&&(l.callback=n),t=kt(e,l,i),t!==null&&(Ae(t,e,i,r),Xr(t,e,i))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=pe(),i=jt(e),l=et(r,i);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=kt(e,l,i),t!==null&&(Ae(t,e,i,r),Xr(t,e,i))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=pe(),r=jt(e),i=et(n,r);i.tag=2,t!=null&&(i.callback=t),t=kt(e,i,r),t!==null&&(Ae(t,e,r,n),Xr(t,e,r))}};function ks(e,t,n,r,i,l,a){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(r,l,a):t.prototype&&t.prototype.isPureReactComponent?!ar(n,r)||!ar(i,l):!0}function Fd(e,t,n){var r=!1,i=Et,l=t.contextType;return typeof l=="object"&&l!==null?l=Oe(l):(i=we(t)?Wt:ce.current,r=t.contextTypes,l=(r=r!=null)?vn(e,i):Et),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=Ai,e.stateNode=t,t._reactInternals=e,r&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=i,e.__reactInternalMemoizedMaskedChildContext=l),t}function Ss(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ai.enqueueReplaceState(t,t.state,null)}function fa(e,t,n,r){var i=e.stateNode;i.props=n,i.state=e.memoizedState,i.refs={},ao(e);var l=t.contextType;typeof l=="object"&&l!==null?i.context=Oe(l):(l=we(t)?Wt:ce.current,i.context=vn(e,l)),i.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(ca(e,t,l,n),i.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(t=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),t!==i.state&&Ai.enqueueReplaceState(i,i.state,null),yi(e,n,i,r),i.state=e.memoizedState),typeof i.componentDidMount=="function"&&(e.flags|=4194308)}function Sn(e,t){try{var n="",r=t;do n+=ff(r),r=r.return;while(r);var i=n}catch(l){i=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:i,digest:null}}function Cl(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function pa(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var $p=typeof WeakMap=="function"?WeakMap:Map;function $d(e,t,n){n=et(-1,n),n.tag=3,n.payload={element:null};var r=t.value;return n.callback=function(){Ni||(Ni=!0,ja=r),pa(e,t)},n}function Ud(e,t,n){n=et(-1,n),n.tag=3;var r=e.type.getDerivedStateFromError;if(typeof r=="function"){var i=t.value;n.payload=function(){return r(i)},n.callback=function(){pa(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){pa(e,t),typeof r!="function"&&(St===null?St=new Set([this]):St.add(this));var a=t.stack;this.componentDidCatch(t.value,{componentStack:a!==null?a:""})}),n}function js(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new $p;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(i.add(n),e=Zp.bind(null,e,t,n),t.then(e,e))}function Ns(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Cs(e,t,n,r,i){return e.mode&1?(e.flags|=65536,e.lanes=i,e):(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=et(-1,1),t.tag=2,kt(n,t,1))),n.lanes|=1),e)}var Up=at.ReactCurrentOwner,ve=!1;function fe(e,t,n,r){t.child=e===null?hd(t,null,n,r):wn(t,e.child,n,r)}function bs(e,t,n,r,i){n=n.render;var l=t.ref;return hn(t,i),r=fo(e,t,n,r,l,i),n=po(),e!==null&&!ve?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,lt(e,t,i)):(W&&n&&Za(t),t.flags|=1,fe(e,t,r,i),t.child)}function Es(e,t,n,r,i){if(e===null){var l=n.type;return typeof l=="function"&&!jo(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,Ad(e,t,l,r,i)):(e=ri(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,!(e.lanes&i)){var a=l.memoizedProps;if(n=n.compare,n=n!==null?n:ar,n(a,r)&&e.ref===t.ref)return lt(e,t,i)}return t.flags|=1,e=Nt(l,r),e.ref=t.ref,e.return=t,t.child=e}function Ad(e,t,n,r,i){if(e!==null){var l=e.memoizedProps;if(ar(l,r)&&e.ref===t.ref)if(ve=!1,t.pendingProps=r=l,(e.lanes&i)!==0)e.flags&131072&&(ve=!0);else return t.lanes=e.lanes,lt(e,t,i)}return ma(e,t,n,r,i)}function Bd(e,t,n){var r=t.pendingProps,i=r.children,l=e!==null?e.memoizedState:null;if(r.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},$(dn,Se),Se|=n;else{if(!(n&1073741824))return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,$(dn,Se),Se|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},r=l!==null?l.baseLanes:n,$(dn,Se),Se|=r}else l!==null?(r=l.baseLanes|n,t.memoizedState=null):r=n,$(dn,Se),Se|=r;return fe(e,t,i,n),t.child}function Wd(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function ma(e,t,n,r,i){var l=we(n)?Wt:ce.current;return l=vn(t,l),hn(t,i),n=fo(e,t,n,r,l,i),r=po(),e!==null&&!ve?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~i,lt(e,t,i)):(W&&r&&Za(t),t.flags|=1,fe(e,t,n,i),t.child)}function Ps(e,t,n,r,i){if(we(n)){var l=!0;mi(t)}else l=!1;if(hn(t,i),t.stateNode===null)ei(e,t),Fd(t,n,r),fa(t,n,r,i),r=!0;else if(e===null){var a=t.stateNode,s=t.memoizedProps;a.props=s;var u=a.context,d=n.contextType;typeof d=="object"&&d!==null?d=Oe(d):(d=we(n)?Wt:ce.current,d=vn(t,d));var m=n.getDerivedStateFromProps,p=typeof m=="function"||typeof a.getSnapshotBeforeUpdate=="function";p||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(s!==r||u!==d)&&Ss(t,a,r,d),ct=!1;var g=t.memoizedState;a.state=g,yi(t,r,a,i),u=t.memoizedState,s!==r||g!==u||ye.current||ct?(typeof m=="function"&&(ca(t,n,m,r),u=t.memoizedState),(s=ct||ks(t,n,s,r,g,u,d))?(p||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(t.flags|=4194308)):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=u),a.props=r,a.state=u,a.context=d,r=s):(typeof a.componentDidMount=="function"&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,xd(e,t),s=t.memoizedProps,d=t.type===t.elementType?s:Me(t.type,s),a.props=d,p=t.pendingProps,g=a.context,u=n.contextType,typeof u=="object"&&u!==null?u=Oe(u):(u=we(n)?Wt:ce.current,u=vn(t,u));var w=n.getDerivedStateFromProps;(m=typeof w=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(s!==p||g!==u)&&Ss(t,a,r,u),ct=!1,g=t.memoizedState,a.state=g,yi(t,r,a,i);var y=t.memoizedState;s!==p||g!==y||ye.current||ct?(typeof w=="function"&&(ca(t,n,w,r),y=t.memoizedState),(d=ct||ks(t,n,d,r,g,y,u)||!1)?(m||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(r,y,u),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(r,y,u)),typeof a.componentDidUpdate=="function"&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof a.componentDidUpdate!="function"||s===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=y),a.props=r,a.state=y,a.context=u,r=d):(typeof a.componentDidUpdate!="function"||s===e.memoizedProps&&g===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||s===e.memoizedProps&&g===e.memoizedState||(t.flags|=1024),r=!1)}return ha(e,t,n,r,l,i)}function ha(e,t,n,r,i,l){Wd(e,t);var a=(t.flags&128)!==0;if(!r&&!a)return i&&ps(t,n,!1),lt(e,t,l);r=t.stateNode,Up.current=t;var s=a&&typeof n.getDerivedStateFromError!="function"?null:r.render();return t.flags|=1,e!==null&&a?(t.child=wn(t,e.child,null,l),t.child=wn(t,null,s,l)):fe(e,t,s,l),t.memoizedState=r.state,i&&ps(t,n,!0),t.child}function Vd(e){var t=e.stateNode;t.pendingContext?fs(e,t.pendingContext,t.pendingContext!==t.context):t.context&&fs(e,t.context,!1),oo(e,t.containerInfo)}function _s(e,t,n,r,i){return yn(),to(i),t.flags|=256,fe(e,t,n,r),t.child}var ga={dehydrated:null,treeContext:null,retryLane:0};function xa(e){return{baseLanes:e,cachePool:null,transitions:null}}function Qd(e,t,n){var r=t.pendingProps,i=V.current,l=!1,a=(t.flags&128)!==0,s;if((s=a)||(s=e!==null&&e.memoizedState===null?!1:(i&2)!==0),s?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(i|=1),$(V,i&1),e===null)return ua(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(a=r.children,e=r.fallback,l?(r=t.mode,l=t.child,a={mode:"hidden",children:a},!(r&1)&&l!==null?(l.childLanes=0,l.pendingProps=a):l=Vi(a,r,0,null),e=Bt(e,r,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=xa(n),t.memoizedState=ga,e):go(t,a));if(i=e.memoizedState,i!==null&&(s=i.dehydrated,s!==null))return Ap(e,t,a,r,s,i,n);if(l){l=r.fallback,a=t.mode,i=e.child,s=i.sibling;var u={mode:"hidden",children:r.children};return!(a&1)&&t.child!==i?(r=t.child,r.childLanes=0,r.pendingProps=u,t.deletions=null):(r=Nt(i,u),r.subtreeFlags=i.subtreeFlags&14680064),s!==null?l=Nt(s,l):(l=Bt(l,a,n,null),l.flags|=2),l.return=t,r.return=t,r.sibling=l,t.child=r,r=l,l=t.child,a=e.child.memoizedState,a=a===null?xa(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},l.memoizedState=a,l.childLanes=e.childLanes&~n,t.memoizedState=ga,r}return l=e.child,e=l.sibling,r=Nt(l,{mode:"visible",children:r.children}),!(t.mode&1)&&(r.lanes=n),r.return=t,r.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=r,t.memoizedState=null,r}function go(e,t){return t=Vi({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ar(e,t,n,r){return r!==null&&to(r),wn(t,e.child,null,n),e=go(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Ap(e,t,n,r,i,l,a){if(n)return t.flags&256?(t.flags&=-257,r=Cl(Error(N(422))),Ar(e,t,a,r)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=r.fallback,i=t.mode,r=Vi({mode:"visible",children:r.children},i,0,null),l=Bt(l,i,a,null),l.flags|=2,r.return=t,l.return=t,r.sibling=l,t.child=r,t.mode&1&&wn(t,e.child,null,a),t.child.memoizedState=xa(a),t.memoizedState=ga,l);if(!(t.mode&1))return Ar(e,t,a,null);if(i.data==="$!"){if(r=i.nextSibling&&i.nextSibling.dataset,r)var s=r.dgst;return r=s,l=Error(N(419)),r=Cl(l,r,void 0),Ar(e,t,a,r)}if(s=(a&e.childLanes)!==0,ve||s){if(r=ne,r!==null){switch(a&-a){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(r.suspendedLanes|a)?0:i,i!==0&&i!==l.retryLane&&(l.retryLane=i,it(e,i),Ae(r,e,i,-1))}return So(),r=Cl(Error(N(421))),Ar(e,t,a,r)}return i.data==="$?"?(t.flags|=128,t.child=e.child,t=em.bind(null,e),i._reactRetry=t,null):(e=l.treeContext,je=wt(i.nextSibling),Ne=t,W=!0,$e=null,e!==null&&(_e[ze++]=Xe,_e[ze++]=Je,_e[ze++]=Vt,Xe=e.id,Je=e.overflow,Vt=t),t=go(t,r.children),t.flags|=4096,t)}function zs(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),da(e.return,t,n)}function bl(e,t,n,r,i){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=r,l.tail=n,l.tailMode=i)}function Hd(e,t,n){var r=t.pendingProps,i=r.revealOrder,l=r.tail;if(fe(e,t,r.children,n),r=V.current,r&2)r=r&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&zs(e,n,t);else if(e.tag===19)zs(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}r&=1}if($(V,r),!(t.mode&1))t.memoizedState=null;else switch(i){case"forwards":for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&wi(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),bl(t,!1,i,n,l);break;case"backwards":for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&wi(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}bl(t,!0,n,null,l);break;case"together":bl(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function ei(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function lt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Ht|=t.lanes,!(n&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(N(153));if(t.child!==null){for(e=t.child,n=Nt(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Nt(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Bp(e,t,n){switch(t.tag){case 3:Vd(t),yn();break;case 5:vd(t);break;case 1:we(t.type)&&mi(t);break;case 4:oo(t,t.stateNode.containerInfo);break;case 10:var r=t.type._context,i=t.memoizedProps.value;$(xi,r._currentValue),r._currentValue=i;break;case 13:if(r=t.memoizedState,r!==null)return r.dehydrated!==null?($(V,V.current&1),t.flags|=128,null):n&t.child.childLanes?Qd(e,t,n):($(V,V.current&1),e=lt(e,t,n),e!==null?e.sibling:null);$(V,V.current&1);break;case 19:if(r=(n&t.childLanes)!==0,e.flags&128){if(r)return Hd(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),$(V,V.current),r)break;return null;case 22:case 23:return t.lanes=0,Bd(e,t,n)}return lt(e,t,n)}var Kd,va,Yd,qd;Kd=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};va=function(){};Yd=function(e,t,n,r){var i=e.memoizedProps;if(i!==r){e=t.stateNode,Ut(Ke.current);var l=null;switch(n){case"input":i=Ul(e,i),r=Ul(e,r),l=[];break;case"select":i=K({},i,{value:void 0}),r=K({},r,{value:void 0}),l=[];break;case"textarea":i=Wl(e,i),r=Wl(e,r),l=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(e.onclick=fi)}Ql(n,r);var a;n=null;for(d in i)if(!r.hasOwnProperty(d)&&i.hasOwnProperty(d)&&i[d]!=null)if(d==="style"){var s=i[d];for(a in s)s.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(Zn.hasOwnProperty(d)?l||(l=[]):(l=l||[]).push(d,null));for(d in r){var u=r[d];if(s=i!=null?i[d]:void 0,r.hasOwnProperty(d)&&u!==s&&(u!=null||s!=null))if(d==="style")if(s){for(a in s)!s.hasOwnProperty(a)||u&&u.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in u)u.hasOwnProperty(a)&&s[a]!==u[a]&&(n||(n={}),n[a]=u[a])}else n||(l||(l=[]),l.push(d,n)),n=u;else d==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,s=s?s.__html:void 0,u!=null&&s!==u&&(l=l||[]).push(d,u)):d==="children"?typeof u!="string"&&typeof u!="number"||(l=l||[]).push(d,""+u):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(Zn.hasOwnProperty(d)?(u!=null&&d==="onScroll"&&U("scroll",e),l||s===u||(l=[])):(l=l||[]).push(d,u))}n&&(l=l||[]).push("style",n);var d=l;(t.updateQueue=d)&&(t.flags|=4)}};qd=function(e,t,n,r){n!==r&&(t.flags|=4)};function Mn(e,t){if(!W)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function se(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&14680064,r|=i.flags&14680064,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Wp(e,t,n){var r=t.pendingProps;switch(eo(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return se(t),null;case 1:return we(t.type)&&pi(),se(t),null;case 3:return r=t.stateNode,kn(),B(ye),B(ce),uo(),r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(e===null||e.child===null)&&($r(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,$e!==null&&(ba($e),$e=null))),va(e,t),se(t),null;case 5:so(t);var i=Ut(cr.current);if(n=t.type,e!==null&&t.stateNode!=null)Yd(e,t,n,r,i),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!r){if(t.stateNode===null)throw Error(N(166));return se(t),null}if(e=Ut(Ke.current),$r(t)){r=t.stateNode,n=t.type;var l=t.memoizedProps;switch(r[Qe]=t,r[ur]=l,e=(t.mode&1)!==0,n){case"dialog":U("cancel",r),U("close",r);break;case"iframe":case"object":case"embed":U("load",r);break;case"video":case"audio":for(i=0;i<Bn.length;i++)U(Bn[i],r);break;case"source":U("error",r);break;case"img":case"image":case"link":U("error",r),U("load",r);break;case"details":U("toggle",r);break;case"input":$o(r,l),U("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!l.multiple},U("invalid",r);break;case"textarea":Ao(r,l),U("invalid",r)}Ql(n,l),i=null;for(var a in l)if(l.hasOwnProperty(a)){var s=l[a];a==="children"?typeof s=="string"?r.textContent!==s&&(l.suppressHydrationWarning!==!0&&Fr(r.textContent,s,e),i=["children",s]):typeof s=="number"&&r.textContent!==""+s&&(l.suppressHydrationWarning!==!0&&Fr(r.textContent,s,e),i=["children",""+s]):Zn.hasOwnProperty(a)&&s!=null&&a==="onScroll"&&U("scroll",r)}switch(n){case"input":zr(r),Uo(r,l,!0);break;case"textarea":zr(r),Bo(r);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(r.onclick=fi)}r=i,t.updateQueue=r,r!==null&&(t.flags|=4)}else{a=i.nodeType===9?i:i.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=ju(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=a.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof r.is=="string"?e=a.createElement(n,{is:r.is}):(e=a.createElement(n),n==="select"&&(a=e,r.multiple?a.multiple=!0:r.size&&(a.size=r.size))):e=a.createElementNS(e,n),e[Qe]=t,e[ur]=r,Kd(e,t,!1,!1),t.stateNode=e;e:{switch(a=Hl(n,r),n){case"dialog":U("cancel",e),U("close",e),i=r;break;case"iframe":case"object":case"embed":U("load",e),i=r;break;case"video":case"audio":for(i=0;i<Bn.length;i++)U(Bn[i],e);i=r;break;case"source":U("error",e),i=r;break;case"img":case"image":case"link":U("error",e),U("load",e),i=r;break;case"details":U("toggle",e),i=r;break;case"input":$o(e,r),i=Ul(e,r),U("invalid",e);break;case"option":i=r;break;case"select":e._wrapperState={wasMultiple:!!r.multiple},i=K({},r,{value:void 0}),U("invalid",e);break;case"textarea":Ao(e,r),i=Wl(e,r),U("invalid",e);break;default:i=r}Ql(n,i),s=i;for(l in s)if(s.hasOwnProperty(l)){var u=s[l];l==="style"?bu(e,u):l==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Nu(e,u)):l==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&er(e,u):typeof u=="number"&&er(e,""+u):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(Zn.hasOwnProperty(l)?u!=null&&l==="onScroll"&&U("scroll",e):u!=null&&$a(e,l,u,a))}switch(n){case"input":zr(e),Uo(e,r,!1);break;case"textarea":zr(e),Bo(e);break;case"option":r.value!=null&&e.setAttribute("value",""+bt(r.value));break;case"select":e.multiple=!!r.multiple,l=r.value,l!=null?cn(e,!!r.multiple,l,!1):r.defaultValue!=null&&cn(e,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(e.onclick=fi)}switch(n){case"button":case"input":case"select":case"textarea":r=!!r.autoFocus;break e;case"img":r=!0;break e;default:r=!1}}r&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return se(t),null;case 6:if(e&&t.stateNode!=null)qd(e,t,e.memoizedProps,r);else{if(typeof r!="string"&&t.stateNode===null)throw Error(N(166));if(n=Ut(cr.current),Ut(Ke.current),$r(t)){if(r=t.stateNode,n=t.memoizedProps,r[Qe]=t,(l=r.nodeValue!==n)&&(e=Ne,e!==null))switch(e.tag){case 3:Fr(r.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Fr(r.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Qe]=t,t.stateNode=r}return se(t),null;case 13:if(B(V),r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(W&&je!==null&&t.mode&1&&!(t.flags&128))pd(),yn(),t.flags|=98560,l=!1;else if(l=$r(t),r!==null&&r.dehydrated!==null){if(e===null){if(!l)throw Error(N(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(N(317));l[Qe]=t}else yn(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;se(t),l=!1}else $e!==null&&(ba($e),$e=null),l=!0;if(!l)return t.flags&65536?t:null}return t.flags&128?(t.lanes=n,t):(r=r!==null,r!==(e!==null&&e.memoizedState!==null)&&r&&(t.child.flags|=8192,t.mode&1&&(e===null||V.current&1?Z===0&&(Z=3):So())),t.updateQueue!==null&&(t.flags|=4),se(t),null);case 4:return kn(),va(e,t),e===null&&or(t.stateNode.containerInfo),se(t),null;case 10:return io(t.type._context),se(t),null;case 17:return we(t.type)&&pi(),se(t),null;case 19:if(B(V),l=t.memoizedState,l===null)return se(t),null;if(r=(t.flags&128)!==0,a=l.rendering,a===null)if(r)Mn(l,!1);else{if(Z!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(a=wi(e),a!==null){for(t.flags|=128,Mn(l,!1),r=a.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),t.subtreeFlags=0,r=n,n=t.child;n!==null;)l=n,e=r,l.flags&=14680066,a=l.alternate,a===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=a.childLanes,l.lanes=a.lanes,l.child=a.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=a.memoizedProps,l.memoizedState=a.memoizedState,l.updateQueue=a.updateQueue,l.type=a.type,e=a.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return $(V,V.current&1|2),t.child}e=e.sibling}l.tail!==null&&G()>jn&&(t.flags|=128,r=!0,Mn(l,!1),t.lanes=4194304)}else{if(!r)if(e=wi(a),e!==null){if(t.flags|=128,r=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Mn(l,!0),l.tail===null&&l.tailMode==="hidden"&&!a.alternate&&!W)return se(t),null}else 2*G()-l.renderingStartTime>jn&&n!==1073741824&&(t.flags|=128,r=!0,Mn(l,!1),t.lanes=4194304);l.isBackwards?(a.sibling=t.child,t.child=a):(n=l.last,n!==null?n.sibling=a:t.child=a,l.last=a)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=G(),t.sibling=null,n=V.current,$(V,r?n&1|2:n&1),t):(se(t),null);case 22:case 23:return ko(),r=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==r&&(t.flags|=8192),r&&t.mode&1?Se&1073741824&&(se(t),t.subtreeFlags&6&&(t.flags|=8192)):se(t),null;case 24:return null;case 25:return null}throw Error(N(156,t.tag))}function Vp(e,t){switch(eo(t),t.tag){case 1:return we(t.type)&&pi(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return kn(),B(ye),B(ce),uo(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return so(t),null;case 13:if(B(V),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(N(340));yn()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return B(V),null;case 4:return kn(),null;case 10:return io(t.type._context),null;case 22:case 23:return ko(),null;case 24:return null;default:return null}}var Br=!1,de=!1,Qp=typeof WeakSet=="function"?WeakSet:Set,P=null;function un(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(r){Y(e,t,r)}else n.current=null}function ya(e,t,n){try{n()}catch(r){Y(e,t,r)}}var Ts=!1;function Hp(e,t){if(na=ui,e=ed(),Ja(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var i=r.anchorOffset,l=r.focusNode;r=r.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var a=0,s=-1,u=-1,d=0,m=0,p=e,g=null;t:for(;;){for(var w;p!==n||i!==0&&p.nodeType!==3||(s=a+i),p!==l||r!==0&&p.nodeType!==3||(u=a+r),p.nodeType===3&&(a+=p.nodeValue.length),(w=p.firstChild)!==null;)g=p,p=w;for(;;){if(p===e)break t;if(g===n&&++d===i&&(s=a),g===l&&++m===r&&(u=a),(w=p.nextSibling)!==null)break;p=g,g=p.parentNode}p=w}n=s===-1||u===-1?null:{start:s,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(ra={focusedElem:e,selectionRange:n},ui=!1,P=t;P!==null;)if(t=P,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,P=e;else for(;P!==null;){t=P;try{var y=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(y!==null){var k=y.memoizedProps,S=y.memoizedState,h=t.stateNode,c=h.getSnapshotBeforeUpdate(t.elementType===t.type?k:Me(t.type,k),S);h.__reactInternalSnapshotBeforeUpdate=c}break;case 3:var f=t.stateNode.containerInfo;f.nodeType===1?f.textContent="":f.nodeType===9&&f.documentElement&&f.removeChild(f.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(N(163))}}catch(x){Y(t,t.return,x)}if(e=t.sibling,e!==null){e.return=t.return,P=e;break}P=t.return}return y=Ts,Ts=!1,y}function qn(e,t,n){var r=t.updateQueue;if(r=r!==null?r.lastEffect:null,r!==null){var i=r=r.next;do{if((i.tag&e)===e){var l=i.destroy;i.destroy=void 0,l!==void 0&&ya(t,n,l)}i=i.next}while(i!==r)}}function Bi(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var r=n.create;n.destroy=r()}n=n.next}while(n!==t)}}function wa(e){var t=e.ref;if(t!==null){var n=e.stateNode;switch(e.tag){case 5:e=n;break;default:e=n}typeof t=="function"?t(e):t.current=e}}function Gd(e){var t=e.alternate;t!==null&&(e.alternate=null,Gd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Qe],delete t[ur],delete t[aa],delete t[Pp],delete t[_p])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Xd(e){return e.tag===5||e.tag===3||e.tag===4}function Rs(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Xd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function ka(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=fi));else if(r!==4&&(e=e.child,e!==null))for(ka(e,t,n),e=e.sibling;e!==null;)ka(e,t,n),e=e.sibling}function Sa(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(e=e.child,e!==null))for(Sa(e,t,n),e=e.sibling;e!==null;)Sa(e,t,n),e=e.sibling}var ie=null,Fe=!1;function ut(e,t,n){for(n=n.child;n!==null;)Jd(e,t,n),n=n.sibling}function Jd(e,t,n){if(He&&typeof He.onCommitFiberUnmount=="function")try{He.onCommitFiberUnmount(Oi,n)}catch{}switch(n.tag){case 5:de||un(n,t);case 6:var r=ie,i=Fe;ie=null,ut(e,t,n),ie=r,Fe=i,ie!==null&&(Fe?(e=ie,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):ie.removeChild(n.stateNode));break;case 18:ie!==null&&(Fe?(e=ie,n=n.stateNode,e.nodeType===8?yl(e.parentNode,n):e.nodeType===1&&yl(e,n),ir(e)):yl(ie,n.stateNode));break;case 4:r=ie,i=Fe,ie=n.stateNode.containerInfo,Fe=!0,ut(e,t,n),ie=r,Fe=i;break;case 0:case 11:case 14:case 15:if(!de&&(r=n.updateQueue,r!==null&&(r=r.lastEffect,r!==null))){i=r=r.next;do{var l=i,a=l.destroy;l=l.tag,a!==void 0&&(l&2||l&4)&&ya(n,t,a),i=i.next}while(i!==r)}ut(e,t,n);break;case 1:if(!de&&(un(n,t),r=n.stateNode,typeof r.componentWillUnmount=="function"))try{r.props=n.memoizedProps,r.state=n.memoizedState,r.componentWillUnmount()}catch(s){Y(n,t,s)}ut(e,t,n);break;case 21:ut(e,t,n);break;case 22:n.mode&1?(de=(r=de)||n.memoizedState!==null,ut(e,t,n),de=r):ut(e,t,n);break;default:ut(e,t,n)}}function Ls(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Qp),t.forEach(function(r){var i=tm.bind(null,e,r);n.has(r)||(n.add(r),r.then(i,i))})}}function Ie(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];try{var l=e,a=t,s=a;e:for(;s!==null;){switch(s.tag){case 5:ie=s.stateNode,Fe=!1;break e;case 3:ie=s.stateNode.containerInfo,Fe=!0;break e;case 4:ie=s.stateNode.containerInfo,Fe=!0;break e}s=s.return}if(ie===null)throw Error(N(160));Jd(l,a,i),ie=null,Fe=!1;var u=i.alternate;u!==null&&(u.return=null),i.return=null}catch(d){Y(i,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)Zd(t,e),t=t.sibling}function Zd(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(Ie(t,e),We(e),r&4){try{qn(3,e,e.return),Bi(3,e)}catch(k){Y(e,e.return,k)}try{qn(5,e,e.return)}catch(k){Y(e,e.return,k)}}break;case 1:Ie(t,e),We(e),r&512&&n!==null&&un(n,n.return);break;case 5:if(Ie(t,e),We(e),r&512&&n!==null&&un(n,n.return),e.flags&32){var i=e.stateNode;try{er(i,"")}catch(k){Y(e,e.return,k)}}if(r&4&&(i=e.stateNode,i!=null)){var l=e.memoizedProps,a=n!==null?n.memoizedProps:l,s=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{s==="input"&&l.type==="radio"&&l.name!=null&&ku(i,l),Hl(s,a);var d=Hl(s,l);for(a=0;a<u.length;a+=2){var m=u[a],p=u[a+1];m==="style"?bu(i,p):m==="dangerouslySetInnerHTML"?Nu(i,p):m==="children"?er(i,p):$a(i,m,p,d)}switch(s){case"input":Al(i,l);break;case"textarea":Su(i,l);break;case"select":var g=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!l.multiple;var w=l.value;w!=null?cn(i,!!l.multiple,w,!1):g!==!!l.multiple&&(l.defaultValue!=null?cn(i,!!l.multiple,l.defaultValue,!0):cn(i,!!l.multiple,l.multiple?[]:"",!1))}i[ur]=l}catch(k){Y(e,e.return,k)}}break;case 6:if(Ie(t,e),We(e),r&4){if(e.stateNode===null)throw Error(N(162));i=e.stateNode,l=e.memoizedProps;try{i.nodeValue=l}catch(k){Y(e,e.return,k)}}break;case 3:if(Ie(t,e),We(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{ir(t.containerInfo)}catch(k){Y(e,e.return,k)}break;case 4:Ie(t,e),We(e);break;case 13:Ie(t,e),We(e),i=e.child,i.flags&8192&&(l=i.memoizedState!==null,i.stateNode.isHidden=l,!l||i.alternate!==null&&i.alternate.memoizedState!==null||(yo=G())),r&4&&Ls(e);break;case 22:if(m=n!==null&&n.memoizedState!==null,e.mode&1?(de=(d=de)||m,Ie(t,e),de=d):Ie(t,e),We(e),r&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!m&&e.mode&1)for(P=e,m=e.child;m!==null;){for(p=P=m;P!==null;){switch(g=P,w=g.child,g.tag){case 0:case 11:case 14:case 15:qn(4,g,g.return);break;case 1:un(g,g.return);var y=g.stateNode;if(typeof y.componentWillUnmount=="function"){r=g,n=g.return;try{t=r,y.props=t.memoizedProps,y.state=t.memoizedState,y.componentWillUnmount()}catch(k){Y(r,n,k)}}break;case 5:un(g,g.return);break;case 22:if(g.memoizedState!==null){Ds(p);continue}}w!==null?(w.return=g,P=w):Ds(p)}m=m.sibling}e:for(m=null,p=e;;){if(p.tag===5){if(m===null){m=p;try{i=p.stateNode,d?(l=i.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(s=p.stateNode,u=p.memoizedProps.style,a=u!=null&&u.hasOwnProperty("display")?u.display:null,s.style.display=Cu("display",a))}catch(k){Y(e,e.return,k)}}}else if(p.tag===6){if(m===null)try{p.stateNode.nodeValue=d?"":p.memoizedProps}catch(k){Y(e,e.return,k)}}else if((p.tag!==22&&p.tag!==23||p.memoizedState===null||p===e)&&p.child!==null){p.child.return=p,p=p.child;continue}if(p===e)break e;for(;p.sibling===null;){if(p.return===null||p.return===e)break e;m===p&&(m=null),p=p.return}m===p&&(m=null),p.sibling.return=p.return,p=p.sibling}}break;case 19:Ie(t,e),We(e),r&4&&Ls(e);break;case 21:break;default:Ie(t,e),We(e)}}function We(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(Xd(n)){var r=n;break e}n=n.return}throw Error(N(160))}switch(r.tag){case 5:var i=r.stateNode;r.flags&32&&(er(i,""),r.flags&=-33);var l=Rs(e);Sa(e,l,i);break;case 3:case 4:var a=r.stateNode.containerInfo,s=Rs(e);ka(e,s,a);break;default:throw Error(N(161))}}catch(u){Y(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Kp(e,t,n){P=e,ec(e)}function ec(e,t,n){for(var r=(e.mode&1)!==0;P!==null;){var i=P,l=i.child;if(i.tag===22&&r){var a=i.memoizedState!==null||Br;if(!a){var s=i.alternate,u=s!==null&&s.memoizedState!==null||de;s=Br;var d=de;if(Br=a,(de=u)&&!d)for(P=i;P!==null;)a=P,u=a.child,a.tag===22&&a.memoizedState!==null?Is(i):u!==null?(u.return=a,P=u):Is(i);for(;l!==null;)P=l,ec(l),l=l.sibling;P=i,Br=s,de=d}Os(e)}else i.subtreeFlags&8772&&l!==null?(l.return=i,P=l):Os(e)}}function Os(e){for(;P!==null;){var t=P;if(t.flags&8772){var n=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:de||Bi(5,t);break;case 1:var r=t.stateNode;if(t.flags&4&&!de)if(n===null)r.componentDidMount();else{var i=t.elementType===t.type?n.memoizedProps:Me(t.type,n.memoizedProps);r.componentDidUpdate(i,n.memoizedState,r.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&vs(t,l,r);break;case 3:var a=t.updateQueue;if(a!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}vs(t,a,n)}break;case 5:var s=t.stateNode;if(n===null&&t.flags&4){n=s;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var m=d.memoizedState;if(m!==null){var p=m.dehydrated;p!==null&&ir(p)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(N(163))}de||t.flags&512&&wa(t)}catch(g){Y(t,t.return,g)}}if(t===e){P=null;break}if(n=t.sibling,n!==null){n.return=t.return,P=n;break}P=t.return}}function Ds(e){for(;P!==null;){var t=P;if(t===e){P=null;break}var n=t.sibling;if(n!==null){n.return=t.return,P=n;break}P=t.return}}function Is(e){for(;P!==null;){var t=P;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{Bi(4,t)}catch(u){Y(t,n,u)}break;case 1:var r=t.stateNode;if(typeof r.componentDidMount=="function"){var i=t.return;try{r.componentDidMount()}catch(u){Y(t,i,u)}}var l=t.return;try{wa(t)}catch(u){Y(t,l,u)}break;case 5:var a=t.return;try{wa(t)}catch(u){Y(t,a,u)}}}catch(u){Y(t,t.return,u)}if(t===e){P=null;break}var s=t.sibling;if(s!==null){s.return=t.return,P=s;break}P=t.return}}var Yp=Math.ceil,ji=at.ReactCurrentDispatcher,xo=at.ReactCurrentOwner,Le=at.ReactCurrentBatchConfig,I=0,ne=null,X=null,le=0,Se=0,dn=_t(0),Z=0,hr=null,Ht=0,Wi=0,vo=0,Gn=null,xe=null,yo=0,jn=1/0,qe=null,Ni=!1,ja=null,St=null,Wr=!1,ht=null,Ci=0,Xn=0,Na=null,ti=-1,ni=0;function pe(){return I&6?G():ti!==-1?ti:ti=G()}function jt(e){return e.mode&1?I&2&&le!==0?le&-le:Tp.transition!==null?(ni===0&&(ni=Fu()),ni):(e=F,e!==0||(e=window.event,e=e===void 0?16:Qu(e.type)),e):1}function Ae(e,t,n,r){if(50<Xn)throw Xn=0,Na=null,Error(N(185));kr(e,n,r),(!(I&2)||e!==ne)&&(e===ne&&(!(I&2)&&(Wi|=n),Z===4&&pt(e,le)),ke(e,r),n===1&&I===0&&!(t.mode&1)&&(jn=G()+500,$i&&zt()))}function ke(e,t){var n=e.callbackNode;Tf(e,t);var r=si(e,e===ne?le:0);if(r===0)n!==null&&Qo(n),e.callbackNode=null,e.callbackPriority=0;else if(t=r&-r,e.callbackPriority!==t){if(n!=null&&Qo(n),t===1)e.tag===0?zp(Ms.bind(null,e)):dd(Ms.bind(null,e)),bp(function(){!(I&6)&&zt()}),n=null;else{switch($u(r)){case 1:n=Va;break;case 4:n=Iu;break;case 16:n=oi;break;case 536870912:n=Mu;break;default:n=oi}n=sc(n,tc.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function tc(e,t){if(ti=-1,ni=0,I&6)throw Error(N(327));var n=e.callbackNode;if(gn()&&e.callbackNode!==n)return null;var r=si(e,e===ne?le:0);if(r===0)return null;if(r&30||r&e.expiredLanes||t)t=bi(e,r);else{t=r;var i=I;I|=2;var l=rc();(ne!==e||le!==t)&&(qe=null,jn=G()+500,At(e,t));do try{Xp();break}catch(s){nc(e,s)}while(!0);ro(),ji.current=l,I=i,X!==null?t=0:(ne=null,le=0,t=Z)}if(t!==0){if(t===2&&(i=Xl(e),i!==0&&(r=i,t=Ca(e,i))),t===1)throw n=hr,At(e,0),pt(e,r),ke(e,G()),n;if(t===6)pt(e,r);else{if(i=e.current.alternate,!(r&30)&&!qp(i)&&(t=bi(e,r),t===2&&(l=Xl(e),l!==0&&(r=l,t=Ca(e,l))),t===1))throw n=hr,At(e,0),pt(e,r),ke(e,G()),n;switch(e.finishedWork=i,e.finishedLanes=r,t){case 0:case 1:throw Error(N(345));case 2:Mt(e,xe,qe);break;case 3:if(pt(e,r),(r&130023424)===r&&(t=yo+500-G(),10<t)){if(si(e,0)!==0)break;if(i=e.suspendedLanes,(i&r)!==r){pe(),e.pingedLanes|=e.suspendedLanes&i;break}e.timeoutHandle=la(Mt.bind(null,e,xe,qe),t);break}Mt(e,xe,qe);break;case 4:if(pt(e,r),(r&4194240)===r)break;for(t=e.eventTimes,i=-1;0<r;){var a=31-Ue(r);l=1<<a,a=t[a],a>i&&(i=a),r&=~l}if(r=i,r=G()-r,r=(120>r?120:480>r?480:1080>r?1080:1920>r?1920:3e3>r?3e3:4320>r?4320:1960*Yp(r/1960))-r,10<r){e.timeoutHandle=la(Mt.bind(null,e,xe,qe),r);break}Mt(e,xe,qe);break;case 5:Mt(e,xe,qe);break;default:throw Error(N(329))}}}return ke(e,G()),e.callbackNode===n?tc.bind(null,e):null}function Ca(e,t){var n=Gn;return e.current.memoizedState.isDehydrated&&(At(e,t).flags|=256),e=bi(e,t),e!==2&&(t=xe,xe=n,t!==null&&ba(t)),e}function ba(e){xe===null?xe=e:xe.push.apply(xe,e)}function qp(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var r=0;r<n.length;r++){var i=n[r],l=i.getSnapshot;i=i.value;try{if(!Be(l(),i))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function pt(e,t){for(t&=~vo,t&=~Wi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Ue(t),r=1<<n;e[n]=-1,t&=~r}}function Ms(e){if(I&6)throw Error(N(327));gn();var t=si(e,0);if(!(t&1))return ke(e,G()),null;var n=bi(e,t);if(e.tag!==0&&n===2){var r=Xl(e);r!==0&&(t=r,n=Ca(e,r))}if(n===1)throw n=hr,At(e,0),pt(e,t),ke(e,G()),n;if(n===6)throw Error(N(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Mt(e,xe,qe),ke(e,G()),null}function wo(e,t){var n=I;I|=1;try{return e(t)}finally{I=n,I===0&&(jn=G()+500,$i&&zt())}}function Kt(e){ht!==null&&ht.tag===0&&!(I&6)&&gn();var t=I;I|=1;var n=Le.transition,r=F;try{if(Le.transition=null,F=1,e)return e()}finally{F=r,Le.transition=n,I=t,!(I&6)&&zt()}}function ko(){Se=dn.current,B(dn)}function At(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,Cp(n)),X!==null)for(n=X.return;n!==null;){var r=n;switch(eo(r),r.tag){case 1:r=r.type.childContextTypes,r!=null&&pi();break;case 3:kn(),B(ye),B(ce),uo();break;case 5:so(r);break;case 4:kn();break;case 13:B(V);break;case 19:B(V);break;case 10:io(r.type._context);break;case 22:case 23:ko()}n=n.return}if(ne=e,X=e=Nt(e.current,null),le=Se=t,Z=0,hr=null,vo=Wi=Ht=0,xe=Gn=null,$t!==null){for(t=0;t<$t.length;t++)if(n=$t[t],r=n.interleaved,r!==null){n.interleaved=null;var i=r.next,l=n.pending;if(l!==null){var a=l.next;l.next=i,r.next=a}n.pending=r}$t=null}return e}function nc(e,t){do{var n=X;try{if(ro(),Jr.current=Si,ki){for(var r=Q.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}ki=!1}if(Qt=0,te=J=Q=null,Yn=!1,fr=0,xo.current=null,n===null||n.return===null){Z=1,hr=t,X=null;break}e:{var l=e,a=n.return,s=n,u=t;if(t=le,s.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var d=u,m=s,p=m.tag;if(!(m.mode&1)&&(p===0||p===11||p===15)){var g=m.alternate;g?(m.updateQueue=g.updateQueue,m.memoizedState=g.memoizedState,m.lanes=g.lanes):(m.updateQueue=null,m.memoizedState=null)}var w=Ns(a);if(w!==null){w.flags&=-257,Cs(w,a,s,l,t),w.mode&1&&js(l,d,t),t=w,u=d;var y=t.updateQueue;if(y===null){var k=new Set;k.add(u),t.updateQueue=k}else y.add(u);break e}else{if(!(t&1)){js(l,d,t),So();break e}u=Error(N(426))}}else if(W&&s.mode&1){var S=Ns(a);if(S!==null){!(S.flags&65536)&&(S.flags|=256),Cs(S,a,s,l,t),to(Sn(u,s));break e}}l=u=Sn(u,s),Z!==4&&(Z=2),Gn===null?Gn=[l]:Gn.push(l),l=a;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var h=$d(l,u,t);xs(l,h);break e;case 1:s=u;var c=l.type,f=l.stateNode;if(!(l.flags&128)&&(typeof c.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(St===null||!St.has(f)))){l.flags|=65536,t&=-t,l.lanes|=t;var x=Ud(l,s,t);xs(l,x);break e}}l=l.return}while(l!==null)}lc(n)}catch(j){t=j,X===n&&n!==null&&(X=n=n.return);continue}break}while(!0)}function rc(){var e=ji.current;return ji.current=Si,e===null?Si:e}function So(){(Z===0||Z===3||Z===2)&&(Z=4),ne===null||!(Ht&268435455)&&!(Wi&268435455)||pt(ne,le)}function bi(e,t){var n=I;I|=2;var r=rc();(ne!==e||le!==t)&&(qe=null,At(e,t));do try{Gp();break}catch(i){nc(e,i)}while(!0);if(ro(),I=n,ji.current=r,X!==null)throw Error(N(261));return ne=null,le=0,Z}function Gp(){for(;X!==null;)ic(X)}function Xp(){for(;X!==null&&!Sf();)ic(X)}function ic(e){var t=oc(e.alternate,e,Se);e.memoizedProps=e.pendingProps,t===null?lc(e):X=t,xo.current=null}function lc(e){var t=e;do{var n=t.alternate;if(e=t.return,t.flags&32768){if(n=Vp(n,t),n!==null){n.flags&=32767,X=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Z=6,X=null;return}}else if(n=Wp(n,t,Se),n!==null){X=n;return}if(t=t.sibling,t!==null){X=t;return}X=t=e}while(t!==null);Z===0&&(Z=5)}function Mt(e,t,n){var r=F,i=Le.transition;try{Le.transition=null,F=1,Jp(e,t,n,r)}finally{Le.transition=i,F=r}return null}function Jp(e,t,n,r){do gn();while(ht!==null);if(I&6)throw Error(N(327));n=e.finishedWork;var i=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(N(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(Rf(e,l),e===ne&&(X=ne=null,le=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Wr||(Wr=!0,sc(oi,function(){return gn(),null})),l=(n.flags&15990)!==0,n.subtreeFlags&15990||l){l=Le.transition,Le.transition=null;var a=F;F=1;var s=I;I|=4,xo.current=null,Hp(e,n),Zd(n,e),vp(ra),ui=!!na,ra=na=null,e.current=n,Kp(n),jf(),I=s,F=a,Le.transition=l}else e.current=n;if(Wr&&(Wr=!1,ht=e,Ci=i),l=e.pendingLanes,l===0&&(St=null),bf(n.stateNode),ke(e,G()),t!==null)for(r=e.onRecoverableError,n=0;n<t.length;n++)i=t[n],r(i.value,{componentStack:i.stack,digest:i.digest});if(Ni)throw Ni=!1,e=ja,ja=null,e;return Ci&1&&e.tag!==0&&gn(),l=e.pendingLanes,l&1?e===Na?Xn++:(Xn=0,Na=e):Xn=0,zt(),null}function gn(){if(ht!==null){var e=$u(Ci),t=Le.transition,n=F;try{if(Le.transition=null,F=16>e?16:e,ht===null)var r=!1;else{if(e=ht,ht=null,Ci=0,I&6)throw Error(N(331));var i=I;for(I|=4,P=e.current;P!==null;){var l=P,a=l.child;if(P.flags&16){var s=l.deletions;if(s!==null){for(var u=0;u<s.length;u++){var d=s[u];for(P=d;P!==null;){var m=P;switch(m.tag){case 0:case 11:case 15:qn(8,m,l)}var p=m.child;if(p!==null)p.return=m,P=p;else for(;P!==null;){m=P;var g=m.sibling,w=m.return;if(Gd(m),m===d){P=null;break}if(g!==null){g.return=w,P=g;break}P=w}}}var y=l.alternate;if(y!==null){var k=y.child;if(k!==null){y.child=null;do{var S=k.sibling;k.sibling=null,k=S}while(k!==null)}}P=l}}if(l.subtreeFlags&2064&&a!==null)a.return=l,P=a;else e:for(;P!==null;){if(l=P,l.flags&2048)switch(l.tag){case 0:case 11:case 15:qn(9,l,l.return)}var h=l.sibling;if(h!==null){h.return=l.return,P=h;break e}P=l.return}}var c=e.current;for(P=c;P!==null;){a=P;var f=a.child;if(a.subtreeFlags&2064&&f!==null)f.return=a,P=f;else e:for(a=c;P!==null;){if(s=P,s.flags&2048)try{switch(s.tag){case 0:case 11:case 15:Bi(9,s)}}catch(j){Y(s,s.return,j)}if(s===a){P=null;break e}var x=s.sibling;if(x!==null){x.return=s.return,P=x;break e}P=s.return}}if(I=i,zt(),He&&typeof He.onPostCommitFiberRoot=="function")try{He.onPostCommitFiberRoot(Oi,e)}catch{}r=!0}return r}finally{F=n,Le.transition=t}}return!1}function Fs(e,t,n){t=Sn(n,t),t=$d(e,t,1),e=kt(e,t,1),t=pe(),e!==null&&(kr(e,1,t),ke(e,t))}function Y(e,t,n){if(e.tag===3)Fs(e,e,n);else for(;t!==null;){if(t.tag===3){Fs(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(St===null||!St.has(r))){e=Sn(n,e),e=Ud(t,e,1),t=kt(t,e,1),e=pe(),t!==null&&(kr(t,1,e),ke(t,e));break}}t=t.return}}function Zp(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),t=pe(),e.pingedLanes|=e.suspendedLanes&n,ne===e&&(le&n)===n&&(Z===4||Z===3&&(le&130023424)===le&&500>G()-yo?At(e,0):vo|=n),ke(e,t)}function ac(e,t){t===0&&(e.mode&1?(t=Lr,Lr<<=1,!(Lr&130023424)&&(Lr=4194304)):t=1);var n=pe();e=it(e,t),e!==null&&(kr(e,t,n),ke(e,n))}function em(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),ac(e,n)}function tm(e,t){var n=0;switch(e.tag){case 13:var r=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:r=e.stateNode;break;default:throw Error(N(314))}r!==null&&r.delete(t),ac(e,n)}var oc;oc=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||ye.current)ve=!0;else{if(!(e.lanes&n)&&!(t.flags&128))return ve=!1,Bp(e,t,n);ve=!!(e.flags&131072)}else ve=!1,W&&t.flags&1048576&&cd(t,gi,t.index);switch(t.lanes=0,t.tag){case 2:var r=t.type;ei(e,t),e=t.pendingProps;var i=vn(t,ce.current);hn(t,n),i=fo(null,t,r,e,i,n);var l=po();return t.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,we(r)?(l=!0,mi(t)):l=!1,t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,ao(t),i.updater=Ai,t.stateNode=i,i._reactInternals=t,fa(t,r,e,n),t=ha(null,t,r,!0,l,n)):(t.tag=0,W&&l&&Za(t),fe(null,t,i,n),t=t.child),t;case 16:r=t.elementType;e:{switch(ei(e,t),e=t.pendingProps,i=r._init,r=i(r._payload),t.type=r,i=t.tag=rm(r),e=Me(r,e),i){case 0:t=ma(null,t,r,e,n);break e;case 1:t=Ps(null,t,r,e,n);break e;case 11:t=bs(null,t,r,e,n);break e;case 14:t=Es(null,t,r,Me(r.type,e),n);break e}throw Error(N(306,r,""))}return t;case 0:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Me(r,i),ma(e,t,r,i,n);case 1:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Me(r,i),Ps(e,t,r,i,n);case 3:e:{if(Vd(t),e===null)throw Error(N(387));r=t.pendingProps,l=t.memoizedState,i=l.element,xd(e,t),yi(t,r,null,n);var a=t.memoizedState;if(r=a.element,l.isDehydrated)if(l={element:r,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){i=Sn(Error(N(423)),t),t=_s(e,t,r,n,i);break e}else if(r!==i){i=Sn(Error(N(424)),t),t=_s(e,t,r,n,i);break e}else for(je=wt(t.stateNode.containerInfo.firstChild),Ne=t,W=!0,$e=null,n=hd(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(yn(),r===i){t=lt(e,t,n);break e}fe(e,t,r,n)}t=t.child}return t;case 5:return vd(t),e===null&&ua(t),r=t.type,i=t.pendingProps,l=e!==null?e.memoizedProps:null,a=i.children,ia(r,i)?a=null:l!==null&&ia(r,l)&&(t.flags|=32),Wd(e,t),fe(e,t,a,n),t.child;case 6:return e===null&&ua(t),null;case 13:return Qd(e,t,n);case 4:return oo(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=wn(t,null,r,n):fe(e,t,r,n),t.child;case 11:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Me(r,i),bs(e,t,r,i,n);case 7:return fe(e,t,t.pendingProps,n),t.child;case 8:return fe(e,t,t.pendingProps.children,n),t.child;case 12:return fe(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(r=t.type._context,i=t.pendingProps,l=t.memoizedProps,a=i.value,$(xi,r._currentValue),r._currentValue=a,l!==null)if(Be(l.value,a)){if(l.children===i.children&&!ye.current){t=lt(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var s=l.dependencies;if(s!==null){a=l.child;for(var u=s.firstContext;u!==null;){if(u.context===r){if(l.tag===1){u=et(-1,n&-n),u.tag=2;var d=l.updateQueue;if(d!==null){d=d.shared;var m=d.pending;m===null?u.next=u:(u.next=m.next,m.next=u),d.pending=u}}l.lanes|=n,u=l.alternate,u!==null&&(u.lanes|=n),da(l.return,n,t),s.lanes|=n;break}u=u.next}}else if(l.tag===10)a=l.type===t.type?null:l.child;else if(l.tag===18){if(a=l.return,a===null)throw Error(N(341));a.lanes|=n,s=a.alternate,s!==null&&(s.lanes|=n),da(a,n,t),a=l.sibling}else a=l.child;if(a!==null)a.return=l;else for(a=l;a!==null;){if(a===t){a=null;break}if(l=a.sibling,l!==null){l.return=a.return,a=l;break}a=a.return}l=a}fe(e,t,i.children,n),t=t.child}return t;case 9:return i=t.type,r=t.pendingProps.children,hn(t,n),i=Oe(i),r=r(i),t.flags|=1,fe(e,t,r,n),t.child;case 14:return r=t.type,i=Me(r,t.pendingProps),i=Me(r.type,i),Es(e,t,r,i,n);case 15:return Ad(e,t,t.type,t.pendingProps,n);case 17:return r=t.type,i=t.pendingProps,i=t.elementType===r?i:Me(r,i),ei(e,t),t.tag=1,we(r)?(e=!0,mi(t)):e=!1,hn(t,n),Fd(t,r,i),fa(t,r,i,n),ha(null,t,r,!0,e,n);case 19:return Hd(e,t,n);case 22:return Bd(e,t,n)}throw Error(N(156,t.tag))};function sc(e,t){return Du(e,t)}function nm(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Re(e,t,n,r){return new nm(e,t,n,r)}function jo(e){return e=e.prototype,!(!e||!e.isReactComponent)}function rm(e){if(typeof e=="function")return jo(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Aa)return 11;if(e===Ba)return 14}return 2}function Nt(e,t){var n=e.alternate;return n===null?(n=Re(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function ri(e,t,n,r,i,l){var a=2;if(r=e,typeof e=="function")jo(e)&&(a=1);else if(typeof e=="string")a=5;else e:switch(e){case Zt:return Bt(n.children,i,l,t);case Ua:a=8,i|=8;break;case Il:return e=Re(12,n,t,i|2),e.elementType=Il,e.lanes=l,e;case Ml:return e=Re(13,n,t,i),e.elementType=Ml,e.lanes=l,e;case Fl:return e=Re(19,n,t,i),e.elementType=Fl,e.lanes=l,e;case vu:return Vi(n,i,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case gu:a=10;break e;case xu:a=9;break e;case Aa:a=11;break e;case Ba:a=14;break e;case dt:a=16,r=null;break e}throw Error(N(130,e==null?e:typeof e,""))}return t=Re(a,n,t,i),t.elementType=e,t.type=r,t.lanes=l,t}function Bt(e,t,n,r){return e=Re(7,e,r,t),e.lanes=n,e}function Vi(e,t,n,r){return e=Re(22,e,r,t),e.elementType=vu,e.lanes=n,e.stateNode={isHidden:!1},e}function El(e,t,n){return e=Re(6,e,null,t),e.lanes=n,e}function Pl(e,t,n){return t=Re(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function im(e,t,n,r,i){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=sl(0),this.expirationTimes=sl(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=sl(0),this.identifierPrefix=r,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function No(e,t,n,r,i,l,a,s,u){return e=new im(e,t,n,s,u),t===1?(t=1,l===!0&&(t|=8)):t=0,l=Re(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:r,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},ao(l),e}function lm(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Jt,key:r==null?null:""+r,children:e,containerInfo:t,implementation:n}}function uc(e){if(!e)return Et;e=e._reactInternals;e:{if(qt(e)!==e||e.tag!==1)throw Error(N(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(we(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(N(171))}if(e.tag===1){var n=e.type;if(we(n))return ud(e,n,t)}return t}function dc(e,t,n,r,i,l,a,s,u){return e=No(n,r,!0,e,i,l,a,s,u),e.context=uc(null),n=e.current,r=pe(),i=jt(n),l=et(r,i),l.callback=t??null,kt(n,l,i),e.current.lanes=i,kr(e,i,r),ke(e,r),e}function Qi(e,t,n,r){var i=t.current,l=pe(),a=jt(i);return n=uc(n),t.context===null?t.context=n:t.pendingContext=n,t=et(l,a),t.payload={element:e},r=r===void 0?null:r,r!==null&&(t.callback=r),e=kt(i,t,a),e!==null&&(Ae(e,i,a,l),Xr(e,i,a)),a}function Ei(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function $s(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Co(e,t){$s(e,t),(e=e.alternate)&&$s(e,t)}function am(){return null}var cc=typeof reportError=="function"?reportError:function(e){console.error(e)};function bo(e){this._internalRoot=e}Hi.prototype.render=bo.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(N(409));Qi(e,t,null,null)};Hi.prototype.unmount=bo.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Kt(function(){Qi(null,e,null,null)}),t[rt]=null}};function Hi(e){this._internalRoot=e}Hi.prototype.unstable_scheduleHydration=function(e){if(e){var t=Bu();e={blockedOn:null,target:e,priority:t};for(var n=0;n<ft.length&&t!==0&&t<ft[n].priority;n++);ft.splice(n,0,e),n===0&&Vu(e)}};function Eo(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ki(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Us(){}function om(e,t,n,r,i){if(i){if(typeof r=="function"){var l=r;r=function(){var d=Ei(a);l.call(d)}}var a=dc(t,r,e,0,null,!1,!1,"",Us);return e._reactRootContainer=a,e[rt]=a.current,or(e.nodeType===8?e.parentNode:e),Kt(),a}for(;i=e.lastChild;)e.removeChild(i);if(typeof r=="function"){var s=r;r=function(){var d=Ei(u);s.call(d)}}var u=No(e,0,!1,null,null,!1,!1,"",Us);return e._reactRootContainer=u,e[rt]=u.current,or(e.nodeType===8?e.parentNode:e),Kt(function(){Qi(t,u,n,r)}),u}function Yi(e,t,n,r,i){var l=n._reactRootContainer;if(l){var a=l;if(typeof i=="function"){var s=i;i=function(){var u=Ei(a);s.call(u)}}Qi(t,a,e,i)}else a=om(n,t,e,i,r);return Ei(a)}Uu=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=An(t.pendingLanes);n!==0&&(Qa(t,n|1),ke(t,G()),!(I&6)&&(jn=G()+500,zt()))}break;case 13:Kt(function(){var r=it(e,1);if(r!==null){var i=pe();Ae(r,e,1,i)}}),Co(e,1)}};Ha=function(e){if(e.tag===13){var t=it(e,134217728);if(t!==null){var n=pe();Ae(t,e,134217728,n)}Co(e,134217728)}};Au=function(e){if(e.tag===13){var t=jt(e),n=it(e,t);if(n!==null){var r=pe();Ae(n,e,t,r)}Co(e,t)}};Bu=function(){return F};Wu=function(e,t){var n=F;try{return F=e,t()}finally{F=n}};Yl=function(e,t,n){switch(t){case"input":if(Al(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var i=Fi(r);if(!i)throw Error(N(90));wu(r),Al(r,i)}}}break;case"textarea":Su(e,n);break;case"select":t=n.value,t!=null&&cn(e,!!n.multiple,t,!1)}};_u=wo;zu=Kt;var sm={usingClientEntryPoint:!1,Events:[jr,rn,Fi,Eu,Pu,wo]},Fn={findFiberByHostInstance:Ft,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},um={bundleType:Fn.bundleType,version:Fn.version,rendererPackageName:Fn.rendererPackageName,rendererConfig:Fn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:at.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Lu(e),e===null?null:e.stateNode},findFiberByHostInstance:Fn.findFiberByHostInstance||am,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Vr=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Vr.isDisabled&&Vr.supportsFiber)try{Oi=Vr.inject(um),He=Vr}catch{}}Ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sm;Ee.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Eo(t))throw Error(N(200));return lm(e,t,null,n)};Ee.createRoot=function(e,t){if(!Eo(e))throw Error(N(299));var n=!1,r="",i=cc;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onRecoverableError!==void 0&&(i=t.onRecoverableError)),t=No(e,1,!1,null,null,n,!1,r,i),e[rt]=t.current,or(e.nodeType===8?e.parentNode:e),new bo(t)};Ee.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(N(188)):(e=Object.keys(e).join(","),Error(N(268,e)));return e=Lu(t),e=e===null?null:e.stateNode,e};Ee.flushSync=function(e){return Kt(e)};Ee.hydrate=function(e,t,n){if(!Ki(t))throw Error(N(200));return Yi(null,e,t,!0,n)};Ee.hydrateRoot=function(e,t,n){if(!Eo(e))throw Error(N(405));var r=n!=null&&n.hydratedSources||null,i=!1,l="",a=cc;if(n!=null&&(n.unstable_strictMode===!0&&(i=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),t=dc(t,null,e,1,n??null,i,!1,l,a),e[rt]=t.current,or(e),r)for(e=0;e<r.length;e++)n=r[e],i=n._getVersion,i=i(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,i]:t.mutableSourceEagerHydrationData.push(n,i);return new Hi(t)};Ee.render=function(e,t,n){if(!Ki(t))throw Error(N(200));return Yi(null,e,t,!1,n)};Ee.unmountComponentAtNode=function(e){if(!Ki(e))throw Error(N(40));return e._reactRootContainer?(Kt(function(){Yi(null,null,e,!1,function(){e._reactRootContainer=null,e[rt]=null})}),!0):!1};Ee.unstable_batchedUpdates=wo;Ee.unstable_renderSubtreeIntoContainer=function(e,t,n,r){if(!Ki(n))throw Error(N(200));if(e==null||e._reactInternals===void 0)throw Error(N(38));return Yi(e,t,n,!1,r)};Ee.version="18.3.1-next-f1338f8080-20240426";function fc(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(fc)}catch(e){console.error(e)}}fc(),fu.exports=Ee;var dm=fu.exports,As=dm;Ol.createRoot=As.createRoot,Ol.hydrateRoot=As.hydrateRoot;/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function gr(){return gr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},gr.apply(null,arguments)}var gt;(function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"})(gt||(gt={}));const Bs="popstate";function cm(e){e===void 0&&(e={});function t(r,i){let{pathname:l,search:a,hash:s}=r.location;return Ea("",{pathname:l,search:a,hash:s},i.state&&i.state.usr||null,i.state&&i.state.key||"default")}function n(r,i){return typeof i=="string"?i:Pi(i)}return pm(t,n,null,e)}function H(e,t){if(e===!1||e===null||typeof e>"u")throw new Error(t)}function pc(e,t){if(!e){typeof console<"u"&&console.warn(t);try{throw new Error(t)}catch{}}}function fm(){return Math.random().toString(36).substr(2,8)}function Ws(e,t){return{usr:e.state,key:e.key,idx:t}}function Ea(e,t,n,r){return n===void 0&&(n=null),gr({pathname:typeof e=="string"?e:e.pathname,search:"",hash:""},typeof t=="string"?Pn(t):t,{state:n,key:t&&t.key||r||fm()})}function Pi(e){let{pathname:t="/",search:n="",hash:r=""}=e;return n&&n!=="?"&&(t+=n.charAt(0)==="?"?n:"?"+n),r&&r!=="#"&&(t+=r.charAt(0)==="#"?r:"#"+r),t}function Pn(e){let t={};if(e){let n=e.indexOf("#");n>=0&&(t.hash=e.substr(n),e=e.substr(0,n));let r=e.indexOf("?");r>=0&&(t.search=e.substr(r),e=e.substr(0,r)),e&&(t.pathname=e)}return t}function pm(e,t,n,r){r===void 0&&(r={});let{window:i=document.defaultView,v5Compat:l=!1}=r,a=i.history,s=gt.Pop,u=null,d=m();d==null&&(d=0,a.replaceState(gr({},a.state,{idx:d}),""));function m(){return(a.state||{idx:null}).idx}function p(){s=gt.Pop;let S=m(),h=S==null?null:S-d;d=S,u&&u({action:s,location:k.location,delta:h})}function g(S,h){s=gt.Push;let c=Ea(k.location,S,h);d=m()+1;let f=Ws(c,d),x=k.createHref(c);try{a.pushState(f,"",x)}catch(j){if(j instanceof DOMException&&j.name==="DataCloneError")throw j;i.location.assign(x)}l&&u&&u({action:s,location:k.location,delta:1})}function w(S,h){s=gt.Replace;let c=Ea(k.location,S,h);d=m();let f=Ws(c,d),x=k.createHref(c);a.replaceState(f,"",x),l&&u&&u({action:s,location:k.location,delta:0})}function y(S){let h=i.location.origin!=="null"?i.location.origin:i.location.href,c=typeof S=="string"?S:Pi(S);return c=c.replace(/ $/,"%20"),H(h,"No window.location.(origin|href) available to create URL for href: "+c),new URL(c,h)}let k={get action(){return s},get location(){return e(i,a)},listen(S){if(u)throw new Error("A history only accepts one active listener");return i.addEventListener(Bs,p),u=S,()=>{i.removeEventListener(Bs,p),u=null}},createHref(S){return t(i,S)},createURL:y,encodeLocation(S){let h=y(S);return{pathname:h.pathname,search:h.search,hash:h.hash}},push:g,replace:w,go(S){return a.go(S)}};return k}var Vs;(function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"})(Vs||(Vs={}));function mm(e,t,n){return n===void 0&&(n="/"),hm(e,t,n)}function hm(e,t,n,r){let i=typeof t=="string"?Pn(t):t,l=Nn(i.pathname||"/",n);if(l==null)return null;let a=mc(e);gm(a);let s=null,u=Em(l);for(let d=0;s==null&&d<a.length;++d)s=Cm(a[d],u);return s}function mc(e,t,n,r){t===void 0&&(t=[]),n===void 0&&(n=[]),r===void 0&&(r="");let i=(l,a,s)=>{let u={relativePath:s===void 0?l.path||"":s,caseSensitive:l.caseSensitive===!0,childrenIndex:a,route:l};u.relativePath.startsWith("/")&&(H(u.relativePath.startsWith(r),'Absolute route path "'+u.relativePath+'" nested under path '+('"'+r+'" is not valid. An absolute child route path ')+"must start with the combined path of all its parent routes."),u.relativePath=u.relativePath.slice(r.length));let d=Ct([r,u.relativePath]),m=n.concat(u);l.children&&l.children.length>0&&(H(l.index!==!0,"Index routes must not have child routes. Please remove "+('all child routes from route path "'+d+'".')),mc(l.children,t,m,d)),!(l.path==null&&!l.index)&&t.push({path:d,score:jm(d,l.index),routesMeta:m})};return e.forEach((l,a)=>{var s;if(l.path===""||!((s=l.path)!=null&&s.includes("?")))i(l,a);else for(let u of hc(l.path))i(l,a,u)}),t}function hc(e){let t=e.split("/");if(t.length===0)return[];let[n,...r]=t,i=n.endsWith("?"),l=n.replace(/\?$/,"");if(r.length===0)return i?[l,""]:[l];let a=hc(r.join("/")),s=[];return s.push(...a.map(u=>u===""?l:[l,u].join("/"))),i&&s.push(...a),s.map(u=>e.startsWith("/")&&u===""?"/":u)}function gm(e){e.sort((t,n)=>t.score!==n.score?n.score-t.score:Nm(t.routesMeta.map(r=>r.childrenIndex),n.routesMeta.map(r=>r.childrenIndex)))}const xm=/^:[\w-]+$/,vm=3,ym=2,wm=1,km=10,Sm=-2,Qs=e=>e==="*";function jm(e,t){let n=e.split("/"),r=n.length;return n.some(Qs)&&(r+=Sm),t&&(r+=ym),n.filter(i=>!Qs(i)).reduce((i,l)=>i+(xm.test(l)?vm:l===""?wm:km),r)}function Nm(e,t){return e.length===t.length&&e.slice(0,-1).every((r,i)=>r===t[i])?e[e.length-1]-t[t.length-1]:0}function Cm(e,t,n){let{routesMeta:r}=e,i={},l="/",a=[];for(let s=0;s<r.length;++s){let u=r[s],d=s===r.length-1,m=l==="/"?t:t.slice(l.length)||"/",p=Pa({path:u.relativePath,caseSensitive:u.caseSensitive,end:d},m),g=u.route;if(!p)return null;Object.assign(i,p.params),a.push({params:i,pathname:Ct([l,p.pathname]),pathnameBase:zm(Ct([l,p.pathnameBase])),route:g}),p.pathnameBase!=="/"&&(l=Ct([l,p.pathnameBase]))}return a}function Pa(e,t){typeof e=="string"&&(e={path:e,caseSensitive:!1,end:!0});let[n,r]=bm(e.path,e.caseSensitive,e.end),i=t.match(n);if(!i)return null;let l=i[0],a=l.replace(/(.)\/+$/,"$1"),s=i.slice(1);return{params:r.reduce((d,m,p)=>{let{paramName:g,isOptional:w}=m;if(g==="*"){let k=s[p]||"";a=l.slice(0,l.length-k.length).replace(/(.)\/+$/,"$1")}const y=s[p];return w&&!y?d[g]=void 0:d[g]=(y||"").replace(/%2F/g,"/"),d},{}),pathname:l,pathnameBase:a,pattern:e}}function bm(e,t,n){t===void 0&&(t=!1),n===void 0&&(n=!0),pc(e==="*"||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were '+('"'+e.replace(/\*$/,"/*")+'" because the `*` character must ')+"always follow a `/` in the pattern. To get rid of this warning, "+('please change the route path to "'+e.replace(/\*$/,"/*")+'".'));let r=[],i="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(a,s,u)=>(r.push({paramName:s,isOptional:u!=null}),u?"/?([^\\/]+)?":"/([^\\/]+)"));return e.endsWith("*")?(r.push({paramName:"*"}),i+=e==="*"||e==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):n?i+="\\/*$":e!==""&&e!=="/"&&(i+="(?:(?=\\/|$))"),[new RegExp(i,t?void 0:"i"),r]}function Em(e){try{return e.split("/").map(t=>decodeURIComponent(t).replace(/\//g,"%2F")).join("/")}catch(t){return pc(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent '+("encoding ("+t+").")),e}}function Nn(e,t){if(t==="/")return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let n=t.endsWith("/")?t.length-1:t.length,r=e.charAt(n);return r&&r!=="/"?null:e.slice(n)||"/"}function Pm(e,t){t===void 0&&(t="/");let{pathname:n,search:r="",hash:i=""}=typeof e=="string"?Pn(e):e,l;return n?(n=gc(n),n.startsWith("/")?l=Hs(n.substring(1),"/"):l=Hs(n,t)):l=t,{pathname:l,search:Tm(r),hash:Rm(i)}}function Hs(e,t){let n=t.replace(/\/+$/,"").split("/");return e.split("/").forEach(i=>{i===".."?n.length>1&&n.pop():i!=="."&&n.push(i)}),n.length>1?n.join("/"):"/"}function _l(e,t,n,r){return"Cannot include a '"+e+"' character in a manually specified "+("`to."+t+"` field ["+JSON.stringify(r)+"].  Please separate it out to the ")+("`to."+n+"` field. Alternatively you may provide the full path as ")+'a string in <Link to="..."> and the router will parse it for you.'}function _m(e){return e.filter((t,n)=>n===0||t.route.path&&t.route.path.length>0)}function Po(e,t){let n=_m(e);return t?n.map((r,i)=>i===n.length-1?r.pathname:r.pathnameBase):n.map(r=>r.pathnameBase)}function _o(e,t,n,r){r===void 0&&(r=!1);let i;typeof e=="string"?i=Pn(e):(i=gr({},e),H(!i.pathname||!i.pathname.includes("?"),_l("?","pathname","search",i)),H(!i.pathname||!i.pathname.includes("#"),_l("#","pathname","hash",i)),H(!i.search||!i.search.includes("#"),_l("#","search","hash",i)));let l=e===""||i.pathname==="",a=l?"/":i.pathname,s;if(a==null)s=n;else{let p=t.length-1;if(!r&&a.startsWith("..")){let g=a.split("/");for(;g[0]==="..";)g.shift(),p-=1;i.pathname=g.join("/")}s=p>=0?t[p]:"/"}let u=Pm(i,s),d=a&&a!=="/"&&a.endsWith("/"),m=(l||a===".")&&n.endsWith("/");return!u.pathname.endsWith("/")&&(d||m)&&(u.pathname+="/"),u}const gc=e=>e.replace(/\/\/+/g,"/"),Ct=e=>gc(e.join("/")),zm=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),Tm=e=>!e||e==="?"?"":e.startsWith("?")?e:"?"+e,Rm=e=>!e||e==="#"?"":e.startsWith("#")?e:"#"+e;function Lm(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.internal=="boolean"&&"data"in e}const xc=["post","put","patch","delete"];new Set(xc);const Om=["get",...xc];new Set(Om);/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function xr(){return xr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},xr.apply(null,arguments)}const qi=v.createContext(null),vc=v.createContext(null),ot=v.createContext(null),Gi=v.createContext(null),Ye=v.createContext({outlet:null,matches:[],isDataRoute:!1}),yc=v.createContext(null);function Dm(e,t){let{relative:n}=t===void 0?{}:t;_n()||H(!1);let{basename:r,navigator:i}=v.useContext(ot),{hash:l,pathname:a,search:s}=Xi(e,{relative:n}),u=a;return r!=="/"&&(u=a==="/"?r:Ct([r,a])),i.createHref({pathname:u,search:s,hash:l})}function _n(){return v.useContext(Gi)!=null}function zn(){return _n()||H(!1),v.useContext(Gi).location}function wc(e){v.useContext(ot).static||v.useLayoutEffect(e)}function st(){let{isDataRoute:e}=v.useContext(Ye);return e?Gm():Im()}function Im(){_n()||H(!1);let e=v.useContext(qi),{basename:t,future:n,navigator:r}=v.useContext(ot),{matches:i}=v.useContext(Ye),{pathname:l}=zn(),a=JSON.stringify(Po(i,n.v7_relativeSplatPath)),s=v.useRef(!1);return wc(()=>{s.current=!0}),v.useCallback(function(d,m){if(m===void 0&&(m={}),!s.current)return;if(typeof d=="number"){r.go(d);return}let p=_o(d,JSON.parse(a),l,m.relative==="path");e==null&&t!=="/"&&(p.pathname=p.pathname==="/"?t:Ct([t,p.pathname])),(m.replace?r.replace:r.push)(p,m.state,m)},[t,r,a,l,e])}const Mm=v.createContext(null);function Fm(e){let t=v.useContext(Ye).outlet;return t&&v.createElement(Mm.Provider,{value:e},t)}function Cr(){let{matches:e}=v.useContext(Ye),t=e[e.length-1];return t?t.params:{}}function Xi(e,t){let{relative:n}=t===void 0?{}:t,{future:r}=v.useContext(ot),{matches:i}=v.useContext(Ye),{pathname:l}=zn(),a=JSON.stringify(Po(i,r.v7_relativeSplatPath));return v.useMemo(()=>_o(e,JSON.parse(a),l,n==="path"),[e,a,l,n])}function $m(e,t){return Um(e,t)}function Um(e,t,n,r){_n()||H(!1);let{navigator:i}=v.useContext(ot),{matches:l}=v.useContext(Ye),a=l[l.length-1],s=a?a.params:{};a&&a.pathname;let u=a?a.pathnameBase:"/";a&&a.route;let d=zn(),m;if(t){var p;let S=typeof t=="string"?Pn(t):t;u==="/"||(p=S.pathname)!=null&&p.startsWith(u)||H(!1),m=S}else m=d;let g=m.pathname||"/",w=g;if(u!=="/"){let S=u.replace(/^\//,"").split("/");w="/"+g.replace(/^\//,"").split("/").slice(S.length).join("/")}let y=mm(e,{pathname:w}),k=Qm(y&&y.map(S=>Object.assign({},S,{params:Object.assign({},s,S.params),pathname:Ct([u,i.encodeLocation?i.encodeLocation(S.pathname).pathname:S.pathname]),pathnameBase:S.pathnameBase==="/"?u:Ct([u,i.encodeLocation?i.encodeLocation(S.pathnameBase).pathname:S.pathnameBase])})),l,n,r);return t&&k?v.createElement(Gi.Provider,{value:{location:xr({pathname:"/",search:"",hash:"",state:null,key:"default"},m),navigationType:gt.Pop}},k):k}function Am(){let e=qm(),t=Lm(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),n=e instanceof Error?e.stack:null,i={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return v.createElement(v.Fragment,null,v.createElement("h2",null,"Unexpected Application Error!"),v.createElement("h3",{style:{fontStyle:"italic"}},t),n?v.createElement("pre",{style:i},n):null,null)}const Bm=v.createElement(Am,null);class Wm extends v.Component{constructor(t){super(t),this.state={location:t.location,revalidation:t.revalidation,error:t.error}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,n){return n.location!==t.location||n.revalidation!=="idle"&&t.revalidation==="idle"?{error:t.error,location:t.location,revalidation:t.revalidation}:{error:t.error!==void 0?t.error:n.error,location:n.location,revalidation:t.revalidation||n.revalidation}}componentDidCatch(t,n){console.error("React Router caught the following error during render",t,n)}render(){return this.state.error!==void 0?v.createElement(Ye.Provider,{value:this.props.routeContext},v.createElement(yc.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function Vm(e){let{routeContext:t,match:n,children:r}=e,i=v.useContext(qi);return i&&i.static&&i.staticContext&&(n.route.errorElement||n.route.ErrorBoundary)&&(i.staticContext._deepestRenderedBoundaryId=n.route.id),v.createElement(Ye.Provider,{value:t},r)}function Qm(e,t,n,r){var i;if(t===void 0&&(t=[]),n===void 0&&(n=null),r===void 0&&(r=null),e==null){var l;if(!n)return null;if(n.errors)e=n.matches;else if((l=r)!=null&&l.v7_partialHydration&&t.length===0&&!n.initialized&&n.matches.length>0)e=n.matches;else return null}let a=e,s=(i=n)==null?void 0:i.errors;if(s!=null){let m=a.findIndex(p=>p.route.id&&(s==null?void 0:s[p.route.id])!==void 0);m>=0||H(!1),a=a.slice(0,Math.min(a.length,m+1))}let u=!1,d=-1;if(n&&r&&r.v7_partialHydration)for(let m=0;m<a.length;m++){let p=a[m];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(d=m),p.route.id){let{loaderData:g,errors:w}=n,y=p.route.loader&&g[p.route.id]===void 0&&(!w||w[p.route.id]===void 0);if(p.route.lazy||y){u=!0,d>=0?a=a.slice(0,d+1):a=[a[0]];break}}}return a.reduceRight((m,p,g)=>{let w,y=!1,k=null,S=null;n&&(w=s&&p.route.id?s[p.route.id]:void 0,k=p.route.errorElement||Bm,u&&(d<0&&g===0?(Xm("route-fallback"),y=!0,S=null):d===g&&(y=!0,S=p.route.hydrateFallbackElement||null)));let h=t.concat(a.slice(0,g+1)),c=()=>{let f;return w?f=k:y?f=S:p.route.Component?f=v.createElement(p.route.Component,null):p.route.element?f=p.route.element:f=m,v.createElement(Vm,{match:p,routeContext:{outlet:m,matches:h,isDataRoute:n!=null},children:f})};return n&&(p.route.ErrorBoundary||p.route.errorElement||g===0)?v.createElement(Wm,{location:n.location,revalidation:n.revalidation,component:k,error:w,children:c(),routeContext:{outlet:null,matches:h,isDataRoute:!0}}):c()},null)}var kc=function(e){return e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e}(kc||{}),Sc=function(e){return e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator",e.UseNavigateStable="useNavigate",e.UseRouteId="useRouteId",e}(Sc||{});function Hm(e){let t=v.useContext(qi);return t||H(!1),t}function Km(e){let t=v.useContext(vc);return t||H(!1),t}function Ym(e){let t=v.useContext(Ye);return t||H(!1),t}function jc(e){let t=Ym(),n=t.matches[t.matches.length-1];return n.route.id||H(!1),n.route.id}function qm(){var e;let t=v.useContext(yc),n=Km(),r=jc();return t!==void 0?t:(e=n.errors)==null?void 0:e[r]}function Gm(){let{router:e}=Hm(kc.UseNavigateStable),t=jc(Sc.UseNavigateStable),n=v.useRef(!1);return wc(()=>{n.current=!0}),v.useCallback(function(i,l){l===void 0&&(l={}),n.current&&(typeof i=="number"?e.navigate(i):e.navigate(i,xr({fromRouteId:t},l)))},[e,t])}const Ks={};function Xm(e,t,n){Ks[e]||(Ks[e]=!0)}function Jm(e,t){e==null||e.v7_startTransition,e==null||e.v7_relativeSplatPath}function _a(e){let{to:t,replace:n,state:r,relative:i}=e;_n()||H(!1);let{future:l,static:a}=v.useContext(ot),{matches:s}=v.useContext(Ye),{pathname:u}=zn(),d=st(),m=_o(t,Po(s,l.v7_relativeSplatPath),u,i==="path"),p=JSON.stringify(m);return v.useEffect(()=>d(JSON.parse(p),{replace:n,state:r,relative:i}),[d,p,i,n,r]),null}function Nc(e){return Fm(e.context)}function ue(e){H(!1)}function Zm(e){let{basename:t="/",children:n=null,location:r,navigationType:i=gt.Pop,navigator:l,static:a=!1,future:s}=e;_n()&&H(!1);let u=t.replace(/^\/*/,"/"),d=v.useMemo(()=>({basename:u,navigator:l,static:a,future:xr({v7_relativeSplatPath:!1},s)}),[u,s,l,a]);typeof r=="string"&&(r=Pn(r));let{pathname:m="/",search:p="",hash:g="",state:w=null,key:y="default"}=r,k=v.useMemo(()=>{let S=Nn(m,u);return S==null?null:{location:{pathname:S,search:p,hash:g,state:w,key:y},navigationType:i}},[u,m,p,g,w,y,i]);return k==null?null:v.createElement(ot.Provider,{value:d},v.createElement(Gi.Provider,{children:n,value:k}))}function eh(e){let{children:t,location:n}=e;return $m(za(t),n)}new Promise(()=>{});function za(e,t){t===void 0&&(t=[]);let n=[];return v.Children.forEach(e,(r,i)=>{if(!v.isValidElement(r))return;let l=[...t,i];if(r.type===v.Fragment){n.push.apply(n,za(r.props.children,l));return}r.type!==ue&&H(!1),!r.props.index||!r.props.children||H(!1);let a={id:r.props.id||l.join("-"),caseSensitive:r.props.caseSensitive,element:r.props.element,Component:r.props.Component,index:r.props.index,path:r.props.path,loader:r.props.loader,action:r.props.action,errorElement:r.props.errorElement,ErrorBoundary:r.props.ErrorBoundary,hasErrorBoundary:r.props.ErrorBoundary!=null||r.props.errorElement!=null,shouldRevalidate:r.props.shouldRevalidate,handle:r.props.handle,lazy:r.props.lazy};r.props.children&&(a.children=za(r.props.children,l)),n.push(a)}),n}/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function _i(){return _i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},_i.apply(null,arguments)}function Cc(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function th(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function nh(e,t){return e.button===0&&(!t||t==="_self")&&!th(e)}const rh=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset","viewTransition"],ih=["aria-current","caseSensitive","className","end","style","to","viewTransition","children"],lh="6";try{window.__reactRouterVersion=lh}catch{}const ah=v.createContext({isTransitioning:!1}),oh="startTransition",Ys=Jc[oh];function sh(e){let{basename:t,children:n,future:r,window:i}=e,l=v.useRef();l.current==null&&(l.current=cm({window:i,v5Compat:!0}));let a=l.current,[s,u]=v.useState({action:a.action,location:a.location}),{v7_startTransition:d}=r||{},m=v.useCallback(p=>{d&&Ys?Ys(()=>u(p)):u(p)},[u,d]);return v.useLayoutEffect(()=>a.listen(m),[a,m]),v.useEffect(()=>Jm(r),[r]),v.createElement(Zm,{basename:t,children:n,location:s.location,navigationType:s.action,navigator:a,future:r})}const uh=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",dh=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Ji=v.forwardRef(function(t,n){let{onClick:r,relative:i,reloadDocument:l,replace:a,state:s,target:u,to:d,preventScrollReset:m,viewTransition:p}=t,g=Cc(t,rh),{basename:w}=v.useContext(ot),y,k=!1;if(typeof d=="string"&&dh.test(d)&&(y=d,uh))try{let f=new URL(window.location.href),x=d.startsWith("//")?new URL(f.protocol+d):new URL(d),j=Nn(x.pathname,w);x.origin===f.origin&&j!=null?d=j+x.search+x.hash:k=!0}catch{}let S=Dm(d,{relative:i}),h=fh(d,{replace:a,state:s,target:u,preventScrollReset:m,relative:i,viewTransition:p});function c(f){r&&r(f),f.defaultPrevented||h(f)}return v.createElement("a",_i({},g,{href:y||S,onClick:k||l?r:c,ref:n,target:u}))}),Jn=v.forwardRef(function(t,n){let{"aria-current":r="page",caseSensitive:i=!1,className:l="",end:a=!1,style:s,to:u,viewTransition:d,children:m}=t,p=Cc(t,ih),g=Xi(u,{relative:p.relative}),w=zn(),y=v.useContext(vc),{navigator:k,basename:S}=v.useContext(ot),h=y!=null&&ph(g)&&d===!0,c=k.encodeLocation?k.encodeLocation(g).pathname:g.pathname,f=w.pathname,x=y&&y.navigation&&y.navigation.location?y.navigation.location.pathname:null;i||(f=f.toLowerCase(),x=x?x.toLowerCase():null,c=c.toLowerCase()),x&&S&&(x=Nn(x,S)||x);const j=c!=="/"&&c.endsWith("/")?c.length-1:c.length;let b=f===c||!a&&f.startsWith(c)&&f.charAt(j)==="/",E=x!=null&&(x===c||!a&&x.startsWith(c)&&x.charAt(c.length)==="/"),z={isActive:b,isPending:E,isTransitioning:h},M=b?r:void 0,C;typeof l=="function"?C=l(z):C=[l,b?"active":null,E?"pending":null,h?"transitioning":null].filter(Boolean).join(" ");let _=typeof s=="function"?s(z):s;return v.createElement(Ji,_i({},p,{"aria-current":M,className:C,ref:n,style:_,to:u,viewTransition:d}),typeof m=="function"?m(z):m)});var Ta;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(Ta||(Ta={}));var qs;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(qs||(qs={}));function ch(e){let t=v.useContext(qi);return t||H(!1),t}function fh(e,t){let{target:n,replace:r,state:i,preventScrollReset:l,relative:a,viewTransition:s}=t===void 0?{}:t,u=st(),d=zn(),m=Xi(e,{relative:a});return v.useCallback(p=>{if(nh(p,n)){p.preventDefault();let g=r!==void 0?r:Pi(d)===Pi(m);u(e,{replace:g,state:i,preventScrollReset:l,relative:a,viewTransition:s})}},[d,u,m,r,i,n,e,l,a,s])}function ph(e,t){t===void 0&&(t={});let n=v.useContext(ah);n==null&&H(!1);let{basename:r}=ch(Ta.useViewTransitionState),i=Xi(e,{relative:t.relative});if(!n.isTransitioning)return!1;let l=Nn(n.currentLocation.pathname,r)||n.currentLocation.pathname,a=Nn(n.nextLocation.pathname,r)||n.nextLocation.pathname;return Pa(i.pathname,a)!=null||Pa(i.pathname,l)!=null}const zi="http://localhost:8000".replace(/\/$/,""),zo="dinora_admin_token",bc="dinora_session_";function vr(){return localStorage.getItem(zo)||""}function Gs(e){e&&localStorage.setItem(zo,e)}function Ec(){localStorage.removeItem(zo)}function yr(e){return localStorage.getItem(bc+e)||""}function mh(e,t){localStorage.setItem(bc+e,t)}class Ra extends Error{constructor(t,n,r){super(t),this.status=n,this.detail=r}}async function A(e,{method:t="GET",body:n,auth:r=!1,headers:i={}}={}){const l={...i};if(n!==void 0&&(l["Content-Type"]="application/json"),r){const d=vr();d&&(l.Authorization=`Bearer ${d}`)}let a;try{a=await fetch(`${zi}${e}`,{method:t,headers:l,body:n!==void 0?JSON.stringify(n):void 0})}catch{throw new Ra(`Could not reach the server at ${zi}. Is the backend running?`,0,null)}a.status===401&&r&&Ec();let s=null;const u=await a.text();if(u)try{s=JSON.parse(u)}catch{s={detail:u}}if(!a.ok){const d=(s==null?void 0:s.detail)||a.statusText||"Request failed";throw new Ra(d,a.status,s==null?void 0:s.detail)}return s}const zl={register:(e,t,n)=>A("/api/auth/register",{method:"POST",body:{name:e,email:t,password:n}}),login:(e,t)=>A("/api/auth/login",{method:"POST",body:{email:e,password:t}}),me:()=>A("/api/auth/me",{auth:!0})},tt={getTable:e=>A(`/api/tables/${encodeURIComponent(e)}`),startSession:e=>A(`/api/tables/${encodeURIComponent(e)}/sessions`,{method:"POST"}),getSession:e=>A(`/api/sessions/${encodeURIComponent(e)}`),closeSession:e=>A(`/api/sessions/${encodeURIComponent(e)}/close`,{method:"POST"}),getMenu:()=>A("/api/menu"),placeOrder:(e,t)=>A("/api/orders",{method:"POST",body:{session_id:e,items:t.map(n=>({menu_item_id:n.menu_item_id,quantity:n.quantity}))}}),listOrdersForSession:e=>A(`/api/orders/session/${encodeURIComponent(e)}`),getOrder:e=>A(`/api/orders/${e}`),initPayment:(e,t)=>A(`/api/orders/${e}/pay/init`,{method:"POST",body:{session_id:t}}),verifyPayment:(e,t,n)=>A(`/api/orders/${e}/pay/verify`,{method:"POST",body:{session_id:t,razorpay_order_id:n.razorpay_order_id,razorpay_payment_id:n.razorpay_payment_id,razorpay_signature:n.razorpay_signature}}),getPaymentStatus:(e,t)=>A(`/api/orders/${e}/pay?session_id=${encodeURIComponent(t)}`)},Te={listOrders:()=>A("/api/orders",{auth:!0}),updateOrderStatus:(e,t)=>A(`/api/orders/${e}`,{method:"PATCH",auth:!0,body:{status:t}}),adminMarkPaid:e=>A(`/api/orders/${e}/admin-pay`,{method:"POST",auth:!0}),listTables:()=>A("/api/tables",{auth:!0}),createTable:e=>A("/api/tables",{method:"POST",auth:!0,body:{number:e}}),tableQrUrl:(e,t)=>{const n=new URLSearchParams({guest_url:t});return`${zi}/api/tables/${encodeURIComponent(e)}/qr?${n.toString()}`},fetchTableQrBlob:async(e,t)=>{const n=vr(),r=new URLSearchParams({guest_url:t}),i=await fetch(`${zi}/api/tables/${encodeURIComponent(e)}/qr?${r.toString()}`,{headers:{Authorization:`Bearer ${n}`}});if(!i.ok)throw new Ra("Could not generate QR code",i.status,null);return i.blob()},listCategories:()=>A("/api/menu/categories"),createCategory:e=>A("/api/menu/categories",{method:"POST",auth:!0,body:{name:e}}),createMenuItem:e=>A("/api/menu/items",{method:"POST",auth:!0,body:e}),updateMenuItem:(e,t)=>A(`/api/menu/items/${e}`,{method:"PATCH",auth:!0,body:t}),deleteMenuItem:e=>A(`/api/menu/items/${e}`,{method:"DELETE",auth:!0}),getCounterTotals:()=>A("/api/counter",{auth:!0})},Pc=v.createContext(null);function hh({children:e}){const[t,n]=v.useState(vr()),[r,i]=v.useState(null),[l,a]=v.useState(!0),s=v.useCallback(async()=>{if(!vr()){i(null),a(!1);return}try{const g=await zl.me();i(g)}catch{i(null),n("")}finally{a(!1)}},[]);v.useEffect(()=>{s()},[s]);const u=v.useCallback(async(g,w)=>{const y=await zl.login(g,w);return Gs(y.token),n(y.token),i(y.user),y},[]),d=v.useCallback(async(g,w,y)=>{const k=await zl.register(g,w,y);return Gs(k.token),n(k.token),i(k.user),k},[]),m=v.useCallback(()=>{Ec(),n(""),i(null)},[]),p={token:t,admin:r,isAuthenticated:!!(t&&r),loading:l,login:u,register:d,logout:m};return o.jsx(Pc.Provider,{value:p,children:e})}function Zi(){const e=v.useContext(Pc);if(!e)throw new Error("useAdminAuth must be used inside AdminAuthProvider");return e}const _c=v.createContext(null);function gh({children:e}){const[t,n]=v.useState([]),r=v.useCallback(m=>{n(p=>p.find(w=>w.menu_item_id===m.id)?p.map(w=>w.menu_item_id===m.id?{...w,quantity:w.quantity+1}:w):[...p,{menu_item_id:m.id,name:m.name,price:m.price,quantity:1}])},[]),i=v.useCallback(m=>{n(p=>p.filter(g=>g.menu_item_id!==m))},[]),l=v.useCallback((m,p)=>{n(g=>p<=0?g.filter(w=>w.menu_item_id!==m):g.map(w=>w.menu_item_id===m?{...w,quantity:p}:w))},[]),a=v.useCallback(()=>n([]),[]),s=v.useMemo(()=>t.reduce((m,p)=>m+p.price*p.quantity,0),[t]),u=v.useMemo(()=>t.reduce((m,p)=>m+p.quantity,0),[t]),d={items:t,addItem:r,removeItem:i,setQuantity:l,clearCart:a,subtotal:s,itemCount:u};return o.jsx(_c.Provider,{value:d,children:e})}function To(){const e=v.useContext(_c);if(!e)throw new Error("useCart must be used inside CartProvider");return e}const zc=v.createContext(null);let xh=0;function vh({children:e}){const[t,n]=v.useState([]),r=v.useRef({}),i=v.useCallback(s=>{n(u=>u.filter(d=>d.id!==s)),clearTimeout(r.current[s]),delete r.current[s]},[]),l=v.useCallback((s,{type:u="info",duration:d=3200}={})=>{const m=++xh;return n(p=>[...p,{id:m,message:s,type:u}]),r.current[m]=setTimeout(()=>i(m),d),m},[i]),a={show:l,success:(s,u)=>l(s,{...u,type:"success"}),error:(s,u)=>l(s,{...u,type:"error"}),info:(s,u)=>l(s,{...u,type:"info"})};return o.jsxs(zc.Provider,{value:a,children:[e,o.jsx("div",{className:"toast-stack",role:"status","aria-live":"polite",children:t.map(s=>o.jsxs("div",{className:`toast toast-${s.type}`,onClick:()=>i(s.id),children:[o.jsx("span",{className:"toast-icon",children:s.type==="success"?"✓":s.type==="error"?"!":"i"}),o.jsx("span",{className:"toast-message",children:s.message})]},s.id))})]})}function Tt(){const e=v.useContext(zc);if(!e)throw new Error("useToast must be used inside ToastProvider");return e}const Tc=v.createContext(null);function yh({children:e}){const[t,n]=v.useState(null),r=v.useCallback((l,a={})=>new Promise(s=>{n({message:l,title:a.title||"Are you sure?",danger:!!a.danger,resolve:s})}),[]);function i(l){t==null||t.resolve(l),n(null)}return o.jsxs(Tc.Provider,{value:r,children:[e,t&&o.jsx("div",{className:"sheet-backdrop",onClick:()=>i(!1),children:o.jsxs("div",{className:"confirm-sheet",onClick:l=>l.stopPropagation(),children:[o.jsx("h3",{children:t.title}),o.jsx("p",{children:t.message}),o.jsxs("div",{className:"confirm-actions",children:[o.jsx("button",{className:"btn btn-ghost",onClick:()=>i(!1),children:"Cancel"}),o.jsx("button",{className:`btn ${t.danger?"btn-danger":"btn-primary"}`,onClick:()=>i(!0),children:"Confirm"})]})]})})]})}function Ro(){const e=v.useContext(Tc);if(!e)throw new Error("useConfirm must be used inside ConfirmProvider");return e}function Ce({size:e=18}){return o.jsx("span",{className:"spinner",style:{width:e,height:e,borderWidth:Math.max(2,e/9)},"aria-hidden":"true"})}function wh({children:e}){const{isAuthenticated:t,loading:n}=Zi();return n?o.jsx("div",{className:"page-loading",children:o.jsx(Ce,{size:24})}):t?e:o.jsx(_a,{to:"/admin/login",replace:!0})}const Xs=[{to:"/admin/orders",icon:"🧾",label:"Orders"},{to:"/admin/counter",icon:"📊",label:"Counter"},{to:"/admin/tables",icon:"🪑",label:"Tables"},{to:"/admin/menu",icon:"🍴",label:"Menu"}];function kh(){const{admin:e,logout:t}=Zi(),n=Ro(),r=st();async function i(){await n("You'll need to sign in again to manage this restaurant.",{title:"Log out?"})&&(t(),r("/admin/login",{replace:!0}))}return o.jsxs("div",{className:"admin-layout",children:[o.jsxs("aside",{className:"admin-sidebar",children:[o.jsx("div",{className:"admin-brand",children:"🍽️ Dinora Admin"}),e&&o.jsx("div",{style:{fontSize:13,opacity:.7,marginTop:-16},children:e.name}),o.jsx("nav",{className:"sidebar-nav",children:Xs.map(l=>o.jsxs(Jn,{to:l.to,className:({isActive:a})=>`nav-item ${a?"active":""}`,children:[o.jsx("span",{className:"nav-item-icon",children:l.icon}),l.label]},l.to))}),o.jsx("button",{className:"btn btn-ghost sidebar-logout",onClick:i,style:{color:"#fff",borderColor:"rgba(255,255,255,0.2)"},children:"Log out"})]}),o.jsx("header",{className:"admin-topbar",children:o.jsxs("div",{className:"admin-topbar-inner",children:[o.jsx("div",{className:"admin-brand",children:"🍽️ Dinora Admin"}),o.jsxs("div",{className:"admin-topbar-user",children:[e==null?void 0:e.name,o.jsx("button",{className:"admin-logout-icon-btn",onClick:i,"aria-label":"Log out",children:"⏻"})]})]})}),o.jsx("main",{className:"admin-content",children:o.jsx(Nc,{})}),o.jsx("nav",{className:"admin-bottom-nav",children:Xs.map(l=>o.jsxs(Jn,{to:l.to,className:({isActive:a})=>`nav-item ${a?"active":""}`,children:[o.jsx("span",{className:"nav-item-icon",children:l.icon}),l.label]},l.to))})]})}function Sh(){var i;const{tableToken:e}=Cr(),{itemCount:t}=To(),[n,r]=v.useState(null);return v.useEffect(()=>{let l=!1;return tt.getTable(e).then(a=>!l&&r(a)).catch(()=>{}),()=>{l=!0}},[e]),o.jsxs("div",{className:"guest-layout",children:[o.jsx("header",{className:"guest-header",children:o.jsx("div",{className:"guest-header-inner",children:o.jsxs("div",{className:"guest-header-title",children:[o.jsx("strong",{children:((i=n==null?void 0:n.restaurant)==null?void 0:i.name)||"Dinora"}),o.jsx("span",{children:n?`Table ${n.table.number}`:"Loading table…"})]})})}),o.jsx("main",{className:"guest-content",children:o.jsx(Nc,{})}),o.jsxs("nav",{className:"guest-bottom-nav",children:[o.jsxs(Jn,{to:`/t/${e}/menu`,className:({isActive:l})=>`nav-item ${l?"active":""}`,children:[o.jsx("span",{className:"nav-item-icon",children:"🍴"}),"Menu"]}),o.jsxs(Jn,{to:`/t/${e}/cart`,className:({isActive:l})=>`nav-item ${l?"active":""}`,children:[o.jsx("span",{className:"nav-item-icon",children:"🛒"}),"Cart",t>0&&o.jsx("span",{className:"nav-badge",children:t})]}),o.jsxs(Jn,{to:`/t/${e}/orders`,className:({isActive:l})=>`nav-item ${l?"active":""}`,children:[o.jsx("span",{className:"nav-item-icon",children:"🧾"}),"Orders"]})]})]})}function me({icon:e="•",title:t,message:n,action:r}){return o.jsxs("div",{className:"empty-state",children:[o.jsx("div",{className:"empty-state-icon","aria-hidden":"true",children:e}),o.jsx("h3",{children:t}),n&&o.jsx("p",{children:n}),r]})}function jh(){const{tableToken:e}=Cr(),t=st(),[n,r]=v.useState("loading"),[i,l]=v.useState(""),a=v.useCallback(async()=>{r("loading"),l("");try{await tt.getTable(e);const s=await tt.startSession(e);mh(e,s.session_id),t(`/t/${e}/menu`,{replace:!0})}catch(s){r("error"),l(s.detail||s.message||"Could not load this table")}},[e,t]);return v.useEffect(()=>{if(yr(e)){t(`/t/${e}/menu`,{replace:!0});return}a()},[e,t,a]),n==="error"?o.jsx("div",{className:"table-landing",children:o.jsx("div",{className:"table-landing-card",children:o.jsx(me,{icon:"⚠️",title:"We couldn't find this table",message:i,action:o.jsx("button",{className:"btn btn-primary",onClick:a,children:"Try again"})})})}):o.jsx("div",{className:"table-landing",children:o.jsxs("div",{className:"table-landing-card",children:[o.jsx(Ce,{size:28}),o.jsx("p",{style:{marginTop:16,color:"var(--color-text-muted)"},children:"Finding your table…"})]})})}function Ti({open:e,onClose:t,title:n,children:r}){return v.useEffect(()=>{if(!e)return;const i=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=i}},[e]),e?o.jsx("div",{className:"sheet-backdrop",onClick:t,children:o.jsxs("div",{className:"sheet",onClick:i=>i.stopPropagation(),role:"dialog","aria-modal":"true",children:[o.jsx("div",{className:"sheet-handle"}),n&&o.jsxs("div",{className:"sheet-header",children:[o.jsx("h2",{children:n}),o.jsx("button",{className:"sheet-close",onClick:t,"aria-label":"Close",children:"✕"})]}),o.jsx("div",{className:"sheet-body",children:r})]})}):null}function Ze({className:e="",style:t}){return o.jsx("div",{className:`skeleton ${e}`,style:t})}function Tl(){return o.jsxs("div",{className:"menu-item",children:[o.jsx(Ze,{className:"skeleton-thumb"}),o.jsxs("div",{className:"menu-item-body",children:[o.jsx(Ze,{style:{width:"60%",height:16}}),o.jsx(Ze,{style:{width:"90%",height:12,marginTop:6}}),o.jsx(Ze,{style:{width:"30%",height:20,marginTop:10}})]})]})}function Ri(){return o.jsxs("div",{className:"order-card",children:[o.jsx(Ze,{style:{width:"40%",height:16}}),o.jsx(Ze,{style:{width:"100%",height:12,marginTop:12}}),o.jsx(Ze,{style:{width:"70%",height:12,marginTop:8}})]})}function Nh(){const{tableToken:e}=Cr(),t=st(),n=Tt(),{items:r,addItem:i,setQuantity:l,itemCount:a,subtotal:s}=To(),[u,d]=v.useState("loading"),[m,p]=v.useState(""),[g,w]=v.useState({categories:[]}),[y,k]=v.useState(""),[S,h]=v.useState(null),[c,f]=v.useState(null),[x,j]=v.useState(1);v.useEffect(()=>{const _=yr(e);if(!_){t(`/t/${e}`,{replace:!0});return}let R=!1;async function re(){var Rt;d("loading");try{await tt.getSession(_);const Lt=await tt.getMenu();R||(w(Lt),h(((Rt=Lt.categories[0])==null?void 0:Rt.id)??null),d("ready"))}catch(Lt){R||(d("error"),p(Lt.detail||Lt.message||"Could not load the menu"))}}return re(),()=>{R=!0}},[e,t]);const b=v.useMemo(()=>{if(!y.trim())return g.categories;const _=y.trim().toLowerCase();return g.categories.map(R=>({...R,items:R.items.filter(re=>re.name.toLowerCase().includes(_)||(re.description||"").toLowerCase().includes(_))})).filter(R=>R.items.length>0)},[g.categories,y]);function E(_){const R=r.find(re=>re.menu_item_id===_);return R?R.quantity:0}function z(_){var R;h(_),(R=document.getElementById(`cat-${_}`))==null||R.scrollIntoView({behavior:"smooth",block:"start"})}function M(_){f(_),j(Math.max(1,E(_.id)))}function C(){if(E(c.id)>0)l(c.id,x);else for(let R=0;R<x;R++)i(c);n.success(`${c.name} × ${x} in cart`),f(null)}return u==="loading"?o.jsx("div",{className:"menu-page",children:o.jsxs("div",{className:"menu-items",children:[o.jsx(Tl,{}),o.jsx(Tl,{}),o.jsx(Tl,{})]})}):u==="error"?o.jsx(me,{icon:"⚠️",title:"Something went wrong",message:m,action:o.jsx("button",{className:"btn btn-primary",onClick:()=>t(`/t/${e}`,{replace:!0}),children:"Start over"})}):o.jsxs("div",{className:"menu-page",children:[o.jsx("div",{className:"menu-search",children:o.jsx("input",{type:"search",placeholder:"Search the menu…",value:y,onChange:_=>k(_.target.value)})}),!y&&g.categories.length>1&&o.jsx("div",{className:"category-tabs",children:g.categories.map(_=>o.jsx("button",{className:`category-tab ${S===_.id?"active":""}`,onClick:()=>z(_.id),children:_.name},_.id))}),b.length===0&&o.jsx(me,{icon:"🔍",title:"No items found",message:"Try a different search term."}),b.map(_=>o.jsxs("section",{id:`cat-${_.id}`,className:"menu-category",children:[o.jsx("h2",{children:_.name}),o.jsx("div",{className:"menu-items",children:_.items.map(R=>{const re=E(R.id);return o.jsxs("button",{className:`menu-item ${R.available?"":"unavailable"}`,onClick:()=>R.available&&M(R),disabled:!R.available,children:[R.image_url?o.jsx("img",{className:"menu-item-thumb",src:R.image_url,alt:""}):o.jsx("div",{className:"menu-item-thumb-placeholder",children:"🍽️"}),o.jsxs("div",{className:"menu-item-body",children:[o.jsx("h3",{children:R.name}),R.description&&o.jsx("p",{children:R.description}),o.jsxs("div",{className:"menu-item-footer",children:[o.jsxs("span",{className:"price",children:["₹",R.price.toFixed(2)]}),R.available?re>0?o.jsxs("div",{className:"qty-stepper",onClick:Rt=>Rt.stopPropagation(),role:"group",children:[o.jsx("button",{onClick:()=>l(R.id,re-1),"aria-label":"Decrease",children:"−"}),o.jsx("span",{children:re}),o.jsx("button",{onClick:()=>l(R.id,re+1),"aria-label":"Increase",children:"+"})]}):o.jsx("span",{className:"add-btn",children:"Add"}):o.jsx("span",{className:"unavailable-label",children:"Unavailable"})]})]})]},R.id)})})]},_.id)),a>0&&o.jsxs(Ji,{to:`/t/${e}/cart`,className:"cart-fab",children:[o.jsxs("span",{children:[o.jsx("span",{className:"cart-fab-count",children:a}),"View cart"]}),o.jsxs("span",{children:["₹",s.toFixed(2)]})]}),o.jsx(Ti,{open:!!c,onClose:()=>f(null),title:c==null?void 0:c.name,children:c&&o.jsxs(o.Fragment,{children:[c.image_url?o.jsx("img",{className:"item-detail-thumb",src:c.image_url,alt:""}):o.jsx("div",{className:"item-detail-thumb-placeholder",children:"🍽️"}),o.jsxs("div",{className:"item-detail-price",children:["₹",c.price.toFixed(2)]}),c.description&&o.jsx("p",{className:"item-detail-desc",children:c.description}),o.jsxs("div",{className:"item-detail-footer",children:[o.jsxs("div",{className:"qty-stepper",children:[o.jsx("button",{onClick:()=>j(_=>Math.max(1,_-1)),"aria-label":"Decrease",children:"−"}),o.jsx("span",{children:x}),o.jsx("button",{onClick:()=>j(_=>_+1),"aria-label":"Increase",children:"+"})]}),o.jsxs("button",{className:"btn btn-primary",onClick:C,children:["Add · ₹",(c.price*x).toFixed(2)]})]})]})})]})}function Ch(){const{tableToken:e}=Cr(),t=st(),n=Tt(),r=Ro(),{items:i,setQuantity:l,removeItem:a,subtotal:s,clearCart:u}=To(),[d,m]=v.useState(!1);async function p(w){await r(`Remove ${w.name} from your cart?`,{title:"Remove item"})&&a(w.menu_item_id)}async function g(){const w=yr(e);if(!w){t(`/t/${e}`,{replace:!0});return}if(i.length!==0){m(!0);try{await tt.placeOrder(w,i),u(),n.success("Order placed!"),t(`/t/${e}/orders`,{replace:!0})}catch(y){n.error(y.detail||y.message||"Could not place your order")}finally{m(!1)}}}return i.length===0?o.jsx(me,{icon:"🛒",title:"Your cart is empty",message:"Add something tasty from the menu to get started.",action:o.jsx("button",{className:"btn btn-primary",onClick:()=>t(`/t/${e}/menu`),children:"Browse menu"})}):o.jsxs("div",{className:"cart-page",children:[o.jsx("h1",{style:{fontSize:20,marginBottom:16},children:"Your order"}),o.jsx("div",{className:"cart-items",children:i.map(w=>o.jsxs("div",{className:"cart-item",children:[o.jsxs("div",{className:"cart-item-info",children:[o.jsx("span",{className:"cart-item-name",children:w.name}),o.jsxs("span",{className:"cart-item-price",children:["₹",w.price.toFixed(2)," each"]})]}),o.jsxs("div",{className:"qty-stepper",children:[o.jsx("button",{onClick:()=>l(w.menu_item_id,w.quantity-1),"aria-label":"Decrease",children:"−"}),o.jsx("span",{children:w.quantity}),o.jsx("button",{onClick:()=>l(w.menu_item_id,w.quantity+1),"aria-label":"Increase",children:"+"})]}),o.jsx("button",{className:"cart-item-remove",onClick:()=>p(w),"aria-label":"Remove",children:"✕"})]},w.menu_item_id))}),o.jsxs("div",{className:"card summary-card",children:[o.jsxs("div",{className:"summary-row",children:[o.jsx("span",{children:"Items"}),o.jsx("span",{children:i.reduce((w,y)=>w+y.quantity,0)})]}),o.jsxs("div",{className:"summary-row total",children:[o.jsx("span",{children:"Subtotal"}),o.jsxs("span",{children:["₹",s.toFixed(2)]})]})]}),o.jsx("p",{className:"cart-note",children:"Final total is confirmed by the kitchen when your order is placed."}),o.jsxs("div",{className:"cart-actions",children:[o.jsx("button",{className:"btn btn-primary btn-block",onClick:g,disabled:d,children:d?o.jsx(Ce,{size:16}):`Place order · ₹${s.toFixed(2)}`}),o.jsx("button",{className:"btn btn-ghost btn-block",onClick:()=>t(`/t/${e}/menu`),disabled:d,children:"Add more items"})]})]})}const bh="http://localhost:8000".replace(/\/$/,"");function Rc(){return bh.replace(/^http/,"ws")}function Eh(e,t,n){return Lc(`${Rc()}/ws/table?session_id=${encodeURIComponent(e)}`,t,n)}function Ph(e,t){const n=vr();return n?Lc(`${Rc()}/ws/counter?token=${encodeURIComponent(n)}`,e,t):(t==null||t("no-token"),()=>{})}function Lc(e,t,n){let r=null,i=!1,l=null,a=0;function s(){r=new WebSocket(e),r.onopen=()=>{a=0,n==null||n("connected")},r.onmessage=u=>{try{const d=JSON.parse(u.data);t==null||t(d)}catch{}},r.onclose=u=>{if(i)return;if(n==null||n("disconnected"),u.code===1008){n==null||n("rejected");return}a+=1;const d=Math.min(1e3*2**a,15e3);l=setTimeout(s,d)},r.onerror=()=>{}}return s(),()=>{i=!0,l&&clearTimeout(l),r==null||r.close()}}const _h="https://checkout.razorpay.com/v1/checkout.js";let Qr=null;function zh(){return window.Razorpay?Promise.resolve():Qr||(Qr=new Promise((e,t)=>{const n=document.createElement("script");n.src=_h,n.onload=()=>e(),n.onerror=()=>t(new Error("Could not load the payment provider. Check your connection.")),document.body.appendChild(n)}),Qr)}async function Th(e,t={}){return await zh(),new Promise((n,r)=>{const i=new window.Razorpay({key:e.razorpay_key_id,order_id:e.razorpay_order_id,amount:e.amount_subunits,currency:e.currency,name:t.name||"Dinora",description:t.description||"Order payment",prefill:{email:t.prefillEmail||"",contact:t.prefillContact||""},theme:{color:"#d4622a"},handler:l=>{n(l)},modal:{ondismiss:()=>{r(new Error("Payment cancelled"))}}});i.on("payment.failed",l=>{var a;r(new Error(((a=l==null?void 0:l.error)==null?void 0:a.description)||"Payment failed"))}),i.open()})}const Rh={connected:"Live",disconnected:"Reconnecting…",rejected:"Connection rejected","no-token":"Not signed in"};function Oc({status:e}){return o.jsx("span",{className:`connection-status connection-${e||"disconnected"}`,children:Rh[e]||"Connecting…"})}const Rl=["pending","preparing","ready","served","paid"],Lh={pending:"Order placed",preparing:"Preparing",ready:"Ready",served:"Served",paid:"Paid"};function Oh({status:e}){if(e==="cancelled")return o.jsxs("div",{className:"progress-cancelled",children:[o.jsx("span",{className:"progress-cancelled-dot"})," Cancelled"]});const t=Rl.indexOf(e==="completed"?"paid":e);return o.jsx("div",{className:"order-progress",role:"list",children:Rl.map((n,r)=>{const i=r<t?"done":r===t?"active":"upcoming";return o.jsxs("div",{className:`progress-step progress-${i}`,role:"listitem",children:[o.jsx("span",{className:"progress-dot",children:i==="done"?"✓":""}),o.jsx("span",{className:"progress-label",children:Lh[n]}),r<Rl.length-1&&o.jsx("span",{className:"progress-line"})]},n)})})}const Dh=new Set(["served"]);function Ll(e){return`₹${e.toFixed(2)}`}function Ih(){const{tableToken:e}=Cr(),t=st(),n=Tt(),[r,i]=v.useState("loading"),[l,a]=v.useState(""),[s,u]=v.useState([]),[d,m]=v.useState("connecting"),[p,g]=v.useState(null);v.useEffect(()=>{const y=yr(e);if(!y){t(`/t/${e}`,{replace:!0});return}let k=!1;async function S(){try{const c=await tt.listOrdersForSession(y);k||(u(c),i("ready"))}catch(c){k||(i("error"),a(c.detail||c.message||"Could not load your orders"))}}S();const h=Eh(y,c=>{(c.type==="order_created"||c.type==="order_updated")&&u(f=>{const x=f.findIndex(b=>b.id===c.order.id);if(x===-1)return[c.order,...f];const j=[...f];return j[x]=c.order,j})},m);return()=>{k=!0,h()}},[e,t]);async function w(y){const k=yr(e);g(y.id);try{const S=await tt.initPayment(y.id,k),h=await Th(S,{name:"Dinora",description:`Order #${y.id}`});await tt.verifyPayment(y.id,k,h),u(c=>c.map(f=>f.id===y.id?{...f,status:"paid"}:f)),n.success("Payment successful")}catch(S){S.message!=="Payment cancelled"&&n.error(S.detail||S.message||"Payment could not be completed")}finally{g(null)}}return r==="loading"?o.jsx("div",{className:"orders-page",children:o.jsxs("div",{className:"order-list",children:[o.jsx(Ri,{}),o.jsx(Ri,{})]})}):r==="error"?o.jsx(me,{icon:"⚠️",title:"Something went wrong",message:l}):o.jsxs("div",{className:"orders-page",children:[o.jsxs("header",{className:"orders-header",children:[o.jsx("h1",{style:{fontSize:20},children:"Your orders"}),o.jsx(Oc,{status:d})]}),s.length===0?o.jsx(me,{icon:"🧾",title:"No orders yet",message:"Once you place an order it will show up here with live status updates.",action:o.jsx("button",{className:"btn btn-primary",onClick:()=>t(`/t/${e}/menu`),children:"Browse menu"})}):o.jsx("div",{className:"order-list",children:s.map(y=>o.jsxs("div",{className:"card order-card",children:[o.jsx("div",{className:"order-card-header",children:o.jsxs("strong",{children:["Order #",y.id]})}),o.jsx(Oh,{status:y.status}),o.jsx("ul",{className:"order-card-items",children:y.items.map(k=>o.jsxs("li",{children:[o.jsxs("span",{children:[k.quantity,"× ",k.name]}),o.jsx("b",{children:Ll(k.line_total)})]},k.id))}),o.jsxs("div",{className:"order-card-total",children:[o.jsx("span",{children:"Total"}),o.jsx("span",{children:Ll(y.total_amount)})]}),Dh.has(y.status)&&o.jsx("button",{className:"btn btn-primary pay-btn",disabled:p===y.id,onClick:()=>w(y),children:p===y.id?o.jsx(Ce,{size:16}):`Pay ${Ll(y.total_amount)}`}),(y.status==="paid"||y.status==="completed")&&o.jsx("p",{className:"paid-note",children:"✓ Paid"})]},y.id))}),s.length>0&&o.jsx("button",{className:"btn btn-ghost btn-block",style:{marginTop:16},onClick:()=>t(`/t/${e}/menu`),children:"Order more"})]})}function Mh(){const{login:e}=Zi(),t=Tt(),n=st(),[r,i]=v.useState(""),[l,a]=v.useState(""),[s,u]=v.useState(""),[d,m]=v.useState(!1);async function p(g){g.preventDefault(),u(""),m(!0);try{await e(r,l),t.success("Welcome back"),n("/admin/orders",{replace:!0})}catch(w){u(w.detail||w.message||"Login failed")}finally{m(!1)}}return o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .dinora-auth-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 20px;
          background:
            radial-gradient(circle at 15% 15%, rgba(191, 105, 48, 0.07), transparent 28%),
            radial-gradient(circle at 85% 85%, rgba(32, 57, 42, 0.07), transparent 28%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #1d241f;
          position: relative;
          overflow: hidden;
        }

        .dinora-auth-page::before,
        .dinora-auth-page::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(2px);
        }

        .dinora-auth-page::before {
          width: 380px;
          height: 380px;
          top: -180px;
          left: -180px;
          background: rgba(190, 108, 54, 0.05);
        }

        .dinora-auth-page::after {
          width: 420px;
          height: 420px;
          bottom: -220px;
          right: -200px;
          background: rgba(47, 78, 57, 0.05);
        }

        .dinora-auth-shell {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 2;
        }

        .dinora-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }

        .dinora-brand-mark {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          margin-bottom: 13px;
          background: #26392d;
          color: #f7f3eb;
          box-shadow:
            0 12px 30px rgba(38, 57, 45, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transform: rotate(-3deg);
        }

        .dinora-brand-mark span {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          line-height: 1;
          font-weight: 700;
          transform: rotate(3deg);
        }

        .dinora-brand-name {
          font-family: "Playfair Display", serif;
          font-size: 29px;
          font-weight: 700;
          letter-spacing: -0.8px;
          color: #243229;
        }

        .dinora-brand-tagline {
          margin-top: 4px;
          font-size: 12px;
          color: #7d837e;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .dinora-auth-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(40, 54, 44, 0.08);
          border-radius: 28px;
          padding: 38px;
          box-shadow:
            0 30px 70px rgba(35, 41, 37, 0.08),
            0 4px 16px rgba(35, 41, 37, 0.04);
        }

        .dinora-auth-heading {
          margin: 0;
          text-align: center;
          font-family: "Playfair Display", serif;
          font-size: 31px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.6px;
          color: #202a24;
        }

        .dinora-auth-subtitle {
          margin: 10px 0 30px;
          text-align: center;
          color: #7a817c;
          font-size: 14px;
          line-height: 1.5;
        }

        .dinora-auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .dinora-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dinora-field label {
          font-size: 12px;
          line-height: 1;
          font-weight: 700;
          color: #465149;
          letter-spacing: 0.02em;
        }

        .dinora-input {
          width: 100%;
          height: 52px;
          border: 1px solid #dfe3de;
          border-radius: 14px;
          background: #fbfbf9;
          padding: 0 15px;
          outline: none;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #202923;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .dinora-input::placeholder {
          color: #a7ada8;
        }

        .dinora-input:hover {
          border-color: #cfd5cf;
          background: #fff;
        }

        .dinora-input:focus {
          border-color: #536a5b;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(83, 106, 91, 0.10);
        }

        .dinora-form-error {
          margin: -4px 0 -4px;
          padding: 11px 13px;
          border-radius: 11px;
          border: 1px solid #ecd7d2;
          background: #fff5f3;
          color: #a04d42;
          font-size: 12px;
          line-height: 1.45;
        }

        .dinora-submit {
          width: 100%;
          height: 52px;
          margin-top: 2px;
          border: 0;
          border-radius: 14px;
          background: #26392d;
          color: #fffdf8;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 10px 22px rgba(38, 57, 45, 0.16);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .dinora-submit:hover:not(:disabled) {
          background: #31493a;
          transform: translateY(-1px);
          box-shadow: 0 14px 26px rgba(38, 57, 45, 0.20);
        }

        .dinora-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .dinora-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .dinora-auth-footer {
          margin: 24px 0 0;
          text-align: center;
          font-size: 13px;
          color: #7c827d;
        }

        .dinora-auth-footer a {
          color: #334b3c;
          font-weight: 700;
          text-decoration: none;
          margin-left: 3px;
        }

        .dinora-auth-footer a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .dinora-demo {
          margin-top: 16px;
          padding: 12px 14px;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.62);
          border: 1px solid rgba(43, 53, 46, 0.07);
          text-align: center;
          font-size: 11px;
          line-height: 1.55;
          color: #8b918d;
        }

        .dinora-demo strong {
          color: #646d66;
          font-weight: 700;
        }

        @media (max-width: 520px) {
          .dinora-auth-page {
            padding: 22px 14px;
          }

          .dinora-auth-card {
            padding: 28px 22px;
            border-radius: 22px;
          }

          .dinora-auth-heading {
            font-size: 27px;
          }

          .dinora-brand {
            margin-bottom: 22px;
          }
        }
      `}),o.jsx("div",{className:"dinora-auth-page",children:o.jsxs("div",{className:"dinora-auth-shell",children:[o.jsxs("div",{className:"dinora-brand",children:[o.jsx("div",{className:"dinora-brand-mark","aria-hidden":"true",children:o.jsx("span",{children:"D"})}),o.jsx("div",{className:"dinora-brand-name",children:"Dinora"}),o.jsx("div",{className:"dinora-brand-tagline",children:"Restaurant Management"})]}),o.jsxs("div",{className:"dinora-auth-card",children:[o.jsx("h1",{className:"dinora-auth-heading",children:"Welcome back"}),o.jsx("p",{className:"dinora-auth-subtitle",children:"Sign in to continue managing your restaurant."}),o.jsxs("form",{onSubmit:p,className:"dinora-auth-form",children:[o.jsxs("div",{className:"dinora-field",children:[o.jsx("label",{htmlFor:"email",children:"Email address"}),o.jsx("input",{id:"email",type:"email",autoComplete:"email",placeholder:"you@example.com",value:r,onChange:g=>i(g.target.value),className:"dinora-input",required:!0})]}),o.jsxs("div",{className:"dinora-field",children:[o.jsx("label",{htmlFor:"password",children:"Password"}),o.jsx("input",{id:"password",type:"password",autoComplete:"current-password",placeholder:"Enter your password",value:l,onChange:g=>a(g.target.value),className:"dinora-input",required:!0})]}),s&&o.jsx("p",{className:"dinora-form-error",children:s}),o.jsx("button",{type:"submit",className:"dinora-submit",disabled:d,children:d?o.jsx(Ce,{size:16}):"Sign in"})]}),o.jsxs("p",{className:"dinora-auth-footer",children:["No account?",o.jsx(Ji,{to:"/admin/register",children:"Create one"})]})]}),o.jsxs("div",{className:"dinora-demo",children:[o.jsx("strong",{children:"Demo access"}),o.jsx("br",{}),"admin@dinora.demo / dinora-demo-admin-123"]})]})})]})}function Fh(){const{register:e}=Zi(),t=Tt(),n=st(),[r,i]=v.useState(""),[l,a]=v.useState(""),[s,u]=v.useState(""),[d,m]=v.useState(""),[p,g]=v.useState(!1);async function w(y){y.preventDefault(),m(""),g(!0);try{await e(r,l,s),t.success("Account created"),n("/admin/orders",{replace:!0})}catch(k){m(k.detail||k.message||"Registration failed")}finally{g(!1)}}return o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .dinora-auth-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 20px;
          background:
            radial-gradient(circle at 15% 15%, rgba(191, 105, 48, 0.07), transparent 28%),
            radial-gradient(circle at 85% 85%, rgba(32, 57, 42, 0.07), transparent 28%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #1d241f;
          position: relative;
          overflow: hidden;
        }

        .dinora-auth-page::before,
        .dinora-auth-page::after {
          content: "";
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(2px);
        }

        .dinora-auth-page::before {
          width: 380px;
          height: 380px;
          top: -180px;
          left: -180px;
          background: rgba(190, 108, 54, 0.05);
        }

        .dinora-auth-page::after {
          width: 420px;
          height: 420px;
          bottom: -220px;
          right: -200px;
          background: rgba(47, 78, 57, 0.05);
        }

        .dinora-auth-shell {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 2;
        }

        .dinora-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }

        .dinora-brand-mark {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          margin-bottom: 13px;
          background: #26392d;
          color: #f7f3eb;
          box-shadow:
            0 12px 30px rgba(38, 57, 45, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transform: rotate(-3deg);
        }

        .dinora-brand-mark span {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          line-height: 1;
          font-weight: 700;
          transform: rotate(3deg);
        }

        .dinora-brand-name {
          font-family: "Playfair Display", serif;
          font-size: 29px;
          font-weight: 700;
          letter-spacing: -0.8px;
          color: #243229;
        }

        .dinora-brand-tagline {
          margin-top: 4px;
          font-size: 12px;
          color: #7d837e;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .dinora-auth-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(40, 54, 44, 0.08);
          border-radius: 28px;
          padding: 38px;
          box-shadow:
            0 30px 70px rgba(35, 41, 37, 0.08),
            0 4px 16px rgba(35, 41, 37, 0.04);
        }

        .dinora-auth-heading {
          margin: 0;
          text-align: center;
          font-family: "Playfair Display", serif;
          font-size: 31px;
          line-height: 1.15;
          font-weight: 700;
          letter-spacing: -0.6px;
          color: #202a24;
        }

        .dinora-auth-subtitle {
          margin: 10px 0 30px;
          text-align: center;
          color: #7a817c;
          font-size: 14px;
          line-height: 1.5;
        }

        .dinora-auth-form {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .dinora-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dinora-field label {
          font-size: 12px;
          line-height: 1;
          font-weight: 700;
          color: #465149;
          letter-spacing: 0.02em;
        }

        .dinora-input {
          width: 100%;
          height: 52px;
          border: 1px solid #dfe3de;
          border-radius: 14px;
          background: #fbfbf9;
          padding: 0 15px;
          outline: none;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #202923;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .dinora-input::placeholder {
          color: #a7ada8;
        }

        .dinora-input:hover {
          border-color: #cfd5cf;
          background: #fff;
        }

        .dinora-input:focus {
          border-color: #536a5b;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(83, 106, 91, 0.10);
        }

        .dinora-field small {
          margin-top: -1px;
          font-size: 11px;
          color: #969d97;
        }

        .dinora-form-error {
          margin: -3px 0 -3px;
          padding: 11px 13px;
          border-radius: 11px;
          border: 1px solid #ecd7d2;
          background: #fff5f3;
          color: #a04d42;
          font-size: 12px;
          line-height: 1.45;
        }

        .dinora-submit {
          width: 100%;
          height: 52px;
          margin-top: 3px;
          border: 0;
          border-radius: 14px;
          background: #26392d;
          color: #fffdf8;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          box-shadow: 0 10px 22px rgba(38, 57, 45, 0.16);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .dinora-submit:hover:not(:disabled) {
          background: #31493a;
          transform: translateY(-1px);
          box-shadow: 0 14px 26px rgba(38, 57, 45, 0.20);
        }

        .dinora-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .dinora-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .dinora-auth-footer {
          margin: 24px 0 0;
          text-align: center;
          font-size: 13px;
          color: #7c827d;
        }

        .dinora-auth-footer a {
          color: #334b3c;
          font-weight: 700;
          text-decoration: none;
          margin-left: 3px;
        }

        .dinora-auth-footer a:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        @media (max-width: 520px) {
          .dinora-auth-page {
            padding: 22px 14px;
          }

          .dinora-auth-card {
            padding: 28px 22px;
            border-radius: 22px;
          }

          .dinora-auth-heading {
            font-size: 27px;
          }

          .dinora-brand {
            margin-bottom: 22px;
          }
        }
      `}),o.jsx("div",{className:"dinora-auth-page",children:o.jsxs("div",{className:"dinora-auth-shell",children:[o.jsxs("div",{className:"dinora-brand",children:[o.jsx("div",{className:"dinora-brand-mark","aria-hidden":"true",children:o.jsx("span",{children:"D"})}),o.jsx("div",{className:"dinora-brand-name",children:"Dinora"}),o.jsx("div",{className:"dinora-brand-tagline",children:"Restaurant Management"})]}),o.jsxs("div",{className:"dinora-auth-card",children:[o.jsx("h1",{className:"dinora-auth-heading",children:"Create your account"}),o.jsx("p",{className:"dinora-auth-subtitle",children:"Set up secure access to your restaurant dashboard."}),o.jsxs("form",{onSubmit:w,className:"dinora-auth-form",children:[o.jsxs("div",{className:"dinora-field",children:[o.jsx("label",{htmlFor:"name",children:"Full name"}),o.jsx("input",{id:"name",value:r,onChange:y=>i(y.target.value),placeholder:"Enter your name",autoComplete:"name",className:"dinora-input",required:!0})]}),o.jsxs("div",{className:"dinora-field",children:[o.jsx("label",{htmlFor:"email",children:"Email address"}),o.jsx("input",{id:"email",type:"email",autoComplete:"email",placeholder:"you@example.com",value:l,onChange:y=>a(y.target.value),className:"dinora-input",required:!0})]}),o.jsxs("div",{className:"dinora-field",children:[o.jsx("label",{htmlFor:"password",children:"Password"}),o.jsx("input",{id:"password",type:"password",autoComplete:"new-password",placeholder:"Create a password",value:s,onChange:y=>u(y.target.value),minLength:8,className:"dinora-input",required:!0}),o.jsx("small",{children:"Use at least 8 characters."})]}),d&&o.jsx("p",{className:"dinora-form-error",children:d}),o.jsx("button",{type:"submit",className:"dinora-submit",disabled:p,children:p?o.jsx(Ce,{size:16}):"Create admin account"})]}),o.jsxs("p",{className:"dinora-auth-footer",children:["Already have an account?",o.jsx(Ji,{to:"/admin/login",children:"Sign in"})]})]})]})})]})}const $h={pending:"Pending",preparing:"Preparing",ready:"Ready",served:"Served",paid:"Paid",completed:"Completed",cancelled:"Cancelled"};function Js({status:e}){return o.jsx("span",{className:`status-badge status-${e}`,children:$h[e]||e})}const Xt=["pending","preparing","ready","served","completed","cancelled"],Uh=["all","pending","preparing","ready","served","paid","completed","cancelled"];function Ah(){const e=Tt(),[t,n]=v.useState("loading"),[r,i]=v.useState(""),[l,a]=v.useState([]),[s,u]=v.useState("connecting"),[d,m]=v.useState(null),[p,g]=v.useState(null),[w,y]=v.useState("all");v.useEffect(()=>{let f=!1;async function x(){try{const b=await Te.listOrders();f||(a(b),n("ready"))}catch(b){f||(n("error"),i(b.detail||b.message||"Could not load orders"))}}x();const j=Ph(b=>{(b.type==="order_created"||b.type==="order_updated")&&a(E=>{const z=E.findIndex(C=>C.id===b.order.id);if(z===-1)return e.info(`New order #${b.order.id} — table ${b.order.table_number??"?"}`),[b.order,...E];const M=[...E];return M[z]=b.order,M})},u);return()=>{f=!0,j()}},[]);const k=v.useMemo(()=>w==="all"?l:l.filter(f=>f.status===w),[l,w]);async function S(f,x){m(f);try{const j=await Te.updateOrderStatus(f,x);a(b=>b.map(E=>E.id===j.id?j:E)),e.success(`Order #${f} → ${x}`)}catch(j){e.error(j.detail||j.message||"Could not update order status")}finally{m(null)}}async function h(f){g(f.id);try{await Te.adminMarkPaid(f.id),a(x=>x.map(j=>j.id===f.id?{...j,status:"paid"}:j)),e.success(`Order #${f.id} marked paid`)}catch(x){e.error(x.detail||x.message||"Could not record payment")}finally{g(null)}}if(t==="loading")return o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-orders-page {
            min-height: 100%;
            padding: 28px;
            background: #f6f3ed;
            font-family: "DM Sans", sans-serif;
            color: #202923;
          }

          .dinora-orders-loading {
            max-width: 1200px;
            margin: 0 auto;
          }

          .dinora-loading-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
          }

          .dinora-loading-title {
            width: 140px;
            height: 30px;
            border-radius: 10px;
            background: #e7e5df;
            animation: dinoraPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-status {
            width: 110px;
            height: 28px;
            border-radius: 999px;
            background: #e7e5df;
            animation: dinoraPulse 1.5s infinite ease-in-out;
          }

          .dinora-loading-filters {
            display: flex;
            gap: 8px;
            margin-bottom: 22px;
          }

          .dinora-loading-filter {
            width: 72px;
            height: 36px;
            border-radius: 999px;
            background: #e7e5df;
            animation: dinoraPulse 1.5s infinite ease-in-out;
          }

          @keyframes dinoraPulse {
            0%, 100% { opacity: .55; }
            50% { opacity: 1; }
          }
        `}),o.jsx("div",{className:"dinora-orders-page",children:o.jsxs("div",{className:"dinora-orders-loading",children:[o.jsxs("div",{className:"dinora-loading-header",children:[o.jsx("div",{className:"dinora-loading-title"}),o.jsx("div",{className:"dinora-loading-status"})]}),o.jsxs("div",{className:"dinora-loading-filters",children:[o.jsx("div",{className:"dinora-loading-filter"}),o.jsx("div",{className:"dinora-loading-filter"}),o.jsx("div",{className:"dinora-loading-filter"}),o.jsx("div",{className:"dinora-loading-filter"})]}),o.jsx(Ri,{}),o.jsx(Ri,{})]})})]});if(t==="error")return o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
          .dinora-error-page {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
          }

          .dinora-error-card {
            width: 100%;
            max-width: 500px;
            padding: 36px;
            border-radius: 24px;
            background: rgba(255,255,255,.9);
            border: 1px solid rgba(36,50,41,.08);
            box-shadow: 0 24px 60px rgba(35,41,37,.07);
            text-align: center;
          }
        `}),o.jsx("div",{className:"dinora-error-page",children:o.jsx("div",{className:"dinora-error-card",children:o.jsx(me,{icon:"⚠️",title:"Something went wrong",message:r})})})]});const c=f=>f==="all"?l.length:l.filter(x=>x.status===f).length;return o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .dinora-orders-page {
          min-height: 100%;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 25%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #202923;
        }

        .dinora-orders-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dinora-page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 26px;
        }

        .dinora-header-copy {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-eyebrow {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: #8b918c;
        }

        .dinora-page-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -.7px;
          color: #26372d;
        }

        .dinora-page-subtitle {
          margin: 2px 0 0;
          color: #858b86;
          font-size: 13px;
        }

        .dinora-live-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 5px 18px rgba(35,41,37,.04);
        }

        .dinora-filter-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          padding: 7px;
          overflow-x: auto;
          scrollbar-width: none;
          background: rgba(255,255,255,.64);
          border: 1px solid rgba(38,57,45,.07);
          border-radius: 17px;
          box-shadow: 0 8px 25px rgba(35,41,37,.04);
        }

        .dinora-filter-bar::-webkit-scrollbar {
          display: none;
        }

        .dinora-filter {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          height: 38px;
          padding: 0 13px;
          border: 0;
          border-radius: 11px;
          background: transparent;
          color: #777f79;
          font: 600 12px "DM Sans", sans-serif;
          cursor: pointer;
          text-transform: capitalize;
          transition: .2s ease;
        }

        .dinora-filter:hover {
          color: #32463a;
          background: rgba(38,57,45,.05);
        }

        .dinora-filter.active {
          background: #26392d;
          color: #fff;
          box-shadow: 0 6px 14px rgba(38,57,45,.15);
        }

        .dinora-filter-count {
          min-width: 20px;
          height: 20px;
          padding: 0 5px;
          display: inline-grid;
          place-items: center;
          border-radius: 999px;
          background: rgba(0,0,0,.06);
          font-size: 10px;
          font-weight: 700;
        }

        .dinora-filter.active .dinora-filter-count {
          background: rgba(255,255,255,.14);
        }

        .dinora-empty {
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 15px 40px rgba(35,41,37,.05);
        }

        .dinora-mobile-orders {
          display: grid;
          gap: 14px;
        }

        .dinora-order-card {
          padding: 19px;
          border-radius: 20px;
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 12px 35px rgba(35,41,37,.06),
            0 2px 8px rgba(35,41,37,.03);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .dinora-order-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 40px rgba(35,41,37,.08),
            0 3px 10px rgba(35,41,37,.04);
        }

        .dinora-order-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eceae4;
        }

        .dinora-order-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-order-number {
          font-size: 15px;
          font-weight: 700;
          color: #27372e;
        }

        .dinora-order-table {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #8b918c;
          font-weight: 500;
        }

        .dinora-table-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #b8bdb8;
        }

        .dinora-order-items {
          display: grid;
          gap: 9px;
          padding: 16px 0;
        }

        .dinora-order-item {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          font-size: 13px;
          color: #6b746d;
        }

        .dinora-order-item-main {
          min-width: 0;
          display: flex;
          gap: 7px;
        }

        .dinora-item-quantity {
          color: #a16a44;
          font-weight: 700;
          flex: 0 0 auto;
        }

        .dinora-item-name {
          color: #39443d;
          font-weight: 600;
        }

        .dinora-order-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 13px;
          border-top: 1px solid #eceae4;
        }

        .dinora-total-label {
          font-size: 11px;
          font-weight: 700;
          color: #939993;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .dinora-order-total {
          font-family: "Playfair Display", serif;
          font-size: 23px;
          font-weight: 700;
          color: #26392d;
        }

        .dinora-actions {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 9px;
          margin-top: 15px;
        }

        .dinora-select {
          width: 100%;
          min-height: 42px;
          padding: 0 34px 0 12px;
          border: 1px solid #dfe2dc;
          border-radius: 11px;
          background: #fafaf8;
          color: #475149;
          font: 600 12px "DM Sans", sans-serif;
          outline: none;
          cursor: pointer;
        }

        .dinora-select:focus {
          border-color: #617466;
          box-shadow: 0 0 0 4px rgba(97,116,102,.09);
        }

        .dinora-payment-button {
          min-height: 42px;
          padding: 0 14px;
          border: 0;
          border-radius: 11px;
          background: #eeeae0;
          color: #3a493f;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .2s ease;
        }

        .dinora-payment-button:hover:not(:disabled) {
          background: #e2ddd1;
          transform: translateY(-1px);
        }

        .dinora-payment-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .dinora-table-wrap {
          overflow: auto;
          border-radius: 22px;
          background: rgba(255,255,255,.9);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 16px 45px rgba(35,41,37,.06),
            0 2px 8px rgba(35,41,37,.03);
        }

        .dinora-orders-table {
          width: 100%;
          min-width: 920px;
          border-collapse: collapse;
        }

        .dinora-orders-table th {
          padding: 15px 18px;
          text-align: left;
          background: #faf9f6;
          border-bottom: 1px solid #eae8e1;
          color: #90968f;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .09em;
          font-weight: 700;
        }

        .dinora-orders-table td {
          padding: 17px 18px;
          border-bottom: 1px solid #efede8;
          color: #4a554d;
          font-size: 13px;
          vertical-align: top;
        }

        .dinora-orders-table tbody tr {
          transition: background .18s ease;
        }

        .dinora-orders-table tbody tr:hover {
          background: #fcfbf8;
        }

        .dinora-orders-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .dinora-table-order-id {
          font-weight: 700;
          color: #293930;
        }

        .dinora-table-cell-muted {
          color: #8d948e;
        }

        .dinora-table-items {
          display: grid;
          gap: 6px;
          min-width: 190px;
          color: #59635c;
          line-height: 1.4;
        }

        .dinora-table-total {
          white-space: nowrap;
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          color: #293a30;
        }

        .dinora-table-select {
          min-width: 145px;
        }

        .dinora-paid-note {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #55725e;
          font-size: 12px;
          font-weight: 700;
        }

        .dinora-paid-check {
          width: 21px;
          height: 21px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #edf4ed;
          font-size: 11px;
        }

        @media (min-width: 901px) {
          .dinora-mobile-orders {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .dinora-table-wrap {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .dinora-orders-page {
            padding: 18px 14px 24px;
          }

          .dinora-page-header {
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 20px;
          }

          .dinora-page-title {
            font-size: 29px;
          }

          .dinora-live-status {
            width: 100%;
            justify-content: center;
          }

          .dinora-filter-bar {
            margin-bottom: 16px;
          }

          .dinora-order-card {
            padding: 16px;
            border-radius: 18px;
          }

          .dinora-actions {
            grid-template-columns: 1fr;
          }
        }
      `}),o.jsx("div",{className:"dinora-orders-page",children:o.jsxs("div",{className:"dinora-orders-container",children:[o.jsxs("header",{className:"dinora-page-header",children:[o.jsxs("div",{className:"dinora-header-copy",children:[o.jsx("p",{className:"dinora-eyebrow",children:"Restaurant operations"}),o.jsx("h1",{className:"dinora-page-title",children:"Orders"}),o.jsx("p",{className:"dinora-page-subtitle",children:"Track incoming orders and manage their progress."})]}),o.jsx("div",{className:"dinora-live-status",children:o.jsx(Oc,{status:s})})]}),o.jsx("div",{className:"dinora-filter-bar",children:Uh.map(f=>o.jsxs("button",{className:`dinora-filter ${w===f?"active":""}`,onClick:()=>y(f),children:[o.jsx("span",{children:f==="all"?"All orders":f}),o.jsx("span",{className:"dinora-filter-count",children:c(f)})]},f))}),k.length===0?o.jsx("div",{className:"dinora-empty",children:o.jsx(me,{icon:"🧾",title:l.length===0?"No orders yet":"No orders match this filter",message:l.length===0?"Orders will appear here as guests place them.":""})}):o.jsxs(o.Fragment,{children:[o.jsx("div",{className:"dinora-mobile-orders",children:k.map(f=>o.jsxs("div",{className:"dinora-order-card",children:[o.jsxs("div",{className:"dinora-order-top",children:[o.jsxs("div",{className:"dinora-order-heading",children:[o.jsxs("div",{className:"dinora-order-number",children:["Order #",f.id]}),o.jsxs("div",{className:"dinora-order-table",children:[o.jsx("span",{className:"dinora-table-dot"}),"Table ",f.table_number??"—"]})]}),o.jsx(Js,{status:f.status})]}),o.jsx("div",{className:"dinora-order-items",children:f.items.map(x=>o.jsx("div",{className:"dinora-order-item",children:o.jsxs("div",{className:"dinora-order-item-main",children:[o.jsxs("span",{className:"dinora-item-quantity",children:[x.quantity,"×"]}),o.jsx("span",{className:"dinora-item-name",children:x.name})]})},x.id))}),o.jsxs("div",{className:"dinora-order-total-row",children:[o.jsx("span",{className:"dinora-total-label",children:"Order total"}),o.jsxs("span",{className:"dinora-order-total",children:["₹",f.total_amount.toFixed(2)]})]}),o.jsxs("div",{className:"dinora-actions",children:[o.jsxs("select",{className:"dinora-select",value:Xt.includes(f.status)?f.status:"",disabled:d===f.id,onChange:x=>S(f.id,x.target.value),children:[!Xt.includes(f.status)&&o.jsx("option",{value:"",disabled:!0,children:f.status}),Xt.map(x=>o.jsx("option",{value:x,children:x},x))]}),f.status!=="paid"&&f.status!=="cancelled"&&o.jsx("button",{className:"dinora-payment-button",disabled:p===f.id,onClick:()=>h(f),children:p===f.id?o.jsx(Ce,{size:14}):"Mark paid"})]})]},f.id))}),o.jsx("div",{className:"dinora-table-wrap",children:o.jsxs("table",{className:"dinora-orders-table",children:[o.jsx("thead",{children:o.jsxs("tr",{children:[o.jsx("th",{children:"Order"}),o.jsx("th",{children:"Table"}),o.jsx("th",{children:"Items"}),o.jsx("th",{children:"Total"}),o.jsx("th",{children:"Status"}),o.jsx("th",{children:"Update"}),o.jsx("th",{children:"Payment"})]})}),o.jsx("tbody",{children:k.map(f=>o.jsxs("tr",{children:[o.jsx("td",{children:o.jsxs("span",{className:"dinora-table-order-id",children:["#",f.id]})}),o.jsx("td",{children:o.jsx("span",{className:"dinora-table-cell-muted",children:f.table_number??"—"})}),o.jsx("td",{children:o.jsx("div",{className:"dinora-table-items",children:f.items.map(x=>o.jsxs("div",{children:[o.jsxs("b",{children:[x.quantity,"×"]})," ",x.name]},x.id))})}),o.jsx("td",{children:o.jsxs("span",{className:"dinora-table-total",children:["₹",f.total_amount.toFixed(2)]})}),o.jsx("td",{children:o.jsx(Js,{status:f.status})}),o.jsx("td",{children:o.jsxs("select",{className:"dinora-select dinora-table-select",value:Xt.includes(f.status)?f.status:"",disabled:d===f.id,onChange:x=>S(f.id,x.target.value),children:[!Xt.includes(f.status)&&o.jsx("option",{value:"",disabled:!0,children:f.status}),Xt.map(x=>o.jsx("option",{value:x,children:x},x))]})}),o.jsx("td",{children:f.status==="paid"?o.jsxs("span",{className:"dinora-paid-note",children:[o.jsx("span",{className:"dinora-paid-check",children:"✓"}),"Paid"]}):f.status==="cancelled"?o.jsx("span",{className:"dinora-table-cell-muted",children:"—"}):o.jsx("button",{className:"dinora-payment-button",disabled:p===f.id,onClick:()=>h(f),children:p===f.id?o.jsx(Ce,{size:14}):"Mark paid"})})]},f.id))})]})})]})]})})]})}const Bh=["pending","preparing","ready","served","paid","completed","cancelled"];function Wh(){const[e,t]=v.useState("loading"),[n,r]=v.useState(""),[i,l]=v.useState({});async function a(d){d&&t("loading");try{const m=await Te.getCounterTotals();l(m.totals||{}),t("ready")}catch(m){t("error"),r(m.detail||m.message||"Could not load counter totals")}}if(v.useEffect(()=>{a(!0);const d=setInterval(()=>a(!1),15e3);return()=>clearInterval(d)},[]),e==="loading")return o.jsx("div",{className:"stat-grid",children:Array.from({length:4}).map((d,m)=>o.jsxs("div",{className:"card stat-card",children:[o.jsx(Ze,{style:{width:40,height:28}}),o.jsx(Ze,{style:{width:60,height:12,marginTop:8}})]},m))});if(e==="error")return o.jsx(me,{icon:"⚠️",title:"Something went wrong",message:n});const s=Bh.filter(d=>i[d]!==void 0).map(d=>[d,i[d]]),u=s.reduce((d,[,m])=>d+m,0);return o.jsxs("div",{className:"admin-counter-page",children:[o.jsx("header",{className:"admin-page-header",children:o.jsx("h1",{style:{fontSize:20},children:"Counter"})}),s.length===0?o.jsx(me,{icon:"📊",title:"No orders yet",message:"Order status totals will appear here once guests start ordering."}):o.jsxs(o.Fragment,{children:[o.jsxs("div",{className:"stat-grid",children:[o.jsxs("div",{className:"card stat-card",children:[o.jsx("div",{className:"stat-value",children:u}),o.jsx("div",{className:"stat-label",children:"Total orders"})]}),s.map(([d,m])=>o.jsxs("div",{className:"card stat-card",children:[o.jsx("div",{className:"stat-value",children:m}),o.jsx("div",{className:"stat-label",children:d})]},d))]}),o.jsx("p",{style:{fontSize:12,color:"var(--color-text-faint)",textAlign:"center",marginTop:8},children:"Refreshes automatically every 15 seconds. See Orders for live, per-order updates."})]})]})}function Vh(){const e=Tt(),[t,n]=v.useState("loading"),[r,i]=v.useState(""),[l,a]=v.useState([]),[s,u]=v.useState(""),[d,m]=v.useState(!1),[p,g]=v.useState(null);async function w(){n("loading");try{const c=await Te.listTables();a(c),n("ready")}catch(c){n("error"),i(c.detail||c.message||"Could not load tables")}}v.useEffect(()=>{w()},[]);async function y(c){c.preventDefault();const f=parseInt(s,10);if(!(!f||f<=0)){m(!0);try{await Te.createTable(f),u(""),e.success(`Table ${f} added`),await w()}catch(x){e.error(x.detail||x.message||"Could not create table")}finally{m(!1)}}}async function k(c){const f=`${window.location.origin}/t/${c.token}`;try{const x=await Te.fetchTableQrBlob(c.token,f),j=URL.createObjectURL(x);g({tableId:c.id,url:j,guestUrl:f,number:c.number})}catch(x){e.error(x.detail||x.message||"Could not generate QR code")}}function S(){if(!p)return;const c=document.createElement("a");c.href=p.url,c.download=`dinora-table-${p.number}-qr.png`,c.click()}async function h(){if(p)try{await navigator.clipboard.writeText(p.guestUrl),e.success("Guest link copied")}catch{const c=document.createElement("textarea");c.value=p.guestUrl,c.setAttribute("readonly",""),c.style.position="fixed",c.style.opacity="0",document.body.appendChild(c),c.select();const f=document.execCommand("copy");c.remove(),f?e.success("Guest link copied"):e.error("Could not copy guest link")}}return t==="loading"?o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-tables-loading {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
            font-family: "DM Sans", sans-serif;
          }

          .dinora-loading-card {
            width: 52px;
            height: 52px;
            display: grid;
            place-items: center;
            border-radius: 16px;
            background: rgba(255,255,255,.84);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 12px 30px rgba(35,41,37,.06);
          }
        `}),o.jsx("div",{className:"dinora-tables-loading",children:o.jsx("div",{className:"dinora-loading-card",children:o.jsx(Ce,{size:24})})})]}):t==="error"?o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
          .dinora-tables-error {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
          }

          .dinora-error-card {
            width: 100%;
            max-width: 520px;
            padding: 34px;
            border-radius: 24px;
            background: rgba(255,255,255,.88);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 25px 65px rgba(35,41,37,.07);
          }
        `}),o.jsx("div",{className:"dinora-tables-error",children:o.jsx("div",{className:"dinora-error-card",children:o.jsx(me,{icon:"⚠️",title:"Something went wrong",message:r})})})]}):o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .dinora-tables-page {
          min-height: 100%;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 25%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #202923;
        }

        .dinora-tables-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .dinora-tables-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 27px;
        }

        .dinora-tables-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-tables-eyebrow {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          color: #8c928d;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .dinora-tables-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 35px;
          line-height: 1;
          letter-spacing: -.8px;
          color: #26372d;
        }

        .dinora-tables-subtitle {
          margin: 2px 0 0;
          color: #858b86;
          font-size: 13px;
        }

        .dinora-create-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px;
          margin-bottom: 21px;
          border-radius: 20px;
          background: rgba(255,255,255,.78);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow: 0 12px 32px rgba(35,41,37,.045);
        }

        .dinora-create-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dinora-create-title {
          margin: 0;
          color: #344139;
          font-size: 13px;
          font-weight: 700;
        }

        .dinora-create-hint {
          margin: 0;
          color: #929992;
          font-size: 11px;
        }

        .dinora-create-form {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dinora-table-input {
          width: 160px;
          height: 42px;
          padding: 0 13px;
          border: 1px solid #dfe3dd;
          border-radius: 11px;
          background: #fbfbf9;
          color: #263129;
          font: 400 12px "DM Sans", sans-serif;
          outline: none;
          transition: .18s ease;
        }

        .dinora-table-input::placeholder {
          color: #a7ada8;
        }

        .dinora-table-input:hover {
          border-color: #cfd5cf;
          background: #fff;
        }

        .dinora-table-input:focus {
          border-color: #5b715f;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(91,113,95,.09);
        }

        .dinora-add-table-btn {
          height: 42px;
          padding: 0 16px;
          border: 0;
          border-radius: 11px;
          background: #26392d;
          color: #fffdf8;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
          transition: .18s ease;
        }

        .dinora-add-table-btn:hover:not(:disabled) {
          background: #31493a;
          transform: translateY(-1px);
          box-shadow: 0 11px 23px rgba(38,57,45,.18);
        }

        .dinora-add-table-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .dinora-tables-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .dinora-table-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px;
          border-radius: 20px;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 12px 35px rgba(35,41,37,.055),
            0 2px 7px rgba(35,41,37,.025);
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            border-color .2s ease;
        }

        .dinora-table-card:hover {
          transform: translateY(-2px);
          border-color: rgba(38,57,45,.11);
          box-shadow:
            0 18px 40px rgba(35,41,37,.075),
            0 3px 10px rgba(35,41,37,.035);
        }

        .dinora-table-info {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .dinora-table-number {
          width: 50px;
          height: 50px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #26392d;
          color: #fffdf8;
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
        }

        .dinora-table-details {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-table-name {
          color: #354139;
          font-size: 14px;
          font-weight: 700;
        }

        .dinora-table-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #8b938c;
          font-size: 11px;
          text-transform: capitalize;
        }

        .dinora-table-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8ba48d;
        }

        .dinora-view-qr {
          height: 38px;
          padding: 0 13px;
          border-radius: 10px;
          border: 1px solid #dfe2dc;
          background: #fff;
          color: #445249;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          white-space: nowrap;
          transition: .18s ease;
        }

        .dinora-view-qr:hover {
          background: #f6f7f3;
          border-color: #cad1ca;
          transform: translateY(-1px);
        }

        .dinora-empty-state {
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 15px 40px rgba(35,41,37,.05);
        }

        /* QR Sheet */

        .dinora-qr-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 17px;
        }

        .dinora-qr-image-wrap {
          width: 230px;
          height: 230px;
          padding: 13px;
          display: grid;
          place-items: center;
          border-radius: 21px;
          background: #fff;
          border: 1px solid #e9e7e0;
          box-shadow:
            0 15px 35px rgba(35,41,37,.08),
            0 3px 9px rgba(35,41,37,.03);
        }

        .dinora-qr-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .dinora-qr-description {
          margin: 0;
          text-align: center;
          color: #858c86;
          font-size: 12px;
          line-height: 1.5;
          max-width: 330px;
        }

        .dinora-qr-url-box {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 8px 13px;
          border-radius: 11px;
          border: 1px solid #e4e4de;
          background: #f8f8f5;
          color: #687169;
          font-size: 11px;
          line-height: 1.5;
          overflow-wrap: anywhere;
          text-align: center;
        }

        .dinora-qr-url {
          min-width: 0;
          flex: 1;
        }

        .dinora-copy-url-btn {
          flex: 0 0 auto;
          height: 32px;
          padding: 0 10px;
          border: 1px solid #d8ddd6;
          border-radius: 8px;
          background: #fff;
          color: #445249;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-copy-url-btn:hover {
          background: #f0f2ed;
          border-color: #c6cec5;
        }

        .dinora-qr-actions {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 2px;
        }

        .dinora-qr-btn {
          height: 45px;
          border-radius: 12px;
          border: 1px solid transparent;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-qr-btn-secondary {
          background: #f0eee8;
          border-color: #e5e2da;
          color: #48554c;
        }

        .dinora-qr-btn-secondary:hover {
          background: #e8e5dd;
        }

        .dinora-qr-btn-primary {
          background: #26392d;
          color: #fffdf8;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
        }

        .dinora-qr-btn-primary:hover {
          background: #31493a;
          transform: translateY(-1px);
        }

        @media (max-width: 760px) {
          .dinora-tables-page {
            padding: 18px 14px 24px;
          }

          .dinora-tables-header {
            align-items: flex-start;
          }

          .dinora-tables-title {
            font-size: 30px;
          }

          .dinora-create-panel {
            align-items: stretch;
            flex-direction: column;
          }

          .dinora-create-form {
            width: 100%;
          }

          .dinora-table-input {
            flex: 1;
            width: auto;
          }

          .dinora-add-table-btn {
            flex: 0 0 auto;
          }

          .dinora-tables-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {
          .dinora-create-form {
            flex-direction: column;
          }

          .dinora-table-input,
          .dinora-add-table-btn {
            width: 100%;
          }

          .dinora-table-card {
            padding: 15px;
          }

          .dinora-table-number {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }

          .dinora-view-qr {
            padding: 0 10px;
          }
        }
      `}),o.jsx("div",{className:"dinora-tables-page",children:o.jsxs("div",{className:"dinora-tables-container",children:[o.jsx("header",{className:"dinora-tables-header",children:o.jsxs("div",{className:"dinora-tables-heading",children:[o.jsx("p",{className:"dinora-tables-eyebrow",children:"Restaurant setup"}),o.jsx("h1",{className:"dinora-tables-title",children:"Tables"}),o.jsx("p",{className:"dinora-tables-subtitle",children:"Manage dining tables and generate guest QR codes."})]})}),o.jsxs("form",{className:"dinora-create-panel",onSubmit:y,children:[o.jsxs("div",{className:"dinora-create-copy",children:[o.jsx("p",{className:"dinora-create-title",children:"Add a new table"}),o.jsx("p",{className:"dinora-create-hint",children:"Use the physical table number from your restaurant."})]}),o.jsxs("div",{className:"dinora-create-form",children:[o.jsx("input",{className:"dinora-table-input",type:"number",min:"1",placeholder:"Table number",value:s,onChange:c=>u(c.target.value),required:!0}),o.jsx("button",{type:"submit",className:"dinora-add-table-btn",disabled:d,children:d?o.jsx(Ce,{size:16}):o.jsxs(o.Fragment,{children:[o.jsx("span",{children:"+"}),"Add table"]})})]})]}),l.length===0?o.jsx("div",{className:"dinora-empty-state",children:o.jsx(me,{icon:"🪑",title:"No tables yet",message:"Add your first table above to generate its QR code."})}):o.jsx("div",{className:"dinora-tables-grid",children:l.map(c=>o.jsxs("div",{className:"dinora-table-card",children:[o.jsxs("div",{className:"dinora-table-info",children:[o.jsx("div",{className:"dinora-table-number",children:c.number}),o.jsxs("div",{className:"dinora-table-details",children:[o.jsxs("div",{className:"dinora-table-name",children:["Table ",c.number]}),o.jsx("div",{className:"dinora-table-status",children:c.status})]})]}),o.jsx("button",{className:"dinora-view-qr",onClick:()=>k(c),children:"View QR"})]},c.id))})]})}),o.jsx(Ti,{open:!!p,onClose:()=>g(null),title:p?`Table ${p.number} QR`:"",children:p&&o.jsxs("div",{className:"dinora-qr-content",children:[o.jsx("div",{className:"dinora-qr-image-wrap",children:o.jsx("img",{className:"dinora-qr-image",src:p.url,alt:`QR code for Table ${p.number}`})}),o.jsx("p",{className:"dinora-qr-description",children:"Guests can scan this code from the table to open the Dinora menu and place an order."}),o.jsxs("div",{className:"dinora-qr-url-box",children:[o.jsx("span",{className:"dinora-qr-url",children:p.guestUrl}),o.jsx("button",{type:"button",className:"dinora-copy-url-btn",onClick:h,children:"Copy link"})]}),o.jsxs("div",{className:"dinora-qr-actions",children:[o.jsx("button",{className:"dinora-qr-btn dinora-qr-btn-secondary",onClick:S,children:"Download QR"}),o.jsx("button",{className:"dinora-qr-btn dinora-qr-btn-primary",onClick:()=>g(null),children:"Done"})]})]})})]})}const Zs={name:"",category_id:"",price:"",description:"",image_url:""};function Qh(){const e=Tt(),t=Ro(),[n,r]=v.useState("loading"),[i,l]=v.useState(""),[a,s]=v.useState([]),[u,d]=v.useState(!1),[m,p]=v.useState(""),[g,w]=v.useState(!1),[y,k]=v.useState(!1),[S,h]=v.useState(Zs),[c,f]=v.useState(!1);async function x(){r("loading");try{const C=await Te.listCategories();s(C),r("ready")}catch(C){r("error"),l(C.detail||C.message||"Could not load menu")}}v.useEffect(()=>{x()},[]);async function j(C){if(C.preventDefault(),!!m.trim()){w(!0);try{await Te.createCategory(m.trim()),p(""),d(!1),e.success("Category added"),await x()}catch(_){e.error(_.detail||_.message||"Could not create category")}finally{w(!1)}}}function b(C){h({...Zs,category_id:C?String(C):""}),k(!0)}async function E(C){if(C.preventDefault(),!(!S.name.trim()||!S.category_id)){f(!0);try{await Te.createMenuItem({name:S.name.trim(),category_id:parseInt(S.category_id,10),price:parseFloat(S.price)||0,description:S.description.trim()||null,image_url:S.image_url.trim()||null,available:!0}),k(!1),e.success(`${S.name} added to menu`),await x()}catch(_){e.error(_.detail||_.message||"Could not create menu item")}finally{f(!1)}}}async function z(C){try{await Te.updateMenuItem(C.id,{available:!C.available}),await x()}catch(_){e.error(_.detail||_.message||"Could not update item")}}async function M(C){if(await t(`Delete "${C.name}"? This can't be undone.`,{title:"Delete item",danger:!0}))try{await Te.deleteMenuItem(C.id),e.success(`${C.name} deleted`),await x()}catch(R){e.error(R.detail||R.message||"Could not delete item")}}return n==="loading"?o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

          .dinora-menu-loading {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
            font-family: "DM Sans", sans-serif;
          }

          .dinora-loading-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            border-radius: 16px;
            background: rgba(255,255,255,.82);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 12px 30px rgba(35,41,37,.06);
          }
        `}),o.jsx("div",{className:"dinora-menu-loading",children:o.jsx("div",{className:"dinora-loading-box",children:o.jsx(Ce,{size:24})})})]}):n==="error"?o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
          .dinora-menu-error {
            min-height: 100%;
            display: grid;
            place-items: center;
            padding: 32px;
            background: #f6f3ed;
          }

          .dinora-menu-error-card {
            width: 100%;
            max-width: 520px;
            padding: 34px;
            border-radius: 24px;
            background: rgba(255,255,255,.88);
            border: 1px solid rgba(38,57,45,.08);
            box-shadow: 0 25px 65px rgba(35,41,37,.07);
          }
        `}),o.jsx("div",{className:"dinora-menu-error",children:o.jsx("div",{className:"dinora-menu-error-card",children:o.jsx(me,{icon:"⚠️",title:"Something went wrong",message:i})})})]}):o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

        .dinora-menu-page {
          min-height: 100%;
          padding: 28px;
          background:
            radial-gradient(circle at 10% 0%, rgba(191,105,48,.05), transparent 25%),
            radial-gradient(circle at 100% 100%, rgba(38,57,45,.05), transparent 25%),
            #f6f3ed;
          font-family: "DM Sans", sans-serif;
          color: #202923;
        }

        .dinora-menu-container {
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
        }

        .dinora-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 28px;
        }

        .dinora-menu-heading {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-menu-eyebrow {
          margin: 0;
          font-size: 11px;
          font-weight: 700;
          color: #8c928d;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .dinora-menu-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 35px;
          line-height: 1;
          letter-spacing: -.8px;
          color: #26372d;
        }

        .dinora-menu-subtitle {
          margin: 2px 0 0;
          color: #858b86;
          font-size: 13px;
        }

        .dinora-menu-header-actions {
          display: flex;
          gap: 8px;
        }

        .dinora-menu-btn {
          height: 42px;
          padding: 0 15px;
          border-radius: 11px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          font: 700 12px "DM Sans", sans-serif;
          cursor: pointer;
          transition:
            transform .18s ease,
            box-shadow .18s ease,
            background .18s ease;
        }

        .dinora-menu-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .dinora-menu-btn-secondary {
          background: rgba(255,255,255,.78);
          color: #3d4b42;
          border-color: rgba(38,57,45,.10);
        }

        .dinora-menu-btn-secondary:hover:not(:disabled) {
          background: #fff;
          box-shadow: 0 8px 20px rgba(35,41,37,.06);
        }

        .dinora-menu-btn-primary {
          background: #26392d;
          color: #fffdf8;
          box-shadow: 0 8px 18px rgba(38,57,45,.14);
        }

        .dinora-menu-btn-primary:hover:not(:disabled) {
          background: #31493a;
          box-shadow: 0 11px 22px rgba(38,57,45,.18);
        }

        .dinora-menu-btn:disabled {
          cursor: not-allowed;
          opacity: .5;
        }

        .dinora-empty-state {
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,.82);
          border: 1px solid rgba(38,57,45,.08);
          box-shadow: 0 15px 40px rgba(35,41,37,.05);
        }

        .dinora-category {
          margin-bottom: 18px;
          border-radius: 22px;
          overflow: hidden;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(38,57,45,.07);
          box-shadow:
            0 13px 38px rgba(35,41,37,.055),
            0 2px 7px rgba(35,41,37,.025);
        }

        .dinora-category:last-child {
          margin-bottom: 0;
        }

        .dinora-category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 19px 21px;
          background:
            linear-gradient(
              90deg,
              rgba(248,246,240,.92),
              rgba(255,255,255,.65)
            );
          border-bottom: 1px solid #eceae3;
        }

        .dinora-category-title-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .dinora-category-marker {
          width: 9px;
          height: 27px;
          border-radius: 999px;
          background: #a06b47;
          flex: 0 0 auto;
        }

        .dinora-category-title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: 20px;
          color: #293a30;
          letter-spacing: -.2px;
        }

        .dinora-category-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 27px;
          height: 23px;
          padding: 0 8px;
          border-radius: 999px;
          background: #eeece5;
          color: #7f867f;
          font-size: 10px;
          font-weight: 700;
        }

        .dinora-category-add {
          height: 34px;
          padding: 0 12px;
          border-radius: 10px;
          border: 1px solid #e0e2dc;
          background: #fff;
          color: #526057;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-category-add:hover {
          background: #f7f7f4;
          border-color: #ccd2cb;
        }

        .dinora-items {
          display: grid;
        }

        .dinora-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 20px;
          align-items: center;
          padding: 18px 21px;
          border-bottom: 1px solid #efede8;
          transition: background .18s ease;
        }

        .dinora-item:last-child {
          border-bottom: 0;
        }

        .dinora-item:hover {
          background: #fcfbf8;
        }

        .dinora-item-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dinora-item-name {
          margin: 0;
          color: #344139;
          font-size: 14px;
          font-weight: 700;
        }

        .dinora-item-description {
          color: #929992;
          font-size: 12px;
          line-height: 1.45;
          max-width: 700px;
        }

        .dinora-item-price {
          color: #26392d;
          font-family: "Playfair Display", serif;
          font-size: 18px;
          font-weight: 700;
          margin-top: 1px;
        }

        .dinora-item-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .dinora-availability {
          min-width: 88px;
          height: 34px;
          padding: 0 10px;
          border-radius: 999px;
          border: 0;
          font: 700 11px "DM Sans", sans-serif;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-availability.available {
          background: #edf4ed;
          color: #55745d;
        }

        .dinora-availability.available:hover {
          background: #e4efe4;
        }

        .dinora-availability.unavailable {
          background: #f1efeb;
          color: #92948f;
        }

        .dinora-availability.unavailable:hover {
          background: #e8e6e1;
        }

        .dinora-delete {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          border: 1px solid #e6e3dc;
          background: #fff;
          color: #9b9188;
          font-size: 12px;
          cursor: pointer;
          transition: .18s ease;
        }

        .dinora-delete:hover {
          color: #a04d42;
          background: #fff6f3;
          border-color: #ecd8d3;
        }

        .dinora-category-empty {
          padding: 17px;
        }

        @media (max-width: 700px) {
          .dinora-menu-page {
            padding: 18px 14px 24px;
          }

          .dinora-menu-header {
            flex-direction: column;
            align-items: stretch;
            gap: 17px;
          }

          .dinora-menu-title {
            font-size: 30px;
          }

          .dinora-menu-header-actions {
            width: 100%;
          }

          .dinora-menu-btn {
            flex: 1;
          }

          .dinora-category-header {
            padding: 16px;
          }

          .dinora-item {
            grid-template-columns: 1fr;
            gap: 13px;
            padding: 16px;
          }

          .dinora-item-actions {
            justify-content: space-between;
          }

          .dinora-availability {
            flex: 1;
          }
        }

        @media (max-width: 430px) {
          .dinora-category-title {
            font-size: 18px;
          }

          .dinora-category-add {
            font-size: 10px;
            padding: 0 10px;
          }
        }

        /* Sheets */

        .dinora-sheet-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .dinora-form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dinora-form-field label {
          color: #4a554d;
          font-size: 12px;
          font-weight: 700;
        }

        .dinora-form-input,
        .dinora-form-select {
          width: 100%;
          min-height: 48px;
          padding: 0 13px;
          border-radius: 12px;
          border: 1px solid #dfe3dd;
          background: #fbfbf9;
          color: #263129;
          font: 400 13px "DM Sans", sans-serif;
          outline: none;
          transition: .18s ease;
        }

        .dinora-form-input::placeholder {
          color: #a7ada8;
        }

        .dinora-form-input:hover,
        .dinora-form-select:hover {
          border-color: #cfd5cf;
          background: #fff;
        }

        .dinora-form-input:focus,
        .dinora-form-select:focus {
          border-color: #5b715f;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(91,113,95,.09);
        }

        .dinora-form-textarea {
          min-height: 88px;
          padding: 12px 13px;
          resize: vertical;
        }

        .dinora-form-hint {
          margin-top: -3px;
          color: #999f99;
          font-size: 11px;
          line-height: 1.45;
        }

        .dinora-form-submit {
          width: 100%;
          height: 50px;
          margin-top: 3px;
          border: 0;
          border-radius: 13px;
          background: #26392d;
          color: #fffdf8;
          font: 700 13px "DM Sans", sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 9px 20px rgba(38,57,45,.14);
          transition: .18s ease;
        }

        .dinora-form-submit:hover:not(:disabled) {
          background: #31493a;
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(38,57,45,.18);
        }

        .dinora-form-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
      `}),o.jsx("div",{className:"dinora-menu-page",children:o.jsxs("div",{className:"dinora-menu-container",children:[o.jsxs("header",{className:"dinora-menu-header",children:[o.jsxs("div",{className:"dinora-menu-heading",children:[o.jsx("p",{className:"dinora-menu-eyebrow",children:"Restaurant configuration"}),o.jsx("h1",{className:"dinora-menu-title",children:"Menu"}),o.jsx("p",{className:"dinora-menu-subtitle",children:"Organize categories and control what's available to guests."})]}),o.jsxs("div",{className:"dinora-menu-header-actions",children:[o.jsxs("button",{className:"dinora-menu-btn dinora-menu-btn-secondary",onClick:()=>d(!0),children:[o.jsx("span",{children:"+"}),"Category"]}),o.jsxs("button",{className:"dinora-menu-btn dinora-menu-btn-primary",onClick:()=>b(),disabled:a.length===0,children:[o.jsx("span",{children:"+"}),"Item"]})]})]}),a.length===0?o.jsx("div",{className:"dinora-empty-state",children:o.jsx(me,{icon:"🍴",title:"No categories yet",message:"Add a category first, then add items to it.",action:o.jsx("button",{className:"dinora-menu-btn dinora-menu-btn-primary",onClick:()=>d(!0),children:"+ Add category"})})}):a.map(C=>o.jsxs("section",{className:"dinora-category",children:[o.jsxs("div",{className:"dinora-category-header",children:[o.jsxs("div",{className:"dinora-category-title-wrap",children:[o.jsx("span",{className:"dinora-category-marker","aria-hidden":"true"}),o.jsx("h3",{className:"dinora-category-title",children:C.name}),o.jsx("span",{className:"dinora-category-count",children:C.items.length})]}),o.jsx("button",{className:"dinora-category-add",onClick:()=>b(C.id),children:"+ Add item"})]}),C.items.length===0?o.jsx("div",{className:"dinora-category-empty",children:o.jsx(me,{icon:"🍽️",title:"No items in this category",action:o.jsx("button",{className:"dinora-menu-btn dinora-menu-btn-secondary",onClick:()=>b(C.id),children:"Add item"})})}):o.jsx("div",{className:"dinora-items",children:C.items.map(_=>o.jsxs("div",{className:"dinora-item",children:[o.jsxs("div",{className:"dinora-item-info",children:[o.jsx("strong",{className:"dinora-item-name",children:_.name}),_.description&&o.jsx("span",{className:"dinora-item-description",children:_.description}),o.jsxs("span",{className:"dinora-item-price",children:["₹",_.price.toFixed(2)]})]}),o.jsxs("div",{className:"dinora-item-actions",children:[o.jsx("button",{className:`dinora-availability ${_.available?"available":"unavailable"}`,onClick:()=>z(_),children:_.available?"Available":"Hidden"}),o.jsx("button",{className:"dinora-delete",onClick:()=>M(_),"aria-label":`Delete ${_.name}`,children:"✕"})]})]},_.id))})]},C.id))]})}),o.jsx(Ti,{open:u,onClose:()=>d(!1),title:"Add category",children:o.jsxs("form",{className:"dinora-sheet-form",onSubmit:j,children:[o.jsxs("div",{className:"dinora-form-field",children:[o.jsx("label",{htmlFor:"category-name",children:"Category name"}),o.jsx("input",{id:"category-name",className:"dinora-form-input",placeholder:"e.g. Desserts",value:m,onChange:C=>p(C.target.value),required:!0,autoFocus:!0})]}),o.jsx("button",{type:"submit",className:"dinora-form-submit",disabled:g,children:g?o.jsx(Ce,{size:16}):"Add category"})]})}),o.jsx(Ti,{open:y,onClose:()=>k(!1),title:"Add menu item",children:o.jsxs("form",{className:"dinora-sheet-form",onSubmit:E,children:[o.jsxs("div",{className:"dinora-form-field",children:[o.jsx("label",{htmlFor:"item-name",children:"Name"}),o.jsx("input",{id:"item-name",className:"dinora-form-input",value:S.name,onChange:C=>h({...S,name:C.target.value}),placeholder:"e.g. Truffle Pasta",required:!0})]}),o.jsxs("div",{className:"dinora-form-field",children:[o.jsx("label",{htmlFor:"item-category",children:"Category"}),o.jsxs("select",{id:"item-category",className:"dinora-form-select",value:S.category_id,onChange:C=>h({...S,category_id:C.target.value}),required:!0,children:[o.jsx("option",{value:"",disabled:!0,children:"Select a category"}),a.map(C=>o.jsx("option",{value:C.id,children:C.name},C.id))]})]}),o.jsxs("div",{className:"dinora-form-field",children:[o.jsx("label",{htmlFor:"item-price",children:"Price"}),o.jsx("input",{id:"item-price",className:"dinora-form-input",type:"number",step:"0.01",min:"0",placeholder:"0.00",value:S.price,onChange:C=>h({...S,price:C.target.value}),required:!0})]}),o.jsxs("div",{className:"dinora-form-field",children:[o.jsx("label",{htmlFor:"item-description",children:"Description"}),o.jsx("textarea",{id:"item-description",className:"dinora-form-input dinora-form-textarea",placeholder:"Briefly describe the dish...",value:S.description,onChange:C=>h({...S,description:C.target.value})}),o.jsx("span",{className:"dinora-form-hint",children:"Optional. Keep it short enough to scan quickly."})]}),o.jsxs("div",{className:"dinora-form-field",children:[o.jsx("label",{htmlFor:"item-image",children:"Image URL"}),o.jsx("input",{id:"item-image",className:"dinora-form-input",value:S.image_url,onChange:C=>h({...S,image_url:C.target.value}),placeholder:"https://..."}),o.jsx("span",{className:"dinora-form-hint",children:"Optional. Paste the direct URL of the item image."})]}),o.jsx("button",{type:"submit",className:"dinora-form-submit",disabled:c,children:c?o.jsx(Ce,{size:16}):"Add item"})]})})]})}function Hh(){return o.jsxs("div",{className:"home-page",children:[o.jsx("div",{className:"home-logo",children:"🍽️"}),o.jsx("h1",{children:"Dinora"}),o.jsx("p",{children:"Scan the QR code on your table to browse the menu, order, and track your food in real time."}),o.jsxs("p",{className:"home-admin-link",children:["Restaurant staff — ",o.jsx("a",{href:"/admin/login",children:"go to the admin dashboard"})]})]})}function Kh(){return o.jsx(vh,{children:o.jsx(yh,{children:o.jsx(hh,{children:o.jsx(gh,{children:o.jsx(sh,{children:o.jsxs(eh,{children:[o.jsx(ue,{path:"/",element:o.jsx(Hh,{})}),o.jsx(ue,{path:"/t/:tableToken",element:o.jsx(jh,{})}),o.jsxs(ue,{path:"/t/:tableToken",element:o.jsx(Sh,{}),children:[o.jsx(ue,{path:"menu",element:o.jsx(Nh,{})}),o.jsx(ue,{path:"cart",element:o.jsx(Ch,{})}),o.jsx(ue,{path:"orders",element:o.jsx(Ih,{})})]}),o.jsx(ue,{path:"/admin/login",element:o.jsx(Mh,{})}),o.jsx(ue,{path:"/admin/register",element:o.jsx(Fh,{})}),o.jsxs(ue,{path:"/admin",element:o.jsx(wh,{children:o.jsx(kh,{})}),children:[o.jsx(ue,{index:!0,element:o.jsx(_a,{to:"orders",replace:!0})}),o.jsx(ue,{path:"orders",element:o.jsx(Ah,{})}),o.jsx(ue,{path:"counter",element:o.jsx(Wh,{})}),o.jsx(ue,{path:"tables",element:o.jsx(Vh,{})}),o.jsx(ue,{path:"menu",element:o.jsx(Qh,{})})]}),o.jsx(ue,{path:"*",element:o.jsx(_a,{to:"/",replace:!0})})]})})})})})})}Ol.createRoot(document.getElementById("root")).render(o.jsx(du.StrictMode,{children:o.jsx(Kh,{})}));
