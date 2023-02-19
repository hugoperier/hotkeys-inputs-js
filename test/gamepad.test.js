import gamepad from '../src/gamepad';
import { gamepadMock } from './mock.gamepad.test';

describe('test gamepad handler', () => {
  test('initialize', () => {
    const gp = gamepad.init(gamepadMock);
    expect(gp).toBeDefined();
    expect(gp.id).toBe(gamepadMock.index);
    expect(gp.axeValues.length).toBe(gamepadMock.axes.length);
  });
});
