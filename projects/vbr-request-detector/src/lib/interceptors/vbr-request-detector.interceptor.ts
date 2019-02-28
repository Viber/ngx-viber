import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {
  rxjsVbrProcess,
  VbrProcessStatusService,
} from '../serives/vbr-process-status.service';

@Injectable()
export class VbrRequestDetectorInterceptor implements HttpInterceptor {

  constructor(private progressStatusService: VbrProcessStatusService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        rxjsVbrProcess(this.progressStatusService),
      );
  }
}
