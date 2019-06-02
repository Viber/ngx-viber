# VbrScrollable
VbrScrollable is a scroller wrapper, which is optimized to provide the infinite scrolling feature to your
web application, without overloading the DOM. It simply removes from DOM all nodes that are not displayed in the viewport.
<br>

#### Dynamic elements height
It calculates dynamically all images dimensions, so you don't have to provide `fixedSize`
parameter for it to work properly. The scroller does it automatically.

#### Ready for messengers apps
The scroller works both directions. You can choose which direction to use
by setting `reverseOrder` parameter. Reverse order tells the scroller to behave
like messengers apps; the newest messages are in the bottom and when you scroll up it
loads more.

`[reverseOrder]="true"`

#### Styled scrollbar
The scroller uses perfect scrollbar module to provide styled scrollbar. If you
want to use the browser's native scrollbar,
set the parameter `usePerfectScrollbar` to false;

`[usePerfectScrollbar]="false"`

---
### Installation
To install the module run in terminal

`npm i --save @viberlab/scrollable`

---

### Usage

In app module
```
import { VbrScrollableModule } from '@viberlab/scrollable';

@NgModule({
    imports: [ VbrScrollableModule ]
})

export class AppModule {}
```

If you want to add the "load more" feature, simply implement the methods in your component.
And add `(reachStart)"` or `(reachEnd)"` emitters in the template.

In component

```
export class MyComponent {
  this.reverseOrder = true; // for scroll behavior like in messengers

  reachStart() {
    return this.reverseOrder ? this.loadMore() : null;
  }

  reachEnd() {
    return this.reverseOrder ? null : this.loadMore();
  }
}
```

In template
```
<vbr-scrollable #vbrScroll
                [items]="items"
                [reverseOrder]="true"
                [usePerfectScrollbar]="true"
                (reachStart)="reachStart()"
                (reachEnd)="reachEnd()">
  <div *ngFor="let item of vbrScroll.innerItems"
                [innerHTML]="item.text"></div>
</vbr-scrollable>
```

---

####Events
If you want to 
You can subscribe to public property `OnInit`. 
