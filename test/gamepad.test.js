import gamepad, { DefaultGamepad } from '../src/gamepad';
import { getMock } from './mock.gamepad';

const wait = async (t) =>
  new Promise((res) => {
    setTimeout(res, t);
  });

describe('test gamepad handler', () => {
  test('initialize', () => {
    const gamepadMock = getMock();
    const gp = gamepad.init(gamepadMock);
    expect(gp).toBeDefined();
    expect(gp.id).toBe(gamepadMock.index);
    expect(gp.axeValues.length).toBe(gamepadMock.axes.length);
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
    const mockGamepads = () => [gamepadMock];
    global.navigator = {
      getGamepads: mockGamepads,
    };
    gp.checkStatus();
    gamepadMock.buttons[0] = true;
    gamepadMock.axes[0] = 0.18;
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

    global.navigator = {
      getGamepads: () => {
        const mock2 = getMock();
        mock2.buttons[1] = {
          pressed: true,
        };
        mock2.axes[0] = 0.18;
        return [mock2];
      },
    };
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
    global.navigator = {
      getGamepads: () => {
        const mock2 = getMock();
        mock2.axes[0] = 0.18;
        return [mock2];
      },
    };
    const timer = setInterval(() => {
      gp.checkStatus();
    }, 1000 / 60); // 60fps to simulate the animate
    const j = await wait(1000);
    expect(onJoystickEvent.mock.calls.length).toBeGreaterThan(8);
    expect(onJoystickEvent.mock.calls.length).toBeLessThan(11);
    clearTimeout(timer);
  });
});
