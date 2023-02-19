"use strict";var Q=Object.defineProperty;var W=(e,t,i)=>t in e?Q(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var _=(e,t,i)=>(W(e,typeof t!="symbol"?t+"":t,i),i);class v{constructor(){_(this,"handlers",[])}on(t){this.handlers.push(t)}off(t){this.handlers=this.handlers.filter(i=>i!==t)}offAll(){this.handlers=[]}once(t){const i=n=>{t(n),this.off(i)};this.on(i)}async trigger(t){const i=this.handlers.slice(0).map(async n=>n(t));await Promise.all(i)}expose(){return this}}const Z={lastUpdate:Date.now(),tick:function(e=10){var t=Date.now(),i=t-this.lastUpdate;return i>1e3/e?(this.lastUpdate=t,!0):!1}};var B;(function(e){e[e.LeftJoystickAxeX=-1]="LeftJoystickAxeX",e[e.LeftJoystickAxeY=-2]="LeftJoystickAxeY",e[e.RightJoystickAxeX=-3]="RightJoystickAxeX",e[e.RightJoystickAxeY=-4]="RightJoystickAxeY",e[e.KeyA=1]="KeyA",e[e.KeyB=0]="KeyB",e[e.KeyX=3]="KeyX",e[e.KeyY=2]="KeyY",e[e.KeyUp=12]="KeyUp",e[e.KeyDown=13]="KeyDown",e[e.KeyLeft=14]="KeyLeft",e[e.KeyRight=15]="KeyRight",e[e.KeyR1=5]="KeyR1",e[e.KeyR2=7]="KeyR2",e[e.KeyL1=4]="KeyL1",e[e.KeyL2=6]="KeyL2",e[e.KeyStart=16]="KeyStart",e[e.KeyOpts=17]="KeyOpts",e[e.KeyPlus=9]="KeyPlus",e[e.KeyMinus=8]="KeyMinus"})(B||(B={}));const C=()=>({changed:new v,pressed:new v,released:new v,repeat:new v}),N={init:function(e){let t={id:e.index,buttons:e.buttons.length,axes:Math.floor(e.axes.length/2),axeValues:[],axeThreshold:[1],axeStep:.15,hapticActuator:null,vibrationMode:-1,vibration:!1,mapping:e.mapping,buttonActions:{},axesActions:{},pressed:{},set:function(i,n){if(["axeThreshold"].indexOf(i)>=0){if(i==="axeThreshold"&&(!parseFloat(n)||n<0||n>1)){console.error("gamepad: invalid value number");return}this[i]=n}else console.error("gamepad: invalid property")},vibrate:function(i=.75,n=500){if(this.hapticActuator)switch(this.vibrationMode){case 0:return this.hapticActuator.pulse(i,n);case 1:return this.hapticActuator.playEffect("dual-rumble",{duration:n,strongMagnitude:i,weakMagnitude:i})}},checkStatus:function(){let i={};const n=Z.tick(),r=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():[];if(r.length){if(i=r[this.id],i.buttons)for(let s=0;s<this.buttons;s++)n&&this.buttonActions[s].repeat.trigger(i.buttons[s].pressed?1:0),i.buttons[s].pressed===!0?(this.pressed[`button${s}`]||(this.pressed[`button${s}`]=!0,this.buttonActions[s].pressed.trigger(1)),this.buttonActions[s].changed.trigger(1)):this.pressed[`button${s}`]&&(delete this.pressed[`button${s}`],this.buttonActions[s].released.trigger(0));if(i.axes)for(let s=0;s<this.axes;s++){const o=Math.floor(s/2),c=s%2===0?"horizontal":"vertical";Math.abs(this.axeValues[s])>this.axeStep&&(i.axes[s]===0||n)&&this.axesActions[o][c].repeat.trigger(i.axes[s]),Math.abs(this.axeValues[s]-i.axes[s])<this.axeStep||(i.axes[s]===0&&this.axeValues[s]!==0?(this.axesActions[o][c].changed.trigger(i.axes[s]),this.axesActions[o][c].released.trigger(i.axes[s]),this.axeValues[s]=i.axes[s]):this.axeValues[s]===0?(this.axesActions[o][c].changed.trigger(i.axes[s]),this.axesActions[o][c].pressed.trigger(i.axes[s]),this.axeValues[s]=i.axes[s]):(this.axesActions[o][c].changed.trigger(i.axes[s]),this.axeValues[s]=i.axes[s])),i.axes[s]===0&&(this.axeValues[s]=0)}}},on:function(i,n,r="changed"){if(i<0){const s=Math.floor((Math.abs(i)-1)/2),o=(Math.abs(i)-1)%2===0?"horizontal":"vertical";this.axesActions[s][o][r].on(n)}else this.buttonActions[i][r].on(n);return this},off:function(i){if(i<0){const n=Math.floor((Math.abs(i)-1)/2),r=(Math.abs(i)-1)%2===0?"horizontal":"vertical";this.axesActions[n][r].changed.offAll(),this.axesActions[n][r].pressed.offAll(),this.axesActions[n][r].released.offAll(),this.axesActions[n][r].repeat.offAll()}else this.buttonActions[i].changed.offAll(),this.buttonActions[i].pressed.offAll(),this.buttonActions[i].released.offAll(),this.buttonActions[i].repeat.offAll();return this}};for(let i=0;i<t.buttons;i++)t.buttonActions[i]=C();for(let i=0;i<t.axes;i++)t.axesActions[i]={vertical:C(),horizontal:C()},t.axeValues[i]=[0,0];return e.hapticActuators?typeof e.hapticActuators.pulse=="function"?(t.hapticActuator=e.hapticActuators,t.vibrationMode=0,t.vibration=!0):e.hapticActuators[0]&&typeof e.hapticActuators[0].pulse=="function"&&(t.hapticActuator=e.hapticActuators[0],t.vibrationMode=0,t.vibration=!0):e.vibrationActuator&&typeof e.vibrationActuator.playEffect=="function"&&(t.hapticActuator=e.vibrationActuator,t.vibrationMode=1,t.vibration=!0),t}},m={gamepads:{},axeThreshold:[1],isReady:()=>navigator.getGamepads&&typeof navigator.getGamepads=="function"||navigator.getGamepads&&typeof navigator.webkitGetGamepads=="function"||!1,onConnect:new v,onDisconnect:new v,onBeforeCycle:new v,onAfterCycle:new v,getGamepads:function(){return this.gamepads},getGamepad:function(e){return this.gamepads[e]?this.gamepads[e]:null},set:function(e,t){if(["axeThreshold"].indexOf(e)>=0){if(e==="axeThreshold"&&(!parseFloat(t)||t<0||t>1)){console.error("gamepad: invalid value number");return}if(this[e]=t,e==="axeThreshold"){const n=this.getGamepads(),r=Object.keys(n);for(let s=0;s<r.length;s++)n[r[s]].set("axeThreshold",this.axeThreshold)}}else console.error("gamepad: invalid property")},checkStatus:function(){const e=window.requestAnimationFrame||window.webkitRequestAnimationFrame,t=Object.keys(m.gamepads);m.onBeforeCycle.trigger();for(let i=0;i<t.length;i++)m.gamepads[t[i]].checkStatus();m.onAfterCycle.trigger(),t.length>0&&e(m.checkStatus)},init:function(){window.addEventListener("gamepadconnected",e=>{const t=e.gamepad||e.detail.gamepad;if(window.gamepads||(window.gamepads={}),t){if(!window.gamepads[t.index]){window.gamepads[t.index]=t;const i=N.init(t);i.set("axeThreshold",this.axeThreshold),this.gamepads[i.id]=i,this.onConnect.trigger(this.gamepads[i.id])}Object.keys(this.gamepads).length===1&&this.checkStatus()}}),window.addEventListener("gamepaddisconnected",e=>{const t=e.gamepad||e.detail.gamepad;t&&(this.onDisconnect.trigger(this.gamepads[t.index]),delete window.gamepads[t.index],delete this.gamepads[t.index])})},on:function(e,t){switch(e){case"connect":this.onConnect.on(t);break;case"disconnect":this.onDisconnect.on(t);break;case"beforeCycle":this.onBeforeCycle.on(t);break;case"afterCycle":this.onAfterCycle.on(t);break;default:console.error("gamepad: unknown custom event");break}return this},off:function(e,t){switch(e){case"connect":this.onConnect.off(t);break;case"disconnect":this.onDisconnect.off(t);break;case"beforeCycle":this.onBeforeCycle.off(t);break;case"afterCycle":this.onAfterCycle.off(t);break;default:console.error("gamepad: unknown event");break}return this}};m.init();var M=typeof navigator<"u"?navigator.userAgent.toLowerCase().indexOf("firefox")>0:!1;function j(e,t,i,n){e.addEventListener?e.addEventListener(t,i,n):e.attachEvent&&e.attachEvent("on".concat(t),function(){i(window.event)})}function X(e,t){for(var i=t.slice(0,t.length-1),n=0;n<i.length;n++)i[n]=e[i[n].toLowerCase()];return i}function F(e){typeof e!="string"&&(e=""),e=e.replace(/\s/g,"");for(var t=e.split(","),i=t.lastIndexOf("");i>=0;)t[i-1]+=",",t.splice(i,1),i=t.lastIndexOf("");return t}function G(e,t){for(var i=e.length>=t.length?e:t,n=e.length>=t.length?t:e,r=!0,s=0;s<i.length;s++)n.indexOf(i[s])===-1&&(r=!1);return r}var K={backspace:8,"⌫":8,tab:9,clear:12,enter:13,"↩":13,return:13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,delete:46,ins:45,insert:45,home:36,end:35,pageup:33,pagedown:34,capslock:20,num_0:96,num_1:97,num_2:98,num_3:99,num_4:100,num_5:101,num_6:102,num_7:103,num_8:104,num_9:105,num_multiply:106,num_add:107,num_enter:108,num_subtract:109,num_decimal:110,num_divide:111,"⇪":20,",":188,".":190,"/":191,"`":192,"-":M?173:189,"=":M?61:187,";":M?59:186,"'":222,"[":219,"]":221,"\\":220},A={"⇧":16,shift:16,"⌥":18,alt:18,option:18,"⌃":17,ctrl:17,control:17,"⌘":91,cmd:91,command:91},T={16:"shiftKey",18:"altKey",17:"ctrlKey",91:"metaKey",shiftKey:16,ctrlKey:17,altKey:18,metaKey:91},h={16:!1,18:!1,17:!1,91:!1},d={};for(var O=1;O<20;O++)K["f".concat(O)]=111+O;var f=[],I=!1,H="all",Y=[],E=function(t){return K[t.toLowerCase()]||A[t.toLowerCase()]||t.toUpperCase().charCodeAt(0)},D=function(t){return Object.keys(K).find(function(i){return K[i]===t})},ee=function(t){return Object.keys(A).find(function(i){return A[i]===t})};function $(e){H=e||"all"}function k(){return H||"all"}function te(){return f.slice(0)}function ie(){return f.map(function(e){return D(e)||ee(e)||String.fromCharCode(e)})}function ne(e){var t=e.target||e.srcElement,i=t.tagName,n=!0;return(t.isContentEditable||(i==="INPUT"||i==="TEXTAREA"||i==="SELECT")&&!t.readOnly)&&(n=!1),n}function se(e){return typeof e=="string"&&(e=E(e)),f.indexOf(e)!==-1}function re(e,t){var i,n;e||(e=k());for(var r in d)if(Object.prototype.hasOwnProperty.call(d,r))for(i=d[r],n=0;n<i.length;)i[n].scope===e?i.splice(n,1):n++;k()===e&&$(t||"all")}function oe(e){var t=e.keyCode||e.which||e.charCode,i=f.indexOf(t);if(i>=0&&f.splice(i,1),e.key&&e.key.toLowerCase()==="meta"&&f.splice(0,f.length),(t===93||t===224)&&(t=91),t in h){h[t]=!1;for(var n in A)A[n]===t&&(x[n]=!1)}}function ae(e){if(typeof e>"u")Object.keys(d).forEach(function(o){return delete d[o]});else if(Array.isArray(e))e.forEach(function(o){o.key&&L(o)});else if(typeof e=="object")e.key&&L(e);else if(typeof e=="string"){for(var t=arguments.length,i=new Array(t>1?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];var r=i[0],s=i[1];typeof r=="function"&&(s=r,r=""),L({key:e,scope:r,method:s,splitKey:"+"})}}var L=function(t){var i=t.key,n=t.scope,r=t.method,s=t.splitKey,o=s===void 0?"+":s,c=F(i);c.forEach(function(a){var l=a.split(o),g=l.length,p=l[g-1],u=p==="*"?"*":E(p);if(d[u]){n||(n=k());var w=g>1?X(A,l):[];d[u]=d[u].filter(function(y){var b=r?y.method===r:!0;return!(b&&y.scope===n&&G(y.mods,w))})}})};function U(e,t,i,n){if(t.element===n){var r;if(t.scope===i||t.scope==="all"){r=t.mods.length>0;for(var s in h)Object.prototype.hasOwnProperty.call(h,s)&&(!h[s]&&t.mods.indexOf(+s)>-1||h[s]&&t.mods.indexOf(+s)===-1)&&(r=!1);(t.mods.length===0&&!h[16]&&!h[18]&&!h[17]&&!h[91]||r||t.shortcut==="*")&&t.method(e,t)===!1&&(e.preventDefault?e.preventDefault():e.returnValue=!1,e.stopPropagation&&e.stopPropagation(),e.cancelBubble&&(e.cancelBubble=!0))}}}function J(e,t){var i=d["*"],n=e.keyCode||e.which||e.charCode;if(x.filter.call(this,e)){if((n===93||n===224)&&(n=91),f.indexOf(n)===-1&&n!==229&&f.push(n),["ctrlKey","altKey","shiftKey","metaKey"].forEach(function(y){var b=T[y];e[y]&&f.indexOf(b)===-1?f.push(b):!e[y]&&f.indexOf(b)>-1?f.splice(f.indexOf(b),1):y==="metaKey"&&e[y]&&f.length===3&&(e.ctrlKey||e.shiftKey||e.altKey||(f=f.slice(f.indexOf(b))))}),n in h){h[n]=!0;for(var r in A)A[r]===n&&(x[r]=!0);if(!i)return}for(var s in h)Object.prototype.hasOwnProperty.call(h,s)&&(h[s]=e[T[s]]);e.getModifierState&&!(e.altKey&&!e.ctrlKey)&&e.getModifierState("AltGraph")&&(f.indexOf(17)===-1&&f.push(17),f.indexOf(18)===-1&&f.push(18),h[17]=!0,h[18]=!0);var o=k();if(i)for(var c=0;c<i.length;c++)i[c].scope===o&&(e.type==="keydown"&&i[c].keydown||e.type==="keyup"&&i[c].keyup)&&U(e,i[c],o,t);if(n in d){for(var a=0;a<d[n].length;a++)if((e.type==="keydown"&&d[n][a].keydown||e.type==="keyup"&&d[n][a].keyup)&&d[n][a].key){for(var l=d[n][a],g=l.splitKey,p=l.key.split(g),u=[],w=0;w<p.length;w++)u.push(E(p[w]));u.sort().join("")===f.sort().join("")&&U(e,l,o,t)}}}}function ce(e){return Y.indexOf(e)>-1}function x(e,t,i){f=[];var n=F(e),r=[],s="all",o=document,c=0,a=!1,l=!0,g="+",p=!1;for(i===void 0&&typeof t=="function"&&(i=t),Object.prototype.toString.call(t)==="[object Object]"&&(t.scope&&(s=t.scope),t.element&&(o=t.element),t.keyup&&(a=t.keyup),t.keydown!==void 0&&(l=t.keydown),t.capture!==void 0&&(p=t.capture),typeof t.splitKey=="string"&&(g=t.splitKey)),typeof t=="string"&&(s=t);c<n.length;c++)e=n[c].split(g),r=[],e.length>1&&(r=X(A,e)),e=e[e.length-1],e=e==="*"?"*":E(e),e in d||(d[e]=[]),d[e].push({keyup:a,keydown:l,scope:s,mods:r,shortcut:n[c],method:i,key:n[c],splitKey:g,element:o});typeof o<"u"&&!ce(o)&&window&&(Y.push(o),j(o,"keydown",function(u){J(u,o)},p),I||(I=!0,j(window,"focus",function(){f=[]},p)),j(o,"keyup",function(u){J(u,o),oe(u)},p))}function fe(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"all";Object.keys(d).forEach(function(i){var n=d[i].filter(function(r){return r.scope===t&&r.shortcut===e});n.forEach(function(r){r&&r.method&&r.method()})})}var S={getPressedKeyString:ie,setScope:$,getScope:k,deleteScope:re,getPressedKeyCodes:te,isPressed:se,filter:ne,trigger:fe,unbind:ae,keyMap:K,modifier:A,modifierMap:T};for(var P in S)Object.prototype.hasOwnProperty.call(S,P)&&(x[P]=S[P]);if(typeof window<"u"){var de=window.hotkeys;x.noConflict=function(e){return e&&window.hotkeys===x&&(window.hotkeys=de),x},window.hotkeys=x}const he={on:function(e,t,i="changed"){i==="repeat"?x(e,(n,r)=>{n.preventDefault(),t(1)}):x(e,{keyup:i==="released"||i==="changed"?!0:null,keydown:i==="pressed"||i==="changed"?!0:null},(r,s)=>{r.repeat||t(x.isPressed(e)===!0?1:0)})},off:function(e,t){x.unbind(e)}},q={supportedInputHandlers:["keyboard","gamepad"],handlers:{keyboard:{handler:he,enabled:!0},gamepad:{handler:void 0,enabled:!1}},definedActions:{},registeredActions:{keyboard:{},gamepad:{}},get gamepadEnabled(){return this.handlers.gamepad.enabled},set gamepadEnabled(e){this.handlers.gamepad.enabled=e},get keyboardEnabled(){return this.handlers.keyboard.enabled},set keyboardEnabled(e){this.handlers.keyboard.enabled=e},unregisterActionsCallbacks:{},init:function(){m.on("connect",e=>{if(!this.handlers.gamepad.handler){if(this.handlers.gamepad.handler=e,!this.handlers.gamepad.enabled)return;Object.entries(this.registeredActions.gamepad).forEach(([t,i])=>{var n;(n=this.handlers.gamepad.handler)==null||n.on(t,i.handler,i.event)})}}),m.on("disconnect",e=>{e.id===this.handlers.gamepad.handler.id&&(this.handlers.gamepad.handler=void 0)}),Object.entries(m.getGamepads()).find(([e,t])=>{t!==null&&t.id!==this.handlers.gamepad.handler.id&&(this.handlers.gamepad.handler=t)})},defineInputActions:function(e,t){Object.entries(e).map(([i,n])=>{if(!(t!=null&&t.override)&&this.definedActions[i])throw new Error(`${i} action has already been defined as a dependancy.`);this.definedActions[i]=n})},onInputActions:function(e,t,i){const n=new Set;Object.entries(t).forEach(([s,o])=>{this.definedActions[s].forEach(a=>{var p,u,w,y;const l=this.registeredActions[a.type][a.key];l&&(n.add(l.id),(p=this.handlers[a.type].handler)==null||p.off(a.key,l.handler));const g=b=>{var R,V;if(!this.handlers[a.type].enabled)return;if(!b){o();return}const z=b===1?((R=a.options)==null?void 0:R.value)??1:b===0?0:(((V=a.options)==null?void 0:V.value)??1)/1*b;o(z)};this.registeredActions[a.type][a.key]={handler:g,id:e,event:(u=a.options)==null?void 0:u.event},g.bind(this),this.handlers[a.type].enabled&&((y=this.handlers[a.type].handler)==null||y.on(a.key,g,(w=a.options)==null?void 0:w.event))})}),this.unregisterActionsCallbacks[e]=i,this.supportedInputHandlers.forEach(s=>{Object.entries(this.registeredActions[s]).forEach(([o,c])=>{var a;n.has(c.id)&&((a=this.handlers[s].handler)==null||a.off(o,c.handler),delete this.registeredActions[s][o])})});for(var r of Array.from(n.values()))this.unregisterActionsCallbacks[r]&&this.unregisterActionsCallbacks[r]()},offInputActions:function(e){this.supportedInputHandlers.forEach(t=>{Object.entries(this.registeredActions[t]).forEach(([i,n])=>{e===n.id&&delete this.registeredActions[t][i]})})}};q.init();module.exports=q;