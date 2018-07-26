import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbrTooltipComponent } from './vbr-tooltip.component';
import { TemplateRef } from '@angular/core';

describe('VbrTooltipComponent', () => {
  let component: VbrTooltipComponent<any>;
  let fixture: ComponentFixture<VbrTooltipComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VbrTooltipComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbrTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have property `content`', async(() => {
    fixture = TestBed.createComponent(VbrTooltipComponent);
    component = fixture.debugElement.componentInstance;
    expect(component.content).toBeDefined();
  }));
});
