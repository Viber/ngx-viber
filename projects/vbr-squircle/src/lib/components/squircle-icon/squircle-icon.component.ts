import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vbr-squircle-icon',
  templateUrl: './squircle-icon.component.html',
  styleUrls: ['./squircle-icon.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class VbrSquircleIconComponent implements OnInit {

  @Input() iconSize: string;
  @Input() placeholder: string = 'assets/@viberlab/squircle/img/default-squircle-icon.png';
  @Input() showBorder: boolean = false;
  @Input() src: string;

  public size: number;
  public borderOffset: number;

  ngOnInit() {

    switch (this.iconSize) {
      case 'sm':
        this.size = 32;
        break;
      case 'lg':
        this.size = 96;
        break;
      case 'md':
        this.size = 48;
        break;
      default:
        this.size = !this.iconSize ? 48 : parseInt(this.iconSize, 10);

    }

    this.borderOffset = Math.sqrt(this.size) * 0.6;
  }
}
