import { Holiday } from './../../../shared/models/holiday';
import { LocalisationService } from './../../../core/services/localisation-service';
import { StateService } from './../../../core/services/state.service';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { RequestOptions } from '../../../shared/models/request-options';
import { Page } from '../../../shared/models/page';
import { HttpService } from '../../../core/services/http.service';
import { HttpParamsService } from '../../../core/services/http-params-service';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { BackComponent } from '../../../shared/components/back/back-component';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HolidayEditComponent } from '../holiday-edit/holiday-edit-component';
import { Header } from '../../../shared/models/header';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm-component';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-holiday-component',
  imports: [...SharedBackend, ...SharedImports, BackComponent],
  templateUrl: './holiday-component.html',
  styleUrl: './holiday-component.scss'
})
export class HolidayComponent implements OnInit, OnDestroy {
  protected http = inject(HttpService);
  private stateService = inject(StateService);
  public localisation = inject(LocalisationService);
  protected paramsService = inject(HttpParamsService);
  private dialog = inject(MatDialog);
  private message = inject(MessageService);

  private readonly destroy$ = new Subject<void>();
  private readonly holidaySearchTrigger$ = new Subject<RequestOptions>();

  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());


  public page!: Page<Holiday>;
  public loading = false;
  public error = null;

  totalLength = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [6, 10, 15, 20];
  pageSize = this.pageSizeOptions[0];

  searchKeyword = new FormControl('');


  constructor() {
    this.stateService.setHeader(new Header('CONFIGURATION DES JOURS FÉRIÉS', 'Ajouter, modifier et activer les jours fériés calendaires.', 'event_seat'));
    this.holidaySearchTrigger$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((options) => {
          this.loading = true;
          this.error = null;
          this.http.url = options.url;
          return this.http.get<Page<Holiday>>(options.params).pipe(finalize(() => (this.loading = false)));
        })
      )
      .subscribe({
        next: (data) => {
          this.page = data;
        },
        error: (err) => (this.error = err),
      });
  }

  ngOnInit(): void {
    this.find(this.paramsService.build('holidays', { page: 1, pageSize: 6 }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected find(requestOptions: RequestOptions): void {
    this.holidaySearchTrigger$.next(requestOptions);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }


  onAdd() {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `AJOUT D'UN NOUVEAU JOUR FÉRIÉ`, holiday: { is_fixed: true }, target: 'add' };

    conf.minWidth = this.xSmallOrSmall() ? '96vw' : '45vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(HolidayEditComponent, conf);
    dialogRef.afterClosed().subscribe((holiday: Holiday) => {
      if (holiday) {

      }
    });
  }

  onUpdate(holiday: Holiday) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `MODIFIER UN JOUR FÉRIÉ`, holiday, target: 'edit' };

    conf.minWidth = this.xSmallOrSmall() ? '96vw' : '45vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(HolidayEditComponent, conf);
    dialogRef.afterClosed().subscribe((holiday: Holiday) => {
      if (holiday) {
        const index = this.page.items.findIndex(item => item.id === holiday.id);
        if (index !== -1) {
          this.page.items[index] = holiday;
        }
      }
    });
  }

  onToogleStatus(holiday: Holiday) {
    const role = this.http.role;
    const target = holiday.is_active ? `Désactiver ${holiday.name}` : 'Activer';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: `Souhaitez-vous vraiment ${target} le jour férié ?`,
        buttonText: { ok: 'Oui', cancel: 'Non' },
      },
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.http.url = `holidays/${holiday.id}`;
        this.http.update({ is_active: !holiday.is_active }).subscribe({
          next: (data: any) => {
            const index = this.page.items.findIndex(item => item.id === data.id);
            if (index !== - 1) {
              this.page.items[index] = data;
            }
          },
          error: () => {
            this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
          },
          complete: () => {
            this.message.openSnackBar(`Opération effectuée avec succès !`, 'Fermer', 4000);
          },
        });
      }
    });
  }

  onDelete(holiday: Holiday) {
    const role = this.http.role;
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: `Souhaitez-vous vraiment supprimer le jour férié "${holiday.name}" ? Cette suppression est définitive et ne pourra pas être annulée.`,
        buttonText: { ok: 'Oui', cancel: 'Non' },
      },
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.http.url = `holidays/${holiday.id}`;
        this.http.delete().subscribe({
          next: (data: any) => {},
          error: () => {
            this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
          },
          complete: () => {
            this.message.openSnackBar(`Jour férié supprimé avec succès !`, 'Fermer', 4000);
          },
        });
      }
    });
  }
}
