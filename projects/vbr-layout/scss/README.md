# Vbr stylesheets

---
## Theming

Viber style customizations for Angular Material design.

Don't forget to import material/theming before using this

```scss
@import '~@angular/material/theming';
```

### Fonts

You can use predefined css presets for customizing your text.  
The styles are available as class name or attribute inside an HTML element.  

To start using, import `vbr.theming` and `vbr.fonts` into your styles.scss file.
```scss
@import "~@viberlab/ngx-viber/scss/vbr.theming";
@import "~@viberlab/ngx-viber/scss/vbr.fonts";
```
And then use the presets in your HTML

```html
<p vbr-font-flex>Awesome paragraph</p>
<p class="vbr-font-flex vbr-font-overflow">Styling paragraph with class name.</p>
```

The vbr styles come to extend angular material design, so you need to to use them with material design class names.
```html
<div class="mat-display-2 vbr-font-flex"></div>
```

#### Font class names:
* **.vbr-font-flex** : responsible for font scaling according to the screen size.
* **.vbr-font-overflow** : makes long text to appear with three dots at end, if it doesn't fit in container.
* **.vbr-color-pale-dark** : set gray color for subtitles.

---

## Vbr-button styles

**vbr-button** is *a* or *button* tags attribute that should be used in combination with mat-button directive.

It converts regular material design button to viber style.

### Types:
**primary** (default state) - violet viber button

**secondary** - green viber button 

### How to use:
Import **"~@viberlab/ngx-viber/scss/vbr.button"** into your scss files.

In relation to the button sizes and actions, they are the same as mat-button.
