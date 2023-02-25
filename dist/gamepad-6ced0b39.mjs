var f = Object.defineProperty;
var u = (i, s, t) => s in i ? f(i, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[s] = t;
var l = (i, s, t) => (u(i, typeof s != "symbol" ? s + "" : s, t), t);
class h {
  constructor() {
    l(this, "handlers", []);
  }
  on(s) {
    this.handlers.push(s);
  }
  off(s) {
    this.handlers = this.handlers.filter((t) => t !== s);
  }
  offAll() {
    this.handlers = [];
  }
  once(s) {
    const t = (a) => {
      s(a), this.off(t);
    };
    this.on(t);
  }
  async trigger(s) {
    const t = this.handlers.slice(0).map(async (a) => a(s));
    await Promise.all(t);
  }
  expose() {
    return this;
  }
}
const x = {
  lastUpdate: Date.now(),
  tick: function(i = 10) {
    var s = Date.now(), t = s - this.lastUpdate;
    return t > 1e3 / i ? (this.lastUpdate = s, !0) : !1;
  }
}, c = () => ({
  changed: new h(),
  pressed: new h(),
  released: new h(),
  repeat: new h()
}), d = {
  init: function(i) {
    let s = {
      id: i.index,
      buttons: i.buttons.length,
      axes: Math.floor(i.axes.length / 2),
      axeValues: [],
      axeThreshold: [1],
      axeStep: 0.15,
      hapticActuator: null,
      vibrationMode: -1,
      vibration: !1,
      mapping: i.mapping,
      buttonActions: {},
      axesActions: {},
      pressed: {},
      set: function(t, a) {
        if (["axeThreshold"].indexOf(t) >= 0) {
          if (t === "axeThreshold" && (!parseFloat(a) || a < 0 || a > 1)) {
            console.error("gamepad: invalid value number");
            return;
          }
          this[t] = a;
        } else
          console.error("gamepad: invalid property");
      },
      vibrate: function(t = 0.75, a = 500) {
        if (this.hapticActuator)
          switch (this.vibrationMode) {
            case 0:
              return this.hapticActuator.pulse(t, a);
            case 1:
              return this.hapticActuator.playEffect("dual-rumble", {
                duration: a,
                strongMagnitude: t,
                weakMagnitude: t
              });
          }
      },
      checkStatus: function() {
        let t = {};
        const a = x.tick(), o = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];
        if (o.length) {
          if (t = o[this.id], t.buttons)
            for (let e = 0; e < this.buttons; e++)
              a && this.buttonActions[e].repeat.trigger(t.buttons[e].pressed ? 1 : 0), t.buttons[e].pressed === !0 ? (this.pressed[`button${e}`] || (this.pressed[`button${e}`] = !0, this.buttonActions[e].pressed.trigger(1)), this.buttonActions[e].changed.trigger(1)) : this.pressed[`button${e}`] && (delete this.pressed[`button${e}`], this.buttonActions[e].released.trigger(0));
          if (t.axes)
            for (let e = 0; e < this.axes; e++) {
              const n = Math.floor(e / 2), r = e % 2 === 0 ? "horizontal" : "vertical";
              Math.abs(this.axeValues[e]) > this.axeStep && (t.axes[e] === 0 || a) && this.axesActions[n][r].repeat.trigger(t.axes[e]), Math.abs(this.axeValues[e] - t.axes[e]) < this.axeStep || (t.axes[e] === 0 && this.axeValues[e] !== 0 ? (this.axesActions[n][r].changed.trigger(t.axes[e]), this.axesActions[n][r].released.trigger(t.axes[e]), this.axeValues[e] = t.axes[e]) : this.axeValues[e] === 0 ? (this.axesActions[n][r].changed.trigger(t.axes[e]), this.axesActions[n][r].pressed.trigger(t.axes[e]), this.axeValues[e] = t.axes[e]) : (this.axesActions[n][r].changed.trigger(t.axes[e]), this.axeValues[e] = t.axes[e])), t.axes[e] === 0 && (this.axeValues[e] = 0);
            }
        }
      },
      on: function(t, a, o = "changed") {
        if (t < 0) {
          const e = Math.floor((Math.abs(t) - 1) / 2), n = (Math.abs(t) - 1) % 2 === 0 ? "horizontal" : "vertical";
          this.axesActions[e][n][o].on(a);
        } else
          this.buttonActions[t][o].on(a);
        return this;
      },
      off: function(t) {
        if (t < 0) {
          const a = Math.floor((Math.abs(t) - 1) / 2), o = (Math.abs(t) - 1) % 2 === 0 ? "horizontal" : "vertical";
          this.axesActions[a][o].changed.offAll(), this.axesActions[a][o].pressed.offAll(), this.axesActions[a][o].released.offAll(), this.axesActions[a][o].repeat.offAll();
        } else
          this.buttonActions[t].changed.offAll(), this.buttonActions[t].pressed.offAll(), this.buttonActions[t].released.offAll(), this.buttonActions[t].repeat.offAll();
        return this;
      }
    };
    for (let t = 0; t < s.buttons; t++)
      s.buttonActions[t] = c();
    for (let t = 0; t < s.axes; t++)
      s.axesActions[t] = {
        vertical: c(),
        horizontal: c()
      };
    return i.hapticActuators ? typeof i.hapticActuators.pulse == "function" ? (s.hapticActuator = i.hapticActuators, s.vibrationMode = 0, s.vibration = !0) : i.hapticActuators[0] && typeof i.hapticActuators[0].pulse == "function" && (s.hapticActuator = i.hapticActuators[0], s.vibrationMode = 0, s.vibration = !0) : i.vibrationActuator && typeof i.vibrationActuator.playEffect == "function" && (s.hapticActuator = i.vibrationActuator, s.vibrationMode = 1, s.vibration = !0), s.axeValues = i.axes, s;
  }
};
export {
  h as L,
  d as g
};
