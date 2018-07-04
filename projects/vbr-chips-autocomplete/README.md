# VbrChipsAutocompleteComponent

## @viberlab/vbr-chips-autocomplete

## vbr-chips-autocomplete tag

```angular2html
<mat-form-field class="chips-autocomplete">
  <vbr-chips-autocomplete
      [formControl]="chipsControl"
      [placeholder]="'app-graph.chips.placeholder' | translate"
      [keysData]="availableKeysData"
      [chippedKeys]="selectedKeys"
      (filter)="filterKeys($event)">
    <mat-option *ngFor="let item of filteredKeys | async" [value]="item" (onSelectionChange)="selectKey(item)">
      {{ item | translate }}
    </mat-option>
  </vbr-chips-autocomplete>
</mat-form-field>
```

keysData (availableKeysData) - all available keys with addition data 
                               { key: string, label: string, color: string }

chippedKeys (selectedKeys) - selected (chipped) keys

filteredKeys - filtered keys

Filter for autocomplete:

```typescript
  public filterKeys(val: string) {
    let keys = this.allKeys.filter(key => this.selectedKeys.indexOf(key) === -1);

    if (keys.indexOf(val) !== -1) {
      keys = this.allKeys.filter(key => key !== val);
    }

    this.filteredKeys = Observable.of(val
      ? keys.filter(key => new RegExp(val, 'gi').test(this.availableKeysData.find(k => k.key === key).label))
      : keys.slice());
  }
```

Selects an option from autocomplete:

```typescript
  public selectKey(key) {
    this.selectedKeys.push(key);
    this.filteredKeys = Observable.of(this.allKeys.filter(k => this.selectedKeys.indexOf(k) === -1));
    this.chipsControl.setValue(key);
  }
```