import { ILiteEvent } from './dist/LiteEvents';

declare const gameControl: GameControl;
//# sourceMappingURL=gamecontrol.d.ts.map

declare const gamepad: {
  init: (gpad: Gamepad) => GamepadPrototype;
};
//# sourceMappingURL=gamepad.d.ts.map

export interface InputActions {
  supportedInputHandlers: Readonly<InputHandlerType[]>;
  handlers: Record<InputHandlerType, IHandler>;
  definedActions: InputHandlerDefinedAction;
  registeredActions: RegisteredActions;
  unregisterActionsCallbacks: Record<string, Function>;
  gamepadEnabled: boolean;
  keyboardEnabled: boolean;
  init: () => void;
  /**
   * Defines the different sets of actions that the application will
   * support by enumerating all the actions that can be handled.
   * @param actions An object whose keys represent the action names that the mappings are associated with, and whose values are arrays of
   * objects that specify the inputs that trigger the associated action.
   * @param opts Options for the definition of inputActions
   */
  defineInputActions: (actions: InputHandlerDefinedAction, opts?: RegisterInputActionOptions) => void;
  /**
   * Subscribe a group of action to events
   * from an already inputhandler map. If provided handlers are going to replace
   * a set of already define action, the whole group of replaced action is unsubscribed,
   * and the user is notified by the unsubscribedCallback
   *
   * @param {string} id - The id that defines the group of actions
   * @param {ActionHandler[]} handlers - The function that handle the action to be performed
   * @param {Function} unsubscribedCallBack - This function is called when handlers unmounts
   */
  onInputActions: (id: string, handlers: ActionHandler, unsubscribedCallback: Function) => void;
  /**
   * Unregisters a previously registered group of input actions.
   * @param {string} id - The ID of the group of actions to unsubscribe.
   */
  offInputActions: (id: string) => void;
}
declare const inputActions: InputActions;
//# sourceMappingURL=inputActions.d.ts.map
export default inputActions;
export { gamepad, gameControl };

export type InputHandlerType = 'keyboard' | 'gamepad';
export type InputEventType = 'changed' | 'pressed' | 'released' | 'repeat';

export type GamepadHandler = Record<number, ((gamepad: Gamepad) => void)[]>;

export type ActionHandler = Record<string, (value?: number) => void>;

export interface RegisterInputActionOptions {
  override?: boolean;
}

export interface IProxyEventOption {
  value?: number;
  event: InputEventType;
}

interface InputHandlerActionDefinition {
  type: InputHandlerType;
  options?: IProxyEventOption;
}

export interface GamepadActionDefinition extends InputHandlerActionDefinition {
  key: number;
  type: 'gamepad';
}

export interface KeyboardActionDefinition extends InputHandlerActionDefinition {
  key: string;
  type: 'keyboard';
}

export type InputHandlerDefinedAction = Record<string | number, (KeyboardActionDefinition | GamepadActionDefinition)[]>;

export interface ActionModel {
  handler: (value?: number) => void;
  id: string;
  event?: InputEventType;
}

export type RegisteredActions = Record<InputHandlerType, Record<string | number, ActionModel>>;

export interface IProxyInputEventHandler {
  on: (eventName: number | string, callback: (value?: number) => void, eventType?: InputEventType) => void;
  off: (eventName: number | string, callback?: (value?: number) => void) => void;
}

export interface IHandler {
  handler?: IProxyInputEventHandler;
  enabled: boolean;
}

export type GameControlEventType = 'connect' | 'disconnect' | 'beforeCycle' | 'afterCycle';

export type GameControlConnectConnectEvent = (
  eventName: 'connect' | 'disconnect',
  handler: (gamepad: GamepadPrototype) => void,
) => void;

export type GameControlCycleEvent = (eventName: 'beforeCycle' | 'afterCycle', handler: () => void) => void;

export type GameControlEventHandler = (gamepad: GamepadPrototype) => void | (() => void);

export interface GameControl {
  gamepads: Record<number, GamepadPrototype>;
  axeThreshold: number[];
  isReady: () => boolean;
  onConnect: ILiteEvent<GamepadPrototype>;
  onDisconnect: ILiteEvent<GamepadPrototype>;
  onBeforeCycle: ILiteEvent<void>;
  onAfterCycle: ILiteEvent<void>;
  getGamepads: () => Record<number, GamepadPrototype>;
  getGamepad: (id: number) => GamepadPrototype | null;
  // set: (property: string, value: any) => void;
  checkStatus: () => void;
  init: () => void;
  on: GameControlConnectConnectEvent & GameControlCycleEvent;
  off: GameControlConnectConnectEvent & GameControlCycleEvent;
}

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

export interface AxesActions {
  [index: string]: {
    vertical: KeyEventAction<number>;
    horizontal: KeyEventAction<number>;
  };
}

export interface Pressed {
  [index: string]: boolean;
}

export interface GamepadPrototype extends IProxyInputEventHandler {
  id: number;
  buttons: number;
  axes: number;
  axeValues: number[];
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
  vibrate: (value?: number, duration?: number) => void;
  checkStatus: () => void;
}
