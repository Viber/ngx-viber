import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { VbrTranslateService, VbrLanguageInfoService } from '@viberlab/translate';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'vbr-languages-switch',
  templateUrl: './languages-switch.component.html',
  styleUrls: ['./languages-switch.component.scss'],
})

export class VbrLanguagesSwitchComponent implements OnInit, OnDestroy {

  public currLang: FormControl = new FormControl();

  private onDestroy$: Subject<any> = new Subject();

  constructor(
    public languagesService: VbrLanguageInfoService,
    private translate: TranslateService,
    private vbrTranslate: VbrTranslateService
  ) {
  }

  ngOnInit() {

    this.translate.onLangChange
      .pipe(
        takeUntil(this.onDestroy$),
        map((lang: LangChangeEvent) => lang.lang),
        startWith(this.translate.currentLang),
        distinctUntilChanged()
      )
      .subscribe((lang: string) => {
        const viberLanguage = this.languagesService.getLanguage(lang);
        console.log(viberLanguage, lang);
        this.currLang.setValue(viberLanguage, {emitEvent: false});
      });

    this.currLang.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        distinctUntilChanged()
      )
      .subscribe(lang => this.vbrTranslate.setLanguage(lang.code));
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }
}

















































