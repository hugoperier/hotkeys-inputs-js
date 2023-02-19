import { ActionHandler, IHandler, InputHandlerDefinedAction, InputHandlerType, RegisteredActions } from './types';
interface RegisterInputActionOptions {
    override?: boolean;
}
export interface InputActions {
    supportedInputHandlers: Readonly<InputHandlerType[]>;
    handlers: Record<InputHandlerType, IHandler>;
    definedActions: InputHandlerDefinedAction;
    registeredActions: RegisteredActions;
    unregisterActionsCallbacks: Record<string, Function>;
    gamepadEnabled: boolean;
    keyboardEnabled: boolean;
    init: () => void;
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
declare const inputAction: InputActions;
export default inputAction;
