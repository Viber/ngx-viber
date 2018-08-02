import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import Popper from 'popper.js';
import { NgTemplateOutlet } from '@angular/common';
import { C } from '@angular/core/src/render3';
import { BehaviorSubject } from 'rxjs';

export enum TooltipTriggers {
  destroy = '[TooltipTriggerTypes] Destroy'
}

@Component({
  selector: 'vbr-tooltip',
  templateUrl: './vbr-tooltip.component.html',
  styleUrls: ['./vbr-tooltip.component.scss']
})
export class VbrTooltipComponent<T> implements OnInit {
  @Input() content: TemplateRef<T>[];
  @Input() placement: 'top' | 'bottom';
  @Input() triggerer: BehaviorSubject<string>;
  @ViewChild('popper') popperElement: ElementRef;
  popper: Popper;

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {
    if (!this.triggerer) {
      this.triggerer = new BehaviorSubject('');
    }

    this.triggerer.subscribe((c: TooltipTriggers) => {
      switch (c) {
        case TooltipTriggers.destroy:
          this.destroyPopper();
          break;
        default:
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e) {
    if (!this.el.nativeElement.contains(e.target)) {
      return this.destroyPopper();
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(e) {
    if (this.popperElement.nativeElement.contains(e.target)) {
      return;
    }

    const popperElement = this.popperElement;
    const selection = window.getSelection();
    const range = !!selection && selection.getRangeAt(0) || null;
    const rect = !!range && range.getBoundingClientRect();
    const elementTop = e.target.offsetTop;

    this.popper = new Popper(e.target, this.popperElement.nativeElement, {
      placement: this.placement || 'top',
      // positionFixed: true,
      onCreate: () => {
        this.renderer.addClass(this.popperElement.nativeElement, 'show');
        const left = rect.left - (popperElement.nativeElement.offsetWidth / 2 - rect.width / 2);
        this.renderer.setStyle(popperElement.nativeElement, 'transform', 'translate3d(' + left + 'px, ' + elementTop + 'px, 0)');
      },
      onUpdate: () => {
        const left = rect.left - (popperElement.nativeElement.offsetWidth / 2 - rect.width / 2);
        this.renderer.setStyle(popperElement.nativeElement, 'transform', 'translate3d(' + left + 'px, ' + elementTop + 'px, 0)');
      }
    });
  }

  destroyPopper() {
    if (!!this.popper) {
      this.popper.destroy();
      this.popper = null;
      this.renderer.removeClass(this.popperElement.nativeElement, 'show');
    }
  }
}
