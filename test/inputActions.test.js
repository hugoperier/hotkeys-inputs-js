import inputActions from '../src/inputActions';
import { DefaultGamepad } from '../src/gamepad';

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
  test('force define action should throw', () => {
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
  test('trigger numeric action', () => {
    inputActions.defineInputActions(defaultMapping);
    const onAction = jest.fn();
    inputActions.onInputActions('test', {
      directionX: onAction,
    });
    inputActions.registeredActions.keyboard['a'].handler(1);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith(-1);
  });
  test('trigger analog action');
  test.todo('trigger action on disabled input')
  test.todo('unregister action');

});
