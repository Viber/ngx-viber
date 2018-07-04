# input filter & replace directives

## @viberlab/vbr-input-keyboard

### vbrInputKeyboardFilter

```angular2html
<mat-form-field>
  <input matInput 
    formControlName="theFilter" 
    [vbrInputKeyboardFilter]="regexpFilter" 
    placeholder="keyboard input filter">
</mat-form-field>
```

```typescript
regexpFilter: RegExp = new RegExp('^[a-z0-9-_]{1,10}$');
```
### vbrInputKeyboardReplace

```angular2html
<mat-form-field>
  <input matInput
    formControlName="theReplacer" 
    [vbrInputKeyboardReplace]="regexpReplace" 
    placeholder="keyboard input replacer">
</mat-form-field>
```

```typescript
type VbrInputReplaceType = [string | RegExp, (substring: string, ...args: any[]) => string];

regexpReplace: Array<VbrInputReplaceType> = [
    [/[A-Z]/g, (match: string) => match.toLowerCase()],
    [/ /g, '_'],
    [/[^0-9a-z_\-]/g, ''],
];
```