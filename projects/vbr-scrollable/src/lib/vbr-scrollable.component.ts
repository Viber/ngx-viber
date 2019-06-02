import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import {
  Observable,
  Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Chunk,
  ElementInterface,
} from './classes/chunk';
import { Scrollable } from './scrollable';
import { Scroller } from './classes/scroller';
import {
  DOCUMENT,
  DocumentWrapper,
  WINDOW,
  WindowWrapper,
} from './classes/factory';

@Component({
  selector: 'vbr-scrollable',
  templateUrl: './vbr-scrollable.component.html',
  styleUrls: ['./vbr-scrollable.component.scss'],
})
export class VbrScrollableComponent implements AfterViewInit, AfterContentInit, OnChanges, OnDestroy, AfterContentChecked, Scrollable {
  @Input() public usePerfectScrollbar = true;
  @Input() private items: Array<any>;
  @Input() private reverseOrder: boolean;
  @Output() reachStart: EventEmitter<any> = new EventEmitter();
  @Output() reachEnd: EventEmitter<any> = new EventEmitter();
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @ViewChild(PerfectScrollbarComponent) private pScroll: PerfectScrollbarComponent;
  @ViewChild('scroller') scrollerElement: ElementRef;
  @ViewChild('contentWrap') contentWrap: ElementRef;
  @ViewChild('vsTemp') vsTemp: ElementRef;
  @ViewChild('vsTempEl') vsTempEl: ElementRef;
  @HostBinding('class.loading') loading: boolean = true;

  public innerItems: Array<any>;
  public totalHeight = 20;
  public totalWidth = 0;
  public chunkHeight = 0;
  public onInit: Subject<void> = new Subject();

  private initialized: boolean;
  /**
   * Array that holds information for all nodes that were added.
   * Info = Bounding data and the node reference itself.
   * For indexing and avoid rendering not necessary DOM elements
   */
  private elements: Array<ElementInterface> = [];
  private nodeElements = [];
  private nodeChunks = [];
  private chunkNumber = 0;
  private chunks: Chunk[] = [];
  private scrollToIndexElement;
  /**
   * Scroller factory class, takes all the responsibility for scroller element maintaining,
   * Whether use perfect scrollbar or native element
   */
  public scroller: Scroller;
  private onDestroy: Subject<void> = new Subject();

  constructor(
    @Inject(WINDOW) private window: WindowWrapper,
    @Inject(DOCUMENT) private document: DocumentWrapper,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private element: ElementRef,
  ) {
  }

  ngAfterViewInit(): void {
    this.scroller = new Scroller(this.scrollerElement, this.pScroll, this.document);

    this.scroller.onScroll()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.appendElements();
        this.scroll.emit();
      });

    this.scroller.onReachStart
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.yReachStart());

    this.scroller.onReachEnd
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => this.yReachEnd());
  }

  ngAfterContentInit(): void {
    this.totalWidth = this.element.nativeElement.offsetWidth;
    this.cdr.markForCheck();
  }

  ngAfterContentChecked(): void {
    if (this.initialized) {
      return;
    }

    this.loading = true;

    const tempNodeElements = this.document.querySelectorAll('#vs-ps-temp > *');
    this.chunkHeight = this.vsTemp.nativeElement.getBoundingClientRect().height;

    if (tempNodeElements.length === 0) {
      return;
    }

    /**
     * Set current node to scroll to, after more nodes loaded.
     * Remember scroll position.
     */
    if (this.nodeChunks.length > 0) {
      this.scrollToIndexElement = this.nodeChunks[0][0];
    }

    this.nodeChunks.unshift(tempNodeElements);

    const tempArr = [];

    this.nodeChunks.forEach(node => node.forEach((item) => tempArr.push(item)));

    this.nodeElements = tempArr;

    const images = this.document.querySelectorAll('#vs-ps-temp img');

    /**
     * If there are images in the nodes start the process only after all images were loaded.
     */
    if (images.length > 0) {
      this.imagesLoaded(images)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          const height = this.vsTemp.nativeElement.getBoundingClientRect().height;
          this.totalHeight += height;

          setTimeout(() => {
            this.processNodes(tempNodeElements);
          }, 800);
        });
    } else {
      setTimeout(() => {
        const height = this.vsTemp.nativeElement.getBoundingClientRect().height;
        this.totalHeight += height;

        this.processNodes(tempNodeElements);
      }, 0);
    }

    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && this.items) {
      this.setInnerItems(this.items);
      this.chunkNumber++;
      this.initialized = false;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }

  /**
   * Program Interface methods
   */

  yReachStart() {
    this.reachStart.emit();
  }

  yReachEnd() {
    this.reachEnd.emit();
  }

  scrollTo(y) {
    this.scroller.scrollTo(y);
  }

  scrollToTop() {
    this.scroller.scrollToTop();
  }

  scrollToBottom() {
    this.scroller.scrollToBottom();
  }

  /**
   * Process newly added nodes
   * @param nodeElements
   */

  private processNodes(nodeElements) {
    const chunkTop = this.reverseOrder ? 0 : this.totalHeight - this.chunkHeight;
    const chunkBottom = this.reverseOrder ? this.vsTemp.nativeElement.getBoundingClientRect().height :
      (this.totalHeight - this.chunkHeight) + this.vsTemp.nativeElement.getBoundingClientRect().height;

    const newChunk = new Chunk(chunkTop, chunkBottom, this.vsTemp.nativeElement.getBoundingClientRect().height);

    const elements: ElementInterface[] = [];
    nodeElements.forEach(node => {
      const bounding = node.getBoundingClientRect();
      const dims = {
        prevItemTop: bounding.top + newChunk.top,
        top: bounding.top + newChunk.top,
        bottom: bounding.bottom + newChunk.top,
        height: bounding.height,
      };

      elements.push({bounding: dims, parent: node});
    });

    newChunk.elements = elements;
    this.addChunkToChunks(newChunk);

    /**
     * Reset positions of all nodes including the old ones, and remove from temporary storage in DOM.
     */
    this.nodeElements.forEach((node, index) => {
      if (!this.elements[index]) {
        return;
      }
      const bounding = this.elements[index].bounding;

      this.renderer.setStyle(node, 'height', bounding.height + 'px');
      this.renderer.setStyle(node, 'transform', 'translateY(' + bounding.top + 'px)');
      this.renderer.setStyle(node, 'position', 'absolute');

      if (node.parentNode === this.vsTemp.nativeElement) {
        this.renderer.removeChild(this.vsTemp.nativeElement, node);
      }
    });

    this.contentWrap.nativeElement.innerHTML = '';

    this.appendElements();

    /**
     * Scroll to the position that was before loading new nodes.
     */
    if (this.scrollToIndexElement) {
      const style = this.scrollToIndexElement.style.transform;
      const scrollIndex = parseInt(style.split('(')[1].split(')')[0], 10);

      this.scroller.scrollTo(scrollIndex);
    } else {
      if (this.reverseOrder) {
        this.scrollToBottom();
      }
    }

    this.loading = false;
    this.onInit.next();
  }

  /**
   * Add new chunk to `this.chunks` array
   * @param chunk
   */
  private addChunkToChunks(chunk: Chunk) {
    if (this.reverseOrder) {
      this.chunks.unshift(chunk);

      const chunks = [];

      /**
       * Recalculate positions of all nodes
       */
      this.chunks.forEach((chunkItem, i) => {
        const prev = this.chunks[i - 1];
        if (prev) {
          chunkItem.top = prev.top + prev.height;
        }

        chunkItem.elements.forEach(el => {
          /**
           * Check if node size has changed
           */

          if (this.reverseOrder && i > 0) {
            const div = this.document.createElement('div');
            div.style.width = '100%';
            div.style.display = 'block';
            div.style.boxSizing = 'border-box';

            div.innerHTML = el.parent.innerHTML.trim();
            this.vsTempEl.nativeElement.appendChild(div);

            el.bounding.top = chunkItem.top + el.bounding.prevItemTop;
            el.bounding.bottom = el.bounding.top +
              (this.vsTempEl.nativeElement.clientHeight !== 0 ? this.vsTempEl.nativeElement.clientHeight : el.bounding.bottom);

            this.renderer.removeChild(this.vsTempEl.nativeElement, div);
          } else {
            el.bounding.top = chunkItem.top + el.bounding.prevItemTop;
            el.bounding.bottom = el.bounding.top +
              (this.vsTempEl.nativeElement.clientHeight !== 0 ? this.vsTempEl.nativeElement.clientHeight : el.bounding.bottom);
          }
        });

        chunks.push(chunkItem);
      });

      if (chunks.length > 0) {
        this.chunks = chunks;
      }

      /**
       * Reinitialize `this.elements`
       */
      this.elements = [];
      chunks.forEach(chunkItem => {
        chunkItem.elements.forEach(item => {
          this.elements.push(item);
        });
      });

      this.chunks.forEach(chunkItem => {
        chunkItem.bottom = chunkItem.top + chunkItem.height;
      });

    } else {
      this.chunks.push(chunk);
      this.elements = [...chunk.elements, ...this.elements];
    }
  }

  /**
   * Method that emits only when all images on the page were loaded.
   * @param images
   */
  private imagesLoaded(images: NodeListOf<Element>): Observable<void> {
    const total = images.length;
    let count = 0;

    return Observable.create(observer => {
      images.forEach((img: HTMLImageElement) => {
        if (!img.complete) {
          img.addEventListener('load', () => {
            count++;

            if (count === total) {
              observer.next(images);
              observer.complete();
            }
          });
        } else {
          count++;

          if (count === total) {
            observer.next(images);
            observer.complete();
          }
        }
      });
    });
  }

  private appendElements() {
    const scrollTop = this.scroller.scrollTop;
    const nodeStorage = [];

    this.chunks.forEach(chunk => {
      const top = chunk.top - scrollTop;
      const bottom = chunk.bottom - scrollTop;

      const clientHeight = this.window.innerHeight || this.document.documentElement.clientHeight;

      chunk.visible = (top <= 0 &&
        bottom >= clientHeight) ||
        (bottom <= clientHeight && bottom >= 0 ||
          top >= 0 && top <= clientHeight);
    });

    const visibleChunks = this.chunks.filter(c => c.visible);
    const arrElements = [];

    for (const arr of visibleChunks) {
      arrElements.push(...arr.elements);
    }

    arrElements.forEach(el => {
      const bounding: ClientRect = el.bounding;
      const top = bounding.top - scrollTop;
      const bottom = bounding.bottom - scrollTop;
      const node = el.parent.cloneNode(true);

      node.childNodes.forEach((childNodes: HTMLElement) => {
        if (!!childNodes.querySelectorAll) {
          const images = childNodes.querySelectorAll('img');
          if (images.length > 0) {
            images.forEach(img => {
              img.setAttribute('data-src', img.currentSrc);
            });
          }
        }
      });

      if (
        bottom >= 0 &&
        top <= (this.window.innerHeight || this.document.documentElement.clientHeight)
      // bounding.top >= 0 &&
      // bounding.bottom <= (this.window.innerHeight || this.document.documentElement.clientHeight)
      // bounding.left >= 0 &&
      // bounding.right <= (this.window.innerWidth || this.document.documentElement.clientWidth) &&
      ) {
        // In the viewport
        if (node.children.length === 0) {
          Array.from(node.childNodes).forEach((item: HTMLElement) => {
            if (item.querySelectorAll) {
              item.querySelectorAll('img').forEach(img => {
                img.src = img.dataset.src;
              });

              node.appendChild(item);
            }
          });
        }
      } else {
        // Not in the viewport
        node.innerHTML = '';
      }

      nodeStorage.push(node);
    });

    this.contentWrap.nativeElement.innerHTML = '';

    nodeStorage.forEach((node) => {
      if (node.innerHTML.length > 0) {
        this.renderer.appendChild(this.contentWrap.nativeElement, node);
      } else {
        if (this.contentWrap.nativeElement.contains(node)) {
          this.renderer.removeChild(this.contentWrap.nativeElement, node);
        }
      }
    });
  }

  private setInnerItems(items: Array<any>) {
    this.innerItems = items;
  }
}
