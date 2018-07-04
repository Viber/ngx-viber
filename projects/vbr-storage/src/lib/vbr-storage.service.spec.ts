import { TestBed, inject } from '@angular/core/testing';
import { VbrStorageModule } from './vbr-storage.module';
import { VbrLocalStorageService, VbrSessionStorageService } from './vbr-storage.service';
import { VBR_WINDOW } from './constants';

const prefix: string = 'test-';

describe('VbrLocalStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        VbrStorageModule.forRoot({prefix: prefix && prefix.slice(0, -1)})
      ],
      providers: [
        {provide: VBR_WINDOW, useValue: 'undefined' !== typeof window && window || {}}
      ]
    });
  });

  it('VbrLocalStorageService should be created',
    inject([VbrLocalStorageService], (service: VbrLocalStorageService) => {
      expect(service).toBeTruthy();
    }));

  it('VbrLocalStorageService: store',
    inject([VbrLocalStorageService, VBR_WINDOW], (service: VbrLocalStorageService, vbrWindow: Window) => {
      service.store('LocalStorageService_store', '1234567890');
      expect(vbrWindow.localStorage.getItem(prefix + 'LocalStorageService_store')).toBe('{"value":"1234567890"}');
    }));

  it('VbrLocalStorageService: retrieve',
    inject([VbrLocalStorageService, VBR_WINDOW], (service: VbrLocalStorageService, vbrWindow: Window) => {
      vbrWindow.localStorage.setItem(prefix + 'LocalStorageService_retrieve', '{"value":"1234567890"}');
      expect(service.retrieve('LocalStorageService_retrieve')).toBe('1234567890');
    }));

  it('VbrLocalStorageService: clear by key',
    inject([VbrLocalStorageService, VBR_WINDOW], (service: VbrLocalStorageService, vbrWindow: Window) => {
      vbrWindow.localStorage.setItem(prefix + 'LocalStorageService_clear', '{"value":"1234567890"}');
      vbrWindow.localStorage.setItem(prefix + 'LocalStorageService_not_clear', '{"value":"1234567890"}');
      service.clear('LocalStorageService_clear');
      expect(vbrWindow.localStorage.getItem(prefix + 'LocalStorageService_clear')).toBeNull();
      expect(vbrWindow.localStorage.getItem(prefix + 'LocalStorageService_not_clear')).toBe('{"value":"1234567890"}');
    }));

  it('VbrLocalStorageService: clear all',
    inject([VbrLocalStorageService, VBR_WINDOW], (service: VbrLocalStorageService, vbrWindow: Window) => {
      vbrWindow.localStorage.setItem(prefix + 'LocalStorageService_clear1', '{"value":"1234567890"}');
      vbrWindow.localStorage.setItem(prefix + 'LocalStorageService_clear2', '{"value":"1234567890"}');
      service.clear();
      expect(vbrWindow.localStorage.getItem(prefix + 'LocalStorageService_clear1')).toBeNull();
      expect(vbrWindow.localStorage.getItem(prefix + 'LocalStorageService_clear2')).toBeNull();
    }));

  it('VbrLocalStorageService: observe',
    inject([VbrLocalStorageService], (service: VbrLocalStorageService) => {
      service.observe('LocalStorageService_observe')
        .subscribe(e => expect(e).toBe('{"value":"1234567890"}'));
      service.store('LocalStorageService_observe', '{"value":"1234567890"}');
    }));

  afterEach(() => TestBed.get(VBR_WINDOW).localStorage.clear());
});

describe('VbrSessionStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        VbrStorageModule.forRoot({prefix: prefix && prefix.slice(0, -1)})
      ],
      providers: [
        {provide: VBR_WINDOW, useValue: 'undefined' !== typeof window && window}
      ]
    });
  });

  it('VbrSessionStorageService should be created',
    inject([VbrSessionStorageService], (service: VbrSessionStorageService) => {
      expect(service).toBeTruthy();
    }));

  it('VbrSessionStorageService: store',
    inject([VbrSessionStorageService, VBR_WINDOW], (service: VbrSessionStorageService, vbrWindow: Window) => {
      service.store('SessionStorageService_store', '1234567890');
      expect(vbrWindow.sessionStorage.getItem(prefix + 'SessionStorageService_store')).toBe('{"value":"1234567890"}');
    }));

  it('VbrSessionStorageService: retrieve',
    inject([VbrSessionStorageService, VBR_WINDOW], (service: VbrSessionStorageService, vbrWindow: Window) => {
      vbrWindow.sessionStorage.setItem(prefix + 'SessionStorageService_retrieve', '{"value":"1234567890"}');
      expect(service.retrieve('SessionStorageService_retrieve')).toBe('1234567890');
    }));

  it('VbrSessionStorageService: clear by key',
    inject([VbrSessionStorageService, VBR_WINDOW], (service: VbrSessionStorageService, vbrWindow: Window) => {
      vbrWindow.sessionStorage.setItem(prefix + 'SessionStorageService_clear', '{"value":"1234567890"}');
      vbrWindow.sessionStorage.setItem(prefix + 'SessionStorageService_not_clear', '{"value":"1234567890"}');
      service.clear('SessionStorageService_clear');
      expect(vbrWindow.sessionStorage.getItem(prefix + 'SessionStorageService_clear')).toBeNull();
      expect(vbrWindow.sessionStorage.getItem(prefix + 'SessionStorageService_not_clear')).toBe('{"value":"1234567890"}');
    }));

  it('VbrSessionStorageService: clear all',
    inject([VbrSessionStorageService, VBR_WINDOW], (service: VbrSessionStorageService, vbrWindow: Window) => {
      vbrWindow.sessionStorage.setItem(prefix + 'SessionStorageService_clear1', '{"value":"1234567890"}');
      vbrWindow.sessionStorage.setItem(prefix + 'SessionStorageService_clear2', '{"value":"1234567890"}');
      service.clear();
      expect(vbrWindow.sessionStorage.getItem(prefix + 'SessionStorageService_clear1')).toBeNull();
      expect(vbrWindow.sessionStorage.getItem(prefix + 'SessionStorageService_clear2')).toBeNull();
    }));

  it('VbrSessionStorageService: observe',
    inject([VbrSessionStorageService], (service: VbrSessionStorageService) => {
      service.observe('SessionStorageService_observe')
        .subscribe(e => expect(e).toBe('{"value":"1234567890"}'));
      service.store('SessionStorageService_observe', '{"value":"1234567890"}');
    }));

  afterEach(() => TestBed.get(VBR_WINDOW).sessionStorage.clear());
});
