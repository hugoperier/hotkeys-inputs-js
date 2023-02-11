import gameControl from './gamecontrol';
import keyboardProxy from './keyboardproxy';
import { ActionHandler, IHandler, InputHandlerDefinedAction, InputHandlerType, RegisteredActions } from './types';

interface RegisterInputActionOptions {
  override?: boolean;
}

// const registeredActions: InputHandlerDefinedAction = {};

// const inputHandlers = {
//   keyboard: null,
//   gamepad: gameControl,
// };

export interface InputActions {
  supportedInputHandlers: Readonly<InputHandlerType[]>;
  handlers: Record<InputHandlerType, IHandler>;
  definedActions: InputHandlerDefinedAction;
  registeredActions: RegisteredActions;
  unregisterActionsCallbacks: Record<string, Function>;
  init: () => void;
  setActiveInputHandlers: (handlers: InputHandlerType[]) => void;
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
  offInputActions: (id: string) => void;
}

const inputAction: InputActions = {
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
  unregisterActionsCallbacks: {},
  init: function () {},
  setActiveInputHandlers: function (handlers: InputHandlerType[]) {},
  defineInputActions: function (actions: InputHandlerDefinedAction, opts?: RegisterInputActionOptions) {
    Object.entries(actions).map(([action, definitions]) => {
      if (!opts?.override && this.definedActions[action])
        throw new Error(`${action} action has already been defined as a dependancy.`);
      this.definedActions[action] = definitions;
    });
  },
  onInputActions: function (id: string, handlers: ActionHandler, unsubscribedCallback: Function) {
    const idsPendingDeletion = new Set<string>();
    console.log('registering', id);

    // First, registering actions to input, and saving ids for action to be cleaned up
    Object.entries(handlers).forEach(([k, v]) => {
      const registeredInputTrigger = this.definedActions[k];

      registeredInputTrigger.forEach((action) => {
        // If already defined, saving id, unsubcribe the event and registering the new one
        if (this.registeredActions[action.type][action.key]) {
          idsPendingDeletion.add(this.registeredActions[action.type][action.key].id);
          // inputHandler[action.type][action.key].off(action.callback)
          this.handlers[action.type].handler?.off(action.key);
        }

        this.handlers[action.type].handler?.on(action.key, v, action.options);
        this.registeredActions[action.type][action.key] = {
          handler: v,
          id,
        };
      });
    });
    this.unregisterActionsCallbacks[id] = unsubscribedCallback;
    // Secondly, unregister all action from saved ids
    this.supportedInputHandlers.forEach((e) => {
      Object.entries(this.registeredActions[e]).forEach(([k, v]) => {
        if (idsPendingDeletion.has(v.id)) {
          //inputHandler[action.type][k].off(action.callback)
          this.handlers[e].handler?.off(k);
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
          // inputHandler[action.type][k].off(action.callback)
          delete this.registeredActions[e][k];
        }
      });
    });
  },
};

export default inputAction;

// const actionIdsRegistered: Record<string, Function> = {};

// const inputActions: InputAction = {
//   keyboard: {},
//   gamepad: {},
// };

// export const registerInputActions = (
//   actions: InputHandlerActionRecord,
//   opts?: RegisterInputActionOptions
// ) => {
//   Object.entries(actions).map(([action, definitions]) => {
//     if (!opts?.override && registeredActions[action])
//       throw new Error(
//         `${action} action has already been defined as a dependancy.`
//       );
//     registeredActions[action] = definitions;
//   });
// };

/**
 * Subscribe a group of action to events
 * from an already inputhandler map. If provided handlers are going to replace
 * a set of already define action, the whole group of replaced action is unsubscribed,
 * and the user is notified by the unsubscribedCallback
 *
 * @param {string} id - The id that defines the group of actions
 * @param {ActionHandler[]} handlers - The function that handle the action to be performed
 * @param {Function} unsubscribedCallBack - This function is called when handlers unmounts
//  */
// export const onInputActions = (
//   id: string,
//   handlers: ActionHandler,
//   unsubscribedCallBack: Function
// ) => {
//   const idsPendingDeletion = new Set<string>();

//   // First, registering actions to input, and saving ids for action to be cleaned up
//   Object.entries(handlers).forEach(([k, v]) => {
//     const registeredInputTrigger = registeredActions[k];

//     registeredInputTrigger.forEach((action) => {
//       // If already defined, saving id, unsubcribe the event and registering the new one
//       if (inputActions[action.type][action.key]) {
//         idsPendingDeletion.add(inputActions[action.type][action.key].id);
//         // inputHandler[action.type][action.key].off(action.callback)
//       }
//       inputActions[action.type][action.key] = {
//         handler: v,
//         id,
//       };
//     });
//   });
//   actionIdsRegistered[id] = unsubscribedCallBack;
//   // Secondly, unregister all action from saved ids
//   (["gamepad", "keyboard"] as InputHandlerType[]).forEach((e) => {
//     Object.entries(inputActions[e]).forEach(([k, v]) => {
//       if (idsPendingDeletion.has(v.id)) {
//         //inputHandler[action.type][k].off(action.callback)
//         delete inputActions[e][k];
//       }
//     });
//   });

//   // Call the unsubscribe callback for unsubcribed actions
//   for (var item of Array.from(idsPendingDeletion.values())) {
//     if (actionIdsRegistered[item]) actionIdsRegistered[item]();
//   }
// };

// export const offInputActions = (id: string) => {
//   (["gamepad", "keyboard"] as InputHandlerType[]).forEach((e) => {
//     Object.entries(inputActions[e]).forEach(([k, v]) => {
//       if (id === v.id) {
//         // inputHandler[action.type][k].off(action.callback)
//         delete inputActions[e][k];
//       }
//     });
//   });
// };

// export const getData = () => {
//   return {
//     registeredActions,
//     inputActions,
//     actionIdsRegistered,
//   };
// };
