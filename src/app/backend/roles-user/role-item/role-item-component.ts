import { Component, computed, Input, OnInit } from '@angular/core';
import { User } from '../../../shared/models/user';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { Subject, takeUntil } from 'rxjs';
import { Role } from '../../../shared/models/role';
import { StateService } from '../../../core/services/state.service';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-role-item-component',
  imports: [...SharedBackend, ...SharedImports, FormsModule],
  templateUrl: './role-item-component.html',
  styleUrl: './role-item-component.scss'
})
export class RoleItemComponent implements OnInit{
  private unsubscribe$ = new Subject<void>();
  @Input() roleBdd!: string;
  @Input() roleLabel!: string;
  @Input() roleDescription!: string;
  @Input() user!: User;
  @Input() isAccountActive!: boolean;
  @Input() start = false;
  loader = false;
  disable!: boolean;

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  constructor(
    private http: HttpService,
    private message: MessageService,
    private stateService: StateService
  ) {
  }

  ngOnInit(): void {
    this.disable = this.hasRole(this.roleBdd);
  }

  public hasRole(roleName: string): boolean {
    return this.user.roles.some(role => role.name === roleName);
  }

  public onToggleChange() {
    if (!this.disable) {
      this.addRoleToUser();
    } else {
      this.removeRoleFromUser();
    }
  }

  private addRoleToUser() {
    this.loader = true;
    this.http.url = `users/${this.user.id}/roles/${this.roleBdd}`;
    this.unsubscribe$.next();
    this.http.update(null).pipe(takeUntil(this.unsubscribe$)).subscribe({
      error: err => {
        this.loader = true;
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.loader = false;
        this.disable = true;
        this.user.roles.push(new Role(undefined, this.roleBdd));
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.message.openSnackBar("Le rôle a été attribué avec succès", 'Fermer', 4000);
      }
    });
  }

  private removeRoleFromUser() {
    this.loader = true;
    this.http.url = `users/${this.user.id}/roles/${this.roleBdd}`;
    this.unsubscribe$.next();
    this.http.delete().pipe(takeUntil(this.unsubscribe$)).subscribe({
      error: err => {
        this.loader = false;
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.loader = false;
        this.disable = false;
        const index = this.user.roles.findIndex(r => r.name === this.roleBdd);
        if (index !== -1) {
          this.user.roles.splice(index, 1);
        }
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.message.openSnackBar("Le rôle a été retiré avec succès", 'Fermer', 4000);
      }
    });
  }
}
