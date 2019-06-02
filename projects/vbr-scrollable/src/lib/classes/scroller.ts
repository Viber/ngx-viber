import { ElementRef } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import {
  fromEvent,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class Scroller {
  public onReachStart: Subject<MouseEvent> = new Subject();
  public onReachEnd: Subject<MouseEvent> = new Subject();
  private document: Document;
  private scroller: ElementRef | PerfectScrollbarComponent;
  private readonly isNative: boolean;

  /**
   *
   * @param scroller
   * @param pScroller
   * @param document DOM Document object reference, needed for SSR
   */
  constructor(scroller: ElementRef, pScroller: PerfectScrollbarComponent, document: Document) {
    this.isNative = !!scroller;
    this.setScroller(scroller || pScroller);
    this.document = document;
  }

  scrollTo(y: number) {
    return this.isNative ?
      (<ElementRef>this.scroller).nativeElement.scrollTo(0, y) :
      (<PerfectScrollbarComponent>this.scroller).directiveRef.scrollTo(0, y);
  }

  scrollToTop() {
    this.scrollTo(0);
  }

  scrollToBottom() {
    return this.isNative ?
      (<ElementRef>this.scroller).nativeElement.scrollTop = (<ElementRef>this.scroller).nativeElement.scrollHeight :
      (<PerfectScrollbarComponent>this.scroller).directiveRef.scrollToBottom();
  }

  onScroll(): Observable<MouseEvent> {
    if (this.isNative) {
      return fromEvent((<ElementRef>this.scroller).nativeElement, 'scroll')
        .pipe(
          switchMap((e: MouseEvent) => {
            const scroller = (<ElementRef>this.scroller).nativeElement;

            if (scroller.scrollTop === 0) {
              this.onReachStart.next(e);
            } else if (scroller.offsetHeight + scroller.scrollTop === scroller.scrollHeight) {
              this.onReachEnd.next(e);
            }

            return of(e);
          }),
        );
    } else {
      return (<PerfectScrollbarComponent>this.scroller).psScrollY;
    }
  }

  get scrollTop() {
    const ps: HTMLElement = this.document.querySelector('.ps__rail-y');
    return this.isNative ? (<ElementRef>this.scroller).nativeElement.scrollTop : parseInt(ps.style.top, 10);
  }

  private setScroller(scroller) {
    this.scroller = scroller;

    if (!this.isNative) {
      this.onReachStart = (<PerfectScrollbarComponent>scroller).psYReachStart;
      this.onReachEnd = (<PerfectScrollbarComponent>scroller).psYReachEnd;
    }
  }
}
