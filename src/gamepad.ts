import { ILiteEvent, LiteEvent } from './LiteEvents';
import { InputEventType, IProxyEventOption, IProxyInputEventHandler } from './types';

interface KeyEventAction<T> {
  changed: ILiteEvent<T>;
  pressed: ILiteEvent<T>;
  released: ILiteEvent<T>;
  repeat: ILiteEvent<T>;
}

interface ButtonActions {
  [index: number]: KeyEventAction<number>;
}

export enum DefaultGamepad {
  LeftJoystickAxeX = -1,
  LeftJoystickAxeY = -2,
  RightJoystickAxeX = -3,
  RightJoystickAxeY = -4,
  KeyA = 1,
  KeyB = 0,
  KeyX = 3,
  KeyY = 2,
  KeyUp = 12,
  KeyDown = 13,
  KeyLeft = 14,
  KeyRight = 15,
  KeyR1 = 5,
  KeyR2 = 7,
  KeyL1 = 4,
  KeyL2 = 6,
  KeyStart = 16,
  KeyOpts = 17,
  KeyPlus = 9,
  KeyMinus = 8,
}

interface AxesActions {
  [index: string]: {
    vertical: KeyEventAction<number>;
    horizontal: KeyEventAction<number>;
  };
}

interface Pressed {
  [index: string]: boolean;
}

export interface GamepadPrototype extends IProxyInputEventHandler {
  id: number;
  buttons: number;
  axes: number;
  axeValues: any[];
  axeThreshold: number[];
  axeStep: number;
  hapticActuator: any;
  vibrationMode: number;
  vibration: boolean;
  mapping: any;
  buttonActions: ButtonActions;
  axesActions: AxesActions;
  pressed: Pressed;
  on: (eventName: number | string, callback: (value?: number) => void, eventType?: InputEventType) => void;
  off: (eventName: number | string) => void;
  after: (eventName: number | DefaultGamepad, callback: (value?: number) => void) => void;
  before: (eventName: number | DefaultGamepad, callback: (value?: number) => void) => void;
  set: (property: string, value: any) => void;
  vibrate: (value?: number, duration?: number) => void;
  checkStatus: () => void;
}

const makeEmptyEvents = <T>() => ({
  changed: new LiteEvent<T>(),
  pressed: new LiteEvent<T>(),
  released: new LiteEvent<T>(),
  repeat: new LiteEvent<T>(),
});

const gamepad = {
  init: function (gpad: Gamepad) {
    let gamepadPrototype: GamepadPrototype = {
      id: gpad.index,
      buttons: gpad.buttons.length,
      axes: Math.floor(gpad.axes.length / 2),
      axeValues: [],
      axeThreshold: [1.0],
      axeStep: 0.15,
      hapticActuator: null,
      vibrationMode: -1,
      vibration: false,
      mapping: gpad.mapping,
      buttonActions: {},
      axesActions: {},
      pressed: {},
      set: function (property: string, value: any) {
        const properties = ['axeThreshold'];
        if (properties.indexOf(property) >= 0) {
          if (property === 'axeThreshold' && (!parseFloat(value) || value < 0.0 || value > 1.0)) {
            console.error('gamepad: invalid value number');
            return;
          }
          (this as any)[property] = value;
        } else {
          console.error('gamepad: invalid property');
        }
      },
      vibrate: function (value = 0.75, duration = 500) {
        if (this.hapticActuator) {
          switch (this.vibrationMode) {
            case 0:
              return this.hapticActuator.pulse(value, duration);
            case 1:
              return this.hapticActuator.playEffect('dual-rumble', {
                duration: duration,
                strongMagnitude: value,
                weakMagnitude: value,
              });
          }
        }
      },
      checkStatus: function () {
        let gp = {} as Gamepad;
        const gps = navigator.getGamepads
          ? navigator.getGamepads()
          : (navigator as any).webkitGetGamepads
          ? (navigator as any).webkitGetGamepads()
          : [];

        if (gps.length) {
          gp = gps[this.id] as Gamepad;
          if (gp.buttons) {
            for (let x = 0; x < this.buttons; x++) {
              if (gp.buttons[x].pressed === true) {
                if (!this.pressed[`button${x}`]) {
                  // use a set
                  this.pressed[`button${x}`] = true;
                  this.buttonActions[x].pressed.trigger(1);
                }
                this.buttonActions[x].changed.trigger(1);
              } else if (this.pressed[`button${x}`]) {
                delete this.pressed[`button${x}`];
                this.buttonActions[x].released.trigger(0);
              }
            }
          }
          if (gp.axes) {
            for (let x = 0; x < this.axes; x++) {
              const modifier = x % 2 === 0 ? 'horizontal' : 'vertical';
              if (Math.abs(this.axeValues[x] - gp.axes[x]) < this.axeStep) {
                // In that case we do nothing, the value has not changed or, under the thresholt.
                // We do not want to spam the consumer with callback
              } else if (gp.axes[x] === 0 && this.axeValues[x] !== 0) {
                // If released
                this.axesActions[x][modifier].changed.trigger(gp.axes[x]);
                this.axesActions[x][modifier].released.trigger(gp.axes[x]);
                this.axeValues[x] = gp.axes[x];
              } else if (this.axeValues[x] === 0) {
                // If activated
                this.axesActions[x][modifier].changed.trigger(gp.axes[x]);
                this.axesActions[x][modifier].pressed.trigger(gp.axes[x]);
                this.axeValues[x] = gp.axes[x];
              } else {
                // Value changed
                this.axesActions[x][modifier].changed.trigger(gp.axes[x]);
                this.axeValues[x] = gp.axes[x];
              }
            }
          }
        }
      },
      on: function (eventName: number | string, callback: (value?: number) => void, eventType = 'changed') {
        if (eventName < 0) {
          // If subscribing to a joystick event
          const jIndex = Math.floor((Math.abs(eventName as number) - 1) / 2);
          const orientation = (Math.abs(eventName as number) - 1) % 2 === 0 ? 'horizontal' : 'vertical';
          this.axesActions[jIndex][orientation][eventType].on(callback);
        } else {
          // If a button
          this.buttonActions[eventName as number][eventType].on(callback);
        }
        return this;
      },
      off: function (eventName: number | string) {
        if (eventName < 0) {
          // If unsubscribing to a joystick event
          const jIndex = Math.floor((Math.abs(eventName as number) - 1) / 2);
          const orientation = (Math.abs(eventName as number) - 1) % 2 === 0 ? 'horizontal' : 'vertical';
          this.axesActions[jIndex][orientation].changed.offAll();
          this.axesActions[jIndex][orientation].pressed.offAll();
          this.axesActions[jIndex][orientation].released.offAll();
          this.axesActions[jIndex][orientation].repeat.offAll();
        } else {
          // If a button
          this.buttonActions[eventName as number].changed.offAll();
          this.buttonActions[eventName as number].pressed.offAll();
          this.buttonActions[eventName as number].released.offAll();
          this.buttonActions[eventName as number].repeat.offAll();
        }
        return this;
        // if (eventName === DefaultGamepad.LeftJoystickAxeX) this.axesActions[0].horizontal[action].off(callback);
        // else if (eventName === DefaultGamepad.LeftJoystickAxeY) this.axesActions[1].vertical[action].off(callback);
        // else if (eventName === DefaultGamepad.RightJoystickAxeX) this.axesActions[2].horizontal[action].off(callback);
        // else if (eventName === DefaultGamepad.LeftJoystickAxeY) this.axesActions[3].vertical[action].off(callback);
        // else this.buttonActions[eventName][action].off(callback as () => void);
        // return this.associateEvent(eventName, function () {}, "action");
      },
      after: function (eventName: number | DefaultGamepad, callback: (value?: number) => void) {
        // if (eventName === DefaultGamepad.LeftJoystickAxeX) this.axesActions[0].horizontal.after.on(callback);
        // else if (eventName === DefaultGamepad.LeftJoystickAxeY) this.axesActions[1].vertical.after.on(callback);
        // else if (eventName === DefaultGamepad.RightJoystickAxeX) this.axesActions[2].horizontal.after.on(callback);
        // else if (eventName === DefaultGamepad.LeftJoystickAxeY) this.axesActions[3].vertical.after.on(callback);
        // else this.buttonActions[eventName]['after'].on(callback as () => void);
        // return this.associateEvent(eventName, callback, "after");
        return this;
      },
      before: function (eventName: number | DefaultGamepad, callback: (value?: number) => void) {
        // if (eventName === DefaultGamepad.LeftJoystickAxeX) this.axesActions[0].horizontal.before.on(callback);
        // else if (eventName === DefaultGamepad.LeftJoystickAxeY) this.axesActions[1].vertical.before.on(callback);
        // else if (eventName === DefaultGamepad.RightJoystickAxeX) this.axesActions[2].horizontal.before.on(callback);
        // else if (eventName === DefaultGamepad.LeftJoystickAxeY) this.axesActions[3].vertical.before.on(callback);
        // else this.buttonActions[eventName]['before'].on(callback as () => void);
        // return this.associateEvent(eventName, callback, "before");
        return this;
      },
    };

    for (let x = 0; x < gamepadPrototype.buttons; x++) {
      gamepadPrototype.buttonActions[x] = (makeEmptyEvents as any)();
    }
    for (let x = 0; x < gamepadPrototype.axes; x++) {
      gamepadPrototype.axesActions[x] = {
        vertical: makeEmptyEvents(),
        horizontal: makeEmptyEvents(),
      };
      gamepadPrototype.axeValues[x] = [0, 0];
    }

    // check if vibration actuator exists
    if (gpad.hapticActuators) {
      // newer standard
      if (typeof (gpad.hapticActuators as any).pulse === 'function') {
        gamepadPrototype.hapticActuator = gpad.hapticActuators;
        gamepadPrototype.vibrationMode = 0;
        gamepadPrototype.vibration = true;
      } else if (gpad.hapticActuators[0] && typeof (gpad.hapticActuators as any)[0].pulse === 'function') {
        gamepadPrototype.hapticActuator = gpad.hapticActuators[0];
        gamepadPrototype.vibrationMode = 0;
        gamepadPrototype.vibration = true;
      }
    } else if ((gpad as any).vibrationActuator) {
      // old chrome stuff
      if (typeof (gpad as any).vibrationActuator.playEffect === 'function') {
        gamepadPrototype.hapticActuator = (gpad as any).vibrationActuator;
        gamepadPrototype.vibrationMode = 1;
        gamepadPrototype.vibration = true;
      }
    }

    return gamepadPrototype;
  },
};

export default gamepad;
