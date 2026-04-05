import { CdkConnectedOverlay, FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { LowerCasePipe } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';

import {
  AZERTY,
  KeyboardLayout,
  NUMBERS,
  QWERTY,
  SPECIAL,
  SpecialLayout,
} from './model/keyboard-layout';
import { KeyLongPress } from './utils/key-long-press';
import { getTones, hasTones } from './utils/pinyin-utils';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';
import { ICONS } from './utils/icons';
import { CaseMode } from './model/model';

const TONE_KEY_WIDTH_PX = 34; // Key width + gap with other keys
const BASE_TONE_OVERLAY_OFFSET_X = -(TONE_KEY_WIDTH_PX * 1.5);
const BASE_TONE_OVERLAY_OFFSET_Y = -TONE_KEY_WIDTH_PX * 2.5;
const CASE_MODE_FLOW: CaseMode[] = ['lower', 'upper', 'upperFixed'];

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
   * Order of the keys in the alternative keyboard (special keys). It can be the predefined `SPECIAL`
   * layout, or any custom layout.
   */
  public readonly specialKeyboardLayout = input<SpecialLayout>('SPECIAL');

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

  /** Whether the numeric row should always be visible at the top of the keyboard */
  public readonly baseKeyboardNumericRow = input(true);

  /** A character has been typed */
  public readonly typed = output<string>();

  /** Backspace key pressed */
  public readonly backspace = output<void>();

  /** Keyboard's "Submit" button pressed */
  public readonly submitText = output<void>();

  // Internal state

  protected layoutType = signal<'letters' | 'special'>('letters');

  protected readonly layout = computed<string[][]>(() => {
    const baseLayout =
      this.layoutType() === 'special' ? this.specialKeyboardLayout() : this.keyboardLayout();
    const layout = structuredClone(this.getLayout(baseLayout));

    if (this.layoutType() === 'letters' && this.baseKeyboardNumericRow()) {
      layout.unshift(NUMBERS);
    }

    return layout;
  });

  protected readonly iconBaseStyle = {
    'height.px': 20,
    fill: 'currentColor',
  };

  protected caseMode: CaseMode = 'lower';
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
   */
  protected writeCharacter(character: string): void {
    const typedChar = this.uppercaseEnabled ? character : character.toLowerCase();
    this.value.update((text) => text + typedChar);
    this.typed.emit(typedChar);
    if (this.caseMode !== 'upperFixed') {
      this.uppercaseEnabled = false;
      this.caseMode = 'lower';
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

  protected switchCaseMode(): void {
    const nextModeIndex = (CASE_MODE_FLOW.indexOf(this.caseMode) + 1) % CASE_MODE_FLOW.length;
    this.caseMode = CASE_MODE_FLOW[nextModeIndex];
    this.uppercaseEnabled = this.caseMode === 'upper' || this.caseMode === 'upperFixed';
  }

  protected switchLayoutType(): void {
    this.layoutType.update((layoutType) => (layoutType === 'letters' ? 'special' : 'letters'));
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

  private getLayout(base: KeyboardLayout | SpecialLayout): string[][] {
    let layout: string[][] = [];
    if (Array.isArray(base)) {
      layout = base as string[][];
    } else {
      switch (base) {
        case 'AZERTY':
          layout = AZERTY;
          break;
        case 'QWERTY':
          layout = QWERTY;
          break;
        case 'SPECIAL':
          layout = SPECIAL;
          break;
      }
    }
    return layout;
  }
}
