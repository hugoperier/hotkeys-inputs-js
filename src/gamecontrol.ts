import gamepad, { GamepadPrototype } from "./gamepad";
import { ILiteEvent, LiteEvent } from "./LiteEvents";

type GameControlEventType =
  | "connect"
  | "disconnect"
  | "beforeCycle"
  | "afterCycle";

type GameControlConnectConnectEvent = (
  eventName: "connect" | "disconnect",
  handler: (gamepad: GamepadPrototype) => void
) => void;

type GameControlCycleEvent = (
  eventName: "beforeCycle" | "afterCycle",
  handler: () => void
) => void;

type GameControlEventHandler = (
  gamepad: GamepadPrototype
) => void | (() => void);

interface GameControl {
  gamepads: Record<number, GamepadPrototype>;
  axeThreshold: number[];
  isReady: () => boolean;
  onConnect: ILiteEvent<GamepadPrototype>;
  onDisconnect: ILiteEvent<GamepadPrototype>;
  onBeforeCycle: ILiteEvent<void>;
  onAfterCycle: ILiteEvent<void>;
  getGamepads: () => Record<number, GamepadPrototype>;
  getGamepad: (id: number) => GamepadPrototype | null;
  set: (property: string, value: any) => void;
  checkStatus: () => void;
  init: () => void;
  on: GameControlConnectConnectEvent & GameControlCycleEvent;
  off: GameControlConnectConnectEvent & GameControlCycleEvent;
}

const gameControl: GameControl = {
  gamepads: {},
  axeThreshold: [1.0],
  isReady: () =>
    (navigator.getGamepads && typeof navigator.getGamepads === "function") ||
    ((navigator as any).getGamepads &&
      typeof (navigator as any).webkitGetGamepads === "function") ||
    false,
  onConnect: new LiteEvent<GamepadPrototype>(),
  onDisconnect: new LiteEvent<GamepadPrototype>(),
  onBeforeCycle: new LiteEvent<void>(),
  onAfterCycle: new LiteEvent<void>(),
  getGamepads: function () {
    return this.gamepads;
  },
  getGamepad: function (id) {
    if (this.gamepads[id]) {
      return this.gamepads[id];
    }
    return null;
  },
  set: function (property, value) {
    const properties = ["axeThreshold"];
    if (properties.indexOf(property) >= 0) {
      if (
        property === "axeThreshold" &&
        (!parseFloat(value) || value < 0.0 || value > 1.0)
      ) {
        console.error("gamepad: invalid value number");
        return;
      }

      (this as any)[property] = value;

      if (property === "axeThreshold") {
        const gps = this.getGamepads();
        const ids = Object.keys(gps) as unknown as number[];
        for (let x = 0; x < ids.length; x++) {
          gps[ids[x]].set("axeThreshold", this.axeThreshold);
        }
      }
    } else {
      console.error("gamepad: invalid property");
    }
  },
  checkStatus: function () {
    const requestAnimationFrame =
      window.requestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame;
    const gamepadIds = Object.keys(gameControl.gamepads) as unknown as number[];

    gameControl.onBeforeCycle.trigger();

    for (let x = 0; x < gamepadIds.length; x++) {
      gameControl.gamepads[gamepadIds[x]].checkStatus();
    }

    gameControl.onAfterCycle.trigger();

    if (gamepadIds.length > 0) {
      requestAnimationFrame(gameControl.checkStatus);
    }
  },
  init: function () {
    window.addEventListener("gamepadconnected", (e) => {
      const egp = (e.gamepad || (e as any).detail.gamepad) as Gamepad;
      if (!(window as any).gamepads) (window as any).gamepads = {};
      if (egp) {
        if (!(window as any).gamepads[egp.index]) {
          (window as any).gamepads[egp.index] = egp;
          const gp = gamepad.init(egp);
          gp.set("axeThreshold", this.axeThreshold);
          this.gamepads[gp.id] = gp;
          this.onConnect.trigger(this.gamepads[gp.id]);
        }
        if (Object.keys(this.gamepads).length === 1) this.checkStatus();
      }
    });
    window.addEventListener("gamepaddisconnected", (e) => {
      const egp = e.gamepad || (e as any).detail.gamepad;
      if (egp) {
        this.onDisconnect.trigger(this.gamepads[egp.index]);
        delete (window as any).gamepads[egp.index];
        delete this.gamepads[egp.index];
      }
    });
  },
  on: function (
    eventName: GameControlEventType,
    callback: GameControlEventHandler
  ) {
    switch (eventName) {
      case "connect":
        this.onConnect.on(callback as (gamepad: GamepadPrototype) => void);
        break;
      case "disconnect":
        this.onDisconnect.on(callback as (gamepad: GamepadPrototype) => void);
        break;
      case "beforeCycle":
        this.onBeforeCycle.on(callback as () => void);
        break;
      case "afterCycle":
        this.onAfterCycle.on(callback as () => void);
        break;
      default:
        console.error("gamepad: unknown custom event");
        break;
    }
    return this;
  },
  off: function (
    eventName: GameControlEventType,
    callback: GameControlEventHandler
  ) {
    switch (eventName) {
      case "connect":
        this.onConnect.off(callback as (gamepad: GamepadPrototype) => void);
        break;
      case "disconnect":
        this.onDisconnect.off(callback as (gamepad: GamepadPrototype) => void);
        break;
      case "beforeCycle":
        this.onBeforeCycle.off(callback as () => void);
        break;
      case "afterCycle":
        this.onAfterCycle.off(callback as () => void);
        break;
      default:
        console.error("gamepad: unknown event");
        break;
    }
    return this;
  },
};

gameControl.init();

export default gameControl;
