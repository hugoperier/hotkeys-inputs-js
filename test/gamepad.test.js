import gamepad, { DefaultGamepad } from '../src/gamepad';
import { gamepadMock } from './mock.gamepad.test';

describe('test gamepad handler', () => {
  test('initialize', () => {
    const gp = gamepad.init(gamepadMock);
    expect(gp).toBeDefined();
    expect(gp.id).toBe(gamepadMock.index);
    expect(gp.axeValues.length).toBe(gamepadMock.axes.length);
  });

  test('Check button changed invoke cb', () => {
    const onCalled = jest.fn();
    const gp = gamepad.init(gamepadMock);
    gp.on(DefaultGamepad.KeyA, function () {
      onCalled();
    });
    gp.buttonActions[1].changed.trigger();
    expect(onCalled).toHaveBeenCalled();
  });

  test('Check button changed does not invoke cb', () => {
    const onCalled = jest.fn();
    const gp = gamepad.init(gamepadMock);
    gp.on(DefaultGamepad.KeyA, function () {
      onCalled();
    });
    gp.buttonActions[3].changed.trigger();
    gp.buttonActions[7].changed.trigger();
    gp.buttonActions[0].changed.trigger();
    expect(onCalled).not.toHaveBeenCalled();
  });

  test('Unsubscribe event', () => {
    const onCalled = jest.fn();
    const gp = gamepad.init(gamepadMock);
    gp.on(DefaultGamepad.KeyA, function () {
      onCalled();
    });
    gp.off(DefaultGamepad.KeyA)
    gp.buttonActions[1].changed.trigger();
    expect(onCalled).not.toHaveBeenCalled();
  });
});
