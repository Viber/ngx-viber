import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VbrSidenavMenuSectionChild } from '../../section';

@Component({
  selector: 'vbr-sidenav-menu-link',
  styleUrls: ['./vbr-sidenav-menu-link.component.scss'],
  templateUrl: './vbr-sidenav-menu-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VbrSidenavMenuLinkComponent {
  @Input() public section: VbrSidenavMenuSectionChild;
}
