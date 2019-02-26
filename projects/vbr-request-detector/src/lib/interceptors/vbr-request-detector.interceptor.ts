import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { VbrProcessStatusService } from '../serives/vbr-process-status.service';

@Injectable()
export class VbrRequestDetectorInterceptor implements HttpInterceptor {

  constructor(private progressStatusService: VbrProcessStatusService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const process = this.progressStatusService.start();
    return next.handle(req)
      .pipe(
        finalize(() => process.stop())
      );
  }
}
