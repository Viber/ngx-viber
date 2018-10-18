import { AfterViewInit, Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[vbrImagePreloader]'
})

export class VbrImagePreloaderDirective implements AfterViewInit, OnChanges {
  /* tslint:disable:max-line-length */
  private readonly defaultPreloader = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAACXBIWXMAAAsSAAALEgHS3X78AAAAGnpUWHRUaXRsZQAACJkrz8gsSdUtyKxIzQEAGswEcSrjKcYAAAAdelRYdEF1dGhvcgAACJkLyMzLVHDKTEotSk/MAQAgXATJ+Ru46QAAAApJREFUCFtjYAAAAAIAAWJAT2gAAAAASUVORK5CYII=';
  /* tslint:enable:max-line-length */

  @Input('vbrImagePreloader') vbrImagePreloader: string;
  @Input('vbrImageSrc') src: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngAfterViewInit() {
    this.setSrc(this.vbrImagePreloader || this.defaultPreloader);
  }

  ngOnChanges(changes: SimpleChanges): any {
    // Check preloader changed, update src only in case it still have old preloader
    if (changes.preloader &&
      changes.preloader.currentValue &&
      changes.preloader.currentValue.length &&
      changes.preloader.currentValue !== changes.preloader.previousValue) {
      if (this.el.nativeElement.getAttribute('src') === changes.preloader.previousValue) {
        this.setSrc(changes.preloader.currentValue);
      }
    }

    // Check new src is valid, and replace image src with the new one or keep preloader
    if (changes.src &&
      changes.src.currentValue &&
      changes.src.currentValue.length &&
      changes.src.currentValue !== changes.src.previousValue) {
      setTimeout(() => {
        const img: HTMLImageElement = new Image();
        img.onload = () => this.setSrc(changes.src.currentValue);
        img.onerror = () => this.setSrc(this.vbrImagePreloader || this.defaultPreloader);
        img.src = changes.src.currentValue;
      }, 0);
    }
  }

  private setSrc(src) {
    this.renderer.setAttribute(this.el.nativeElement, 'src', src);
  }
}
