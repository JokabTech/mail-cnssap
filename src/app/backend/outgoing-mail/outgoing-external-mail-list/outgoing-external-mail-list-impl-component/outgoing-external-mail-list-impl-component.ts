import { OutgoingMailGridComponent } from '../../chunks/outgoing-mail-grid/outgoing-mail-grid-component';
import { Component, inject, OnInit } from '@angular/core';
import { ToolbarComponent } from '../../../incoming-mail/chunks/toolbar/toolbar-component';
import { StateService } from '../../../../core/services/state.service';
import { Header } from '../../../../shared/models/header';
import { SearchBarComponent } from '../../../incoming-mail/chunks/search-bar/search-bar-component';
import { Criteria } from '../../../../shared/models/criteria';
import { OutgoingExternalMailService } from '../../../../core/services/outgoing-external-mail-service';
import { SharedBackend } from '../../../../shared/imports/shared-backend-imports';
import { ActionEvent } from '../../../../shared/models/action-event';
import { OutgoingExternalMail } from '../../../../shared/models/outgoing-external-mail';

@Component({
  selector: 'app-outgoing-external-mail-list-impl-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ...SharedBackend,
    OutgoingMailGridComponent,
  ],
  templateUrl: './outgoing-external-mail-list-impl-component.html',
  styleUrl: './outgoing-external-mail-list-impl-component.scss'
})
export class OutgoingExternalMailListImplComponent implements OnInit {
  protected stateService = inject(StateService);
  public mailService = inject(OutgoingExternalMailService);

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('COURRIERS SORTANTS EXTERNES', 'Liste des correspondances externes sortants', 'flight_land'));
  }

  ngOnInit(): void {
    this.onSelectTab(this.mailService.tab);
  }

  onSelectTab(tab: string, isNewTab = false) {
    this.mailService.selectTab(tab, isNewTab);
  }

  onActionButton(tab: string) {
    this.mailService.actionButton(tab);
  }

  onSearchChanged(criteria: Criteria) {
    Object.assign(this.mailService.criteria, criteria);
    this.onSelectTab(this.mailService.tab);
  }

  onMenuSelected(event: ActionEvent<OutgoingExternalMail>) {
    this.mailService.menuSelected(event);
  }
}
