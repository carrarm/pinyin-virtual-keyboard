# pinyin-virtual-keyboard

A reusable Angular standalone virtual keyboard for typing pinyin with tone support.

## What this project does

`pinyin-virtual-keyboard` provides an Angular standalone component that renders a customizable on-screen keyboard for pinyin input. It supports predefined layouts, custom layouts, symbol mode, rounded accent selection, and simplified tone entry.

## Why it is useful

- Quick pinyin entry with built-in tone accents
- Works as a standalone Angular component
- Supports custom key layouts for letters and symbols
- Offers flexible positioning: fixed, container, or custom
- Includes a numeric row, submit action, and backspace handling
- Uses CSS custom properties for easy theming

## Quick start

### Install dependencies

```bash
npm install
```

### Run the demo application

```bash
npm start
```

Open `http://localhost:4200` in your browser.

### Build the library

```bash
npm run build:lib
```

### Run unit tests

```bash
npm test
```

## Example usage

Import the standalone component and `FormsModule` into your Angular application:

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PinyinVirtualKeyboard } from 'pinyin-virtual-keyboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, PinyinVirtualKeyboard],
  template: `
    <input [(ngModel)]="value" />

    <pinyin-virtual-keyboard
      [(value)]="value"
      [keyboardLayout]="'QWERTY'"
      [symbolKeyboardLayout]="'SYMBOL'"
      [anchor]="'fixed'"
      [simplify]="true"
      [baseKeyboardNumericRow]="true"
    />
  `,
})
export class AppComponent {
  value = '';
}
```

## Component API

### Inputs

- `keyboardLayout: 'QWERTY' | 'AZERTY' | 'QWERTZ' | string[][]`
- `symbolKeyboardLayout: 'SYMBOL' | string[][]`
- `anchor: 'fixed' | 'container' | 'custom'`
- `baseKeyboardNumericRow: boolean`
- `simplify: boolean`
- `value: string` (two-way binding supported)

### Outputs

- `typed: EventEmitter<string>`
- `backspace: EventEmitter<void>`
- `submitText: EventEmitter<void>`

## Custom layouts

Use a custom layout by passing a matrix of key rows. Include `SHIFT` and `BACKSPACE` as needed.

```ts
const customLayout = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];
```

## Project structure

- `src/` – demo app source
- `src/app/` – sample app using the keyboard component
- `projects/pinyin-virtual-keyboard/` – Angular library source
- `projects/pinyin-virtual-keyboard/src/lib/pinyin-virtual-keyboard.ts` – main component
- `projects/pinyin-virtual-keyboard/src/lib/model/keyboard-layout.ts` – predefined layouts and layout types
- `projects/pinyin-virtual-keyboard/src/public-api.ts` – library public exports

## Support

If you need help or want to suggest improvements, open an issue on this repository.

For Angular documentation, see `https://angular.dev/`.

## Contributing

Contributions are welcome. If you want to contribute, please open a pull request or issue with a description of the change.

## Maintainers

Maintained by the repository owner. For questions, bugs, and enhancement requests, use the repository issue tracker.
