import { Component } from '@angular/core';

@Component({
  selector: 'app-squircle-demo',
  templateUrl: './vbr-squircle-demo.component.html',
  styleUrls: ['./squircle-demo.component.scss']
})
export class VbrSquircleDemoComponent {
  public srcImage: string = 'assets/@viberlab/layout/img/viber_logo.svg';
  public anotherImage: string = 'assets/@viberlab/layout/img/404.png';
  public sizeImage: string = '128';
}
