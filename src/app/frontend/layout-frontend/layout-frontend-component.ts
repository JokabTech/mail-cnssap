import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SharedImports } from '../../shared/imports/shared-imports';
import { LayoutImports } from '../../shared/imports/layout-imports';

@Component({
  selector: 'app-layout-frontend-component',
  imports: [...SharedImports, ...LayoutImports],
  templateUrl: './layout-frontend-component.html',
  styleUrl: './layout-frontend-component.scss'
})
export class LayoutFrontendComponent {
  toggle = false;
  switch = false;
  darkClass = 'dark-mode';

  currentScreenSize!: string;
  XSmallOrSmall = false;

  destroyed = new Subject<void>();

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  //authentication!: Authentication;

  constructor(
    //public stateService: StateService,
    //private theme: ThemeService,
    // private http: HttpService,
  ) {
    if (sessionStorage.getItem('authentication')) {
      // this.authentication = JSON.parse(<string>sessionStorage.getItem('authentication'));
      //this.http.authentication = this.authentication;
    }
    inject(BreakpointObserver)
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
            this.XSmallOrSmall = this.currentScreenSize === 'XSmall' || this.currentScreenSize === 'Small';
            //this.stateService.setXSmallOrSmall(this.XSmallOrSmall);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onSwitch() {
    this.switch = !this.switch;
    document.body.classList.toggle('dark-mode');
    //this.stateService.setState(this.switch);
  }
}
