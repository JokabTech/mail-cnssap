import { computed, inject, Injectable } from '@angular/core';
import { BaseMail } from '../../shared/models/base-mail';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { StateService } from './state.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpParamsService } from './http-params-service';
import { MessageService } from './message.service';
import { PdfService } from './pdf-service';
import { finalize, Subject, switchMap } from 'rxjs';
import { RequestOptions } from '../../shared/models/request-options';
import { Page } from '../../shared/models/page';
import { Criteria } from '../../shared/models/criteria';
import { PageEvent } from '@angular/material/paginator';
import { FormActionPayload } from '../../shared/models/form-action-payload';
import { ActionEvent } from '../../shared/models/action-event';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractMailService<T extends BaseMail> {
  protected http = inject(HttpService);
  protected router = inject(Router);
  protected stateService = inject(StateService);
  protected dialog = inject(MatDialog);
  protected paramsService = inject(HttpParamsService);
  protected message = inject(MessageService);
  protected pdfService = inject(PdfService);

  private readonly mailSearchTrigger$ = new Subject<RequestOptions>();
  private sessionKey!: string;

  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  public page!: Page<T>;
  public loading = false;
  public error = null;
  public criteria = new Criteria(1, 6);
  public uploadProgress = 0;
  public pageSizeOptions: number[] = [6, 12, 24, 100];
  public pageEvent!: PageEvent;
  public pageIndex = 0;
  public tab = 'initial';

  protected constructor(protected endpoint: string, protected routePrefix: string, public key: string) {
    this.sessionKey = this.endpoint.replace(/-/g, '')
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

  public goToForm(action: string, mail?: T) {
    const payload = new FormActionPayload(action, mail);
    sessionStorage.setItem('formActionPayload', JSON.stringify(payload));
    this.router.navigateByUrl(`${this.routePrefix}/form`);
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

  protected find(requestOptions: RequestOptions): void {
    this.mailSearchTrigger$.next(requestOptions);
  }

  gotToDetails(mail: T) {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(mail));
    this.router.navigateByUrl(`${this.routePrefix}/detail`);
  }

  search(criteria: Criteria) {
    this.find(this.paramsService.build(this.endpoint, criteria));
  }

  public onNext(event: PageEvent): void {
    this.pageEvent = event;
    this.pageIndex = event.pageIndex;
    this.criteria.page = this.pageEvent.pageIndex + 1;
    this.criteria.pageSize = this.pageEvent.pageSize;
    this.selectTab(this.tab);
  }

  displayOnline(mail_id: number, target: string) {
    this.pdfService.displayOnlinePdf(mail_id, target, this.endpoint);
  }

  displayLocal() {
    this.pdfService.displayLocalPdf();
  }

  public abstract selectTab(tab: string, isNewTab?: boolean): void;

  public abstract actionButton(tab: string): void;

  public abstract menuSelected(event: ActionEvent<T>): void;
}
