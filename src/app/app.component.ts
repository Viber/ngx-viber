import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TooltipTriggers } from '../../projects/vbr-tooltip/src/lib/vbr-tooltip.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  triggerer: BehaviorSubject<string> = new BehaviorSubject('');

  ngOnInit() {
    setTimeout(() => {
      this.triggerer.next(TooltipTriggers.destroy);
    }, 5000);
  }

  onClick() {
    console.log('Click');
  }
}
