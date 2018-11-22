import { Observable } from 'rxjs';

export interface VbrSidenavMenuSectionChild {
  name: Observable<string> | string;
  icon?: Observable<string> | string;
  type: string;
  permissions?: Array<any>; // Array of Guards implementing CanActivate
  state?: Observable<Array<any> | string> | Array<any> | string; // Observable data for [routerLink] used in <a>
  href?: Observable<string | Object> | string; // Observable data for [href]
}

export interface VbrSidenavMenuSection extends VbrSidenavMenuSectionChild {
  className?: string;
  hidden?: boolean;
  children?: VbrSidenavMenuSectionChild[];
}
