import { Department } from './../../shared/models/department';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { SharedBackend } from '../../shared/imports/shared-backend-imports';
import { StateService } from '../../core/services/state.service';
import { SharedImports } from '../../shared/imports/shared-imports';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../shared/models/user';
import { PageEvent } from '@angular/material/paginator';
import { HttpService } from '../../core/services/http.service';
import { MessageService } from '../../core/services/message.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Header } from '../../shared/models/header';
import { Function } from '../../shared/models/function';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserEditComponent } from './user-edit/user-edit-component';

@Component({
  selector: 'app-users-component',
  imports: [...SharedBackend, ...SharedImports, FormsModule],
  templateUrl: './users-component.html',
  styleUrl: './users-component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  private http = inject(HttpService);
  private message = inject(MessageService);
  router = inject(Router);
  private dialog = inject(MatDialog);

  private stateService = inject(StateService);
  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  private unsubscribe$ = new Subject<void>();
  private unsubscribeD$ = new Subject<void>();
  private unsubscribeF$ = new Subject<void>();

  loading = false;
  users: User[] = [];
  paginatedUsers: User[] = [];

  totalLength = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 16];
  pageSize = this.pageSizeOptions[0];
  searchKeyword = new FormControl();

  form!: FormGroup;

  departments: Department[] = [];
  functions: Function[] = [];

  constructor() {
    this.stateService.setHeader(new Header('GESTION DES UTILISATEURS', `Liste de tous les utilisateurs du système et des personnes enregistrées.`, 'people'));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.onGet();
    this.findDepartment();
  }

  onGet(): void {
    this.loading = true;
    this.http.url = `users/with-roles`;
    this.unsubscribe$.next();
    this.http
      .get<User[]>()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.users = data;
        },
        error: (err) => {
          this.loading = false;
          this.message.openSnackBar(err, 'Fermer', 800);
        },
        complete: () => {
          this.loading = false;
          this.totalLength = this.users.length;
          this.updatePaginated();
        },
      });
  }

  findDepartment(): void {
    this.http.url = `departments`;
    this.unsubscribeD$.next();
    this.http.get<Department[]>().pipe(takeUntil(this.unsubscribeD$)).subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (err) => {
        this.loading = false;
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
      },
    });
  }

  findFunctions(): void {
    this.http.url = `functions`;
    this.unsubscribeF$.next();
    this.http.get<Function[]>().pipe(takeUntil(this.unsubscribeF$)).subscribe({
      next: (data) => {
        this.functions = data;
      },
      error: (err) => {
        this.loading = false;
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
      },
    });
  }

  updatePaginated() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  search() {
    if (!this.searchKeyword.value) {
      // Si le champ de recherche est vide, réinitialisez la pagination
      this.totalLength = this.users.length;
      this.updatePaginated();
      return;
    }

    // Filtrer les items selon le mot-clé de recherche et le champ dynamique
    this.paginatedUsers = this.users.filter(item =>
      item.full_name.toLowerCase().includes(this.searchKeyword.value.toLowerCase())
    );

    this.totalLength = this.paginatedUsers.length;
    //this.currentPage = 0;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginated();
  }

  onGoToUserRoles(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.router.navigateByUrl('/user/roles');
  }

  onDepartmentChange(user: User, event: Event): void {
    const department_id = (event.target as HTMLSelectElement).value;
    this.update(user, department_id);
  }

  update(user: User, department_id: string) {
    this.http.url = `users/${user.id}/department`;
    this.http.update({department_id}).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {

      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 100);
      },
      complete: () => {
        this.message.openSnackBar('Oparation effectuée avec succès', 'Fermer', 4000);
      },
    });
  }

 onAddDialog(user: User) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Modifier utilisateur`, user, target: 'update' };

    //conf.minWidth = this.xSmallOrSmall() ? '96vw' : '60vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(UserEditComponent, conf);
    dialogRef.afterClosed().subscribe((user: User) => {
      if (user) {
        this.onGet();
      }
    });
  }
}
