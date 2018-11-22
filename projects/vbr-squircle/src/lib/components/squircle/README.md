# VbrSquircleComponent

"Squircle" element for general use of icons or avatars.

## Parameters

* size {number} - Define the size of component in pixels.

## How to use
1. Add the component to your Angular HTML and define its `size` parameter.
2. Then within the component tag insert
an `img` element with `src` and `alt`attributes. You can use all valid attributes in the `img` tag, as it nests the element within `ng-content`.

The component's view is not encapsulated, so you can modify its css from parent's css file.

### HTML

```angular2html
<vbr-squircle [size]="64">
    <img src="YOUR_AWESOME_IMAGE_PATH" alt="WOW! It really works..">
</vbr-squircle>
```


\* Was tested on IE11, Edge, Chrome, Firefox, Safari.