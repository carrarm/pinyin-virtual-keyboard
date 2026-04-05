import { CdkConnectedOverlay, FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { LowerCasePipe } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';

import { AZERTY, KeyboardLayout, QWERTY } from './model/keyboard-layout';
import { KeyLongPress } from './utils/key-long-press';
import { getTones, hasTones } from './utils/pinyin-utils';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';
import { ICONS } from './utils/icons';

const TONE_KEY_WIDTH_PX = 34; // Key width + gap with other keys
const BASE_TONE_OVERLAY_OFFSET_X = -(TONE_KEY_WIDTH_PX * 1.5);
const BASE_TONE_OVERLAY_OFFSET_Y = -TONE_KEY_WIDTH_PX * 2.5;

@Component({
  selector: 'pinyin-virtual-keyboard',
  imports: [KeyLongPress, LowerCasePipe, SvgIconComponent, CdkConnectedOverlay],
  templateUrl: './pinyin-virtual-keyboard.html',
  styleUrl: './pinyin-virtual-keyboard.css',
  host: {
    '[class.pvk--anchor-fixed]': 'anchor() === "fixed"',
    '[class.pvk--anchor-container]': 'anchor() === "container"',
  },
  standalone: true,
})
export class PinyinVirtualKeyboard {
  // Public API

  /**
   * Order of the keys in the keyboard. It can be the predefined `QWERTY` or `AZERTY` layouts, or any
   * custom layout.
   */
  public readonly keyboardLayout = input<KeyboardLayout>('QWERTY');

  /**
   * Where the keyboard will be positioned:
   * - fixed: bottom of the screen
   * - container: bottom of the parent container (must be configured with `position: relative`)
   * - custom: no default position, define your own
   *
   * Defaults to `fixed`.
   */
  public readonly anchor = input<'fixed' | 'container' | 'custom'>('fixed');

  /** All the typed characters */
  public readonly value = model<string>('');

  /** A character has been typed */
  public readonly typed = output<string>();

  /** Backspace key pressed */
  public readonly backspace = output<void>();

  /** Keyboard's "Submit" button pressed */
  public readonly submitText = output<void>();

  // Internal state

  protected readonly layout = computed<string[][]>(() => {
    if (Array.isArray(this.keyboardLayout())) {
      return this.keyboardLayout() as string[][];
    } else {
      return this.keyboardLayout() === 'QWERTY' ? QWERTY : AZERTY;
    }
  });

  protected readonly iconBaseStyle = {
    'height.px': 20,
    fill: 'currentColor',
  };

  protected toneOverlayOffsetY = BASE_TONE_OVERLAY_OFFSET_Y;
  protected toneOverlayOffsetX = BASE_TONE_OVERLAY_OFFSET_X;
  protected toneOverlayOpen = false;
  protected toneOverlayOrigin?: FlexibleConnectedPositionStrategyOrigin;
  protected toneKeys: string[] = [];
  protected uppercaseEnabled = false;

  constructor(iconRegistry: SvgIconRegistryService) {
    Object.entries(ICONS).forEach(([iconName, inlineSvg]) => {
      iconRegistry.addSvg(iconName, inlineSvg);
    });
  }

  protected clickBackspace(): void {
    this.backspace.emit();
    this.value.update((text) => (text.length ? text.substring(0, text.length - 1) : text));
  }

  /**
   * Select a character to write. This method is used for both the standard keyboard
   * and the tone overlay.
   *
   * @param character Character to emit
   * @param preserveCase Whether to go back to lowercase after typing
   */
  protected writeCharacter(character: string, preserveCase = false): void {
    const typedChar = this.uppercaseEnabled ? character : character.toLowerCase();
    this.value.update((text) => text + typedChar);
    this.typed.emit(typedChar);
    if (!preserveCase) {
      this.uppercaseEnabled = false;
    }
    this.toneOverlayOpen = false;
  }

  /**
   * Open the tone overlay to select an accentuated letter.
   *
   * @param letter The letter to accentuate
   * @param positionInColumn Index of the letter in the row
   * @param elementRef Reference to the HTML container of the letter
   */
  protected openTones(letter: string, positionInColumn: number, elementRef: HTMLElement): void {
    if (hasTones(letter)) {
      this.toneOverlayOffsetX = this.computeOffsetX(positionInColumn);
      this.toneOverlayOpen = true;
      this.toneOverlayOrigin = elementRef;
      const letterCase = this.uppercaseEnabled ? 'UPPER' : 'LOWER';
      this.toneKeys = getTones(letter, letterCase);
      if (letter === 'U') {
        // Add ü variations with u tones to avoid adding another key
        const rootLetter = this.uppercaseEnabled ? 'Ü' : 'ü';
        this.toneKeys = [...this.toneKeys, ...getTones('ü', letterCase), rootLetter];
      }
    }
  }

  /**
   * Compute the overlay offset based on the position of the key in the row.
   * The two leftmost and the two rightmost keys shouldn't try and display a centered
   * overlay as it would go offscreen.
   *
   * @param positionInColumn Key index in the row
   * @returns Adjusted offset in px
   */
  private computeOffsetX(positionInColumn: number): number {
    let offset = BASE_TONE_OVERLAY_OFFSET_X;
    if (positionInColumn < 2) {
      offset = 0;
    } else if (positionInColumn > 7) {
      offset = -TONE_KEY_WIDTH_PX * 2;
    }
    return offset;
  }
}
