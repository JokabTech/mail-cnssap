import { Component, inject, OnInit } from '@angular/core';
import { ReportToolbarComponent } from '../report-toolbar/report-toolbar-component';
import { StateService } from '../../../core/services/state.service';
import { IncomingInternalMailReportService } from '../../../core/services/incoming-internal-mail-report-service';
import { Header } from '../../../shared/models/header';
import { Criteria } from '../../../shared/models/criteria';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { IncomingReportListViewComponent } from '../incoming-report-list-view/incoming-report-list-view-component';
import { ActionEvent } from '../../../shared/models/action-event';

@Component({
  selector: 'app-incoming-internal-mail-report-component',
  imports: [ReportToolbarComponent, ...SharedBackend, ...SharedImports, IncomingReportListViewComponent],
  templateUrl: './incoming-internal-mail-report-component.html',
  styleUrl: './incoming-internal-mail-report-component.scss'
})
export class IncomingInternalMailReportComponent implements OnInit {
  protected stateService = inject(StateService);
  protected mailService = inject(IncomingInternalMailReportService);

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('RAPPORT DES COURRIERS ENTRANTS INTERNES', 'Liste des correspondances internes reçues', 'flight_land'));
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
