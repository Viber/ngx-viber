# VbrSquircleIconComponent

More customized squircle icon, that uses generic squircle component.

## Parameters

* iconSize {string} - icon size: sm (small), md (medium), lg (large) or use number to set custom size
* placeholder {string} - default squircle icon (image)
* showBorder {boolean} - shows border (default: false) * doesn't work in IE
* src {string} - path to the icon image

## How to use

### Typescript

```typescript
@Component(
  ...
)

export class Demo {
  icon_size: string = 'md';
  placeholder: string = 'assets/placeholder.png';
  show_bolder: boolean = true;
  src: string = 'assets/icon.png';
}
```

### HTML

```angular2html
<vbr-squircle-icon 
  [iconSize]="icon_size"
  [placeholder]="placeholder"
  [showBorder]="show_bolder"
  [src]="src"
></vbr-squircle-icon>
```
