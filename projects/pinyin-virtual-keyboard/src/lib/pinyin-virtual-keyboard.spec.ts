import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinyinVirtualKeyboard } from './pinyin-virtual-keyboard';

describe('PinyinVirtualKeyboard', () => {
  let component: PinyinVirtualKeyboard;
  let fixture: ComponentFixture<PinyinVirtualKeyboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinyinVirtualKeyboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinyinVirtualKeyboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
