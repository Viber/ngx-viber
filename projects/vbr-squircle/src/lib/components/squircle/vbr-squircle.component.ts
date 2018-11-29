import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { VBR_NAVIGATOR_TOKEN } from '../../constants';

@Component({
  selector: 'vbr-squircle',
  templateUrl: './vbr-squircle.component.html',
  styleUrls: ['./vbr-squircle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VbrSquircleComponent implements OnInit, AfterViewInit {
  @Input() size: string | number = 100;
  @Input() placeholder: string;
  // @Input() bg: string;
  @ViewChild('squircle') squircle: ElementRef;
  @ViewChild('sqWrap') sqWrap: ElementRef;
  @ViewChild('inner') inner: ElementRef;
  @ViewChild('innerSrc') innerSrc: ElementRef;

  isMS: boolean = false;

  constructor(private renderer: Renderer2, @Inject(VBR_NAVIGATOR_TOKEN) private readonly navigator) {
    if (!this.navigator && !!navigator) {
      this.navigator = navigator;
    }
  }

  ngOnInit() {
    if ('undefined' !== typeof this.navigator) {
      let verOffset, isOldFF;
      if ((verOffset = this.navigator.userAgent.indexOf('Firefox')) !== -1) {
        isOldFF = parseInt(this.navigator.userAgent.substring(verOffset + 8), 10) < 57;
      }

      this.isMS = this.navigator.userAgent.search(/msie/i) !== -1 ||
        this.navigator.userAgent.search(/edge/i) !== -1 ||
        this.navigator.userAgent.search(/\.net/i) !== -1 || isOldFF;
    }
  }

  ngAfterViewInit(): void {
    if (!this.isMS) {
      const squircleElement = this.squircle.nativeElement;
      this.renderer.setStyle(squircleElement, 'width', this.size + 'px');
      this.renderer.setStyle(squircleElement, 'height', this.size + 'px');
      // this.renderer.setAttribute(squircleElement.children[0], 'src', this.placeholder);


    } else {
      this.setCss();
      // this.innerSrc.nativeElement.children[0].src = this.placeholder;
      // this.renderer.setAttribute(this.innerSrc.nativeElement.children[0], 'src', this.placeholder);
    }
  }

  setCss() {
    const size = +this.size;
    const padding = size / 10;
    const rawSize = size - (padding * 2);
    const sqWrapEl = this.sqWrap.nativeElement;
    const innerEl = this.inner.nativeElement;

    this.renderer.setStyle(sqWrapEl, 'left', padding + 'px');
    this.renderer.setStyle(sqWrapEl, 'width', rawSize + 'px');
    this.renderer.setStyle(sqWrapEl, 'height', rawSize + 'px');
    this.renderer.setStyle(innerEl, 'width', rawSize + 'px');
    this.renderer.setStyle(innerEl, 'height', rawSize + 'px');

    this.renderer.setStyle(sqWrapEl, 'padding', `${size / 10}px 0`);
    this.renderer.setStyle(innerEl, 'padding', `0 ${size / 10}px`);
    this.renderer.setStyle(innerEl, 'left', `calc(${size}px / -10)`);
    this.renderer.setStyle(innerEl, 'top', `calc(${size}px / 10)`);

    this.renderer.setStyle(sqWrapEl, 'background-position-x', `calc(${size}px / -10)`);
    this.renderer.setStyle(innerEl, 'background-position-y', `calc(${size}px / -10)`);

    // this.sqWrap.nativeElement.style.left = padding + 'px';
    // this.sqWrap.nativeElement.style.width = rawSize + 'px';
    // this.sqWrap.nativeElement.style.height = rawSize + 'px';
    // this.inner.nativeElement.style.width = rawSize + 'px';
    // this.inner.nativeElement.style.height = rawSize + 'px';
    //
    // this.sqWrap.nativeElement.style.padding = `${size / 10}px 0`;
    // this.inner.nativeElement.style.padding = `0 ${size / 10}px`;
    // this.inner.nativeElement.style.left = `calc(${size}px / -10)`;
    // this.inner.nativeElement.style.top = `calc(${size}px / 10)`;
    //
    // this.sqWrap.nativeElement.style.backgroundPositionX = `calc(${size}px / -10)`;
    // this.inner.nativeElement.style.backgroundPositionY = `calc(${size}px / -10)`;

    const imageElement = this.innerSrc.nativeElement.children[0];
    // this.getImageSrc(imageEl);
    imageElement.onload = () => {
      const src = imageElement.getAttribute('src');
      this.renderer.setStyle(sqWrapEl, 'background-image', `url(${src})`);
      this.renderer.setStyle(innerEl, 'background-image', `url(${src})`);
      // this.sqWrap.nativeElement.style.backgroundImage = `url(${src})`;
      // this.inner.nativeElement.style.backgroundImage = `url(${src})`;
    };
  }
}
