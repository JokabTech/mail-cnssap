import { Component, inject, OnInit } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { OutgoingExternalMailReportService } from '../../../core/services/outgoing-external-mail-report-service';
import { Header } from '../../../shared/models/header';
import { Criteria } from '../../../shared/models/criteria';
import { ReportToolbarComponent } from "../report-toolbar/report-toolbar-component";
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { OutgoingReportListViewComponent } from "../outgoing-report-list-view/outgoing-report-list-view-component";
import { ActionEvent } from '../../../shared/models/action-event';

@Component({
  selector: 'app-outgoing-external-mail-report-component',
  imports: [ReportToolbarComponent, ...SharedBackend, ...SharedImports, OutgoingReportListViewComponent],
  templateUrl: './outgoing-external-mail-report-component.html',
  styleUrl: './outgoing-external-mail-report-component.scss'
})
export class OutgoingExternalMailReportComponent implements OnInit {
  protected stateService = inject(StateService);
  protected mailService = inject(OutgoingExternalMailReportService);

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('RAPPORT DES COURRIERS SORTANTS EXTERNES', 'Liste des correspondances externes sortants', 'flight_land'));
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

}
