import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import { EditableImage } from './classes/editable-image';
import { EditModes } from './classes/edit-modes.type';
import { Key } from './classes/key.enum';
import { fromEvent, Subject } from 'rxjs';
import { auditTime, tap } from 'rxjs/operators';
import { VbrImageEditService } from './vbr-image-edit.service';

declare let html2canvas: any;

@Component({
  selector: 'lib-vbr-image-edit',
  templateUrl: './vbr-image-edit.component.html',
  styles: []
})
export class VbrImageEditComponent implements OnInit, AfterContentInit {

  @ViewChild('fileInput') inputEl;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('editableImageView') editableImageView: ElementRef;
  @ViewChild('main') main: ElementRef;
  @ViewChild('artBoard') artBoard: ElementRef;
  @ContentChild('changeButton') changeButton;
  @Input() accept = 'image/*'; // '.jpg,.png,.jpeg,.gif';

  showPreview: boolean;

  outputWidth = 400;
  outputHeight = 400;
  editMode: EditModes = 'move';
  interacting = false;
  outputImageSrc: string;
  editableImage: EditableImage;
  dimSize: any;
  private context: CanvasRenderingContext2D;
  private startX: number;
  private startY: number;
  private mouseMove: EventListenerObject;
  private startWidth = 0;
  private startHeight = 0;
  private keysDown: Array<Key> = [];
  private scroll: Subject<WheelEvent> = new Subject();

  constructor(private zone: NgZone,
              private fileService: VbrImageEditService,
              private cdr: ChangeDetectorRef) {
    this.scroll
      .pipe(
        tap(e => this.resizeObject(e)),
        auditTime(500),
      )
      .subscribe(() => {
        this.updatePreview();
      });
  }

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');

    this.setBoundaries();
  }

  ngAfterContentInit(): void {
    if (!this.changeButton) {
      return;
    }

    const button = !!this.changeButton.nativeElement ?
      this.changeButton.nativeElement : this.changeButton._elementRef.nativeElement;

    fromEvent(button, 'click').subscribe(() => this.addImage());
  }

  @HostListener('window:resize')
  setBoundaries() {
    const rect = this.artBoard.nativeElement;
    const boundaries = {
      left: rect.offsetLeft,
      top: rect.offsetTop,
      right: rect.offsetLeft + rect.offsetWidth,
      bottom: rect.offsetTop + rect.offsetHeight,
    };

    this.dimSize = {
      right: {
        width: boundaries.left + 'px',
        x: boundaries.right + 'px',
      },
      bottom: {
        width: rect.offsetWidth + 'px',
        height: boundaries.top + 'px',
        y: (boundaries.top + rect.offsetHeight) + 'px',
      },
    };

    this.cdr.markForCheck();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    switch (e.which) {
      case Key.Shift:
        this.keysDown.push(Key.Shift);
        break;
      case Key.Control:
        this.keysDown.push(Key.Shift);
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    switch (e.which) {
      case Key.Shift:
        this.keysDown[this.keysDown.indexOf(Key.Shift)] = null;
        break;
      case Key.Control:
        this.keysDown[this.keysDown.indexOf(Key.Control)] = null;
        break;
    }
  }

  @HostListener('window:dragover', ['$event'])
  public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  @HostListener('window:dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    this.inputEl.nativeElement.files = e.dataTransfer.files;
  }

  onMouseOut() {
    window.removeEventListener('DOMMouseScroll', this.preventDefault.bind(this), false);
    document.getElementById('art-board')
      .removeEventListener('wheel', this.preventDefault.bind(this), false);

    window.onwheel = null;
  }

  onMouseEnter() {
    window.addEventListener('DOMMouseScroll', this.preventDefault.bind(this), false);
    document.getElementById('art-board')
      .addEventListener('wheel', this.preventDefault.bind(this), false);

    window.onwheel = this.preventDefault.bind(this);
  }

  private preventDefault(e) {
    if (e instanceof WheelEvent) {
      this.scroll.next(e);

      e = e || window.event;
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.returnValue = false;
    }
  }

  onMouseDown(e: MouseEvent) {
    e.preventDefault();

    this.interacting = true;

    const lastOffsetX = this.editableImage.left || 0;
    const lastOffsetY = this.editableImage.top || 0;
    this.startWidth = this.editableImage.width;
    this.startHeight = this.editableImage.height;
    this.startX = e.pageX;
    this.startY = e.pageY;

    if (this.editMode === 'move') {
      this.startX = e.pageX - lastOffsetX;
      this.startY = e.pageY - lastOffsetY;
    }

    this.mouseMove = this.onMouseMove.bind(this);
    this.zone.runOutsideAngular(() => {
      window.document.addEventListener('mousemove', this.mouseMove);
    });
  }

  onMouseMove(e: MouseEvent) {
    if (!this.interacting) {
      return;
    }

    e.preventDefault();

    switch (this.editMode) {
      case 'move':
        return this.moveObject(e);
      case 'resize':
        return this.resizeObject(e);
    }
  }

  onMouseUp() {
    this.interacting = false;

    this.zone.run(() => {
      this.updatePreview();
    });

    window.document.removeEventListener('mousemove', this.mouseMove);
  }

  moveObject(e: MouseEvent) {
    let newDx = e.pageX - this.startX;
    let newDy = e.pageY - this.startY;

    const rect = this.editableImage.imageElement.getBoundingClientRect();
    const boundRect = this.artBoard.nativeElement.getBoundingClientRect();

    if (newDx >= 0) {
      newDx = 0;
    }

    if (newDy >= 0) {
      newDy = 0;
    }

    if (newDx <= -(rect.width - boundRect.width)) {
      newDx = -(rect.width - boundRect.width);
    }

    if (newDy <= -(rect.height - boundRect.height)) {
      newDy = -(rect.height - boundRect.height);
    }

    this.zone.run(() => {
      this.editableImage.left = newDx;
      this.editableImage.top = newDy;
    });
  }

  resizeObject(e: any) {
    if (!this.editableImage) {
      return;
    }

    let width = this.startWidth + e.clientX - this.startX;
    let height = this.startHeight + e.clientY - this.startY;
    let top = this.editableImage.top;
    let left = this.editableImage.left;

    const boundRect = this.artBoard.nativeElement.getBoundingClientRect();
    const delta = e.deltaY > 0 ? 50 : -50;

    if (e instanceof WheelEvent) {
      width = this.editableImage.width - delta;
      height = !this.editableImage.isPortrait ? this.editableImage.height - delta / this.editableImage.ratio :
        this.editableImage.height - delta * this.editableImage.ratio;

      left += (this.editableImage.isPortrait ? delta / this.editableImage.ratio : delta) / 2;
      top += (this.editableImage.isPortrait ? delta * this.editableImage.ratio : delta) / 2;
    }

    const cond = e instanceof WheelEvent ? e.deltaY > 0 : false;

    if ((boundRect.left + left + width <= boundRect.right || boundRect.top + top + height <= boundRect.bottom) && cond) {
      width = this.editableImage.width;
      height = this.editableImage.height;
    }

    if ((boundRect.top + top) > boundRect.top) {
      top = 0;
    }
    if (boundRect.bottom + top + height < boundRect.bottom) {
      height += (boundRect.bottom - (boundRect.bottom + top + height));
      width = this.editableImage.isPortrait ? height / this.editableImage.ratio :
        height * this.editableImage.ratio;
    }
    if ((boundRect.left + left) > boundRect.left) {
      left = 0;
    }
    if ((boundRect.left + left + width) < boundRect.right) {
      width += (boundRect.right - (boundRect.left + left + width));
      height = this.editableImage.isPortrait ? width * this.editableImage.ratio :
        width / this.editableImage.ratio;
    }

    this.zone.run(() => {
      this.editableImage.width = width;
      this.editableImage.height = height;
      this.editableImage.top = top;
      this.editableImage.left = left;
    });
  }

  addImage() {
    this.inputEl.nativeElement.click();
  }

  updatePreview() {
    if (!this.editableImage) {
      return;
    }

    this.context.clearRect(0, 0, this.outputWidth, this.outputHeight);

    html2canvas(this.artBoard.nativeElement).then((canvas) => {
      this.context.drawImage(canvas, 0, 0);
      this.outputImageSrc = canvas.toDataURL('image/jpeg');
      const file: Blob = VbrImageEditService.dataURItoBlob(this.outputImageSrc);

      this.fileService.file.next(file);
    });
  }

  sourceChanged($event) {
    const input = $event.target;
    this.readURL(input);
  }

  private readURL(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      const img: HTMLImageElement = new Image();

      img.onload = () => {
        this.editableImage = new EditableImage(img);
        this.editableImage.imageElement = this.editableImageView.nativeElement;

        setTimeout(() => {
          this.updatePreview();
        }, 100);

        this.resetView();
      };

      reader.onload = (e: ProgressEvent) => {
        img.src = (<FileReader>e.target).result;
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  private resetView() {
    this.startX = this.startY = 0;
    this.editableImage.left = 0;
    this.editableImage.top = 0;
    this.setBoundaries();
  }

}
