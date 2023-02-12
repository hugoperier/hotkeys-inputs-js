import { ILiteEvent } from './LiteEvents';
import { IProxyEventOption, IProxyInputEventHandler } from './types';
interface KeyEventAction<T> {
    changed: ILiteEvent<T>;
    pressed: ILiteEvent<T>;
    released: ILiteEvent<T>;
    repeat: ILiteEvent<T>;
}
interface ButtonActions {
    [index: number]: KeyEventAction<number>;
}
export declare enum DefaultGamepad {
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
    KeyMinus = 8
}
interface AxesActions {
    [index: string]: {
        vertical: KeyEventAction<number>;
        horizontal: KeyEventAction<number>;
    };
}
interface Pressed {
    [index: string]: boolean;
}
export interface GamepadPrototype extends IProxyInputEventHandler {
    id: number;
    buttons: number;
    axes: number;
    axeValues: any[];
    axeThreshold: number[];
    axeStep: number;
    hapticActuator: any;
    vibrationMode: number;
    vibration: boolean;
    mapping: any;
    buttonActions: ButtonActions;
    axesActions: AxesActions;
    pressed: Pressed;
    on: (eventName: number | string, callback: (value?: number) => void, opts?: IProxyEventOption) => void;
    off: (eventName: number | string) => void;
    after: (eventName: number | DefaultGamepad, callback: (value?: number) => void) => void;
    before: (eventName: number | DefaultGamepad, callback: (value?: number) => void) => void;
    set: (property: string, value: any) => void;
    vibrate: (value?: number, duration?: number) => void;
    checkStatus: () => void;
}
declare const gamepad: {
    init: (gpad: Gamepad) => GamepadPrototype;
};
export default gamepad;
