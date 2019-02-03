#VBR Adjust Text
##A directive for automatically color the text in different color than the background.

If you want to use css3 rule only use only the next directive 'vbrAdjustText' without any attributes.
```angular2html
<p vbrAdjustText>This is an example</p>
```

If you want to use javascript

!! Warning - works only in the same domain !!

Use the next attribute 'imageSrc'
```angular2html
<p vbrAdjustText [imageSrc]="src"></p>
```

It will recognize if the image is dark or bright and accordingly change the color of the html tag with the directive.
