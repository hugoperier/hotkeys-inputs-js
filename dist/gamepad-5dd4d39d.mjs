var u = Object.defineProperty;
var f = (i, e, t) => e in i ? u(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var l = (i, e, t) => (f(i, typeof e != "symbol" ? e + "" : e, t), t);
class h {
  constructor() {
    l(this, "handlers", []);
  }
  on(e) {
    this.handlers.push(e);
  }
  off(e) {
    this.handlers = this.handlers.filter((t) => t !== e);
  }
  offAll() {
    this.handlers = [];
  }
  async trigger(e) {
    const t = this.handlers.slice(0).map(async (a) => a(e));
    await Promise.all(t);
  }
}
const x = {
  lastUpdate: Date.now(),
  tick: function(i = 10) {
    var e = Date.now(), t = e - this.lastUpdate;
    return t > 1e3 / i ? (this.lastUpdate = e, !0) : !1;
  }
}, c = () => ({
  changed: new h(),
  pressed: new h(),
  released: new h(),
  repeat: new h()
}), p = {
  init: function(i) {
    let e = {
      id: i.index,
      buttons: i.buttons.length,
      axes: Math.floor(i.axes.length / 2),
      axeValues: [],
      axeStep: 0.15,
      hapticActuator: null,
      vibrationMode: -1,
      vibration: !1,
      mapping: i.mapping,
      buttonActions: {},
      axesActions: {},
      pressed: {},
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
            for (let s = 0; s < this.buttons; s++)
              a && this.buttonActions[s].repeat.trigger(t.buttons[s].pressed ? 1 : 0), t.buttons[s].pressed === !0 ? (this.pressed[`button${s}`] || (this.pressed[`button${s}`] = !0, this.buttonActions[s].pressed.trigger(1)), this.buttonActions[s].changed.trigger(1)) : this.pressed[`button${s}`] && (delete this.pressed[`button${s}`], this.buttonActions[s].released.trigger(0));
          if (t.axes)
            for (let s = 0; s < this.axes; s++) {
              const n = Math.floor(s / 2), r = s % 2 === 0 ? "horizontal" : "vertical";
              Math.abs(this.axeValues[s]) > this.axeStep && (t.axes[s] === 0 || a) && this.axesActions[n][r].repeat.trigger(t.axes[s]), Math.abs(this.axeValues[s] - t.axes[s]) < this.axeStep || (t.axes[s] === 0 && this.axeValues[s] !== 0 ? (this.axesActions[n][r].changed.trigger(t.axes[s]), this.axesActions[n][r].released.trigger(t.axes[s]), this.axeValues[s] = t.axes[s]) : this.axeValues[s] === 0 ? (this.axesActions[n][r].changed.trigger(t.axes[s]), this.axesActions[n][r].pressed.trigger(t.axes[s]), this.axeValues[s] = t.axes[s]) : (this.axesActions[n][r].changed.trigger(t.axes[s]), this.axeValues[s] = t.axes[s])), t.axes[s] === 0 && (this.axeValues[s] = 0);
            }
        }
      },
      on: function(t, a, o = "changed") {
        if (t < 0) {
          const s = Math.floor((Math.abs(t) - 1) / 2), n = (Math.abs(t) - 1) % 2 === 0 ? "horizontal" : "vertical";
          this.axesActions[s][n][o].on(a);
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
    for (let t = 0; t < e.buttons; t++)
      e.buttonActions[t] = c();
    for (let t = 0; t < e.axes; t++)
      e.axesActions[t] = {
        vertical: c(),
        horizontal: c()
      };
    return i.hapticActuators ? typeof i.hapticActuators.pulse == "function" ? (e.hapticActuator = i.hapticActuators, e.vibrationMode = 0, e.vibration = !0) : i.hapticActuators[0] && typeof i.hapticActuators[0].pulse == "function" && (e.hapticActuator = i.hapticActuators[0], e.vibrationMode = 0, e.vibration = !0) : i.vibrationActuator && typeof i.vibrationActuator.playEffect == "function" && (e.hapticActuator = i.vibrationActuator, e.vibrationMode = 1, e.vibration = !0), e.axeValues = i.axes, e;
  }
};
export {
  h as L,
  p as g
};
