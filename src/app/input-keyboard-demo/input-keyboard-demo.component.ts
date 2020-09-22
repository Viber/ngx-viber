import {
  Component,
} from '@angular/core';
import {
  FormControl,
  FormGroup
} from '@angular/forms';
import { VbrInputReplaceType } from '../../../projects/vbr-input-keyboard/src/lib/vbr-input-keyboard-replace.directive';

@Component({
  selector: 'input-keyboard-demo',
  templateUrl: './input-keyboard-demo.component.html',
})
export class VbrInputKeyboardDemoComponent {
  public inputKeyboard: FormGroup;
  public regexpFilter: RegExp = new RegExp('^[a-z0-9-_]{1,10}$');
  public regexpReplace: Array<VbrInputReplaceType> = [
    [/[A-Z]/g, (match: string) => match.toLowerCase()],
    [/ /g, () => '_'],
    [/[^0-9a-z_\-]/g, () => ''],
  ];

  constructor() {
    this.inputKeyboard = new FormGroup({
      theFilter: new FormControl(),
      theReplacer: new FormControl()
    });
  }
}
