import {
  Injectable,
  InjectionToken,
} from '@angular/core';

export function windowFactory() {
  return window;
}

export function documentFactory() {
  return document;
}

export const WINDOW = new InjectionToken('WINDOW', {providedIn: 'root', factory: windowFactory});
export const DOCUMENT = new InjectionToken('DOCUMENT', {providedIn: 'root', factory: documentFactory});

@Injectable()
export class WindowWrapper extends Window {
}

@Injectable()
export class DocumentWrapper extends Document {
}
