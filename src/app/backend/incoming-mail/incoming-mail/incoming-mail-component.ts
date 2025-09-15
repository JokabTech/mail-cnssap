import { Component, computed, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Criteria } from '../../../shared/models/criteria';
import { ActionEvent } from './../../../shared/models/action-event';
import { StateService } from '../../../core/services/state.service';
import { PdfService } from '../../../core/services/pdf-service';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { MailBaseService } from '../../../core/services/mail-base-service';
import { IncomingMail } from '../../../shared/models/incoming-mail';
import { IncomingMailGridComponent } from "../chunks/incoming-mail-grid/incoming-mail-grid-component";
import { ToolbarComponent } from '../chunks/toolbar/toolbar-component';
import { SearchBarComponent } from '../chunks/search-bar/search-bar-component';

@Component({
  selector: 'app-incoming-mail-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ...SharedBackend,
    IncomingMailGridComponent
  ],
  templateUrl: './incoming-mail-component.html',
  styleUrl: './incoming-mail-component.scss'
})
export abstract class IncomingMailComponent<T extends IncomingMail> implements OnInit {
  protected abstract mailService: MailBaseService<T>;
  private pdfService = inject(PdfService);
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
    this.mailService.criteria.page = this.pageEvent.pageIndex + 1;
    this.mailService.criteria.pageSize = this.pageEvent.pageSize;
    this.onSelectTab(this.tab);
  }

  onSearchChanged(criteria: Criteria) {
    Object.assign(this.mailService.criteria, criteria);
    this.onSelectTab(this.tab);
  }

  onSelectTab(tab: string, isNewTab = false) {
    if (isNewTab) {
      this.mailService.criteria.page = 1;
      this.mailService.criteria.pageSize = 6;
      this.pageIndex = 0;
    }
    switch (tab) {
      case 'initial':
        this.mailService.buildInitial();
        break;
      case 'annotated':
        this.mailService.buildAnnotated();
        break;
      case 'all':
        this.mailService.buildAll();
        break;
      case 'treated':
        this.mailService.buildTreated();
        break;
      case 'to-process':
        this.mailService.buildToProcess();
        break;
      default:
    }
    this.tab = tab;
    sessionStorage.setItem('tab', tab);
  }

  onActionButton(tab: string) {
    switch (tab) {
      case 'goToForm':
        this.mailService.goToForm('add');
        break;
      case 'refresh':
        this.mailService.buildInitial();
        break;
      case 'print':
        // Implement print logic
        break;
      default:
    }
  }

  onMenuSelected(event: ActionEvent<T>) {
    switch (event.action) {
      case 'view_detail':
        this.mailService.gotToDetails(event.data);
        break;
      case 'display_document':
        this.mailService.displayOnline(event.data.id, 'document');
        break;
      case 'display_proof':
        this.mailService.displayOnline(event.data.id, 'proof');
        break;
      case 'receipt':
        // Implement receipt logic
        break;
      case 'download_mail':
        this.mailService.downloadDocument(event.data.id, 'document');
        break;
      case 'download_proof':
        this.mailService.downloadDocument(event.data.id, 'proof');
        break;
      case 'add_comment':
        this.mailService.openAddCommentDialog(event.data, this.tab);
        break;
      case 'treatment_proof':
        this.mailService.AddTreatmentProof(event.data);
        break;
      case 'share_mail':
        // Implement share logic
        break;
      case 'assign_agent':
      case 'edit_mail':
        this.mailService.goToForm(event.action, event.data);
        break;
      case 'delete_mail':
        // Implement delete logic
        break;
      case 'send':
        this.mailService.send(event.data);
        break;
      default:
        console.warn(`Action non gérée :`);
    }
  }
}
