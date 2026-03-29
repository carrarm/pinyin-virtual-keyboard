import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideAngularSvgIcon } from 'angular-svg-icon';

export function providePinyinVirtualKeyboard(): EnvironmentProviders {
  return makeEnvironmentProviders([provideAngularSvgIcon()]);
}
