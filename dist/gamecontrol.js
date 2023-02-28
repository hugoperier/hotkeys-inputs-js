"use strict";const i=require("./gamepad-24976dfc.js"),a={gamepads:{},axeThreshold:[1],isReady:()=>navigator.getGamepads&&typeof navigator.getGamepads=="function"||navigator.getGamepads&&typeof navigator.webkitGetGamepads=="function"||!1,onConnect:new i.LiteEvent,onDisconnect:new i.LiteEvent,onBeforeCycle:new i.LiteEvent,onAfterCycle:new i.LiteEvent,getGamepads:function(){return this.gamepads},getGamepad:function(n){return this.gamepads[n]?this.gamepads[n]:null},checkStatus:function(){const n=window.requestAnimationFrame||window.webkitRequestAnimationFrame,e=Object.keys(a.gamepads);a.onBeforeCycle.trigger();for(let t=0;t<e.length;t++)a.gamepads[e[t]].checkStatus();a.onAfterCycle.trigger(),e.length>0&&n(a.checkStatus)},init:function(){window.addEventListener("gamepadconnected",n=>{const e=n.gamepad||n.detail.gamepad;if(window.gamepads||(window.gamepads={}),e){if(!window.gamepads[e.index]){window.gamepads[e.index]=e;const t=i.gamepad.init(e);this.gamepads[t.id]=t,this.onConnect.trigger(this.gamepads[t.id])}Object.keys(this.gamepads).length===1&&this.checkStatus()}}),window.addEventListener("gamepaddisconnected",n=>{const e=n.gamepad||n.detail.gamepad;e&&(this.onDisconnect.trigger(this.gamepads[e.index]),delete window.gamepads[e.index],delete this.gamepads[e.index])})},on:function(n,e){switch(n){case"connect":this.onConnect.on(e);break;case"disconnect":this.onDisconnect.on(e);break;case"beforeCycle":this.onBeforeCycle.on(e);break;case"afterCycle":this.onAfterCycle.on(e);break;default:console.error("gamepad: unknown custom event");break}return this},off:function(n,e){switch(n){case"connect":this.onConnect.off(e);break;case"disconnect":this.onDisconnect.off(e);break;case"beforeCycle":this.onBeforeCycle.off(e);break;case"afterCycle":this.onAfterCycle.off(e);break;default:console.error("gamepad: unknown event");break}return this}};a.init();module.exports=a;
