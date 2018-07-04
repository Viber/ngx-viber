import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor } from '@angular/cdk/a11y';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatAutocomplete, MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
  selector: 'vbr-chips-autocomplete',
  templateUrl: './vbr-chips-autocomplete.component.html',
  styleUrls: ['./vbr-chips-autocomplete.component.scss'],
  providers: [
    {provide: MatFormFieldControl, useExisting: VbrChipsAutocompleteComponent}
  ]
})
export class VbrChipsAutocompleteComponent implements MatFormFieldControl<{}>, ControlValueAccessor, OnInit, OnDestroy {
  static nextId: number = 0;

  @HostBinding('id') id: string = `vbr-chips-autocomplete-${VbrChipsAutocompleteComponent.nextId++}`;
  @HostBinding('attr.aria-describedby') describedBy = '';

  @ViewChild('chipsInput') chipsInput: ElementRef;
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

  @Input() keysData: { key: string, label: string, color: string }[];
  @Input() chippedKeys: string[];
  @Output() filter: EventEmitter<string> = new EventEmitter();

  stateChanges: Subject<void> = new Subject<void>();
  focused: boolean = false;
  errorState: boolean = false;
  controlType: string = 'vbr-chips-autocomplete';
  allKeys: string[];
  chipsControl: FormControl = new FormControl();

  private _placeholder: string;
  private _required: boolean = false;
  private _disabled: boolean = false;

  get empty() {
    return !this.chippedKeys.length;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }

  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }

  @Input()
  get value(): string[] | null {
    return this.chippedKeys || null;
  }

  set value(chippedKeys: string[] | null) {
    this.chippedKeys = chippedKeys;
    this.stateChanges.next();
  }

  constructor(private fm: FocusMonitor,
              private elRef: ElementRef,
              // private cdRef: ChangeDetectorRef,
              @Optional() @Self() public ngControl: NgControl) {
    if (ngControl != null) {
      ngControl.valueAccessor = this;
    }

    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnInit() {
    this.allKeys = this.keysData.map(data => data.key);
    this.chipsControl.valueChanges.subscribe(val => this.filter.emit(val));

    if (this.ngControl != null) {
      this.ngControl.valueChanges.subscribe(() => this.chipsInput.nativeElement.value = '');
    }

    // Fixes ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
    // this.cdRef.detach();
    // setInterval(() => this.cdRef.detectChanges(), 0);
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
    this.panel();
  }

  panel() {
    if (this.matAutocomplete.panel) {
      if (this.matAutocomplete.panel.nativeElement.children.length === 1) {
        this.matAutocomplete.panel.nativeElement.classList.remove('mat-autocomplete-visible');
      } else {
        this.matAutocomplete.panel.nativeElement.classList.add('mat-autocomplete-visible');
      }
    }
  }

  getByKey(key) {
    return this.keysData.find(k => k.key === key);
  }

  removeChip(key) {
    const index: number = this.chippedKeys.indexOf(key);
    if (index !== -1) {
      this.chippedKeys.splice(index, 1);
    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  private changed = (_: any) => {
  };

  writeValue(value: string): void {
  }

  registerOnChange(fn: any): void {
    this.changed = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
