import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import {
  BehaviorSubject,
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
import { ScrollItemDirective } from './scroll-item.directive';

@Component({
  selector: 'vbr-scrollable',
  templateUrl: './vbr-scrollable.component.html',
  styleUrls: ['./vbr-scrollable.component.scss'],
})
export class VbrScrollableComponent implements AfterViewInit, AfterContentInit, OnChanges, OnDestroy, Scrollable {
  @Input() public usePerfectScrollbar = true;
  @Input() private items: Array<any>;
  // @Input() private items$: Subject<any>;
  @Input() private reverseOrder: boolean;
  @Output() reachStart: EventEmitter<any> = new EventEmitter();
  @Output() reachEnd: EventEmitter<any> = new EventEmitter();
  @Output() scroll: EventEmitter<any> = new EventEmitter();
  @ViewChild(PerfectScrollbarComponent) private pScroll: PerfectScrollbarComponent;
  @ViewChild('scroller') scrollerElement: ElementRef;
  @ViewChild('contentWrap', {read: ViewContainerRef}) contentWrap: ViewContainerRef;
  @ViewChild('vsTemp', {read: ViewContainerRef}) vsTemp: ViewContainerRef;
  @HostBinding('class.loading') loading: boolean = true;
  @ContentChildren(ScrollItemDirective) contentChildren !: QueryList<ScrollItemDirective>;

  public innerItems: Array<any>;
  public totalHeight = 20;
  public totalWidth = 0;
  public onInit: Subject<void> = new Subject();

  private initialized: boolean;
  /**
   * Array that holds information for all nodes that were added.
   * Info = Bounding data and the node reference itself.
   * For indexing and avoid rendering not necessary DOM elements
   */
  private elements: Array<ElementInterface> = [];
  private nodeElements = [];
  private scrollToPosition = 0;
  private prevHeight = 0;
  private chunks: Chunk[] = [];


  private nodeStorage = [];


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

  loadContent() {
    // this.loading = true;

    const tempNodeElements = this.contentChildren.toArray().slice();
    // this.chunkHeight = this.vsTemp.element.nativeElement.getBoundingClientRect().height;

    if (tempNodeElements.length === 0) {
      return;
    }

    // this.totalHeight = this.vsTemp.element.nativeElement.getBoundingClientRect().height;


    /**
     * Set current node to scroll to, after more nodes loaded.
     * Remember scroll position.
     */

    // this.nodeElements = [...Array.from(tempNodeElements)];
    this.nodeElements = tempNodeElements;

    const images = this.document.querySelectorAll('#vs-ps-temp img');

    /**
     * If there are images in the nodes start the process only after all images were loaded.
     */
    if (images.length > 0) {
      this.imagesLoaded(images)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(() => {
          // const height = this.vsTemp.element.nativeElement.getBoundingClientRect().height;
          // this.totalHeight = height + 20;


          const height = this.vsTemp.element.nativeElement.getBoundingClientRect().height;
          this.totalHeight += height;

          this.scrollToPosition = this.totalHeight - this.prevHeight;
          this.prevHeight = this.totalHeight;

          setTimeout(() => {
            this.processNodes(this.nodeElements);
          }, 500);
        });
    } else {
      setTimeout(() => {
        const height = this.vsTemp.element.nativeElement.getBoundingClientRect().height;
        this.totalHeight = height + 20;

        this.scrollToPosition = this.totalHeight - this.prevHeight;
        this.prevHeight = this.totalHeight;

        this.processNodes(tempNodeElements);
      }, 0);
    }

    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initialized = false;
    this.setInnerItems(changes.items.currentValue);

    setTimeout(() => {
      this.loadContent();
      this.cdr.detectChanges();
    }, 0);
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


  private processNodes(nodeElements) {
    // const chunkTop = this.reverseOrder ? 0 : this.totalHeight - this.chunkHeight;
    // const chunkBottom = this.reverseOrder ? this.vsTemp.element.nativeElement.getBoundingClientRect().height :
    //   (this.totalHeight - this.chunkHeight) + this.vsTemp.element.nativeElement.getBoundingClientRect().height;

    const newChunk = new Chunk();
    let chunkHeight = 0;

    const elements: ElementInterface[] = [];
    nodeElements.forEach(node => {
      const dims = {
        height: node.getRenderElement().offsetHeight,
      };
      elements.push({bounding: dims, parent: node});
    });

    const prevChunkLength = this.elements.length;
    // newChunk.elements = prevChunkLength > 0 ? elements.slice(0, elements.length - prevChunkLength) : elements;


    newChunk.elements = prevChunkLength > 0 ? elements.slice(0, elements.length - prevChunkLength) : elements;


    newChunk.elements.forEach(el => {
      chunkHeight += el.bounding.height;
    });

    /**
     * Set chunk dimensions
     */
    // const chunkTop = this.reverseOrder ? 0 : this.totalHeight - this.chunkHeight;
    // const chunkBottom = this.reverseOrder ? this.vsTemp.element.nativeElement.getBoundingClientRect().height :
    //   (this.totalHeight - this.chunkHeight) + this.vsTemp.element.nativeElement.getBoundingClientRect().height;

    newChunk.setTop(0);
    newChunk.setBottom(chunkHeight);
    newChunk.setHeight(chunkHeight);

    newChunk.elements.forEach(node => {
      const bounding = node.parent.getRenderElement().getBoundingClientRect();
      const dims = {
        prevItemTop: bounding.top + newChunk.top,
        top: bounding.top + newChunk.top,
        bottom: bounding.bottom + newChunk.top,
        height: bounding.height,
      };

      node.bounding = dims;
    });


    this.addChunkToChunks(newChunk);

    /**
     * Reset positions of all nodes including the old ones, and remove from temporary storage in DOM.
     */
    this.nodeElements.forEach((node, index) => {
      if (!this.elements[index]) {
        return;
      }
      const bounding = this.elements[index].bounding;
      node = node.vc.element.nativeElement;

      this.renderer.setStyle(node, 'height', bounding.height + 'px');
      this.renderer.setStyle(node, 'top', bounding.top + 'px');
      this.renderer.setStyle(node, 'position', 'absolute');

      // if (node.parentNode === this.vsTemp.element.nativeElement) {
      //   this.renderer.removeChild(this.vsTemp.element.nativeElement, node);
      // }
    });

    this.contentWrap.element.nativeElement.innerHTML = '';

    this.appendElements();

    /**
     * Scroll to the position that was before loading new nodes.
     */
    if (this.scrollToPosition !== 20 && this.scrollToPosition > 0) {
      // const style = this.scrollToIndexElement.style.top;
      // const scrollIndex = parseInt(style.split('(')[1].split(')')[0], 10);

      this.scroller.scrollTo(this.scrollToPosition);
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
      const exists = [];

      if (this.chunks.length > 0) {
        chunk.elements.map(el => {
          const last = this.chunks[this.chunks.length - 1];
          const e = last.elements.some(l => {
            return l.parent === el.parent;
          });

          exists.push(e);
        });
      }

      if (exists.indexOf(false) !== -1 || exists.length === 0) {

        for (let i = 0; i < exists.length; i++) {
          const v = exists[i];
          if (v) {
            exists.splice(i, 1);
            chunk.elements.splice(i, 1);
            i--;
          }
        }

        this.chunks.unshift(chunk);
      } else {
        this.chunks[this.chunks.length - 1] = chunk;
      }

      const chunks = [];

      /**
       * Recalculate positions of all nodes and recalculate height of chunk
       */
      this.chunks.forEach((chunkItem, i) => {
        const prev = this.chunks[i - 1];
        if (prev) {
          chunkItem.top = prev.top + prev.height;
          chunkItem.bottom = chunkItem.top + chunkItem.height;
        }

        let height = 0;

        chunkItem.elements.forEach(el => {
          el.bounding.top = chunkItem.top + el.bounding.prevItemTop;
          el.bounding.bottom = el.bounding.top + el.bounding.height;
          height += el.bounding.height;
        });

        chunkItem.height = height;

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

    const arr = this.contentChildren.toArray().slice();

    this.elements.forEach((el, index) => {
      const bounding: ClientRect = el.bounding;
      const top = bounding.top - scrollTop;
      const bottom = bounding.bottom - scrollTop;


      const node = el.parent.getRenderElement().cloneNode(true);


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

    this.contentWrap.element.nativeElement.innerHTML = '';

    // this.contentWrap.clear();

    nodeStorage.forEach((node, i) => {
      const item: ScrollItemDirective = arr[i];
      let renderElement;
      if (item) {
        renderElement = item.getRenderElement();
      }

      if (node.childElementCount > 0) {
        // const factory = this.resolver.resolveComponentFactory(item.getComponent());

        // const tmpCmp = item.getComponent();
        // const tmpModule = NgModule({declarations: [tmpCmp], entryComponents:[tmpCmp]})(class {
        // });

        // this.compiler.compileModuleAndAllComponentsAsync(tmpModule)
        //   .then(factories => {
        //     const f = factories.componentFactories[0];
        //     const cmpRef = this.contentWrap.createComponent(f);
        //     cmpRef.instance.name = 'dynamic';
        //   });

        // this.contentWrap.createComponent(item.getComponent());


        if (renderElement) {
          const wrap = this.contentWrap.element.nativeElement;
          const el = renderElement.cloneNode(true);
          this.renderer.appendChild(this.contentWrap.element.nativeElement, renderElement);
          this.nodeStorage.push(el);
        }
      } else {
        const storage = this.nodeStorage;


        if (this.contentWrap.element.nativeElement.contains(renderElement)) {
          this.renderer.removeChild(this.contentWrap.element.nativeElement, renderElement);
        }
      }
    });

    // this.setInnerItems([]);
  }

  private setInnerItems(items: Array<any>) {
    this.innerItems = items;
  }
}
