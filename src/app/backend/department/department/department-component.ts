import { User } from './../../../shared/models/user';
import { Department } from './../../../shared/models/department';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpService } from '../../../core/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../../core/services/message.service';
import { StateService } from '../../../core/services/state.service';
import { FormControl } from '@angular/forms';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { Roles } from '../../../shared/enums/roles-enum';
import { BackComponent } from '../../../shared/components/back/back-component';
import { Header } from '../../../shared/models/header';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentEditComponent } from '../department-edit/department-edit-component';
import { UserFilterComponent } from '../../user/user-filter/user-filter-component';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm-component';

@Component({
  selector: 'app-department-component',
  imports: [...SharedBackend, ...SharedImports, BackComponent],
  templateUrl: './department-component.html',
  styleUrl: './department-component.scss',
})
export class DepartmentComponent implements OnInit, OnDestroy {
  private http = inject(HttpService);
  private message = inject(MessageService);
  private stateService = inject(StateService);
  private dialog = inject(MatDialog);

  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  private unsubscribe$ = new Subject<void>();

  loading = false;
  allUDepartments: Department[] = [];
  filteredDepartments: Department[] = [];
  paginatedDepartments: Department[] = [];

  totalLength = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [6, 10, 15, 20];
  pageSize = this.pageSizeOptions[0];
  searchKeyword = new FormControl('');

  roles = Roles;
  user!: User;
  loader = false;

  constructor() {
    this.stateService.setHeader(
      new Header(
        'GESTION DES DIRECTIONS',
        'Liste des toutes les directions',
        'event_seat'
      )
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.onGet();
    this.setupSearch();
  }

  onGet(): void {
    this.loading = true;
    this.http.url = `departments`;
    this.unsubscribe$.next();
    this.http
      .get<Department[]>()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.allUDepartments = data;
          this.filteredDepartments = data;
        },
        error: (err) => {
          this.loading = false;
          this.message.openSnackBar(err, 'Fermer', 800);
        },
        complete: () => {
          this.loading = false;
          this.totalLength = this.filteredDepartments.length;
          this.updatePaginated();
        },
      });
  }

  setupSearch(): void {
    this.searchKeyword.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.applyFilter(value);
      });
  }

  applyFilter(filterValue: string | null): void {
    const keyword = filterValue ? filterValue.toLowerCase().trim() : '';
    this.filteredDepartments = this.allUDepartments.filter((department) =>
      department.designation.toLowerCase().includes(keyword)
    );

    this.totalLength = this.filteredDepartments.length;
    this.currentPage = 0;
    this.updatePaginated();
  }

  updatePaginated() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDepartments = this.filteredDepartments.slice(
      startIndex,
      endIndex
    );
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginated();
  }

  onAddDialog(department?: Department) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Ajouter une direction`, department, target: 'add' };

    //conf.minWidth = this.xSmallOrSmall() ? '96vw' : '60vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(DepartmentEditComponent, conf);
    dialogRef.afterClosed().subscribe((department: Department) => {
      if (department) {
        this.allUDepartments.push(department);
        this.applyFilter(this.searchKeyword.value);
      }
    });
  }

  onUpdateDialog(department?: Department) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Modifier une direction`, department, target: 'edit' };

    //conf.minWidth = this.xSmallOrSmall() ? '96vw' : '60vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(DepartmentEditComponent, conf);
    dialogRef.afterClosed().subscribe((department: Department) => {
      if (department) {
        const index = this.filteredDepartments.findIndex(
          (dep) => dep.id === department.id
        );
        if (index !== -1) {
          this.filteredDepartments[index] = department;
          this.updatePaginated();
        }
      }
    });
  }

  onAsignDir(department: Department) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Rechercher un utilisateur` };
    conf.minWidth = this.xSmallOrSmall() ? '96vw' : '57vw';
    const dialogRef = this.dialog.open(UserFilterComponent, conf);
    dialogRef.afterClosed().subscribe((user: User) => {
      this.openQuestion(department, user);
    });
  }
   openQuestion(department: Department, user: User): void {
      const dialogRef = this.dialog.open(ConfirmComponent, {
        data: {
          message: `Souhaitez-vous vraiment associer  ${user.full_name} comme ${department.designation} ?`,
          buttonText: { ok: 'Oui', cancel: 'Non' },
        },
      });

      dialogRef.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.loader = true;
          this.http.url = `users/${department.id}/dir`;
          this.http.update({director_id: user.id}).subscribe({
            next: (data: any) => {
            },
            error: () => {
              this.loader = false;
              this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
            },
            complete: () => {
              this.loader = false;
              this.onGet();
              this.message.openSnackBar(`Opération effectuée avec succès !`, 'Fermer', 4000);
            },
          });
        }
      });
    }
}
