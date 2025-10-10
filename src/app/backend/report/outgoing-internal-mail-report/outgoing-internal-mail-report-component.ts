import { Component, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Header } from '../../../shared/models/header';
import { Criteria } from '../../../shared/models/criteria';
import { ReportToolbarComponent } from "../report-toolbar/report-toolbar-component";
import { OutgoingReportListViewComponent } from "../outgoing-report-list-view/outgoing-report-list-view-component";
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { OutgoingInternalMailReportService } from '../../../core/services/outgoing-internal-mail-report-service';
import { ActionEvent } from '../../../shared/models/action-event';

@Component({
  selector: 'app-outgoing-internal-mail-report-component',
  imports: [ReportToolbarComponent, OutgoingReportListViewComponent, ...SharedBackend, ...SharedImports],
  templateUrl: './outgoing-internal-mail-report-component.html',
  styleUrl: './outgoing-internal-mail-report-component.scss'
})
export class OutgoingInternalMailReportComponent {
  protected stateService = inject(StateService);
  protected mailService = inject(OutgoingInternalMailReportService);

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('RAPPORT DES COURRIERS SORTANTS INTERNES', 'Liste des correspondances internes sortants', 'flight_land'));
  }

  ngOnInit(): void {
    this.onSelectTab(this.mailService.tab);
  }

  searchChanged(criteria: Criteria) {
    console.log()
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
