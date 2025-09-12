import { Component, computed } from '@angular/core';
import { SharedImports } from '../../shared/imports/shared-imports';
import { SharedBackend } from '../../shared/imports/shared-backend-imports';
import { User } from '../../shared/models/user';
import { StateService } from '../../core/services/state.service';
import { Header } from '../../shared/models/header';
import { HttpService } from '../../core/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { FormsModule } from '@angular/forms';
import { RoleItemComponent } from "./role-item/role-item-component";

@Component({
  selector: 'app-roles-user-component',
  imports: [...SharedBackend, ...SharedImports, FormsModule, RoleItemComponent],
  templateUrl: './roles-user-component.html',
  styleUrl: './roles-user-component.scss'
})
export class RolesUserComponent {
  private unsubscribe$ = new Subject<void>();

  user!: User;
  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  roleStates: { [key: string]: boolean } = {};

  isAccountActive!: boolean;
  is_admin = false;
  loader = false;

  constructor(
    private stateService: StateService,
    private http: HttpService,
    private message: MessageService
  ) {
    this.user = JSON.parse(<string>sessionStorage.getItem('user'));
    this.stateService.setHeader(new Header(this.user.full_name.toUpperCase(), `${this.user.roles.length} rôle(s) attribué(s) à cet utilisateur`, 'home'));
    this.isAccountActive = this.user.is_active;
  }

  onAccountStatusClick() {
    this.isAccountActive = !this.isAccountActive;
    this.toggleAccountStatus();
  }

  toggleAccountStatus() {
    this.http.url = `users/${this.user.id}/toggle-status`;
    this.http.update(null).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: () => {
        this.user.is_active = !this.user.is_active;
      },
      error: err => {
        this.message.openSnackBar(err, 'Fermer', 4000);
        this.isAccountActive = !this.isAccountActive;
      },
      complete: () => {
        this.message.openSnackBar('Le statut du compte a été mis à jour avec succès.', 'Fermer', 4000);
      }
    });
  }
}
