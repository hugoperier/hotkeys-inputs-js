import {
  ActionHandler,
  IHandler,
  InputHandlerDefinedAction,
  InputHandlerType,
  RegisteredActions,
  RegisterInputActionOptions,
  GameControl,
  GamepadPrototype,
} from './dist/types';

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
