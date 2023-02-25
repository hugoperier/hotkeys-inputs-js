import gamepad from './gamepad';
import { LiteEvent } from './LiteEvents';
import { GameControl, GameControlEventHandler, GameControlEventType, GamepadPrototype } from './types';

const gameControl: GameControl = {
  gamepads: {},
  axeThreshold: [1.0],
  isReady: () =>
    (navigator.getGamepads && typeof navigator.getGamepads === 'function') ||
    ((navigator as any).getGamepads && typeof (navigator as any).webkitGetGamepads === 'function') ||
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
  checkStatus: function () {
    const requestAnimationFrame = window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame;
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
    window.addEventListener('gamepadconnected', (e) => {
      const egp = (e.gamepad || (e as any).detail.gamepad) as Gamepad;
      if (!(window as any).gamepads) (window as any).gamepads = {};
      if (egp) {
        if (!(window as any).gamepads[egp.index]) {
          (window as any).gamepads[egp.index] = egp;
          const gp = gamepad.init(egp);
          this.gamepads[gp.id] = gp;
          this.onConnect.trigger(this.gamepads[gp.id]);
        }
        if (Object.keys(this.gamepads).length === 1) this.checkStatus();
      }
    });
    window.addEventListener('gamepaddisconnected', (e) => {
      const egp = e.gamepad || (e as any).detail.gamepad;
      if (egp) {
        this.onDisconnect.trigger(this.gamepads[egp.index]);
        delete (window as any).gamepads[egp.index];
        delete this.gamepads[egp.index];
      }
    });
  },
  on: function (eventName: GameControlEventType, callback: GameControlEventHandler) {
    switch (eventName) {
      case 'connect':
        this.onConnect.on(callback as (gamepad: GamepadPrototype) => void);
        break;
      case 'disconnect':
        this.onDisconnect.on(callback as (gamepad: GamepadPrototype) => void);
        break;
      case 'beforeCycle':
        this.onBeforeCycle.on(callback as () => void);
        break;
      case 'afterCycle':
        this.onAfterCycle.on(callback as () => void);
        break;
      default:
        console.error('gamepad: unknown custom event');
        break;
    }
    return this;
  },
  off: function (eventName: GameControlEventType, callback: GameControlEventHandler) {
    switch (eventName) {
      case 'connect':
        this.onConnect.off(callback as (gamepad: GamepadPrototype) => void);
        break;
      case 'disconnect':
        this.onDisconnect.off(callback as (gamepad: GamepadPrototype) => void);
        break;
      case 'beforeCycle':
        this.onBeforeCycle.off(callback as () => void);
        break;
      case 'afterCycle':
        this.onAfterCycle.off(callback as () => void);
        break;
      default:
        console.error('gamepad: unknown event');
        break;
    }
    return this;
  },
};

gameControl.init();

export default gameControl;
