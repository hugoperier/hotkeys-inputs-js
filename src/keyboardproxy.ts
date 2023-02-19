import { IProxyEventOption, IProxyInputEventHandler } from './types';
import hotkeys, { HotkeysEvent } from 'hotkeys-js';

const keyboardProxy: IProxyInputEventHandler = {
  on: function (eventName, callback, event = 'changed') {
    if (event === 'repeat') {
      hotkeys(eventName as string, (event, _) => {
        event.preventDefault();
        callback(1);
      });
    } else {
      const hotKeysOptions = {
        keyup: event === 'released' || event === 'changed' ? true : null,
        keydown: event === 'pressed' || event === 'changed' ? true : null,
      };
      hotkeys(eventName as string, hotKeysOptions, (event: KeyboardEvent, d: HotkeysEvent) => {
        if (!event.repeat) callback(hotkeys.isPressed(eventName as string) === true ? 1 : 0);
      });
    }
  },
  off: function (eventName, handler) {
    hotkeys.unbind(eventName as string);
  }, // todo save function ref to unhandle it properly
};

export default keyboardProxy;

// 3 implement options for gamepad
// 4 test with gamepad
// 5 test switch
