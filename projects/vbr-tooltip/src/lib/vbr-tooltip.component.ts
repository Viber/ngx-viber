import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import Popper from 'popper.js';

@Component({
  selector: 'vbr-tooltip',
  templateUrl: './vbr-tooltip.component.html',
  styleUrls: ['./vbr-tooltip.component.scss']
})
export class VbrTooltipComponent implements OnInit {
  @ViewChild('popper') popperElement: ElementRef;
  @ViewChild('popperBlock') popperBlock: ElementRef;
  popper: Popper;

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.el.nativeElement) {
        return;
      }
    });
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e) {
    const popperElement = this.popperElement;
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const popper = new Popper(e.target, this.popperElement.nativeElement, {
      placement: 'top',
      positionFixed: true,
      onCreate: () => {
        if (rect.width > 0) {
          this.renderer.addClass(this.popperElement.nativeElement, 'show');
          const left = rect.left - (popperElement.nativeElement.offsetWidth / 2 - rect.width / 2);
          this.renderer.setStyle(popperElement.nativeElement, 'transform', 'translate3d(' + left + 'px, ' + rect.top + 'px, 0)');
        } else {
          this.destroyPopper(popper);
        }
      },
      onUpdate: () => {
        const left = rect.left - (popperElement.nativeElement.offsetWidth / 2 - rect.width / 2);
        this.renderer.setStyle(popperElement.nativeElement, 'transform', 'translate3d(' + left + 'px, ' + rect.top + 'px, 0)');
      }
    });
  }

  destroyPopper(popper: Popper) {
    if (!!popper) {
      popper.destroy();
      this.renderer.removeClass(this.popperElement.nativeElement, 'show');
      popper = null;
    }
  }
}
