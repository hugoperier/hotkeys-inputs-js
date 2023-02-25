# hotkeys-inputs-js

hotkeys-inputs-js is a javascript library for handling both keyboard and gamepad inputs in web applications. This is the ideal solution for your project if you need to work with both a keyboard and gamepad, and frequently need to activate or deactivate input events to manage actions.

![GitHub package version](https://img.shields.io/github/package-json/v/hugoperier/hotkeys-inputs-js)
![NPM](https://img.shields.io/npm/l/hotkeys-inputs-js)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

## Features

- Subscribe to gamepad events such as button presses and joystick movements
- Subscribe to keyboard events such as key presses
- Register actions with a group of different keys or buttons
- Unify input handling with a single, user-friendly interface

## Installation

```bash
npm install hotkeys-input-js
```

or

```bash
yarn add hotkeys-input-js
```

## Simple usage

```javascript
// Action definition
const defaultMapping = {
  directionY: [
    { type: 'keyboard', key: 'w', options: { event: 'repeat', value: 1 } },
    { type: 'keyboard', key: 's', options: { event: 'repeat', value: -1 } },
    { type: 'gamepad', key: DefaultGamepad.LeftJoystickAxeY, options: { event: 'repeat', value: -2 } },
  ],
  directionX: [
    { type: 'keyboard', key: 'd', options: { event: 'repeat', value: 1 } },
    { type: 'keyboard', key: 'a', options: { event: 'repeat', value: -1 } },
    { type: 'gamepad', key: DefaultGamepad.LeftJoystickAxeX, options: { event: 'repeat', value: 2 } },
  ],
};

// Register previously defined actions
inputActions.defineInputActions(defaultMapping);

// Register events from the group of action, defines callback for when an event is triggered
inputActions.onInputActions(`moveActions`, {
  directionX: (v) => moveX(v),
  directionY: (v) => moveY(v),
});
```

# API Reference

## defineInputActions

To specify the different sets of actions that your application will support, employ the inputActions.defineInputActions function. Note that this function does not attach any event listeners; rather, it serves as a way to enumerate all the actions that your app can handle. When utilizing the override parameter, any previously defined actions will be replaced, while not providing this parameter will result in an error being thrown.

**Mapping an action to handlers**

```typescript
interface MapExample {
  [actionNames]: {
    type: 'keyboard' | 'gamepad';
    key: number | string;
    options: {
      event: 'changed' | 'pressed' | 'released' | 'repeat';
      value: number;
    };
  };
}
```

`actionNames`: The keys of the object represent the action names that the mappings are associated with.

`handlers`: An array of objects that specify the inputs that trigger the associated action.

`type`: Indicates the input device type, either keyboard or gamepad.

`key`: Specifies the input key, which is either an integer for gamepad button ID or a string using the js-keyboard library.
event: The type of input event, which can be repeat, pressed, released, or changed.

`value`: The value parameter that the callback function is called with. If the key is pressed, the value will be the value specified. If the key is not pressed, the value will be 0. For analog inputs such as joysticks, the value will reflect the degree of input (e.g., if a joystick is at 50%, the value will be 0.5).

**Example**

```javascript
const mapping1 = {
  directionY: [{ type: 'keyboard', key: 'w', options: { event: 'repeat', value: 1 } }],
  directionX: [{ type: 'keyboard', key: 'd', options: { event: 'repeat', value: 1 } }],
};

const mapping2 = {
  jump: [{ type: 'keyboard', key: 'space', options: { event: 'pressed', value: 1 } }],
  punch: [{ type: 'keyboard', key: '1', options: { event: 'pressed', value: 1 } }],
};

// works
inputActions.defineInputActions(mapping1);
inputActions.defineInputActions(mapping2);

// throw an error, it has already been defined
inputActions.defineInputActions(mapping1);

// works
inputActions.defineInputActions(mapping1, { override: true });
```

## onInputActions

The inputActions.onInputActions function allows you to register a collection of actions to functions, which will be invoked with the value provided in the mapping when a given action is triggered. The function takes the following parameters:

```javascript
inputActions.onInputActions(id: string, handlers: Record<string, function>, unsubscribedCallback: function )
```

`id`: The ID of the group of actions to subscribe. The group ID must be unique and no duplicates are allowed. You can use this ID to later unsubscribe the group of actions related to it.

`handlers`: The collection of actions and callbacks to invoke when the key corresponding to the mapping is triggered by the user. If the action is not defined, an error will be thrown.

`unsubscribedCallback`: (Optional) The unsubscribedCallback is invoked when the group of actions is unregistered.

```javascript
const mapping1 = {
  directionY: [{ type: 'keyboard', key: 'w', options: { event: 'repeat', value: 1 } }],
  directionX: [{ type: 'keyboard', key: 'd', options: { event: 'repeat', value: 1 } }],
};

inputActions.defineInputActions(mapping1);

inputActions.onInputActions(
  `moveActions`,
  {
    directionX: (v) => moveX(v),
    directionY: (v) => moveY(v),
  },
  myCallbackWhenUnregisters,
);
```

## offInputActions

The offInputActions function is used to unregister a previously registered group of input actions. When called, this function will unregister the group of actions that corresponds to the given ID. The function takes a single parameter:

`id`: The ID of the group of actions to unsubscribe.

```javascript
inputActions.offInputActions(`moveActions`);
```

## Enable or disable handlers

You can enable or disable the support for an input handler. If the handler is disabled, it will not fire the action if the input is triggered.

**Note that only the keyboard is enabled by default**

```javascript
//enable
inputActions.keyboardEnabled = true;
inputActions.gamepadEnabled = true;

//disable
inputActions.keyboardEnabled = false;
inputActions.gamepadEnabled = false;
```

# Testing

_I have been using node 14.18.0 for the development_

- Clone the repository
- Run `npm install` and then `npm build`
- use the `index.html`
- Happy coding!

# Contributing

If you would like to contribute to the development of this library, please reach out to us. We welcome contributions of all kinds, from bug reports and fixes to new features and improvements.
