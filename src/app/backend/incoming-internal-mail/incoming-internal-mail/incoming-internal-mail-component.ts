import { IncomingInternalMail } from './../../../shared/models/Incoming-internal-mail';
import { IncomingInternalMailService } from './../../../core/services/incoming-internal-mail-service';
import { Component, computed, inject, OnInit } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Roles } from '../../../shared/enums/roles-enum';
import { Header } from '../../../shared/models/header';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { BackComponent } from '../../../shared/components/back/back-component';
import { SearchBarComponent } from '../../incoming-external-mail/chunks/search-bar/search-bar-component';
import { Criteria } from '../../../shared/models/criteria';
import { IncomingInternalMailsGridComponent } from '../chunks/incoming-internal-mails-grid/incoming-internal-mails-grid-component';
import { PageEvent } from '@angular/material/paginator';
import { FormActionPayload } from '../../../shared/models/form-action-payload';
import { Router } from '@angular/router';
import { ActionEvent } from '../../../shared/models/action-event';
import { PdfService } from '../../../core/services/pdf-service';

export interface Tab {
  key: string;
  icon: string;
  tooltip: string;
  tooltipDir?: string;
}

@Component({
  selector: 'app-incoming-internal-mail-component',
  imports: [
    ...SharedBackend,
    ...SharedImports,
    BackComponent,
    SearchBarComponent,
    IncomingInternalMailsGridComponent
  ],
  templateUrl: './incoming-internal-mail-component.html',
  styleUrl: './incoming-internal-mail-component.scss'
})
export class IncomingInternalMailComponent implements OnInit {
  private stateService = inject(StateService);
  public incomingInternalMailService = inject(IncomingInternalMailService);
  private router = inject(Router);
  private pdfService = inject(PdfService)

  role = computed(() => this.stateService.role());
  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  pageSizeOptions: number[] = [6, 12, 24, 100];

  roles = Roles;
  pageIndex = 0;


  tabs: Tab[] = [
    {
      key: 'initial',
      icon: 'toc',
      tooltip: 'COURRIERS NON TRAITÉS',
    },
    { key: 'treated', icon: 'receipt', tooltip: 'COURRIERS DÉJÀ TRAITÉS' },
    { key: 'all', icon: 'list', tooltip: 'LISTE COMPLETE DE COURRIERS', },
    { key: 'to-process', icon: 'translate', tooltip: 'COURRIER À TRAITER' }
  ];
  selectedTab: string = 'initial';
  title = 'COURRIERS NON TRAITÉS';

  constructor() {
    if (sessionStorage.getItem('tabInternal')) {
      this.selectedTab = <string>sessionStorage.getItem('tabInternal');
    }
    this.stateService.setHeader(new Header('COURRIERS ENTRANTS INTERNES', 'Liste des correspondances internes reçues', 'flight_land'));
  }

  ngOnInit(): void {
    this.selectTab(this.selectedTab);
  }

  onSearchChanged(criteria: Criteria) {

    this.incomingInternalMailService.criteria.keyword = criteria.keyword;
    this.incomingInternalMailService.criteria.startDate = criteria.startDate;
    this.incomingInternalMailService.criteria.endDate = criteria.endDate;
    this.incomingInternalMailService.criteria.department_id = criteria.department_id;

    this.selectTab(this.selectedTab);
  }

  public onNext(event: PageEvent): void {
    this.incomingInternalMailService.criteria.page = event.pageIndex + 1;
    this.incomingInternalMailService.criteria.pageSize = event.pageSize;
    this.selectTab(this.selectedTab);
  }

  public goToForm(action: string, incomingInternalMail?: IncomingInternalMail) {
    const payload = new FormActionPayload(action, incomingInternalMail);
    sessionStorage.setItem('formActionPayload', JSON.stringify(payload));
    this.router.navigateByUrl('/mails/incoming/internal/form');
  }

  selectTab(tab: string, isNewTab = false) {
    if (isNewTab) {
      this.incomingInternalMailService.criteria.page = 1;
      this.incomingInternalMailService.criteria.pageSize = 6;
      this.pageIndex = 0;
    }
    switch (tab) {
      case 'initial':
        this.incomingInternalMailService.buildInitial();
        break;
      case 'treated':
        this.incomingInternalMailService.buildTreated();
        break;
      case 'all':
        this.incomingInternalMailService.buildAll();
        break;
      case 'to-process':
        break;
      default:
    }
    this.selectedTab = tab;
  }

  onSelectTab(tab: Tab, isNewTab = false) {
    this.selectTab(tab.key, isNewTab);
    this.title = tab.tooltip;
    sessionStorage.setItem('tabInternal', tab.key);
  }

  onMenuSelected(event: ActionEvent<IncomingInternalMail>) {
    switch (event.action) {
      case 'view_detail':
        this.incomingInternalMailService.gotToDetails(event.data);
        break;
      case 'display_document':
        this.pdfService.displayOnlinePdf(event.data.id, 'document', 'internal');
        break;
      case 'display_proof':
        this.pdfService.displayOnlinePdf(event.data.id, 'proof', 'internal');
        break;
      case 'receipt':
        break;
      case 'download_mail':
        this.incomingInternalMailService.downloadDocument(event.data.id, 'document');
        break;
      case 'download_proof':
        this.incomingInternalMailService.downloadDocument(event.data.id, 'proof');
        break;
      case 'treatment_proof':
        this.incomingInternalMailService.AddTreatmentProof(event.data);
        break;
      case 'share_mail':
        break;
      case 'assign_agent':
      case 'edit_mail':
        this.goToForm('edit', event.data)
        break;
      case 'delete_mail':
        break;
      default:
        console.warn(`Action non gérée :`);
    }
  }
}

