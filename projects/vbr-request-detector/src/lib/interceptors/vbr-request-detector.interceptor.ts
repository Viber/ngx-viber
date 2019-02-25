import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { VbrRequestDetectorService } from '../serives/vbr-request-detector.service';

@Injectable()
export class VbrRequestDetectorInterceptor implements HttpInterceptor {

  constructor(private progressBar: VbrRequestDetectorService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressBar.activate();
    return next.handle(req)
      .pipe(
        finalize(() => this.progressBar.deactivate())
      );
  }
}
