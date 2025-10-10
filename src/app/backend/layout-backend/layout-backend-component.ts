import { Roles } from './../../shared/enums/roles-enum';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StateService } from '../../core/services/state.service';
import { SharedImports } from '../../shared/imports/shared-imports';
import { LayoutImports } from '../../shared/imports/layout-imports';
import { Authentication } from '../../shared/models/authentication';
import { HttpService } from '../../core/services/http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { RoleService } from '../../core/services/role-service';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-layout-backend-component',
  imports: [...SharedImports, ...LayoutImports],
  templateUrl: './layout-backend-component.html',
  styleUrl: './layout-backend-component.scss'
})
export class LayoutBackendComponent implements OnDestroy {
  private stateService = inject(StateService);
  private http = inject(HttpService);
  private router = inject(Router);
  private unsubscribe$ = new Subject<void>();
  private message = inject(MessageService);

  public roleService = inject(RoleService);

  toggle = false;
  switch = false;

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

  authentication!: Authentication;
  header = computed(() => this.stateService.header());
  roleLabel = '';

  constructor() {
    if (sessionStorage.getItem('authentication')) {
      this.authentication = JSON.parse(<string>sessionStorage.getItem('authentication'));
      this.http.authentication = this.authentication;
      const helper = new JwtHelperService();
      //this.http.roles = helper.decodeToken(this.authentication.authorization).scope;
      this.http.role = helper.decodeToken(this.authentication.authorization).scope;
      this.roleLabel = this.roleService.build(this.http.role);
      //this.roles = this.http.roles.split(' ');
      this.stateService.setRole(this.http.role);
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
            this.stateService.setXSmallOrSmall(this.XSmallOrSmall);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSwitch() {
    this.switch = !this.switch;
    document.body.classList.toggle('dark-mode');
    this.stateService.setState(this.switch);
  }

  onChangeRole(name: string) {
    this.unsubscribe$.next();
    this.http.url = `auth/switch-role`;
    this.http.save({ name }).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data: any) => {
        sessionStorage.setItem('authentication', JSON.stringify(data));
        this.http.authentication = data;
        this.http.role = name;
        this.roleLabel = this.roleService.build(this.http.role);
        this.stateService.setRole(name)
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => { },
    });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/');
  }

}
