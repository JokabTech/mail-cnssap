import { Component, inject, OnInit } from '@angular/core';
import { ToolbarComponent } from '../../../incoming-mail/chunks/toolbar/toolbar-component';
import { SearchBarComponent } from '../../../incoming-mail/chunks/search-bar/search-bar-component';
import { SharedBackend } from '../../../../shared/imports/shared-backend-imports';
import { OutgoingMailGridComponent } from '../../chunks/outgoing-mail-grid/outgoing-mail-grid-component';
import { StateService } from '../../../../core/services/state.service';
import { OutgoingInternalMailService } from '../../../../core/services/outgoing-internal-mail-service';
import { Header } from '../../../../shared/models/header';
import { Criteria } from '../../../../shared/models/criteria';
import { ActionEvent } from '../../../../shared/models/action-event';
import { OutgoingInternalMail } from '../../../../shared/models/outgoing-internal-mail';
import { InformationComponent } from "../../../../shared/components/information/information-component";

@Component({
  selector: 'app-outgoing-internal-mail-list-impl-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ...SharedBackend,
    OutgoingMailGridComponent,
    InformationComponent
],
  templateUrl: './outgoing-internal-mail-list-impl-component.html',
  styleUrl: './outgoing-internal-mail-list-impl-component.scss'
})
export class OutgoingInternalMailListImplComponent implements OnInit {
  protected stateService = inject(StateService);
  public mailService = inject(OutgoingInternalMailService);

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('COURRIERS SORTANTS INTERNES', 'Liste des correspondances internes sortants', 'flight_land'));
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

  onMenuSelected(event: ActionEvent<OutgoingInternalMail>) {
    this.mailService.menuSelected(event);
  }

}
