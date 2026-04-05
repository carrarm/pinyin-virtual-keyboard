import { Component, computed, signal } from "@angular/core";
import { PinyinVirtualKeyboard } from "pinyin-virtual-keyboard";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-root",
  imports: [FormsModule, PinyinVirtualKeyboard],
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
}
