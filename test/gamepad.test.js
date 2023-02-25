import gamepad from '../src/gamepad';
import { getMock } from './mock.gamepad';
import { DefaultGamepad } from '../src/types';

const wait = async (t) =>
  new Promise((res) => {
    setTimeout(res, t);
  });

describe('test gamepad handler', () => {
  const getGamepadMock = getMock();
  Object.defineProperty(global.navigator, 'getGamepads', {
    value: () => {
      return [getGamepadMock];
    },
  });
  test('initialize', () => {
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);
    expect(gp).toBeDefined();
    expect(gp.id).toBe(gamepadMock.index);
    expect(gp.axeValues.length).toBe(gamepadMock.axes.length);
  });

  test('vibrations', () => {
    const gamepadMock = getMock();
    gamepadMock.vibrationActuator = {
      playEffect: (type, obj) => `${type} - ${obj.duration}`,
    };
    const gp = gamepad.init(gamepadMock);
    expect(gp.vibrate(0.5, 500)).toEqual('dual-rumble - 500');
    expect(gp.vibrate()).toEqual('dual-rumble - 500');
  });

  test('Check button changed invoke cb', () => {
    const onCalled = jest.fn();
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);
    gp.on(DefaultGamepad.KeyA, function () {
      onCalled();
    });
    gp.buttonActions[1].changed.trigger();
    expect(onCalled).toHaveBeenCalled();
  });

  test('Check button changed does not invoke cb', () => {
    const onCalled = jest.fn();
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);
    gp.on(DefaultGamepad.KeyA, function () {
      onCalled();
    });
    gp.buttonActions[3].changed.trigger();
    gp.buttonActions[7].changed.trigger();
    gp.buttonActions[0].changed.trigger();
    expect(onCalled).not.toHaveBeenCalled();
  });

  test('cycle check status', () => {
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);
    getGamepadMock.buttons[1] = {
      pressed: true,
    };
    getGamepadMock.axes[0] = 0.18;
    gp.checkStatus();
    expect(gp.axeValues[0]).toBe(0.18);
    expect(gp.axeValues[1]).toBe(0);
    expect(gp.axeValues[2]).toBe(0);
    expect(gp.axeValues[3]).toBe(0);
  });

  test('cycle check status events', () => {
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);

    const onButtonPressed = jest.fn();
    const onJoystickEvent = jest.fn();

    gp.on(DefaultGamepad.LeftJoystickAxeX, onJoystickEvent, 'pressed');
    gp.on(DefaultGamepad.KeyA, onButtonPressed, 'changed');

    gp.checkStatus();
    expect(onJoystickEvent).toHaveBeenCalledTimes(1);
    expect(onButtonPressed).toHaveBeenCalledTimes(1);
    expect(onJoystickEvent).toHaveBeenCalledWith(0.18);
  });

  test('cycle check repeat event', async () => {
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);

    const onJoystickEvent = jest.fn();
    gp.on(DefaultGamepad.LeftJoystickAxeX, onJoystickEvent, 'repeat');
    const timer = setInterval(() => {
      gp.checkStatus();
    }, 1000 / 60); // 60fps to simulate the animate
    const j = await wait(1000);
    expect(onJoystickEvent.mock.calls.length).toBeGreaterThan(6);
    expect(onJoystickEvent.mock.calls.length).toBeLessThan(11);
    clearTimeout(timer);
  });

  test('unsubscribe from event', () => {
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);
    const onJoystickEvent = jest.fn();
    const onButtonEvent = jest.fn();

    gp.on(DefaultGamepad.LeftJoystickAxeY, onJoystickEvent, 'pressed');
    gp.on(DefaultGamepad.KeyB, onButtonEvent, 'pressed');

    getGamepadMock.buttons[DefaultGamepad.KeyB].pressed = true;
    getGamepadMock.axes[1] = 0.5;
    gp.checkStatus();
    getGamepadMock.buttons[DefaultGamepad.KeyB].pressed = false;
    getGamepadMock.axes[1] = 0;
    gp.checkStatus();
    expect(onButtonEvent).toHaveBeenCalledTimes(1);
    expect(onJoystickEvent).toHaveBeenCalledTimes(1);

    gp.off(DefaultGamepad.LeftJoystickAxeY);
    gp.off(DefaultGamepad.KeyB);

    getGamepadMock.buttons[DefaultGamepad.KeyB].pressed = true;
    getGamepadMock.axes[1] = 0.5;
    gp.checkStatus();
  });
});
