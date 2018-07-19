import { TestBed, inject } from '@angular/core/testing';

import { VbrTooltipService } from './vbr-tooltip.service';

describe('VbrTooltipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VbrTooltipService]
    });
  });

  it('should be created', inject([VbrTooltipService], (service: VbrTooltipService) => {
    expect(service).toBeTruthy();
  }));
});
