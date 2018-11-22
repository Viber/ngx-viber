import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VbrSidenavMenuSection } from '../../section';

@Component({
  selector: 'vbr-sidenav-menu-url-link',
  styleUrls: ['./vbr-sidenav-menu-url-link.component.scss'],
  templateUrl: './vbr-sidenav-menu-url-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VbrSidenavMenuUrlLinkComponent {
  @Input() public section: VbrSidenavMenuSection;

  constructor() {
  }
}
