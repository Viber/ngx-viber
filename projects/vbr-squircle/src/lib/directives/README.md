## Directives

### vbrInputKeyboardFilter

Filters keyboard input in accordance with RegExp

template:

```angular2html
<input matInput [vbrInputKeyboardFilter]="regexFilter">
```

typescript:

```typescript
public regexFilter = new RegExp('^[a-z0-9-_]{1,28}$');
```

### vbrInputKeyboardReplace

Replaces keyboard input in accordance with array [RegExp, replacer (function or string)]

template:

```angular2html
<input matInput [vbrInputKeyboardReplace]="replacer">
```

typescript:

```typescript
public replacer = [
    [/[A-Z]/g, (match: string) => match.toLowerCase()],
    [/ /g, '_'],
    [/[^0-9a-z_\-]/g, ''],
  ];
```

