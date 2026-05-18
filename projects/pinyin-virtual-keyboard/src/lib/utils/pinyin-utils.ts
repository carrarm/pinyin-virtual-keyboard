import { findLastIndex, replaceCharAt } from './general-utils';

/**
 * All the available tones for each letter.
 */
export const TONES: Record<string, string[]> = Object.freeze({
  A: ['Ā', 'Á', 'Ǎ', 'À'],
  E: ['Ē', 'É', 'Ě', 'È'],
  I: ['Ī', 'Í', 'Ǐ', 'Ì'],
  O: ['Ō', 'Ó', 'Ǒ', 'Ò'],
  U: ['Ū', 'Ú', 'Ǔ', 'Ù'],
  Ü: ['Ǖ', 'Ǘ', 'Ǚ', 'Ǜ'],
});

/**
 * Apply the tone to the last letter of the word.
 * @param word Full word
 * @param tone Tone to apply, between 1-4
 */
function applyTone(word: string, tone: number): string {
  let wordWithTone = word;
  const toTransformIdx = findLastIndex(word.toUpperCase().split(''), (letter: string) =>
    hasTones(letter),
  );
  if (toTransformIdx > -1) {
    const charWithTone = toTone(wordWithTone.charAt(toTransformIdx), tone);
    wordWithTone = replaceCharAt(wordWithTone, toTransformIdx, charWithTone).slice(0, -1);
  }
  return wordWithTone;
}

/**
 * Get all the available tones for the key.
 *
 * @param letter       Letter to fetch tones for
 * @param letterCase   Whether the tones should be uppercase or lowercased
 * @returns Array of tones for the letter
 */
export const getTones = (letter: string, letterCase: 'UPPER' | 'LOWER'): string[] => {
  let tones = TONES[letter.toUpperCase()] ?? [];
  if (letterCase === 'LOWER') {
    tones = tones.map((toneLetter) => toneLetter.toLowerCase());
  }
  return tones;
};

/**
 * Check if a letter has associated tones.
 *
 * @param letter The letter to check
 * @returns Whether or not there are pinyin tones for the letter
 */
export const hasTones = (letter: string): boolean => {
  return Object.keys(TONES).includes(letter.toUpperCase());
};

/**
 * Transform a letter to a specific tone.
 *
 * @param letter  Base letter
 * @param digit   Tone, between 1-4
 * @returns Transformed letter
 */
export const toTone = (letter: string, digit: number): string => {
  const isUppercased = letter.toUpperCase() === letter;
  const letterTones = getTones(letter.toUpperCase(), 'UPPER');

  let transformed = letter;
  if (letterTones.length && digit >= 1 && digit <= 4) {
    const matchedTone = letterTones[digit - 1];
    transformed = isUppercased ? matchedTone : matchedTone.toLowerCase();
  }
  return transformed;
};

/**
 * Simplify the text by typing a letter and number to replace the letter with a different tone.
 * Use lower or upper V to apply a tone to the ü character.
 *
 * @param text Text to simplify
 * @param lastTyped Last typed character
 */
export function simplifyText(text: string, lastTyped: string): string {
  const lastWord = text.split(' ').at(-1) ?? '';
  let simplified = lastWord;

  if (lastTyped.toUpperCase() === 'V') {
    const replacedV = lastTyped === 'V' ? 'Ü' : 'ü';
    simplified = simplified.replace(/.$/, replacedV);
  }

  const digit = Number.parseInt(lastTyped);
  if (!Number.isNaN(digit) && lastWord.length > 1) {
    simplified = applyTone(lastWord, digit);
  }
  return text.replace(lastWord, simplified);
}
