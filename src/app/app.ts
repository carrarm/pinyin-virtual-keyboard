import { Component, computed, signal } from "@angular/core";
import { PinyinVirtualKeyboard } from "pinyin-virtual-keyboard";
import { FormsModule } from "@angular/forms";
import { Chip, ChipsComponent } from "./components/chips/chips";
import { HelpTooltipComponent } from "./components/help-tooltip/help-tooltip";

@Component({
  selector: "app-root",
  imports: [FormsModule, PinyinVirtualKeyboard, ChipsComponent, HelpTooltipComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly anchor = signal<"container" | "fixed" | "custom">("container");
  protected readonly format = signal("mobile");
  protected readonly letterLayout = signal("QWERTY");
  protected readonly symbolLayout = signal("default");
  protected readonly numericRow = signal(true);
  protected readonly simplify = signal(true);
  protected readonly value = signal("");

  protected readonly formatChips: Chip[] = [
    { label: "Mobile", command: "mobile", selected: true },
    { label: "Tablet landscape", command: "tablet-landscape" },
    { label: "Tablet portrait", command: "tablet-portrait" },
  ];
  protected readonly anchorChips: Chip[] = [
    { label: "Container", command: "container", selected: true },
    { label: "Fixed", command: "fixed" },
    { label: "Custom", command: "custom" },
  ];
  protected readonly letterLayoutChips: Chip[] = [
    { label: "QWERTY", command: "QWERTY", selected: true },
    { label: "AZERTY", command: "AZERTY" },
    { label: "QWERTZ", command: "QWERTZ" },
    { label: "Custom", command: "custom" },
  ];
  protected readonly symbolLayoutChips: Chip[] = [
    { label: "Default", command: "default", selected: true },
    { label: "Custom", command: "custom" },
  ];
  protected readonly simplifyChips: Chip[] = [
    { label: "Enabled", command: "true", selected: true },
    { label: "Disabled", command: "false" },
  ];
  protected readonly numericRowChips: Chip[] = [
    { label: "Visible", command: "true", selected: true },
    { label: "Hidden", command: "false" },
  ];

  protected readonly pvkLayout = computed(() => {
    if (this.letterLayout() === "custom") {
      return [
        ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        ["K", "L", "M", "N", "O", "P", "Q", "R", "S"],
        ["SHIFT", "T", "U", "V", "W", "X", "Y", "Z", "BACKSPACE"],
      ];
    }
    return this.letterLayout() as "QWERTY" | "AZERTY" | "QWERTZ";
  });

  protected readonly pvkSymbolLayout = computed(() => {
    if (this.symbolLayout() === "custom") {
      return [
        [".", ",", "_", '"', "'", ":", ";", "!", "?"],
        ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
      ];
    }
    return "SYMBOL";
  });

  protected anchorChange(event: string): void {
    this.anchor.set(event as "container" | "fixed" | "custom");
  }
}
