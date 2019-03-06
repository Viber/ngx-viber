import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {
  rxjsVbrPulsar,
  VbrPulsarService,
} from '../serives/vbr-pulsar.service';

@Injectable()
export class VbrActiveRequestsDetectorInterceptor implements HttpInterceptor {

  constructor(private pulsarService: VbrPulsarService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        rxjsVbrPulsar(this.pulsarService),
      );
  }
}
