import { Roles } from './../../shared/enums/roles-enum';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StateService } from '../../core/services/state.service';
import { SharedImports } from '../../shared/imports/shared-imports';
import { LayoutImports } from '../../shared/imports/layout-imports';
import { Authentication } from '../../shared/models/authentication';
import { HttpService } from '../../core/services/http.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-layout-backend-component',
  imports: [...SharedImports, ...LayoutImports],
  templateUrl: './layout-backend-component.html',
  styleUrl: './layout-backend-component.scss'
})
export class LayoutBackendComponent {
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
  roles: string[] = [];
  roleLabel = '';

  constructor(
    private stateService: StateService,
    private http: HttpService
  ) {
    if (sessionStorage.getItem('authentication')) {
      this.authentication = JSON.parse(<string>sessionStorage.getItem('authentication'));
      this.http.authentication = this.authentication;
      const helper = new JwtHelperService();
      this.http.roles = helper.decodeToken(this.authentication.authorization).scope;
      this.http.role = helper.decodeToken(this.authentication.authorization).scope;
      this.roles = this.http.roles.split(' ');
      this.buildRoles();
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
  }

  onSwitch() {
    this.switch = !this.switch;
    document.body.classList.toggle('dark-mode');
    this.stateService.setState(this.switch);
  }

  buildRoles() {
    if (sessionStorage.getItem('role')) {
      let role = <string>sessionStorage.getItem('role');
      this.onChangeRole(role);
    } else {
      if (this.http.roles.includes(Roles.DIRECTOR)) {
        this.onChangeRole(Roles.DIRECTOR)
      } else if (this.http.roles.includes(Roles.SENIOR_ASSISTANT)) {
        this.onChangeRole(Roles.SENIOR_ASSISTANT)
      } else if (this.http.roles.includes(Roles.ADMIN_ASSISTANT)) {
        this.onChangeRole(Roles.ADMIN_ASSISTANT)
      } else if (this.http.roles.includes(Roles.MAIL_ARCHIVES_AGENT)) {
        this.onChangeRole(Roles.MAIL_ARCHIVES_AGENT)
      } else if (this.http.roles.includes(Roles.EXECUTIVE_SECRETARY)) {
        this.onChangeRole(Roles.EXECUTIVE_SECRETARY)
      } else {
        this.onChangeRole(Roles.AGENT)
      }
    }
  }

  buildRoleName(role: string) {
    switch (role) {
      case Roles.DIRECTOR:
        return 'Directeur'
      case Roles.SENIOR_ASSISTANT:
        return 'Assistant Principal'
      case Roles.ADMIN_ASSISTANT:
        return 'Assistant Administratif'
      case Roles.MAIL_ARCHIVES_AGENT:
        return 'Agent Courrier et Archive'
      case Roles.EXECUTIVE_SECRETARY:
        return 'Secrétaire de direction'
      default:
        return 'Agent'
    }
  }

  onChangeRole(role: string) {
    this.stateService.setRole(role)
    this.roleLabel = this.buildRoleName(role);
    sessionStorage.setItem('role', role);
  }

}
