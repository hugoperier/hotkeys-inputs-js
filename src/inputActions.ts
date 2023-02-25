import gameControl from './gamecontrol';
import keyboardProxy from './keyboardproxy';
import {
  ActionHandler,
  GamepadPrototype,
  IHandler,
  InputHandlerDefinedAction,
  InputHandlerType,
  RegisteredActions,
  RegisterInputActionOptions,
} from './types';

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

const inputActions: InputActions = {
  supportedInputHandlers: ['keyboard', 'gamepad'],
  handlers: {
    keyboard: {
      handler: keyboardProxy,
      enabled: true,
    },
    gamepad: {
      handler: undefined,
      enabled: false,
    },
  },
  definedActions: {},
  registeredActions: {
    keyboard: {},
    gamepad: {},
  },
  get gamepadEnabled() {
    return this.handlers.gamepad.enabled;
  },
  set gamepadEnabled(value: boolean) {
    this.handlers.gamepad.enabled = value;
  },
  get keyboardEnabled() {
    return this.handlers.keyboard.enabled;
  },
  set keyboardEnabled(value: boolean) {
    this.handlers.keyboard.enabled = value;
  },
  unregisterActionsCallbacks: {},
  init: function () {
    gameControl.on('connect', (gamepad) => {
      if (!this.handlers.gamepad.handler) {
        this.handlers.gamepad.handler = gamepad;
        if (!this.handlers.gamepad.enabled) return;
        Object.entries(this.registeredActions.gamepad).forEach(([k, v]) => {
          this.handlers.gamepad.handler?.on(k, v.handler, v.event);
        });
      }
    });
    gameControl.on('disconnect', (gamepad) => {
      if (gamepad.id === (this.handlers.gamepad.handler as GamepadPrototype).id) {
        this.handlers.gamepad.handler = undefined;
      }
    });
    Object.entries(gameControl.getGamepads()).find(([k, v]) => {
      if (v !== null && v.id !== (this.handlers.gamepad.handler as GamepadPrototype).id)
        this.handlers.gamepad.handler = v;
    });
  },
  defineInputActions: function (actions: InputHandlerDefinedAction, opts?: RegisterInputActionOptions) {
    Object.entries(actions).map(([action, definitions]) => {
      if (!opts?.override && this.definedActions[action])
        throw new Error(`${action} action has already been defined as a dependancy.`);
      this.definedActions[action] = definitions;
    });
  },
  onInputActions: function (id: string, handlers: ActionHandler, unsubscribedCallback: Function) {
    const idsPendingDeletion = new Set<string>();

    // First, registering actions to input, and saving ids for action to be cleaned up
    Object.entries(handlers).forEach(([k, v]) => {
      const registeredInputTrigger = this.definedActions[k];

      registeredInputTrigger.forEach((action) => {
        // If already defined, saving id, unsubcribe the event and registering the new one
        const previouslyRegistered = this.registeredActions[action.type][action.key];
        if (previouslyRegistered) {
          if (previouslyRegistered.id === id)
            throw new Error(
              `There is already a group of event registered under the id [${id}]. Unsubscribe this group of event before registering a new one`,
            );
          idsPendingDeletion.add(previouslyRegistered.id);
          this.handlers[action.type].handler?.off(action.key, previouslyRegistered.handler);
        }

        const onInputEvent = (value: number | undefined) => {
          if (!this.handlers[action.type].enabled) return;
          if (!value) {
            v();
            return;
          }
          const adjustedValue =
            value === 1 ? action.options?.value ?? 1 : value === 0 ? 0 : ((action.options?.value ?? 1) / 1) * value;
          v(adjustedValue);
        };
        this.registeredActions[action.type][action.key] = {
          handler: onInputEvent,
          id,
          event: action.options?.event,
        };
        onInputEvent.bind(this); //test to remove it
        if (this.handlers[action.type].enabled)
          this.handlers[action.type].handler?.on(action.key, onInputEvent, action.options?.event);
      });
    });
    this.unregisterActionsCallbacks[id] = unsubscribedCallback;
    // Secondly, unregister all action from saved ids
    this.supportedInputHandlers.forEach((e) => {
      Object.entries(this.registeredActions[e]).forEach(([k, v]) => {
        if (idsPendingDeletion.has(v.id)) {
          this.handlers[e].handler?.off(k, v.handler);
          delete this.registeredActions[e][k];
        }
      });
    });

    // Call the unsubscribe callback for unsubcribed actions
    for (var item of Array.from(idsPendingDeletion.values())) {
      if (this.unregisterActionsCallbacks[item]) this.unregisterActionsCallbacks[item]();
    }
  },
  offInputActions: function (id: string) {
    this.supportedInputHandlers.forEach((e) => {
      Object.entries(this.registeredActions[e]).forEach(([k, v]) => {
        if (id === v.id) {
          this.handlers[e].handler?.off(k);
          delete this.registeredActions[e][k];
        }
      });
    });
  },
};

inputActions.init();

export default inputActions;
