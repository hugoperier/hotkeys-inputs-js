# hotkeys-inputs-js
A javascript library for handling both keyboard and gamepad inputs in web applications.

## Features
- Subscribe to gamepad events such as button presses and joystick movements
- Subscribe to keyboard events such as key presses
- Register actions with a group of different keys or buttons
- Unify input handling with a single, user-friendly interface

## Installation

```
npm install hotkeys-input-js
```

## Usage

```javascript
const defaultMapping = {
  'direction': [
    { type: 'keyboard', key: 'w', value: 1 },
    { type: 'keyboard', key: 's', value: -1 },
    { type: 'gamepad', key: InputFusion.LeftJoystickAxeY }
  ],
  'rotation': [
    { type: 'keyboard', key: 'd', value: 1 },
    { type: 'keyboard', key: 'a', value: -1 },
    { type: 'gamepad', key: InputFusion.LeftJoystickAxeX }
  ],
  'speed': [
    { type: 'keyboard', key: 'leftArrow', value: -1 },
    { type: 'keyboard', key: 'rightArrow', value: 1 },
    { type: 'gamepad', key: InputFusion.KeyPlus, value: 1 },
    { type: 'gamepad', key: InputFusion.KeyMinus, value: 1 },
  ]
};

InputFusion.useInputActions('module-id', defaultMapping, () => setActive(false));
```

## Contributing

If you would like to contribute to the development of this library, please reach out to us. We welcome contributions of all kinds, from bug reports and fixes to new features and improvements.