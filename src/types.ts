export type InputHandlerType = "keyboard" | "gamepad";

export type GamepadHandler = Record<number, ((gamepad: Gamepad) => void)[]>;

export type ActionHandler = Record<string, (value: number) => void>;

interface InputHandlerActionDefinition {
  type: InputHandlerType;
  value: number;
}

export interface GamepadActionDefinition extends InputHandlerActionDefinition {
  key: number;
  type: "gamepad";
}

export interface KeyboardActionDefinition extends InputHandlerActionDefinition {
  key: string;
  type: "keyboard";
}

export type InputHandlerDefinedAction = Record<
  string | number,
  (KeyboardActionDefinition | GamepadActionDefinition)[]
>;

export interface ActionModel {
  handler: (value: number) => void;
  id: string;
}

export type RegisteredActions = Record<
  InputHandlerType,
  Record<string | number, ActionModel>
>;
