import { Department } from './../../../shared/models/department';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpService } from '../../../core/services/http.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../../core/services/message.service';
import { StateService } from '../../../core/services/state.service';
import { FormControl } from '@angular/forms';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { Roles } from '../../../shared/enums/roles-enum';
import { BackComponent } from "../../../shared/components/back/back-component";
import { Header } from '../../../shared/models/header';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Function } from '../../../shared/models/function';
import { FunctionEditComponent } from '../function-edit/function-edit-component';

@Component({
  selector: 'app-function-component',
  imports: [...SharedBackend, ...SharedImports, BackComponent],
  templateUrl: './function-component.html',
  styleUrl: './function-component.scss'
})
export class FunctionComponent implements OnInit, OnDestroy {
  private http = inject(HttpService);
  private message = inject(MessageService);
  private stateService = inject(StateService);
  private dialog = inject(MatDialog);

  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  private unsubscribe$ = new Subject<void>();

  loading = false;
  allUFunctions: Function[] = [];
  filteredFunctions: Function[] = [];
  paginatedFunctions: Function[] = [];

  totalLength = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [6, 10, 15, 20];
  pageSize = this.pageSizeOptions[0];
  searchKeyword = new FormControl('');

  roles = Roles;

  constructor() {
    this.stateService.setHeader(new Header('GESTION DES FONCTIONS', 'Liste des toutes les fonctions', 'work_outline'));
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
    this.http.url = `functions`;
    this.unsubscribe$.next();
    this.http.get<Function[]>().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.allUFunctions = data;
        this.filteredFunctions = data;
      },
      error: (err) => {
        this.loading = false;
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
        this.loading = false;
        this.totalLength = this.filteredFunctions.length;
        this.updatePaginated();
      },
    });
  }

  setupSearch(): void {
    this.searchKeyword.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
        this.applyFilter(value);
      });
  }

  applyFilter(filterValue: string | null): void {
    const keyword = filterValue ? filterValue.toLowerCase().trim() : '';
    this.filteredFunctions = this.allUFunctions.filter(f =>
      f.designation.toLowerCase().includes(keyword)
    );

    this.totalLength = this.filteredFunctions.length;
    this.currentPage = 0;
    this.updatePaginated();
  }

  updatePaginated() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFunctions = this.filteredFunctions.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginated();
  }

  onAddDialog(f?: Function) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Ajouter une fonction`, function: f, target: 'add' };

    //conf.minWidth = this.xSmallOrSmall() ? '96vw' : '60vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(FunctionEditComponent, conf);
    dialogRef.afterClosed().subscribe((department: Department) => {
      if (department) {
        this.allUFunctions.push(department);
        this.applyFilter(this.searchKeyword.value);
      }
    });
  }

  onUpdateDialog(f?: Function) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Modifier une fonction`, function: f, target: 'edit' };

    //conf.minWidth = this.xSmallOrSmall() ? '96vw' : '60vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(FunctionEditComponent, conf);
    dialogRef.afterClosed().subscribe((department: Department) => {
      if (department) {
        const index = this.filteredFunctions.findIndex(f => f.id === department.id);
        if (index !== -1) {
          this.filteredFunctions[index] = department;
          this.updatePaginated();
        }
      }
    });
  }
}
