import { TestBed, inject } from '@angular/core/testing';
import { VbrImageEditService } from './vbr-image-edit.service';

describe('VbrImageEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VbrImageEditService]
    });
  });

  it('should be created', inject([VbrImageEditService], (service: VbrImageEditService) => {
    expect(service).toBeTruthy();
  }));

  it('VbrImageEditService: dataURItoBlob', inject([VbrImageEditService], (service: VbrImageEditService) => {
    const dataUri = '';
    expect(VbrImageEditService.dataURItoBlob(dataUri)).toBe(jasmine.any(Blob));
  }));
});
