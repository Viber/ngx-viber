import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MatAutocompleteModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatOptionModule } from '@angular/material';
import { VbrChipsAutocompleteComponent } from './vbr-chips-autocomplete.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { take } from 'rxjs/operators';

describe('VbrChipsAutocompleteComponent', () => {
  let fixture: ComponentFixture<TestChipsAutocompleteComponent>;
  let component: VbrChipsAutocompleteComponent;
  const subscriptions: Array<Subscription> = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestChipsAutocompleteComponent, VbrChipsAutocompleteComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatFormFieldModule,
        MatOptionModule,
        BrowserAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestChipsAutocompleteComponent);
    component = fixture.debugElement.query(By.directive(VbrChipsAutocompleteComponent)).componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => subscriptions.forEach(s => s.unsubscribe()));

  it('component creation', () => {
    expect(component).toBeTruthy();
    expect(component.id).toBe('vbr-chips-autocomplete-' + --VbrChipsAutocompleteComponent.nextId);
    expect(component.placeholder).toBe('');
  });

  it('input keys with data', () => {
    expect(component.keysData).toEqual([
      {key: 'aaa', label: 'aaa', color: 'red'},
      {key: 'bbb', label: 'bbb', color: 'green'},
      {key: 'ccc', label: 'ccc', color: 'blue'},
      {key: 'ddd', label: 'ddd', color: 'yellow'},
      {key: 'eee', label: 'eee', color: 'black'}
    ]);

    expect(component.chippedKeys).toEqual(['aaa', 'ddd', 'eee']);
  });

  it('on init', () => {
    expect(component.allKeys).toEqual(['aaa', 'bbb', 'ccc', 'ddd', 'eee']);

    expect(component.value).toEqual(component.chippedKeys);
  });

  it('chips', done => {
    setTimeout(() => {
      expect(fixture.debugElement
        .query(By.css('.mat-chip-list-wrapper')).children
        .filter(c => c.name === 'mat-chip').map(s => s.context.$implicit))
        .toEqual(component.chippedKeys);
      done();
    }, 0);
  });

  it('filtered keys', done => {
    component.filter.emit('');
    const s1 = fixture.componentInstance.filteredKeys.pipe(take(1)).subscribe(fk => {
      expect(fk).toEqual(['bbb', 'ccc']);
      done();
    });

    component.filter.emit('c');
    const s2 = fixture.componentInstance.filteredKeys.pipe(take(1)).subscribe(fk => {
      expect(fk).toEqual(['ccc']);
      done();
    });

    subscriptions.push(s1, s2);
  });

  it('select key', () => {
    fixture.componentInstance.selectKey('bbb');
    expect(fixture.componentInstance.selectedKeys).toContain('bbb');
  });
});

@Component({
  template:
  '<mat-form-field class="chips-autocomplete">' +
  '  <vbr-chips-autocomplete' +
  '      [formControl]="chipsControl"' +
  '      placeholder="Chips test"' +
  '      [keysData]="availableKeysData"' +
  '      [chippedKeys]="selectedKeys"' +
  '      (filter)="filterKeys($event)">' +
  '    <mat-option *ngFor="let item of filteredKeys | async" [value]="item" (onSelectionChange)="selectKey(item)">' +
  '      {{ item }}' +
  '    </mat-option>' +
  '  </vbr-chips-autocomplete>' +
  '</mat-form-field>'
})
export class TestChipsAutocompleteComponent {
  public selectedKeys: string[] = ['aaa', 'ddd', 'eee'];
  public availableKeysData: { key: string, label: string, color: string }[] = [
    {key: 'aaa', label: 'aaa', color: 'red'},
    {key: 'bbb', label: 'bbb', color: 'green'},
    {key: 'ccc', label: 'ccc', color: 'blue'},
    {key: 'ddd', label: 'ddd', color: 'yellow'},
    {key: 'eee', label: 'eee', color: 'black'}
  ];
  public chipsControl: FormControl = new FormControl();
  public filteredKeys: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor() {
    // todo: there is problem with filteredKeys in template
    this.filteredKeys.subscribe(fk => console.log(fk));
  }

  public filterKeys(val: string) {
    let keys = this.availableKeysData.map(k => k.key).filter(k => this.selectedKeys.indexOf(k) === -1);

    if (keys.indexOf(val) !== -1) {
      keys = this.availableKeysData.map(k => k.key).filter(k => k !== val);
    }

    this.filteredKeys.next(val
      ? keys.filter(key => new RegExp(val, 'gi').test(this.availableKeysData.find(k => k.key === key).label))
      : keys.slice());
  }

  public selectKey(key) {
    this.selectedKeys.push(key);
    this.filteredKeys.next(this.availableKeysData.map(k => k.key).filter(k => this.selectedKeys.indexOf(k) === -1));
    this.chipsControl.setValue(key);
  }
}
