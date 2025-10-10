import { Component, inject, OnInit } from '@angular/core';
import { IncomingExternalMailService } from '../../../../core/services/incoming-external-mail-service';
import { StateService } from '../../../../core/services/state.service';
import { Header } from '../../../../shared/models/header';
import { SharedBackend } from '../../../../shared/imports/shared-backend-imports';
import { IncomingMailGridComponent } from '../../chunks/incoming-mail-grid/incoming-mail-grid-component';
import { Criteria } from '../../../../shared/models/criteria';
import { ActionEvent } from '../../../../shared/models/action-event';
import { SearchBarComponent } from '../../chunks/search-bar/search-bar-component';
import { ToolbarComponent } from '../../chunks/toolbar/toolbar-component';
import { IncomingExternalMail } from '../../../../shared/models/incoming-external-mail';
import { IncomingReportListViewComponent } from "../../../report/incoming-report-list-view/incoming-report-list-view-component";

@Component({
  selector: 'app-incoming-external-mail-list-impl-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ...SharedBackend,
    IncomingMailGridComponent,
    IncomingReportListViewComponent
],
  templateUrl: './incoming-external-mail-list-impl-component.html',
  styleUrl: './incoming-external-mail-list-impl-component.scss'
})
export class IncomingExternalMailListImplComponent implements OnInit {
  public mailService = inject(IncomingExternalMailService);
  protected stateService = inject(StateService);
  view = 'grid';

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('COURRIERS ENTRANTS EXTERNES', 'Liste des correspondances externes reçues', 'flight_land'));
  }

  ngOnInit(): void {
    this.onSelectTab(this.mailService.tab);
  }

  onSearchChanged(criteria: Criteria) {
    Object.assign(this.mailService.criteria, criteria);
    this.onSelectTab(this.mailService.tab);
  }

  onviewChanged(string: string){
    this.view = string;
  }

  onSelectTab(tab: string, isNewTab = false) {
    this.mailService.selectTab(tab, isNewTab);
  }

  onActionButton(tab: string) {
    this.mailService.actionButton(tab);
  }

  onMenuSelected(event: ActionEvent<IncomingExternalMail>) {
    this.mailService.menuSelected(event);
  }
}
