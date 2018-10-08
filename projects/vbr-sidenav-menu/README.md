# VbrSideNavMenu

## @viberlab/sidenav-menu

## vbr-sidenav-menu component

Installation:

```bash
npm i @viberlab/sidenav-menu
```

Usage:

Import in your module:

```typescript
@NgModule({
  ...
  imports: [
    VbrSidenavMenuModule
  ]
  ...
  }
)
```

Component:
```typescript
@Component({
  selector: 'mySidebar',
  templateUrl: './my-sidebar.component.html',
})

export class MySidebar {
  // section is Observable implementing Array<VbrSidenavMenuSection>
  public sections: Observable<Array<VbrSidenavMenuSection>> = [
    {
      name: 'System Management', // Static menu element name
      permissions: [DocumentAdminGuard], // DocumentAdminGuard used to decide to show this menu element or not
      type: 'heading', // Type of the element, in this case it is 'heading' means it can have nested elements
      // Array of nested elements (sub menu)
      children: [
        {
          name: 'Users', // Static sub-menu name
          type: 'link', // Anular route link
          icon: 'people_outline', // Icon to use
          state: ['/security', 'users-list'] // Static, used for routerLink
        },
        {
          name: this.translate.get('security.group'), // Example of observable for the name 
          type: 'link',
          icon: 'security',
          state: of(['/security', 'groups-list']) // Observable as data for routerLink
        },
      ]
    }
   ];
}
```

View:

```angular2html
<vbr-sidenav-menu [sections]="sections"></vbr-sidenav-menu>
```

