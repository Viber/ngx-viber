import { Component } from '@angular/core';
import {
  Observable,
  of
} from 'rxjs';
import { VbrSidenavMenuSection } from '@viberlab/sidenav-menu';

@Component({
  selector: 'app-sidenav-menu-demo',
  templateUrl: './vbr-sidenav-menu-demo.component.html'
})
export class VbrSidenavMenuDemoComponent {
  public sections: Observable<Array<VbrSidenavMenuSection>> = of([
    {
      name: 'Test Menu',
      type: 'heading',
      children: [
        {
          name: 'Layout',
          type: 'link',
          icon: 'dvr',
          state: ['/layout']
        },
        {
          name: 'Input Keyboard',
          type: 'link',
          icon: 'input',
          state: of('/input-keyboard')
        },
      ]
    }
  ]);
}
