import { Injectable } from '@angular/core';
import { IncomingMail } from '../../shared/models/incoming-mail';
import { MatDialogConfig } from '@angular/material/dialog';
import { Tabs } from '../../shared/enums/tab-enum';
import { Roles } from '../../shared/enums/roles-enum';
import { ConfirmComponent } from '../../shared/components/confirm/confirm-component';
import { MailStatus } from '../../shared/enums/mail-status.enum';
import { CommentDialogComponent } from '../../backend/incoming-mail/comment-dialog/comment-dialog-component';
import { HttpEventType } from '@angular/common/http';
import { ActionEvent } from '../../shared/models/action-event';
import { TreatmentProoftDialogComponent } from '../../backend/incoming-mail/treatment-prooft-dialog/treatment-prooft-dialog-component';
import { AbstractMailService } from './abstract-mail-service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractIncomingMailService<T extends IncomingMail> extends AbstractMailService<T> {
  protected constructor(endpoint: string, routePrefix: string, key: string) {
    super(endpoint, routePrefix, key);
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

  public selectTab(tab: string, isNewTab = false) {
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

  public actionButton(tab: string) {
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

  public menuSelected(event: ActionEvent<T>) {
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
}
