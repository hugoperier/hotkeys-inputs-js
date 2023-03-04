import { LiteEvent } from './LiteEvents';
import { GamepadPrototype } from './types';
import { freqTimer } from './utils';

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
      axeStep: 0.15,
      hapticActuator: null,
      vibrationMode: -1,
      vibration: false,
      mapping: gpad.mapping,
      buttonActions: {},
      axesActions: {},
      pressed: {},
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
        const repeat = freqTimer.tick();
        const gps = navigator.getGamepads
          ? navigator.getGamepads()
          : (navigator as any).webkitGetGamepads
          ? (navigator as any).webkitGetGamepads()
          : [];

        if (gps.length) {
          gp = gps[this.id] as Gamepad;
          if (gp.buttons) {
            for (let x = 0; x < this.buttons; x++) {
              if (repeat) this.buttonActions[x].repeat.trigger(gp.buttons[x].pressed ? 1 : 0);
              if (gp.buttons[x].pressed === true) {
                if (!this.pressed[`button${x}`]) {
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
              const jIndex = Math.floor(x / 2);
              const modifier = x % 2 === 0 ? 'horizontal' : 'vertical';
              if (Math.abs(this.axeValues[x]) > this.axeStep) {
                if (gp.axes[x] === 0 || repeat) this.axesActions[jIndex][modifier].repeat.trigger(gp.axes[x]);
              }
              if (Math.abs(this.axeValues[x] - gp.axes[x]) < this.axeStep) {
                // In that case we do nothing, the value has not changed or, under the thresholt.
                // We do not want to spam the consumer with callback
              } else if (gp.axes[x] === 0 && this.axeValues[x] !== 0) {
                // If released
                this.axesActions[jIndex][modifier].changed.trigger(gp.axes[x]);
                this.axesActions[jIndex][modifier].released.trigger(gp.axes[x]);
                this.axeValues[x] = gp.axes[x];
              } else if (this.axeValues[x] === 0) {
                // If activated
                this.axesActions[jIndex][modifier].changed.trigger(gp.axes[x]);
                this.axesActions[jIndex][modifier].pressed.trigger(gp.axes[x]);
                this.axeValues[x] = gp.axes[x];
              } else {
                // Value changed
                this.axesActions[jIndex][modifier].changed.trigger(gp.axes[x]);
                this.axeValues[x] = gp.axes[x];
              }
              if (gp.axes[x] === 0) this.axeValues[x] = 0;
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
    }

    if (gpad.hapticActuators) {
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
      if (typeof (gpad as any).vibrationActuator.playEffect === 'function') {
        gamepadPrototype.hapticActuator = (gpad as any).vibrationActuator;
        gamepadPrototype.vibrationMode = 1;
        gamepadPrototype.vibration = true;
      }
    }
    gamepadPrototype.axeValues = [...gpad.axes] as number[];
    return gamepadPrototype;
  },
};

export default gamepad;
