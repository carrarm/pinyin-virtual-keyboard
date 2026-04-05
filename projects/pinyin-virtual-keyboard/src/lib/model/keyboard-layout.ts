export const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export const QWERTY: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const QWERTZ: string[][] = [
  ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['SHIFT', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export const AZERTY: string[][] = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['SHIFT', 'W', 'X', 'C', 'V', 'B', 'N', 'BACKSPACE'],
];

export const SYMBOL: string[][] = [
  NUMBERS,
  ['@', '#', '~', '°', '&', '^', '[', ']', '(', ')'],
  ['£', '$', '€', '¥', '*', '-', '+', '/', '=', '%'],
  ['.', ',', '_', '"', "'", ':', ';', '!', '?'],
];

export const PREDEFINED = {
  QWERTY: QWERTY,
  QWERTZ: QWERTZ,
  AZERTY: AZERTY,
  SYMBOL: SYMBOL,
} as const;

export type KeyboardLayout = 'QWERTY' | 'AZERTY' | 'QWERTZ' | string[][];

export type SymbolLayout = 'SYMBOL' | string[][];
