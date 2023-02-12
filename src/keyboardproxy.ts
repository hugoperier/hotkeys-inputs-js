import { IProxyEventOption, IProxyInputEventHandler } from './types';
import hotkeys from 'hotkeys-js';
import { defaultOpts } from './utils';

const keyboardProxy: IProxyInputEventHandler = {
  on: function (eventName, callback, opts) {
    const options = opts ?? defaultOpts;
    if (options.event === 'repeat') {
      hotkeys(eventName as string, (event, _) => {
        event.preventDefault();
        callback(options.value);
      });
    } else {
      const hotKeysOptions = {
        keyup: opts?.event === 'released' || opts?.event === 'changed' ? true : null,
        keydown: opts?.event === 'pressed' || opts?.event === 'changed' ? true : null,
      };
      hotkeys(eventName as string, hotKeysOptions, (event, d) => {
        if (!event.repeat) callback(options.value);
      });
    }
  },
  off: function (eventName) {
    hotkeys.unbind(eventName as string);
  },
};

export default keyboardProxy;

// 3 implement options for gamepad
// 4 test with gamepad
// 5 test switch
