import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { VbrSidenavMenuSection } from '../../section';

@Component({
  selector: 'vbr-sidenav-menu',
  templateUrl: './vbr-sidenav-menu.component.html',
  styleUrls: ['./vbr-sidenav-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VbrSidenavMenuComponent {
  @Input() sections: Observable<Array<VbrSidenavMenuSection>>;
}
