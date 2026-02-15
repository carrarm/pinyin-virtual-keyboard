import { Component, signal } from '@angular/core';
import { PinyinVirtualKeyboard } from 'pinyin-virtual-keyboard';

@Component({
  selector: 'app-root',
  imports: [PinyinVirtualKeyboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pinyin-virtual-keyboard');
}
