var $ = Object.defineProperty;
var z = (e, t, n) => t in e ? $(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var R = (e, t, n) => (z(e, typeof t != "symbol" ? t + "" : t, n), n);
class m {
  constructor() {
    R(this, "handlers", []);
  }
  on(t) {
    this.handlers.push(t);
  }
  off(t) {
    this.handlers = this.handlers.filter((n) => n !== t);
  }
  offAll() {
    this.handlers = [];
  }
  once(t) {
    const n = (i) => {
      t(i), this.off(n);
    };
    this.on(n);
  }
  async trigger(t) {
    const n = this.handlers.slice(0).map(async (i) => i(t));
    await Promise.all(n);
  }
  expose() {
    return this;
  }
}
const J = {
  event: "change"
};
var _;
(function(e) {
  e[e.LeftJoystickAxeX = -1] = "LeftJoystickAxeX", e[e.LeftJoystickAxeY = -2] = "LeftJoystickAxeY", e[e.RightJoystickAxeX = -3] = "RightJoystickAxeX", e[e.RightJoystickAxeY = -4] = "RightJoystickAxeY", e[e.KeyA = 1] = "KeyA", e[e.KeyB = 0] = "KeyB", e[e.KeyX = 3] = "KeyX", e[e.KeyY = 2] = "KeyY", e[e.KeyUp = 12] = "KeyUp", e[e.KeyDown = 13] = "KeyDown", e[e.KeyLeft = 14] = "KeyLeft", e[e.KeyRight = 15] = "KeyRight", e[e.KeyR1 = 5] = "KeyR1", e[e.KeyR2 = 7] = "KeyR2", e[e.KeyL1 = 4] = "KeyL1", e[e.KeyL2 = 6] = "KeyL2", e[e.KeyStart = 16] = "KeyStart", e[e.KeyOpts = 17] = "KeyOpts", e[e.KeyPlus = 9] = "KeyPlus", e[e.KeyMinus = 8] = "KeyMinus";
})(_ || (_ = {}));
const E = () => ({
  changed: new m(),
  pressed: new m(),
  released: new m(),
  repeat: new m()
}), q = {
  init: function(e) {
    let t = {
      id: e.index,
      buttons: e.buttons.length,
      axes: Math.floor(e.axes.length / 2),
      axeValues: [],
      axeThreshold: [1],
      axeStep: 0.15,
      hapticActuator: null,
      vibrationMode: -1,
      vibration: !1,
      mapping: e.mapping,
      buttonActions: {},
      axesActions: {},
      pressed: {},
      set: function(n, i) {
        if (["axeThreshold"].indexOf(n) >= 0) {
          if (n === "axeThreshold" && (!parseFloat(i) || i < 0 || i > 1)) {
            console.error("gamepad: invalid value number");
            return;
          }
          this[n] = i;
        } else
          console.error("gamepad: invalid property");
      },
      vibrate: function(n = 0.75, i = 500) {
        if (this.hapticActuator)
          switch (this.vibrationMode) {
            case 0:
              return this.hapticActuator.pulse(n, i);
            case 1:
              return this.hapticActuator.playEffect("dual-rumble", {
                duration: i,
                strongMagnitude: n,
                weakMagnitude: n
              });
          }
      },
      checkStatus: function() {
        let n = {};
        const i = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];
        if (i.length) {
          if (n = i[this.id], n.buttons)
            for (let s = 0; s < this.buttons; s++)
              n.buttons[s].pressed === !0 ? (this.pressed[`button${s}`] || (this.pressed[`button${s}`] = !0, this.buttonActions[s].pressed.trigger(1)), this.buttonActions[s].changed.trigger(1)) : this.pressed[`button${s}`] && (delete this.pressed[`button${s}`], this.buttonActions[s].released.trigger(0));
          if (n.axes)
            for (let s = 0; s < this.axes; s++) {
              const r = s % 2 === 0 ? "horizontal" : "vertical";
              Math.abs(this.axeValues[s] - n.axes[s]) < this.axeStep || (n.axes[s] === 0 && this.axeValues[s] !== 0 ? (this.axesActions[s][r].changed.trigger(n.axes[s]), this.axesActions[s][r].released.trigger(n.axes[s]), this.axeValues[s] = n.axes[s]) : this.axeValues[s] === 0 ? (this.axesActions[s][r].changed.trigger(n.axes[s]), this.axesActions[s][r].pressed.trigger(n.axes[s]), this.axeValues[s] = n.axes[s]) : (this.axesActions[s][r].changed.trigger(n.axes[s]), this.axeValues[s] = n.axes[s]));
            }
        }
      },
      on: function(n, i, s) {
        const r = s ?? J;
        if (n < 0) {
          const o = Math.floor((Math.abs(n) - 1) / 2), d = (Math.abs(n) - 1) % 2 === 0 ? "horizontal" : "vertical";
          this.axesActions[o][d][r.event].on(i);
        } else
          this.buttonActions[n][r.event].on(i);
        return this;
      },
      off: function(n) {
        if (n < 0) {
          const i = Math.floor((Math.abs(n) - 1) / 2), s = (Math.abs(n) - 1) % 2 === 0 ? "horizontal" : "vertical";
          this.axesActions[i][s].changed.offAll(), this.axesActions[i][s].pressed.offAll(), this.axesActions[i][s].released.offAll(), this.axesActions[i][s].repeat.offAll();
        } else
          this.buttonActions[n].changed.offAll(), this.buttonActions[n].pressed.offAll(), this.buttonActions[n].released.offAll(), this.buttonActions[n].repeat.offAll();
        return this;
      },
      after: function(n, i) {
        return this;
      },
      before: function(n, i) {
        return this;
      }
    };
    for (let n = 0; n < t.buttons; n++)
      t.buttonActions[n] = E();
    for (let n = 0; n < t.axes; n++)
      t.axesActions[n] = {
        vertical: E(),
        horizontal: E()
      }, t.axeValues[n] = [0, 0];
    return e.hapticActuators ? typeof e.hapticActuators.pulse == "function" ? (t.hapticActuator = e.hapticActuators, t.vibrationMode = 0, t.vibration = !0) : e.hapticActuators[0] && typeof e.hapticActuators[0].pulse == "function" && (t.hapticActuator = e.hapticActuators[0], t.vibrationMode = 0, t.vibration = !0) : e.vibrationActuator && typeof e.vibrationActuator.playEffect == "function" && (t.hapticActuator = e.vibrationActuator, t.vibrationMode = 1, t.vibration = !0), t;
  }
}, x = {
  gamepads: {},
  axeThreshold: [1],
  isReady: () => navigator.getGamepads && typeof navigator.getGamepads == "function" || navigator.getGamepads && typeof navigator.webkitGetGamepads == "function" || !1,
  onConnect: new m(),
  onDisconnect: new m(),
  onBeforeCycle: new m(),
  onAfterCycle: new m(),
  getGamepads: function() {
    return this.gamepads;
  },
  getGamepad: function(e) {
    return this.gamepads[e] ? this.gamepads[e] : null;
  },
  set: function(e, t) {
    if (["axeThreshold"].indexOf(e) >= 0) {
      if (e === "axeThreshold" && (!parseFloat(t) || t < 0 || t > 1)) {
        console.error("gamepad: invalid value number");
        return;
      }
      if (this[e] = t, e === "axeThreshold") {
        const i = this.getGamepads(), s = Object.keys(i);
        for (let r = 0; r < s.length; r++)
          i[s[r]].set("axeThreshold", this.axeThreshold);
      }
    } else
      console.error("gamepad: invalid property");
  },
  checkStatus: function() {
    const e = window.requestAnimationFrame || window.webkitRequestAnimationFrame, t = Object.keys(x.gamepads);
    x.onBeforeCycle.trigger();
    for (let n = 0; n < t.length; n++)
      x.gamepads[t[n]].checkStatus();
    x.onAfterCycle.trigger(), t.length > 0 && e(x.checkStatus);
  },
  init: function() {
    window.addEventListener("gamepadconnected", (e) => {
      const t = e.gamepad || e.detail.gamepad;
      if (window.gamepads || (window.gamepads = {}), t) {
        if (!window.gamepads[t.index]) {
          window.gamepads[t.index] = t;
          const n = q.init(t);
          n.set("axeThreshold", this.axeThreshold), this.gamepads[n.id] = n, this.onConnect.trigger(this.gamepads[n.id]);
        }
        Object.keys(this.gamepads).length === 1 && this.checkStatus();
      }
    }), window.addEventListener("gamepaddisconnected", (e) => {
      const t = e.gamepad || e.detail.gamepad;
      t && (this.onDisconnect.trigger(this.gamepads[t.index]), delete window.gamepads[t.index], delete this.gamepads[t.index]);
    });
  },
  on: function(e, t) {
    switch (e) {
      case "connect":
        this.onConnect.on(t);
        break;
      case "disconnect":
        this.onDisconnect.on(t);
        break;
      case "beforeCycle":
        this.onBeforeCycle.on(t);
        break;
      case "afterCycle":
        this.onAfterCycle.on(t);
        break;
      default:
        console.error("gamepad: unknown custom event");
        break;
    }
    return this;
  },
  off: function(e, t) {
    switch (e) {
      case "connect":
        this.onConnect.off(t);
        break;
      case "disconnect":
        this.onDisconnect.off(t);
        break;
      case "beforeCycle":
        this.onBeforeCycle.off(t);
        break;
      case "afterCycle":
        this.onAfterCycle.off(t);
        break;
      default:
        console.error("gamepad: unknown event");
        break;
    }
    return this;
  }
};
x.init();
var M = typeof navigator < "u" ? navigator.userAgent.toLowerCase().indexOf("firefox") > 0 : !1;
function L(e, t, n, i) {
  e.addEventListener ? e.addEventListener(t, n, i) : e.attachEvent && e.attachEvent("on".concat(t), function() {
    n(window.event);
  });
}
function H(e, t) {
  for (var n = t.slice(0, t.length - 1), i = 0; i < n.length; i++)
    n[i] = e[n[i].toLowerCase()];
  return n;
}
function X(e) {
  typeof e != "string" && (e = ""), e = e.replace(/\s/g, "");
  for (var t = e.split(","), n = t.lastIndexOf(""); n >= 0; )
    t[n - 1] += ",", t.splice(n, 1), n = t.lastIndexOf("");
  return t;
}
function Q(e, t) {
  for (var n = e.length >= t.length ? e : t, i = e.length >= t.length ? t : e, s = !0, r = 0; r < n.length; r++)
    i.indexOf(n[r]) === -1 && (s = !1);
  return s;
}
var K = {
  backspace: 8,
  "⌫": 8,
  tab: 9,
  clear: 12,
  enter: 13,
  "↩": 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  num_0: 96,
  num_1: 97,
  num_2: 98,
  num_3: 99,
  num_4: 100,
  num_5: 101,
  num_6: 102,
  num_7: 103,
  num_8: 104,
  num_9: 105,
  num_multiply: 106,
  num_add: 107,
  num_enter: 108,
  num_subtract: 109,
  num_decimal: 110,
  num_divide: 111,
  "⇪": 20,
  ",": 188,
  ".": 190,
  "/": 191,
  "`": 192,
  "-": M ? 173 : 189,
  "=": M ? 61 : 187,
  ";": M ? 59 : 186,
  "'": 222,
  "[": 219,
  "]": 221,
  "\\": 220
}, b = {
  // shiftKey
  "⇧": 16,
  shift: 16,
  // altKey
  "⌥": 18,
  alt: 18,
  option: 18,
  // ctrlKey
  "⌃": 17,
  ctrl: 17,
  control: 17,
  // metaKey
  "⌘": 91,
  cmd: 91,
  command: 91
}, T = {
  16: "shiftKey",
  18: "altKey",
  17: "ctrlKey",
  91: "metaKey",
  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
}, l = {
  16: !1,
  18: !1,
  17: !1,
  91: !1
}, f = {};
for (var O = 1; O < 20; O++)
  K["f".concat(O)] = 111 + O;
var c = [], B = !1, F = "all", U = [], C = function(t) {
  return K[t.toLowerCase()] || b[t.toLowerCase()] || t.toUpperCase().charCodeAt(0);
}, W = function(t) {
  return Object.keys(K).find(function(n) {
    return K[n] === t;
  });
}, Z = function(t) {
  return Object.keys(b).find(function(n) {
    return b[n] === t;
  });
};
function Y(e) {
  F = e || "all";
}
function k() {
  return F || "all";
}
function N() {
  return c.slice(0);
}
function G() {
  return c.map(function(e) {
    return W(e) || Z(e) || String.fromCharCode(e);
  });
}
function D(e) {
  var t = e.target || e.srcElement, n = t.tagName, i = !0;
  return (t.isContentEditable || (n === "INPUT" || n === "TEXTAREA" || n === "SELECT") && !t.readOnly) && (i = !1), i;
}
function ee(e) {
  return typeof e == "string" && (e = C(e)), c.indexOf(e) !== -1;
}
function te(e, t) {
  var n, i;
  e || (e = k());
  for (var s in f)
    if (Object.prototype.hasOwnProperty.call(f, s))
      for (n = f[s], i = 0; i < n.length; )
        n[i].scope === e ? n.splice(i, 1) : i++;
  k() === e && Y(t || "all");
}
function ne(e) {
  var t = e.keyCode || e.which || e.charCode, n = c.indexOf(t);
  if (n >= 0 && c.splice(n, 1), e.key && e.key.toLowerCase() === "meta" && c.splice(0, c.length), (t === 93 || t === 224) && (t = 91), t in l) {
    l[t] = !1;
    for (var i in b)
      b[i] === t && (p[i] = !1);
  }
}
function ie(e) {
  if (typeof e > "u")
    Object.keys(f).forEach(function(o) {
      return delete f[o];
    });
  else if (Array.isArray(e))
    e.forEach(function(o) {
      o.key && S(o);
    });
  else if (typeof e == "object")
    e.key && S(e);
  else if (typeof e == "string") {
    for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      n[i - 1] = arguments[i];
    var s = n[0], r = n[1];
    typeof s == "function" && (r = s, s = ""), S({
      key: e,
      scope: s,
      method: r,
      splitKey: "+"
    });
  }
}
var S = function(t) {
  var n = t.key, i = t.scope, s = t.method, r = t.splitKey, o = r === void 0 ? "+" : r, d = X(n);
  d.forEach(function(a) {
    var h = a.split(o), u = h.length, y = h[u - 1], g = y === "*" ? "*" : C(y);
    if (f[g]) {
      i || (i = k());
      var w = u > 1 ? H(b, h) : [];
      f[g] = f[g].filter(function(A) {
        var v = s ? A.method === s : !0;
        return !(v && A.scope === i && Q(A.mods, w));
      });
    }
  });
};
function I(e, t, n, i) {
  if (t.element === i) {
    var s;
    if (t.scope === n || t.scope === "all") {
      s = t.mods.length > 0;
      for (var r in l)
        Object.prototype.hasOwnProperty.call(l, r) && (!l[r] && t.mods.indexOf(+r) > -1 || l[r] && t.mods.indexOf(+r) === -1) && (s = !1);
      (t.mods.length === 0 && !l[16] && !l[18] && !l[17] && !l[91] || s || t.shortcut === "*") && t.method(e, t) === !1 && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation && e.stopPropagation(), e.cancelBubble && (e.cancelBubble = !0));
    }
  }
}
function V(e, t) {
  var n = f["*"], i = e.keyCode || e.which || e.charCode;
  if (p.filter.call(this, e)) {
    if ((i === 93 || i === 224) && (i = 91), c.indexOf(i) === -1 && i !== 229 && c.push(i), ["ctrlKey", "altKey", "shiftKey", "metaKey"].forEach(function(A) {
      var v = T[A];
      e[A] && c.indexOf(v) === -1 ? c.push(v) : !e[A] && c.indexOf(v) > -1 ? c.splice(c.indexOf(v), 1) : A === "metaKey" && e[A] && c.length === 3 && (e.ctrlKey || e.shiftKey || e.altKey || (c = c.slice(c.indexOf(v))));
    }), i in l) {
      l[i] = !0;
      for (var s in b)
        b[s] === i && (p[s] = !0);
      if (!n)
        return;
    }
    for (var r in l)
      Object.prototype.hasOwnProperty.call(l, r) && (l[r] = e[T[r]]);
    e.getModifierState && !(e.altKey && !e.ctrlKey) && e.getModifierState("AltGraph") && (c.indexOf(17) === -1 && c.push(17), c.indexOf(18) === -1 && c.push(18), l[17] = !0, l[18] = !0);
    var o = k();
    if (n)
      for (var d = 0; d < n.length; d++)
        n[d].scope === o && (e.type === "keydown" && n[d].keydown || e.type === "keyup" && n[d].keyup) && I(e, n[d], o, t);
    if (i in f) {
      for (var a = 0; a < f[i].length; a++)
        if ((e.type === "keydown" && f[i][a].keydown || e.type === "keyup" && f[i][a].keyup) && f[i][a].key) {
          for (var h = f[i][a], u = h.splitKey, y = h.key.split(u), g = [], w = 0; w < y.length; w++)
            g.push(C(y[w]));
          g.sort().join("") === c.sort().join("") && I(e, h, o, t);
        }
    }
  }
}
function se(e) {
  return U.indexOf(e) > -1;
}
function p(e, t, n) {
  c = [];
  var i = X(e), s = [], r = "all", o = document, d = 0, a = !1, h = !0, u = "+", y = !1;
  for (n === void 0 && typeof t == "function" && (n = t), Object.prototype.toString.call(t) === "[object Object]" && (t.scope && (r = t.scope), t.element && (o = t.element), t.keyup && (a = t.keyup), t.keydown !== void 0 && (h = t.keydown), t.capture !== void 0 && (y = t.capture), typeof t.splitKey == "string" && (u = t.splitKey)), typeof t == "string" && (r = t); d < i.length; d++)
    e = i[d].split(u), s = [], e.length > 1 && (s = H(b, e)), e = e[e.length - 1], e = e === "*" ? "*" : C(e), e in f || (f[e] = []), f[e].push({
      keyup: a,
      keydown: h,
      scope: r,
      mods: s,
      shortcut: i[d],
      method: n,
      key: i[d],
      splitKey: u,
      element: o
    });
  typeof o < "u" && !se(o) && window && (U.push(o), L(o, "keydown", function(g) {
    V(g, o);
  }, y), B || (B = !0, L(window, "focus", function() {
    c = [];
  }, y)), L(o, "keyup", function(g) {
    V(g, o), ne(g);
  }, y));
}
function re(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "all";
  Object.keys(f).forEach(function(n) {
    var i = f[n].filter(function(s) {
      return s.scope === t && s.shortcut === e;
    });
    i.forEach(function(s) {
      s && s.method && s.method();
    });
  });
}
var j = {
  getPressedKeyString: G,
  setScope: Y,
  getScope: k,
  deleteScope: te,
  getPressedKeyCodes: N,
  isPressed: ee,
  filter: D,
  trigger: re,
  unbind: ie,
  keyMap: K,
  modifier: b,
  modifierMap: T
};
for (var P in j)
  Object.prototype.hasOwnProperty.call(j, P) && (p[P] = j[P]);
if (typeof window < "u") {
  var oe = window.hotkeys;
  p.noConflict = function(e) {
    return e && window.hotkeys === p && (window.hotkeys = oe), p;
  }, window.hotkeys = p;
}
const ae = {
  on: function(e, t, n) {
    const i = n ?? J;
    if (i.event === "repeat")
      p(e, (s, r) => {
        s.preventDefault(), t(i.value);
      });
    else {
      const s = {
        keyup: (n == null ? void 0 : n.event) === "released" || (n == null ? void 0 : n.event) === "changed" ? !0 : null,
        keydown: (n == null ? void 0 : n.event) === "pressed" || (n == null ? void 0 : n.event) === "changed" ? !0 : null
      };
      p(e, s, (r, o) => {
        r.repeat || t(i.value);
      });
    }
  },
  off: function(e) {
    p.unbind(e);
  }
}, fe = {
  supportedInputHandlers: ["keyboard", "gamepad"],
  handlers: {
    keyboard: {
      handler: ae,
      enabled: !0
    },
    gamepad: {
      handler: void 0,
      enabled: !1
    }
  },
  definedActions: {},
  registeredActions: {
    keyboard: {},
    gamepad: {}
  },
  unregisterActionsCallbacks: {},
  init: function() {
    x.on("connect", (e) => {
      this.handlers.gamepad.handler || (console.log("gamepad connected with id ", e.id), this.handlers.gamepad.handler = e);
    }), x.on("disconnect", (e) => {
      e.id === this.handlers.gamepad.handler.id && (console.log("gamepad disconnected with id ", e.id), this.handlers.gamepad.handler = void 0);
    }), Object.entries(x.getGamepads()).find(([e, t]) => {
      t !== null && t.id !== this.handlers.gamepad.handler.id && (this.handlers.gamepad.handler = t);
    });
  },
  setActiveInputHandlers: function(e) {
    e.includes("gamepad") ? this.handlers.gamepad.enabled = !0 : this.handlers.gamepad.enabled = !1, e.includes("keyboard") ? this.handlers.keyboard.enabled = !0 : this.handlers.keyboard.enabled = !1;
  },
  defineInputActions: function(e, t) {
    Object.entries(e).map(([n, i]) => {
      if (!(t != null && t.override) && this.definedActions[n])
        throw new Error(`${n} action has already been defined as a dependancy.`);
      this.definedActions[n] = i;
    });
  },
  onInputActions: function(e, t, n) {
    const i = /* @__PURE__ */ new Set();
    console.log("registering", e), Object.entries(t).forEach(([r, o]) => {
      this.definedActions[r].forEach((a) => {
        var h, u;
        this.registeredActions[a.type][a.key] && (i.add(this.registeredActions[a.type][a.key].id), (h = this.handlers[a.type].handler) == null || h.off(a.key)), (u = this.handlers[a.type].handler) == null || u.on(a.key, o, a.options), this.registeredActions[a.type][a.key] = {
          handler: o,
          id: e
        };
      });
    }), this.unregisterActionsCallbacks[e] = n, this.supportedInputHandlers.forEach((r) => {
      Object.entries(this.registeredActions[r]).forEach(([o, d]) => {
        var a;
        i.has(d.id) && ((a = this.handlers[r].handler) == null || a.off(o), delete this.registeredActions[r][o]);
      });
    });
    for (var s of Array.from(i.values()))
      this.unregisterActionsCallbacks[s] && this.unregisterActionsCallbacks[s]();
  },
  offInputActions: function(e) {
    this.supportedInputHandlers.forEach((t) => {
      Object.entries(this.registeredActions[t]).forEach(([n, i]) => {
        e === i.id && delete this.registeredActions[t][n];
      });
    });
  }
};
export {
  fe as default
};
