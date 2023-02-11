import { IProxyEventOption, IProxyInputEventHandler } from './types';
import hotkeys from 'hotkeys-js';

const defaultOpts: IProxyEventOption = {
  event: 'change',
};

const keyboardProxy: IProxyInputEventHandler = {
  on: function (eventName, callback, opts) {
    const options = opts ?? defaultOpts;

    if (options.event === 'repeat') {
      hotkeys(eventName as string, (event, _) => {
        event.preventDefault();
        if (event.type === 'keydown') {
          const interval = setInterval(() => {
            if (!hotkeys.isPressed(eventName as string)) clearInterval(interval);
            else callback(options.value);
          }, 100);
        }
      });
    } else {
      const hotKeysOptions = {
        keyup: opts?.event === 'released' || opts?.event === 'change' ? true : null,
        keydown: opts?.event === 'pressed' || opts?.event === 'change' ? true : null,
      };
      hotkeys(eventName as string, hotKeysOptions, (event, _) => {
        callback(options.value);
      });
    }
  },
  off: function (eventName) {
    hotkeys.unbind(eventName as string);
  },
};

export default keyboardProxy;

// 1 implement options for on/off of IproxyInputEventHandkler
// 2 test with keyboard

// 3 implement options for gamepad
// 4 test with gamepad
// 5 test switch
