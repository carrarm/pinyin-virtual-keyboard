import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { providePinyinVirtualKeyboard } from 'pinyin-virtual-keyboard';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), providePinyinVirtualKeyboard()],
};
