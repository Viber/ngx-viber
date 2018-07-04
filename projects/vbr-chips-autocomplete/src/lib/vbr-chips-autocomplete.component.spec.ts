import { MatAutocompleteModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatOptionModule } from '@angular/material';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VbrChipsAutocompleteComponent } from './vbr-chips-autocomplete.component';
import { ElementRef, EventEmitter, NgZone } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';

export class MockNgZone extends NgZone {
  onStable: EventEmitter<any> = new EventEmitter(false);

  constructor() {
    super({enableLongStackTrace: false});
  }

  run(fn: Function): any {
    return fn();
  }

  runOutsideAngular(fn: Function): any {
    return fn();
  }

  simulateZoneExit(): void {
    this.onStable.emit(null);
  }
}

export class MockFocusMonitor extends FocusMonitor {
  constructor() {
    super(new MockNgZone(), new Platform());
  }
}

export class MockElementRef extends ElementRef {
  constructor() {
    super({
      addEventListener: () => {
      }
    });
  }
}

describe('VbrChipsAutocompleteComponent', () => {
  let fixture: ComponentFixture<VbrChipsAutocompleteComponent>;
  let component: VbrChipsAutocompleteComponent;
  let id: number = -1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VbrChipsAutocompleteComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatFormFieldModule,
        MatOptionModule,
        BrowserAnimationsModule
      ],
      providers: [
        VbrChipsAutocompleteComponent,
        {provide: FocusMonitor, useClass: MockFocusMonitor},
        {provide: ElementRef, useClass: MockElementRef}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VbrChipsAutocompleteComponent);
    component = fixture.componentInstance;

    component.keysData = [
      {key: 'aaa', label: 'aaa', color: 'red'},
      {key: 'bbb', label: 'bbb', color: 'green'},
      {key: 'ccc', label: 'ccc', color: 'blue'},
      {key: 'ddd', label: 'ddd', color: 'yellow'},
      {key: 'eee', label: 'eee', color: 'black'}
    ];

    component.chippedKeys = ['aaa', 'ddd', 'eee'];

    component.ngOnInit();
    id++;
  });

  afterEach(() => component.ngOnDestroy());

  it('component creation', () => {
    expect(component).toBeTruthy();

    expect(component.id).toBe('vbr-chips-autocomplete-' + id);
  });

  it('on init', () => {
    expect(component.allKeys).toEqual(['aaa', 'bbb', 'ccc', 'ddd', 'eee']);

    expect(component.value).toEqual(['aaa', 'ddd', 'eee']);

    expect(component.empty).toBeFalsy();

    expect(component.shouldLabelFloat).toBeTruthy();
  });

  it('chippedKeys & value', () => {
    component.value = ['111', '222', '333'];
    expect(component.chippedKeys).toEqual(['111', '222', '333']);

    component.chippedKeys = ['333', '222', '111'];
    expect(component.value).toEqual(['333', '222', '111']);

    component.value = [];
    expect(component.empty).toBeTruthy();
  });

  it('chipsControl & filter', done => {
    component.filter.subscribe(c => {
      expect(c).toBe('aaa');
      done();
    });
    component.chipsControl.setValue('aaa');
  });

  it('getByKey', () => {
    expect(component.getByKey('ccc')).toEqual({key: 'ccc', label: 'ccc', color: 'blue'});
  });

  it('removeChip', () => {
    component.removeChip('ddd');
    expect(component.chippedKeys).toEqual(['aaa', 'eee']);
  });

  it('describedBy', () => {
    component.setDescribedByIds(['id1', 'id2', 'id3']);
    expect(component.describedBy).toBe('id1 id2 id3');
  });
});
