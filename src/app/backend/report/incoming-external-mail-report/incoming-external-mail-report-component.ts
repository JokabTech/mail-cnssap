import { IncomingExternalMailReportService } from './../../../core/services/incoming-external-mail-report-service';
import { Component, inject, OnInit } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Header } from '../../../shared/models/header';
import { ReportToolbarComponent } from "../report-toolbar/report-toolbar-component";
import { Criteria } from '../../../shared/models/criteria';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { IncomingReportListViewComponent } from "../incoming-report-list-view/incoming-report-list-view-component";
import { ActionEvent } from '../../../shared/models/action-event';
import { IncomingExternalMail } from '../../../shared/models/incoming-external-mail';

@Component({
  selector: 'app-incoming-external-mail-report-component',
  imports: [ReportToolbarComponent, ...SharedBackend, ...SharedImports, IncomingReportListViewComponent],
  templateUrl: './incoming-external-mail-report-component.html',
  styleUrl: './incoming-external-mail-report-component.scss'
})
export class IncomingExternalMailReportComponent implements OnInit {
  protected stateService = inject(StateService);
  protected mailService = inject(IncomingExternalMailReportService);

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('RAPPORT DES COURRIERS ENTRANTS EXTERNES', 'Liste des correspondances externes reçues', 'flight_land'));
  }

  ngOnInit(): void {
    this.onSelectTab(this.mailService.tab);
  }

  searchChanged(criteria: Criteria) {
    Object.assign(this.mailService.criteria, criteria);
    this.onSelectTab(this.mailService.tab);
  }

  onSelectTab(tab: string, isNewTab = false) {
    this.mailService.selectTab(tab, isNewTab);
  }

  onActionButton(event: ActionEvent<Header>) {
    this.mailService.actionButton(event.action, event);
  }

  onMenuSelected(event: ActionEvent<IncomingExternalMail>) {
    this.mailService.menuSelected(event);
  }

}
