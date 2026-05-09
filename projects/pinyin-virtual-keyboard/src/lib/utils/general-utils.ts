/**
 * Replace a character in a string at the specified index.
 *
 * @param text     Original text
 * @param index    Position of the character to replace
 * @param newChar  Character replacing the old one
 * @returns Text with replaced character
 */
export function replaceCharAt(text: string, index: number, newChar: string): string {
  const asArray = text.split('');
  asArray[index] = newChar;
  return asArray.join('');
}

/**
 * Find the index of the last element matching the predicate.
 *
 * @param arr        Array of items
 * @param predicate  Predicate to test each element of the array
 * @returns Index of the last element found, or -1 if nothing matches
 */
export function findLastIndex<T>(arr: T[], predicate: (element: T) => boolean): number {
  const result = [...arr].reverse().find(predicate);
  return result ? arr.lastIndexOf(result) : -1;
}
