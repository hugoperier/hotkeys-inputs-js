# hotkeys-inputs-js

hotkeys-inputs-js is a javascript library for handling both keyboard and gamepad inputs in web applications. This is the ideal solution for your project if you need to work with both a keyboard and gamepad, and frequently need to activate or deactivate input events to manage actions.

![GitHub package version](https://img.shields.io/github/package-json/v/hugoperier/hotkeys-inputs-js)
![NPM](https://img.shields.io/npm/l/hotkeys-inputs-js)


## Features

- Subscribe to gamepad events such as button presses and joystick movements
- Subscribe to keyboard events such as key presses
- Register actions with a group of different keys or buttons
- Unify input handling with a single, user-friendly interface

## Installation

```
npm install hotkeys-input-js
```

## Simple usage

```javascript
// Action definition
const defaultMapping = {
  directionY: [
    { type: 'keyboard', key: 'w', options: { event: 'repeat', value: 1 } },
    { type: 'keyboard', key: 's', options: { event: 'repeat', value: -1 } },
    { type: 'gamepad', key: -2, options: { event: 'repeat', value: -2 } },
  ],
  directionX: [
    { type: 'keyboard', key: 'd', options: { event: 'repeat', value: 1 } },
    { type: 'keyboard', key: 'a', options: { event: 'repeat', value: -1 } },
    { type: 'gamepad', key: -1, options: { event: 'repeat', value: 2 } },
  ],
};

// Register previously defined actions
inputAction.defineInputActions(defaultMapping);

// Register events from the group of action, defines callback for when an event is triggered
inputAction.onInputActions(`cubeActionHandler`, {
  directionX: (v) => moveX(v),
  directionY: (v) => moveY(v),
});
```

## Contributing

If you would like to contribute to the development of this library, please reach out to us. We welcome contributions of all kinds, from bug reports and fixes to new features and improvements.
