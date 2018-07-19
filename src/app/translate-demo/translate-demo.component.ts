import { Component, } from '@angular/core';
import { interval, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'translate-demo',
  templateUrl: './translate-demo.component.html'
})
export class VbrTranslateDemoComponent {

  public paramName = 'start.parameter';

  private data: any = {super: 'Initial'};

  constructor(public translate: TranslateService) {
    this.translate.use('en');
  }

  changeLanguage() {
    this.translate.use(this.translate.currentLang === 'en' ? 'ru' : 'en');
  }

  newKey() {
    this.paramName = this.paramName === 'start.end' ? 'start.parameter' : 'start.end';
  }

  observableEmitter() {
    this.data = interval(1000).pipe(
      map(() => {
        return [
          {super: 'YES'},
          {super: 'NO'},
          {super: 'MAYBE'}
        ][Math.floor(Math.random() * 3)];
      })
    );
  }

  observable() {
    this.data = of({super: 'Once emitted observable'});
  }

  otherEmitter() {
    this.data = {super: 'Other'};
  }


  getParameter() {
    return this.data;
  }
}
