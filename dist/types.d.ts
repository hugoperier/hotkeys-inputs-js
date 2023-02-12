export type InputHandlerType = 'keyboard' | 'gamepad';
export type GamepadHandler = Record<number, ((gamepad: Gamepad) => void)[]>;
export type ActionHandler = Record<string, (value?: number) => void>;
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
}
export type RegisteredActions = Record<InputHandlerType, Record<string | number, ActionModel>>;
export interface IProxyEventOption {
    value?: number;
    event: 'changed' | 'pressed' | 'released' | 'repeat';
}
export interface IProxyInputEventHandler {
    on: (eventName: number | string, callback: (value?: number) => void, opts?: IProxyEventOption) => void;
    off: (eventName: number | string) => void;
}
export interface IHandler {
    handler?: IProxyInputEventHandler;
    enabled: boolean;
}
export {};
