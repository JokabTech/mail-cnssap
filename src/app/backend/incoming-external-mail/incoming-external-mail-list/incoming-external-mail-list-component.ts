import { IncomingExternalMailService } from '../../../core/services/incoming-external-mail-service';
import { ActionEvent } from './../../../shared/models/action-event';
import { Component, computed, inject } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ToolbarComponent } from "../chunks/toolbar/toolbar-component";
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SearchBarComponent } from '../chunks/search-bar/search-bar-component';
import { ExternalIncomingMailsGridComponent } from '../chunks/external-incoming-mails-grid/external-incoming-mails-grid-component';
import { Criteria } from '../../../shared/models/criteria';
import { IncomingExternalMail } from '../../../shared/models/Incoming-external-mail';
import { PdfService } from '../../../core/services/pdf-service';
import { StateService } from '../../../core/services/state.service';
@Component({
  selector: 'app-incoming-external-mail-list-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ExternalIncomingMailsGridComponent,
    ...SharedBackend
  ],
  templateUrl: './incoming-external-mail-list-component.html',
  styleUrl: './incoming-external-mail-list-component.scss'
})
export class IncomingExternalMailListComponent {
  public incomingExternalMailService = inject(IncomingExternalMailService);
  private pdfService = inject(PdfService)
  private stateService = inject(StateService);

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  pageSizeOptions: number[] = [6, 12, 24, 100];
  pageEvent!: PageEvent;

  tab = 'initial';
  pageIndex = 0;

  constructor() {
    if (sessionStorage.getItem('tab')) {
      this.tab = <string>sessionStorage.getItem('tab');
    }
  }

  ngOnInit(): void {
    this.onSelectTab(this.tab);
  }

  public onNext(event: PageEvent): void {
    this.pageEvent = event;

    this.pageIndex = event.pageIndex;
    this.incomingExternalMailService.criteria.page = this.pageEvent.pageIndex + 1;
    this.incomingExternalMailService.criteria.pageSize = this.pageEvent.pageSize;
    this.onSelectTab(this.tab);
  }

  onSearchChanged(criteria: Criteria) {
    Object.assign(this.incomingExternalMailService.criteria, criteria);
    this.onSelectTab(this.tab);
  }

  onSelectTab(tab: string, isNewTab = false) {
    if (isNewTab) {
      this.incomingExternalMailService.criteria.page = 1;
      this.incomingExternalMailService.criteria.pageSize = 6;
      this.pageIndex = 0;
    }

    switch (tab) {
      case 'initial':
        this.incomingExternalMailService.buildInitial();
        break;
      case 'annotated':
        this.incomingExternalMailService.buildAnnotated();
        break;
      case 'all':
        this.incomingExternalMailService.buildAll();
        break;
      case 'treated':
        this.incomingExternalMailService.buildTreated();
        break;
      case 'to-process':
        this.incomingExternalMailService.buildToProcess();
        break;
      default:
    }
    this.tab = tab;
    sessionStorage.setItem('tab', tab);
  }

  onActionButton(tab: string) {
    switch (tab) {
      case 'goToForm':
        this.incomingExternalMailService.goToForm('add');
        break;
      case 'refresh':
        this.incomingExternalMailService.buildInitial();
        break;
      case 'print':
        break;
      default:
    }
  }

  onMenuSelected(event: ActionEvent<IncomingExternalMail>) {
    switch (event.action) {
      case 'view_detail':
        this.incomingExternalMailService.gotToDetails(event.data);
        break;
      case 'display_document':
        this.pdfService.displayOnlinePdf(event.data.id, 'document');
        break;
      case 'display_proof':
        this.pdfService.displayOnlinePdf(event.data.id, 'proof');
        break;
      case 'receipt':
        break;
      case 'download_mail':
        this.incomingExternalMailService.downloadDocument(event.data.id, 'document');
        break;
      case 'download_proof':
        this.incomingExternalMailService.downloadDocument(event.data.id, 'proof');
        break;
      case 'add_comment':
        this.incomingExternalMailService.openAddCommentDialog(event.data, this.tab);
        break;
      case 'treatment_proof':
        this.incomingExternalMailService.AddTreatmentProof(event.data);
        break;
      case 'share_mail':
        break;
      case 'assign_agent':
      case 'edit_mail':
        this.incomingExternalMailService.goToForm(event.action, event.data);
        break;
      case 'delete_mail':
        break;
      case 'send':
        this.incomingExternalMailService.send(event.data);
        break;
      default:
        console.warn(`Action non gérée :`);
    }
  }

}
