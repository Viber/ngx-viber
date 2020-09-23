import { async, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { VbrInputKeyboardFilterDirective } from './vbr-input-keyboard-filter.directive';
import { VbrInputKeyboardReplaceDirective, VbrInputReplaceType } from './vbr-input-keyboard-replace.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElementRef } from '@angular/core';

export class MockElementRef extends ElementRef {
  constructor() {
    super({
      addEventListener: () => {
      },
      value: ''
    });

    this.nativeElement.setSelectionRange = (start: number, end: number) => {
    };
  }
}

export class MockNgControl extends NgControl {
  constructor() {
    super();
  }

  control: FormControl = new FormControl();

  viewToModelUpdate() {
  }
}

export class MockClipboardEvent {
  data: string;
  clipboardData = {
    getData: (type: string) => this.data
  };

  target = {
    selectionStart: 0,
    selectionEnd: 0
  };

  constructor(data) {
    this.data = data;
  }

  stopPropagation() {
  }

  preventDefault() {
  }
}

describe('VbrInputKeyboardFilterDirective', () => {
  let component: VbrInputKeyboardFilterDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        VbrInputKeyboardFilterDirective,
        {provide: ElementRef, useClass: MockElementRef},
        {provide: NgControl, useClass: MockNgControl}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.get(VbrInputKeyboardFilterDirective);

    component.vbrInputKeyboardFilter = new RegExp('^[a-z0-9-_]{1,10}$');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('paste', () => {
    component.onPaste(new MockClipboardEvent('abcABC012_@$&'));
    expect(component['ngControl'].control.value).toBe('abc012_');
  });

  it('keydown', () => {
    let event: KeyboardEvent = new KeyboardEvent('keydown', {key: 'a', cancelable: true});
    component.onKeyDown(event);
    expect(event.defaultPrevented).toBeFalsy();

    event = new KeyboardEvent('keydown', {key: '&', cancelable: true});
    component.onKeyDown(event);
    expect(event.defaultPrevented).toBeTruthy();
  });
});

describe('VbrInputKeyboardReplaceDirective', () => {
  let component: VbrInputKeyboardReplaceDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        VbrInputKeyboardReplaceDirective,
        {provide: ElementRef, useClass: MockElementRef},
        {provide: NgControl, useClass: MockNgControl}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    component = TestBed.get(VbrInputKeyboardReplaceDirective);

    component.vbrInputKeyboardReplace = [
      [/[A-Z]/g, (match: string) => match.toLowerCase()],
      [/ /g, '_'],
      [/[^0-9a-z_\-]/g, ''],
    ] as Array<VbrInputReplaceType>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('paste', () => {
    component.onPaste(new MockClipboardEvent('abc ABC012_@$&'));
    expect(component['ngControl'].control.value).toBe('abc_abc012_');
  });

  it('keydown', () => {
    let event: KeyboardEvent = new KeyboardEvent('keydown', {key: 'a', cancelable: true});
    component.onKeyDown(event);
    expect(event.defaultPrevented).toBeFalsy();

    event = new KeyboardEvent('keydown', {key: 'A', cancelable: true});
    component.onKeyDown(event);
    expect(event.defaultPrevented).toBeTruthy();
    expect(component['el'].nativeElement.value).toBe('a');
    component['el'].nativeElement.value = '';

    event = new KeyboardEvent('keydown', {key: '&', cancelable: true});
    component.onKeyDown(event);
    expect(event.defaultPrevented).toBeTruthy();
    expect(component['el'].nativeElement.value).toBe('');
    component['el'].nativeElement.value = '';

    event = new KeyboardEvent('keydown', {key: ' ', cancelable: true});
    component.onKeyDown(event);
    expect(event.defaultPrevented).toBeTruthy();
    expect(component['el'].nativeElement.value).toBe('_');
    component['el'].nativeElement.value = '';
  });
});
