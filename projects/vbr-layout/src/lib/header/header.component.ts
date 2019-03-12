import {Component, Input} from '@angular/core';

@Component({
  selector: 'vbr-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss']
})

export class VbrHeaderComponent {
  @Input() logoAltText = '';
}
