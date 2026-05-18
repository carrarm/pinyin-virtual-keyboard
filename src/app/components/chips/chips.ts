import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export interface Chip {
  label: string;
  command: string;
  selected?: boolean;
}

@Component({
  selector: 'app-chips',
  imports: [CommonModule],
  templateUrl: './chips.html',
  styleUrl: './chips.css',
})
export class ChipsComponent {
  public readonly chips = input.required<Chip[]>();
  public readonly onClicked = output<string>();

  protected onChipClick(chip: Chip) {
    this.chips().forEach(c => c.selected = c === chip);
    this.onClicked.emit(chip.command);
  }
}
