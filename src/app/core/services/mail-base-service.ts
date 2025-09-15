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
import { Tabs } from '../../shared/enums/tab-enum';
import { Roles } from '../../shared/enums/roles-enum';
import { ConfirmComponent } from '../../shared/components/confirm/confirm-component';
import { MailStatus } from '../../shared/enums/mail-status.enum';
import { CommentDialogComponent } from '../../backend/incoming-mail/comment-dialog/comment-dialog-component';
import { HttpEventType } from '@angular/common/http';
import { PdfService } from './pdf-service';
import { ActionEvent } from '../../shared/models/action-event';
import { PageEvent } from '@angular/material/paginator';
import { TreatmentProoftDialogComponent } from '../../backend/incoming-mail/treatment-prooft-dialog/treatment-prooft-dialog-component';

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
  protected pdfService = inject(PdfService);

  private readonly mailSearchTrigger$ = new Subject<RequestOptions>();

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  public page!: Page<T>;
  public loading = false;
  public error = null;
  public criteria = new Criteria(1, 6);
  public uploadProgress = 0;

  public pageSizeOptions: number[] = [6, 12, 24, 100];
  public pageEvent!: PageEvent;
  public pageIndex = 0;
  public tab = 'initial';
  public key!: string;

  protected constructor(protected endpoint: string, protected routePrefix: string, key: string) {
    this.key = key;
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
    conf.data = { title: `Ajouter une annotation`, mail, endpoint: this.endpoint };
    conf.minWidth = this.xSmallOrSmall() ? '96vw' : '57vw';
    const dialogRef = this.dialog.open(CommentDialogComponent, conf);
    dialogRef.afterClosed().subscribe((result: T) => {
      if (result && tab === Tabs.INITIAL) {
        this.buildInitial();
      } else if (result) {
        const index = this.page.items.findIndex(item => item.id === result.id);
        if (index !== -1) {
          this.page.items[index].status = result.status;
        }
      }
    });
  }

  AddTreatmentProof(mail: T) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Ajouter une preuve de traitement`, mail, endpoint: this.endpoint };
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
      case Roles.MAIL_ARCHIVES_AGENT:
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
    this.uploadProgress = 0
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
        this.http.sendFormData(JSON.stringify({ should_send_document: true }), null, 'patch').subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
            } else if (event.type === HttpEventType.Response) {
              const index = this.page.items.findIndex(item => item.id === event.body.id);
              if (index !== -1) {
                this.page.items[index].status = role === Roles.ADMIN_ASSISTANT ? MailStatus.TO_SENIOR_ASSISTANT : MailStatus.TO_DIRECTOR;
              }
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

  displayOnline(mail_id: number, target: string) {
    this.pdfService.displayOnlinePdf(mail_id, target, this.endpoint);
  }

  displayLocal() {
    this.pdfService.displayLocalPdf();
  }

  selectTab(tab: string, isNewTab = false) {
    if (isNewTab) {
      this.criteria.page = 1;
      this.criteria.pageSize = 6;
      this.pageIndex = 0;
    }
    switch (tab) {
      case 'initial':
        this.buildInitial();
        break;
      case 'annotated':
        this.buildAnnotated();
        break;
      case 'all':
        this.buildAll();
        break;
      case 'treated':
        this.buildTreated();
        break;
      case 'to-process':
        this.buildToProcess();
        break;
      default:
    }
    this.tab = tab;
    sessionStorage.setItem(this.key, tab);
  }

  actionButton(tab: string) {
    switch (tab) {
      case 'goToForm':
        this.goToForm('add');
        break;
      case 'refresh':
        this.buildInitial();
        break;
      case 'print':
        // Implement print logic
        break;
      default:
    }
  }

  menuSelected(event: ActionEvent<T>) {
    switch (event.action) {
      case 'view_detail':
        this.gotToDetails(event.data);
        break;
      case 'display_document':
        this.displayOnline(event.data.id, 'document');
        break;
      case 'display_proof':
        this.displayOnline(event.data.id, 'proof');
        break;
      case 'receipt':
        // Implement receipt logic
        break;
      case 'download_mail':
        this.downloadDocument(event.data.id, 'document');
        break;
      case 'download_proof':
        this.downloadDocument(event.data.id, 'proof');
        break;
      case 'add_comment':
        this.openAddCommentDialog(event.data, this.tab);
        break;
      case 'treatment_proof':
        this.AddTreatmentProof(event.data);
        break;
      case 'share_mail':
        // Implement share logic
        break;
      case 'assign_agent':
      case 'edit_mail':
        this.goToForm(event.action, event.data);
        break;
      case 'delete_mail':
        // Implement delete logic
        break;
      case 'send':
        this.send(event.data);
        break;
      default:
        console.warn(`Action non gérée :`);
    }
  }

  public onNext(event: PageEvent): void {
    this.pageEvent = event;
    this.pageIndex = event.pageIndex;
    this.criteria.page = this.pageEvent.pageIndex + 1;
    this.criteria.pageSize = this.pageEvent.pageSize;
    this.selectTab(this.tab);
  }

}
