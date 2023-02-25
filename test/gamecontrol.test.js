import gameControl from '../src/gamecontrol';
import { getMock } from './mock.gamepad';

const wait = async (t) =>
  new Promise((res) => {
    setTimeout(res, t);
  });

describe('gameControl', () => {
  test('assert animation frame is not running', () => {
    const tmp = global.requestAnimationFrame
    global.requestAnimationFrame = jest.fn();
    gameControl.checkStatus();
    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
    global.requestAnimationFrame = tmp
  });

  test('Check gameControl gamepads', () => {
    expect(gameControl.gamepads).toEqual({});
    expect(gameControl.getGamepads()).toEqual({});
    expect(gameControl.getGamepad(0)).toEqual(null);
  });

  test('check gamepad connect trigger callback', () => {
    const mock = jest.fn();
    const gamepadMock = getMock();

    gameControl.on('connect', mock);
    const event = new CustomEvent('gamepadconnected', {
      detail: { gamepad: gamepadMock },
      gamepad: gamepadMock,
    });
    global.dispatchEvent(event);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(Object.keys(gameControl.gamepads).length).toBe(1);

    const disconnectEvent = new CustomEvent('gamepaddisconnected', {
      detail: { gamepad: gamepadMock },
      gamepad: gamepadMock,
    });
    global.dispatchEvent(disconnectEvent);
    gameControl.off('connect', mock)
  });

  test('check animate frame runs when active', async () => {
    const onBeforeMock = jest.fn();
    const onAfterMock = jest.fn();
    const gamepadMock = getMock();
    
    await wait(100)
    gameControl.on('beforeCycle', onBeforeMock);
    gameControl.on('afterCycle', onAfterMock);
    const event = new CustomEvent('gamepadconnected', {
      detail: { gamepad: gamepadMock },
      gamepad: gamepadMock,
    });
    global.dispatchEvent(event);
    await wait(1000);
    expect(onBeforeMock.mock.calls.length).toBeGreaterThan(50);
    expect(onBeforeMock.mock.calls.length).toBeLessThan(70);

    expect(onAfterMock.mock.calls.length).toBeGreaterThan(50);
    expect(onAfterMock.mock.calls.length).toBeLessThan(70);

    const disconnectEvent = new CustomEvent('gamepaddisconnected', {
      detail: { gamepad: gamepadMock },
      gamepad: gamepadMock,
    });
    global.dispatchEvent(disconnectEvent);
  });

  test('connect and disconnect', async () => {
    const onBeforeMock = jest.fn();
    const connectMock = jest.fn();
    const disconnectMock = jest.fn();
    const gamepadMock = getMock();

    gameControl.on('beforeCycle', onBeforeMock);
    gameControl.on('connect', connectMock);
    gameControl.on('disconnect', disconnectMock);
    const connectEvent = new CustomEvent('gamepadconnected', {
      detail: { gamepad: gamepadMock },
      gamepad: gamepadMock,
    });
    global.dispatchEvent(connectEvent);

    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(Object.keys(gameControl.gamepads).length).toBe(1);

    const disconnectEvent = new CustomEvent('gamepaddisconnected', {
      detail: { gamepad: gamepadMock },
      gamepad: gamepadMock,
    });
    global.dispatchEvent(disconnectEvent);
    await wait(100);
    const cycles = onBeforeMock.mock.calls.length;
    await wait(500);

    expect(onBeforeMock.mock.calls.length).toBe(cycles);
    expect(disconnectMock).toHaveBeenCalledTimes(1);
    expect(Object.keys(gameControl.gamepads).length).toBe(0);
  });
});
