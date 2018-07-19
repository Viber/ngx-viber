import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbrTooltipComponent } from './vbr-tooltip.component';

describe('VbrTooltipComponent', () => {
  let component: VbrTooltipComponent;
  let fixture: ComponentFixture<VbrTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbrTooltipComponent ]
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
});
