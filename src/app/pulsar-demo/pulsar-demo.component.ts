import {
  Component,
  OnInit,
} from '@angular/core';
import {
  rxjsVbrPulsar,
  VbrPulsarService,
} from '../../../projects/vbr-pulsar/src/lib/serives/vbr-pulsar.service';
import {
  from,
  of,
} from 'rxjs';
import {
  delay,
  mergeMap,
} from 'rxjs/operators';

@Component({
  selector: 'pulsar-demo',
  templateUrl: './pulsar-demo.component.html',
})
export class VbrPulsarDemoComponent implements OnInit {

  constructor(public service: VbrPulsarService) {
  }

  public ngOnInit(): void {
    const streams = ['a', 'b', 'c'];

    from([0, 1, 2, 3, 4, 5, 6, 7, 8])
      .pipe(
        mergeMap((wait) => of(wait)
          .pipe(
            delay(wait * 1000),
            rxjsVbrPulsar(this.service, streams[Math.floor(Math.random() * Math.floor(3))]),
          )),
      )
      .subscribe();
  }

  public get() {
    return of('result')
      .pipe(
        delay(5000),
        // Set default process as active on subscribe and deactivate the moment observable resolved or error throwed
        rxjsVbrPulsar(this.service),
      );
  }

  public manual() {
    this.service.isActive('first');
    // Create and start process
    const process = this.service.start('new activity');
    // Deactivate after 5 seconds
    setTimeout(() => {
      // Stop process
      process.stop();
    }, 5000);
  }
}
