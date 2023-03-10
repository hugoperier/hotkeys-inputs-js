import gameControl from '../src/gamecontrol';
import inputActions from '../src/inputActions';
import { DefaultGamepad } from '../src/types';
import { getMock } from './mock.gamepad';

describe('inputActions', () => {
  const defaultMapping = {
    directionY: [
      { type: 'keyboard', key: 'w', options: { event: 'repeat', value: 1 } },
      { type: 'keyboard', key: 's', options: { event: 'repeat', value: -1 } },
      { type: 'gamepad', key: DefaultGamepad.LeftJoystickAxeY, options: { event: 'repeat', value: -2 } },
    ],
    directionX: [
      { type: 'keyboard', key: 'd', options: { event: 'repeat', value: 1 } },
      { type: 'keyboard', key: 'a', options: { event: 'repeat', value: -1 } },
      { type: 'gamepad', key: DefaultGamepad.LeftJoystickAxeX, options: { event: 'repeat', value: 2 } },
    ],
  };

  afterEach(() => {
    inputActions.definedActions = {};
  });

  test('define actions', () => {
    inputActions.defineInputActions(defaultMapping);
    expect(inputActions.definedActions).toStrictEqual(defaultMapping);
  });
  test('define duplicate action should throw', () => {
    inputActions.defineInputActions(defaultMapping);
    const fn = () => {
      inputActions.defineInputActions(defaultMapping);
    };
    expect(fn).toThrow();
  });
  test('force define action with override set', () => {
    inputActions.defineInputActions(defaultMapping);
    inputActions.defineInputActions(defaultMapping, { override: true });
    expect(inputActions.definedActions).toStrictEqual(defaultMapping);
  });
  test('register duplicate id should throw', () => {
    inputActions.defineInputActions(defaultMapping);
    const onAction = jest.fn();
    inputActions.onInputActions('throw', {
      directionX: onAction,
    });
    const regiserAgain = () => {
      inputActions.onInputActions('throw', {
        directionX: onAction,
      });
    };
    expect(regiserAgain).toThrow();
  });
  test('trigger numeric action', () => {
    inputActions.defineInputActions(defaultMapping);
    const onAction = jest.fn();
    inputActions.onInputActions('test', {
      directionX: onAction,
    });
    inputActions.registeredActions.keyboard['a'].handler(1);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(-1);
    inputActions.offInputActions('test');
  });
  test('trigger analog action', () => {
    inputActions.defineInputActions(defaultMapping);
    inputActions.gamepadEnabled = true;
    const onAction = jest.fn();
    inputActions.onInputActions('test', {
      directionX: onAction,
    });
    inputActions.registeredActions.gamepad[DefaultGamepad.LeftJoystickAxeX].handler(1);
    expect(onAction).toHaveBeenCalledWith(2);
    inputActions.offInputActions('test');
  });
  test('trigger undefined action', () => {
    inputActions.defineInputActions(defaultMapping);
    const onAction = jest.fn();
    inputActions.onInputActions('test', {
      directionX: onAction,
    });
    inputActions.registeredActions.keyboard['a'].handler();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith();
    inputActions.offInputActions('test');
  });

  test('trigger action on disabled input', () => {
    inputActions.defineInputActions(defaultMapping);
    inputActions.gamepadEnabled = false;
    inputActions.keyboardEnabled = false;
    expect(inputActions.gamepadEnabled).toBe(false);
    expect(inputActions.keyboardEnabled).toBe(false);
    const onAction = jest.fn();
    inputActions.onInputActions('test', {
      directionX: onAction,
    });
    inputActions.registeredActions.gamepad[DefaultGamepad.LeftJoystickAxeX].handler(1);
    expect(onAction).not.toHaveBeenCalled();
    inputActions.offInputActions('test');
    inputActions.keyboardEnabled = true;
  });
  test('unregister action', () => {
    inputActions.defineInputActions(defaultMapping);
    const onAction = jest.fn();
    inputActions.onInputActions('test', {
      directionX: onAction,
    });
    inputActions.offInputActions('test');
    expect(inputActions.registeredActions.keyboard['a']).not.toBeDefined();
    expect(onAction).not.toHaveBeenCalled();
  });

  test('gamepad set and unset handler', () => {
    const mockGamepad = getMock();
    expect(inputActions.handlers.gamepad.handler).not.toBeDefined();

    gameControl.onConnect.trigger(mockGamepad);
    expect(inputActions.handlers.gamepad.handler).toBeDefined();
    gameControl.onDisconnect.trigger(mockGamepad);
    expect(inputActions.handlers.gamepad.handler).not.toBeDefined();
  });
});
