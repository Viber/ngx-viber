import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  Observable,
  Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[vbrAdjustText]',
})
export class VbrAdjustTextDirective implements OnInit, OnDestroy {

  @Input('imageSrc') imageSrc: string;
  private onDestroy: Subject<any> = new Subject();

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.mixBlendMode = 'difference';
    this.el.nativeElement.style.color = '#fff';

    if (!this.imageSrc) {
      return;
    }
    this.getImageBrightness(this.imageSrc)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(brightnessLevel => {
        const className = (brightnessLevel > 50) ? 'bgLight' : 'bgDark';
        this.renderer.addClass(this.el.nativeElement, className);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  private getImageBrightness(imageSrc): Observable<number> {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.display = 'none';
    img.crossOrigin = 'Anonymous';
    document.body.appendChild(img);

    let colorSum = 0;

    return Observable.create((observer) => {
      img.onload = function () {
        // create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r, g, b, avg;

        for (let x = 0, len = data.length; x < len; x += 4) {
          r = data[x];
          g = data[x + 1];
          b = data[x + 2];

          avg = Math.floor((r + g + b) / 3);
          colorSum += avg;
        }

        const brightness = Math.floor(colorSum / (img.width * img.height));
        observer.next(brightness);
      };
    });
  }
}
