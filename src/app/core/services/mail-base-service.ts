import { computed, inject, Injectable } from '@angular/core';
import { IncomingMail } from '../../shared/models/incoming-mail';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { StateService } from './state.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { HttpParamsService } from './http-params-service';
import { MessageService } from './message.service';
import { finalize, Subject, switchMap } from 'rxjs';
import { RequestOptions } from '../../shared/models/request-options';
import { Page } from '../../shared/models/page';
import { Criteria } from '../../shared/models/criteria';
import { FormActionPayload } from '../../shared/models/form-action-payload';
import { AddCommentDialogComponent } from '../../backend/incoming-external-mail/add-comment-dialog/add-comment-dialog-component';
import { Tabs } from '../../shared/enums/tab-enum';
import { TreatmentProoftDialogComponent } from '../../backend/incoming-external-mail/treatment-prooft-dialog/treatment-prooft-dialog-component';
import { Roles } from '../../shared/enums/roles-enum';
import { ConfirmComponent } from '../../shared/components/confirm/confirm-component';
import { MailStatus } from '../../shared/enums/mail-status.enum';

@Injectable({
  providedIn: 'root'
})
export abstract class MailBaseService<T extends IncomingMail> {
  protected http = inject(HttpService);
  protected router = inject(Router);
  protected stateService = inject(StateService);
  protected dialog = inject(MatDialog);
  protected paramsService = inject(HttpParamsService);
  protected message = inject(MessageService);

  private readonly mailSearchTrigger$ = new Subject<RequestOptions>();

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  public page!: Page<T>;
  public loading = false;
  public error = null;
  public criteria = new Criteria(1, 6);

  protected constructor(protected endpoint: string, protected routePrefix: string) {
    this.mailSearchTrigger$
      .pipe(
        switchMap((options) => {
          this.loading = true;
          this.error = null;
          this.http.url = options.url;
          return this.http.get<Page<T>>(options.params).pipe(finalize(() => (this.loading = false)));
        })
      )
      .subscribe({
        next: (data) => {
          this.page = data;
        },
        error: (err) => (this.error = err),
      });
  }

  public findMails(requestOptions: RequestOptions): void {
    this.mailSearchTrigger$.next(requestOptions);
  }

  public goToForm(action: string, mail?: T) {
    const payload = new FormActionPayload(action, mail);
    sessionStorage.setItem('formActionPayload', JSON.stringify(payload));
    this.router.navigateByUrl(`${this.routePrefix}/form`);
  }

  openAddCommentDialog(mail: T, tab: string) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Ajouter une annotation`, mail };
    conf.minWidth = this.xSmallOrSmall() ? '96vw' : '57vw';
    const dialogRef = this.dialog.open(AddCommentDialogComponent, conf);
    dialogRef.afterClosed().subscribe((result: T) => {
      if (result && tab === Tabs.INITIAL) {
        this.buildInitial();
      }
    });
  }

  AddTreatmentProof(mail: T) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Ajouter une preuve de traitement`, mail };
    const dialogRef = this.dialog.open(TreatmentProoftDialogComponent, conf);
    dialogRef.afterClosed().subscribe((result: T) => {
      if (result) {
        this.buildInitial();
      }
    });
  }

  downloadDocument(documentId: number, target: string) {
    this.http.url = `${this.endpoint}/${target}/${documentId}`;
    this.http.getPdfDocument().subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = `${target}_${documentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(fileURL);
        a.remove();
      },
      error: () => {
        this.message.openSnackBar('Erreur lors du téléchargement du document', 'Fermer', 6000);
      },
      complete: () => {
        this.message.openSnackBar('Début du téléchargement', 'Fermer', 1000);
      },
    });
  }

  gotToDetails(mail: T) {
    sessionStorage.setItem(this.endpoint.replace(/-/g, ''), JSON.stringify(mail));
    this.router.navigateByUrl(`${this.routePrefix}/detail`);
  }

  search(criteria: Criteria) {
    this.findMails(this.paramsService.build(this.endpoint, criteria));
  }

  buildInitial() {
    const baseCriteria = { ...this.criteria };
    switch (this.http.role) {
      case Roles.EXECUTIVE_SECRETARY:
        this.search(baseCriteria);
        break;
      case Roles.ADMIN_ASSISTANT:
      case Roles.SENIOR_ASSISTANT:
        this.search({ ...baseCriteria, withAnnotated: false });
        break;
      case Roles.DIRECTOR:
        this.search({ ...baseCriteria, processed: false });
        break;
      default:
        this.search(baseCriteria);
    }
  }

  buildToProcess() {
    this.search({ ...this.criteria, assigned_to_me: true });
  }

  buildAnnotated() {
    if (this.http.role === Roles.ADMIN_ASSISTANT || this.http.role === Roles.SENIOR_ASSISTANT) {
      this.search({ ...this.criteria, withAnnotated: true });
    }
  }

  buildAll() {
    const baseCriteria = { ...this.criteria };
    switch (this.http.role) {
      case Roles.ADMIN_ASSISTANT:
      case Roles.SENIOR_ASSISTANT:
        this.search(baseCriteria);
        break;
      case Roles.DIRECTOR:
        this.search({ ...baseCriteria, processed: undefined });
        break;
      default:
        this.search(baseCriteria);
    }
  }

  buildTreated() {
    this.search({ ...this.criteria, processed: true });
  }

  send(mail: T): void {
    const role = this.http.role;
    const target = role === Roles.ADMIN_ASSISTANT ? `à l'Assistant Principal pour validation` : 'au Directeur pour traitement';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        message: `Souhaitez-vous vraiment envoyer ce courrier ${target} ?`,
        buttonText: { ok: 'Oui', cancel: 'Non' },
      },
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.http.url = `${this.endpoint}/${mail.id}`;
        this.http.sendFormData(JSON.stringify({ shouldSendDocument: true }), null, 'patch').subscribe({
          next: (event) => {
            const index = this.page.items.findIndex((item) => item.id === event.body.id);
            if (index !== -1) {
              this.page.items[index].status =
                role === Roles.ADMIN_ASSISTANT ? MailStatus.TO_SENIOR_ASSISTANT : MailStatus.TO_DIRECTOR;
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

}
