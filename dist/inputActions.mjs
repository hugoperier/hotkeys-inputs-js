import k from "./gamecontrol.mjs";
import "./gamepad-6ced0b39.mjs";
var C = typeof navigator < "u" ? navigator.userAgent.toLowerCase().indexOf("firefox") > 0 : !1;
function x(e, t, r, n) {
  e.addEventListener ? e.addEventListener(t, r, n) : e.attachEvent && e.attachEvent("on".concat(t), function() {
    r(window.event);
  });
}
function U(e, t) {
  for (var r = t.slice(0, t.length - 1), n = 0; n < r.length; n++)
    r[n] = e[r[n].toLowerCase()];
  return r;
}
function B(e) {
  typeof e != "string" && (e = ""), e = e.replace(/\s/g, "");
  for (var t = e.split(","), r = t.lastIndexOf(""); r >= 0; )
    t[r - 1] += ",", t.splice(r, 1), r = t.lastIndexOf("");
  return t;
}
function V(e, t) {
  for (var r = e.length >= t.length ? e : t, n = e.length >= t.length ? t : e, i = !0, a = 0; a < r.length; a++)
    n.indexOf(r[a]) === -1 && (i = !1);
  return i;
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
  "-": C ? 173 : 189,
  "=": C ? 61 : 187,
  ";": C ? 59 : 186,
  "'": 222,
  "[": 219,
  "]": 221,
  "\\": 220
}, v = {
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
}, S = {
  16: "shiftKey",
  18: "altKey",
  17: "ctrlKey",
  91: "metaKey",
  shiftKey: 16,
  ctrlKey: 17,
  altKey: 18,
  metaKey: 91
}, u = {
  16: !1,
  18: !1,
  17: !1,
  91: !1
}, o = {};
for (var E = 1; E < 20; E++)
  K["f".concat(E)] = 111 + E;
var d = [], T = !1, D = "all", $ = [], A = function(t) {
  return K[t.toLowerCase()] || v[t.toLowerCase()] || t.toUpperCase().charCodeAt(0);
}, F = function(t) {
  return Object.keys(K).find(function(r) {
    return K[r] === t;
  });
}, X = function(t) {
  return Object.keys(v).find(function(r) {
    return v[r] === t;
  });
};
function G(e) {
  D = e || "all";
}
function O() {
  return D || "all";
}
function q() {
  return d.slice(0);
}
function z() {
  return d.map(function(e) {
    return F(e) || X(e) || String.fromCharCode(e);
  });
}
function J(e) {
  var t = e.target || e.srcElement, r = t.tagName, n = !0;
  return (t.isContentEditable || (r === "INPUT" || r === "TEXTAREA" || r === "SELECT") && !t.readOnly) && (n = !1), n;
}
function Q(e) {
  return typeof e == "string" && (e = A(e)), d.indexOf(e) !== -1;
}
function W(e, t) {
  var r, n;
  e || (e = O());
  for (var i in o)
    if (Object.prototype.hasOwnProperty.call(o, i))
      for (r = o[i], n = 0; n < r.length; )
        r[n].scope === e ? r.splice(n, 1) : n++;
  O() === e && G(t || "all");
}
function Y(e) {
  var t = e.keyCode || e.which || e.charCode, r = d.indexOf(t);
  if (r >= 0 && d.splice(r, 1), e.key && e.key.toLowerCase() === "meta" && d.splice(0, d.length), (t === 93 || t === 224) && (t = 91), t in u) {
    u[t] = !1;
    for (var n in v)
      v[n] === t && (b[n] = !1);
  }
}
function Z(e) {
  if (typeof e > "u")
    Object.keys(o).forEach(function(f) {
      return delete o[f];
    });
  else if (Array.isArray(e))
    e.forEach(function(f) {
      f.key && j(f);
    });
  else if (typeof e == "object")
    e.key && j(e);
  else if (typeof e == "string") {
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)
      r[n - 1] = arguments[n];
    var i = r[0], a = r[1];
    typeof i == "function" && (a = i, i = ""), j({
      key: e,
      scope: i,
      method: a,
      splitKey: "+"
    });
  }
}
var j = function(t) {
  var r = t.key, n = t.scope, i = t.method, a = t.splitKey, f = a === void 0 ? "+" : a, l = B(r);
  l.forEach(function(s) {
    var c = s.split(f), g = c.length, p = c[g - 1], h = p === "*" ? "*" : A(p);
    if (o[h]) {
      n || (n = O());
      var w = g > 1 ? U(v, c) : [];
      o[h] = o[h].filter(function(y) {
        var m = i ? y.method === i : !0;
        return !(m && y.scope === n && V(y.mods, w));
      });
    }
  });
};
function I(e, t, r, n) {
  if (t.element === n) {
    var i;
    if (t.scope === r || t.scope === "all") {
      i = t.mods.length > 0;
      for (var a in u)
        Object.prototype.hasOwnProperty.call(u, a) && (!u[a] && t.mods.indexOf(+a) > -1 || u[a] && t.mods.indexOf(+a) === -1) && (i = !1);
      (t.mods.length === 0 && !u[16] && !u[18] && !u[17] && !u[91] || i || t.shortcut === "*") && t.method(e, t) === !1 && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, e.stopPropagation && e.stopPropagation(), e.cancelBubble && (e.cancelBubble = !0));
    }
  }
}
function H(e, t) {
  var r = o["*"], n = e.keyCode || e.which || e.charCode;
  if (b.filter.call(this, e)) {
    if ((n === 93 || n === 224) && (n = 91), d.indexOf(n) === -1 && n !== 229 && d.push(n), ["ctrlKey", "altKey", "shiftKey", "metaKey"].forEach(function(y) {
      var m = S[y];
      e[y] && d.indexOf(m) === -1 ? d.push(m) : !e[y] && d.indexOf(m) > -1 ? d.splice(d.indexOf(m), 1) : y === "metaKey" && e[y] && d.length === 3 && (e.ctrlKey || e.shiftKey || e.altKey || (d = d.slice(d.indexOf(m))));
    }), n in u) {
      u[n] = !0;
      for (var i in v)
        v[i] === n && (b[i] = !0);
      if (!r)
        return;
    }
    for (var a in u)
      Object.prototype.hasOwnProperty.call(u, a) && (u[a] = e[S[a]]);
    e.getModifierState && !(e.altKey && !e.ctrlKey) && e.getModifierState("AltGraph") && (d.indexOf(17) === -1 && d.push(17), d.indexOf(18) === -1 && d.push(18), u[17] = !0, u[18] = !0);
    var f = O();
    if (r)
      for (var l = 0; l < r.length; l++)
        r[l].scope === f && (e.type === "keydown" && r[l].keydown || e.type === "keyup" && r[l].keyup) && I(e, r[l], f, t);
    if (n in o) {
      for (var s = 0; s < o[n].length; s++)
        if ((e.type === "keydown" && o[n][s].keydown || e.type === "keyup" && o[n][s].keyup) && o[n][s].key) {
          for (var c = o[n][s], g = c.splitKey, p = c.key.split(g), h = [], w = 0; w < p.length; w++)
            h.push(A(p[w]));
          h.sort().join("") === d.sort().join("") && I(e, c, f, t);
        }
    }
  }
}
function N(e) {
  return $.indexOf(e) > -1;
}
function b(e, t, r) {
  d = [];
  var n = B(e), i = [], a = "all", f = document, l = 0, s = !1, c = !0, g = "+", p = !1;
  for (r === void 0 && typeof t == "function" && (r = t), Object.prototype.toString.call(t) === "[object Object]" && (t.scope && (a = t.scope), t.element && (f = t.element), t.keyup && (s = t.keyup), t.keydown !== void 0 && (c = t.keydown), t.capture !== void 0 && (p = t.capture), typeof t.splitKey == "string" && (g = t.splitKey)), typeof t == "string" && (a = t); l < n.length; l++)
    e = n[l].split(g), i = [], e.length > 1 && (i = U(v, e)), e = e[e.length - 1], e = e === "*" ? "*" : A(e), e in o || (o[e] = []), o[e].push({
      keyup: s,
      keydown: c,
      scope: a,
      mods: i,
      shortcut: n[l],
      method: r,
      key: n[l],
      splitKey: g,
      element: f
    });
  typeof f < "u" && !N(f) && window && ($.push(f), x(f, "keydown", function(h) {
    H(h, f);
  }, p), T || (T = !0, x(window, "focus", function() {
    d = [];
  }, p)), x(f, "keyup", function(h) {
    H(h, f), Y(h);
  }, p));
}
function ee(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "all";
  Object.keys(o).forEach(function(r) {
    var n = o[r].filter(function(i) {
      return i.scope === t && i.shortcut === e;
    });
    n.forEach(function(i) {
      i && i.method && i.method();
    });
  });
}
var P = {
  getPressedKeyString: z,
  setScope: G,
  getScope: O,
  deleteScope: W,
  getPressedKeyCodes: q,
  isPressed: Q,
  filter: J,
  trigger: ee,
  unbind: Z,
  keyMap: K,
  modifier: v,
  modifierMap: S
};
for (var M in P)
  Object.prototype.hasOwnProperty.call(P, M) && (b[M] = P[M]);
if (typeof window < "u") {
  var te = window.hotkeys;
  b.noConflict = function(e) {
    return e && window.hotkeys === b && (window.hotkeys = te), b;
  }, window.hotkeys = b;
}
const re = {
  on: function(e, t, r = "changed") {
    r === "repeat" ? b(e, (n, i) => {
      n.preventDefault(), t(1);
    }) : b(e, {
      keyup: r === "released" || r === "changed" ? !0 : null,
      keydown: r === "pressed" || r === "changed" ? !0 : null
    }, (i, a) => {
      i.repeat || t(b.isPressed(e) === !0 ? 1 : 0);
    });
  },
  off: function(e, t) {
    b.unbind(e);
  }
}, ne = {
  supportedInputHandlers: ["keyboard", "gamepad"],
  handlers: {
    keyboard: {
      handler: re,
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
  get gamepadEnabled() {
    return this.handlers.gamepad.enabled;
  },
  set gamepadEnabled(e) {
    this.handlers.gamepad.enabled = e;
  },
  get keyboardEnabled() {
    return this.handlers.keyboard.enabled;
  },
  set keyboardEnabled(e) {
    this.handlers.keyboard.enabled = e;
  },
  unregisterActionsCallbacks: {},
  init: function() {
    k.on("connect", (e) => {
      if (!this.handlers.gamepad.handler) {
        if (this.handlers.gamepad.handler = e, !this.handlers.gamepad.enabled)
          return;
        Object.entries(this.registeredActions.gamepad).forEach(([t, r]) => {
          var n;
          (n = this.handlers.gamepad.handler) == null || n.on(t, r.handler, r.event);
        });
      }
    }), k.on("disconnect", (e) => {
      e.id === this.handlers.gamepad.handler.id && (this.handlers.gamepad.handler = void 0);
    }), Object.entries(k.getGamepads()).find(([e, t]) => {
      t !== null && t.id !== this.handlers.gamepad.handler.id && (this.handlers.gamepad.handler = t);
    });
  },
  defineInputActions: function(e, t) {
    Object.entries(e).map(([r, n]) => {
      if (!(t != null && t.override) && this.definedActions[r])
        throw new Error(`${r} action has already been defined as a dependancy.`);
      this.definedActions[r] = n;
    });
  },
  onInputActions: function(e, t, r) {
    const n = /* @__PURE__ */ new Set();
    Object.entries(t).forEach(([a, f]) => {
      this.definedActions[a].forEach((s) => {
        var p, h, w, y;
        const c = this.registeredActions[s.type][s.key];
        if (c) {
          if (c.id === e)
            throw new Error(`There is already a group of event registered under the id [${e}]. Unsubscribe this group of event before registering a new one`);
          n.add(c.id), (p = this.handlers[s.type].handler) == null || p.off(s.key, c.handler);
        }
        const g = (m) => {
          var _, L;
          if (!this.handlers[s.type].enabled)
            return;
          if (!m) {
            f();
            return;
          }
          const R = m === 1 ? ((_ = s.options) == null ? void 0 : _.value) ?? 1 : m === 0 ? 0 : (((L = s.options) == null ? void 0 : L.value) ?? 1) / 1 * m;
          f(R);
        };
        this.registeredActions[s.type][s.key] = {
          handler: g,
          id: e,
          event: (h = s.options) == null ? void 0 : h.event
        }, g.bind(this), this.handlers[s.type].enabled && ((y = this.handlers[s.type].handler) == null || y.on(s.key, g, (w = s.options) == null ? void 0 : w.event));
      });
    }), this.unregisterActionsCallbacks[e] = r, this.supportedInputHandlers.forEach((a) => {
      Object.entries(this.registeredActions[a]).forEach(([f, l]) => {
        var s;
        n.has(l.id) && ((s = this.handlers[a].handler) == null || s.off(f, l.handler), delete this.registeredActions[a][f]);
      });
    });
    for (var i of Array.from(n.values()))
      this.unregisterActionsCallbacks[i] && this.unregisterActionsCallbacks[i]();
  },
  offInputActions: function(e) {
    this.supportedInputHandlers.forEach((t) => {
      Object.entries(this.registeredActions[t]).forEach(([r, n]) => {
        e === n.id && delete this.registeredActions[t][r];
      });
    });
  }
};
ne.init();
export {
  ne as default
};
