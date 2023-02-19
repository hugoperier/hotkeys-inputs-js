import { GamepadPrototype } from "./gamepad";
import { ILiteEvent } from "./LiteEvents";
type GameControlConnectConnectEvent = (eventName: "connect" | "disconnect", handler: (gamepad: GamepadPrototype) => void) => void;
type GameControlCycleEvent = (eventName: "beforeCycle" | "afterCycle", handler: () => void) => void;
interface GameControl {
    gamepads: Record<number, GamepadPrototype>;
    axeThreshold: number[];
    isReady: () => boolean;
    onConnect: ILiteEvent<GamepadPrototype>;
    onDisconnect: ILiteEvent<GamepadPrototype>;
    onBeforeCycle: ILiteEvent<void>;
    onAfterCycle: ILiteEvent<void>;
    getGamepads: () => Record<number, GamepadPrototype>;
    getGamepad: (id: number) => GamepadPrototype | null;
    set: (property: string, value: any) => void;
    checkStatus: () => void;
    init: () => void;
    on: GameControlConnectConnectEvent & GameControlCycleEvent;
    off: GameControlConnectConnectEvent & GameControlCycleEvent;
}
declare const gameControl: GameControl;
export default gameControl;
