import {
  Directive,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[libScrollItem]',
})
export class ScrollItemDirective {

  constructor(public vc: ViewContainerRef) {
  }

  public getRenderElement() {
    return this.vc['_data'].renderElement;
  }
}
