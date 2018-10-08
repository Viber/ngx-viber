import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VbrSidenavMenuSectionChild } from '../../section';

@Component({
  selector: 'vbr-sidenav-menu-link',
  styleUrls: ['./vbr-sidenav-menu-link.component.scss'],
  templateUrl: './vbr-sidenav-menu-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VbrSidenavMenuLinkComponent implements OnInit {
  @Input() public section: VbrSidenavMenuSectionChild;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    setTimeout(() => {
      console.log(
        this.route.snapshot.pathFromRoot.toString()
      );
    }, 5000);

  }

}
