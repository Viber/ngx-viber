import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VbrImageEditComponent } from './vbr-image-edit.component';

describe('VbrImageEditComponent', () => {
  let component: VbrImageEditComponent;
  let fixture: ComponentFixture<VbrImageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VbrImageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VbrImageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
