import { Injectable, EventEmitter, Inject } from '@angular/core';
import { VBR_WINDOW, VBR_STORAGE_PREFIX } from './constants';
import { filter } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';

class InnerStorage implements Storage {
  private storage: Object = {};
  readonly length: number;

  [key: string]: any;
  [index: number]: string;

  setItem(key: string, data: any): void {
    this.storage[key] = data;
  }

  getItem(key: string): any {
    return this.storage[key];
  }

  removeItem(key: string): void {
    delete this.storage[key];
  }

  clear(): void {
    this.storage = {};
  }

  key(index: number): string {
    return '';
  }
}

export class StorageService {
  protected observers: Object = {};
  protected storageChange: Subject<string> = new Subject();

  constructor(protected storage: Storage, protected prefix: string) {
    this.storageChange.subscribe(key => {
      if (key in this.observers) {
        this.observers[key].emit(this.retrieve(key, true));
      }

      if (key === null) {
        Object.keys(this.observers).map(k => this.observers[k].emit(null));
      }
    });
  }

  store(key: string, value: any): void {
    key = this.prefix ? this.prefix + '-' + key : key;

    try {
      this.storage.setItem(key, JSON.stringify({value: value}));
      this.storageChange.next(key);
    } catch (e) {
      console.log('failed to store to storage', e);
    }
  }

  retrieve(key: string, withoutPrefix: boolean = false): any {
    key = this.prefix && !withoutPrefix ? this.prefix + '-' + key : key;

    try {
      return JSON.parse(this.storage.getItem(key)).value;
    } catch (e) {
      return null;
    }
  }

  clear(key?: string): void {
    if (key) {
      key = this.prefix ? this.prefix + '-' + key : key;
      this.storage.removeItem(key);
    } else {
      this.storage.clear();
    }

    this.storageChange.next(key || null);
  }

  observe(key: string): EventEmitter<any> {
    key = this.prefix ? this.prefix + '-' + key : key;

    if (!(key in this.observers)) {
      this.observers[key] = new EventEmitter();
    }
    return this.observers[key];
  }
}

@Injectable({
  providedIn: 'root',
})
export class VbrLocalStorageService extends StorageService {
  constructor(@Inject(VBR_WINDOW) vbrWindow: any, @Inject(VBR_STORAGE_PREFIX) prefix: string) {
    super((<Window>vbrWindow).localStorage, prefix);

    fromEvent(vbrWindow, 'storage')
      .pipe(
        filter((event: StorageEvent) => event.storageArea === this.storage && event.key in this.observers)
      )
      .subscribe((event: StorageEvent) => this.observers[event.key].emit(event.newValue));
  }
}

@Injectable({
  providedIn: 'root',
})
export class VbrSessionStorageService extends StorageService {
  constructor(@Inject(VBR_WINDOW) vbrWindow: any, @Inject(VBR_STORAGE_PREFIX) prefix: string) {
    super((<Window>vbrWindow).sessionStorage, prefix);

    fromEvent(vbrWindow, 'storage')
      .pipe(
        filter((event: StorageEvent) => event.storageArea === this.storage && event.key in this.observers)
      )
      .subscribe((event: StorageEvent) => this.observers[event.key].emit(event.newValue));
  }
}

@Injectable({
  providedIn: 'root',
})
export class VbrInternalStorageService extends StorageService {
  constructor(@Inject(VBR_STORAGE_PREFIX) prefix: string) {
    super(new InnerStorage(), prefix);
  }
}
