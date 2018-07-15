import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { VbrImageEditModule } from '../../projects/vbr-image-edit/src/lib/vbr-image-edit.module';
import { VbrImageEditComponent } from '../../projects/vbr-image-edit/src/lib/vbr-image-edit.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        VbrImageEditModule
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
