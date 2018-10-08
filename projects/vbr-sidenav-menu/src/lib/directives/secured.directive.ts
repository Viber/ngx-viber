import {
  AfterViewInit, ChangeDetectorRef,
  Directive,
  HostBinding,
  InjectionToken,
  Injector,
  Input
} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { from, of, zip } from 'rxjs';

@Directive({
  selector: '[VbrSidenavHideSecured]',
})
export class VbrHideSecureDirective implements AfterViewInit {
  @HostBinding('hidden')
  hideRouterLink: boolean = true;

  @Input('VbrSidenavHideSecured') guards: Array<InjectionToken<any>> | boolean;

  constructor(private injector: Injector, private _ref: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    // Provided with empty array or value is null or undefined
    if (Array.isArray(this.guards) && !this.guards.length || null == this.guards) {
      return this.setHidden(false);
    }

    if ('boolean' === typeof this.guards) {
      return this.setHidden(!!this.guards);
    }

    zip(
      ...this.guards.map((name) => {
        const guard: any = this.injector.get(name, 'notFound');
        if ('string' === typeof guard) {
          console.error('Guard ' + name + ' not found.');
          return of(false);
        }

        if ('function' !== typeof guard.canActivate) {
          console.error('Provided Guard ' + name + ' is not implementing CanActivate');
          return of(false);
        }

        const result = guard.canActivate(this.injector.get(ActivatedRouteSnapshot, null), this.injector.get(RouterStateSnapshot, null));
        return 'boolean' === typeof result ? of(result) : from(result);
      })
    )
      .subscribe(results => {
        this.setHidden(!results.reduce((a, b) => a || b));
      });
  }

  private setHidden(hidden: boolean) {
    setTimeout(() => {
      this.hideRouterLink = hidden;
      this._ref.markForCheck();
    }, 0);
  }
}
