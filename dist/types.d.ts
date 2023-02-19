export type InputHandlerType = 'keyboard' | 'gamepad';
export type InputEventType = 'changed' | 'pressed' | 'released' | 'repeat';
export type GamepadHandler = Record<number, ((gamepad: Gamepad) => void)[]>;
export type ActionHandler = Record<string, (value?: number) => void>;
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
    off: (eventName: number | string, callback: (value?: number) => void) => void;
}
export interface IHandler {
    handler?: IProxyInputEventHandler;
    enabled: boolean;
}
export {};
