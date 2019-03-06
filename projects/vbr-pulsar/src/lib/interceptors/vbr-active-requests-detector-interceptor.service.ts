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
  VbrPulsarService,
} from '../serives/vbr-pulsar.service';

@Injectable()
export class VbrActiveRequestsDetectorInterceptor implements HttpInterceptor {

  constructor(private progressStatusService: VbrPulsarService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        rxjsVbrProcess(this.progressStatusService),
      );
  }
}
