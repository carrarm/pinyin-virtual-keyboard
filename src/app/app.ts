import { Component, signal } from '@angular/core';
import { PinyinVirtualKeyboard } from 'pinyin-virtual-keyboard';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule, PinyinVirtualKeyboard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly landscapeValue = signal('');
}
