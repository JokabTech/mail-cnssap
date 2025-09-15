import { Component, inject } from '@angular/core';
import { IncomingInternalMail } from '../../../../shared/models/Incoming-internal-mail';
import { IncomingInternalMailService } from '../../../../core/services/incoming-internal-mail-service';
import { StateService } from '../../../../core/services/state.service';
import { Header } from '../../../../shared/models/header';
import { SharedBackend } from '../../../../shared/imports/shared-backend-imports';
import { IncomingMailGridComponent } from '../../chunks/incoming-mail-grid/incoming-mail-grid-component';
import { Criteria } from '../../../../shared/models/criteria';
import { ActionEvent } from '../../../../shared/models/action-event';
import { ToolbarComponent } from '../../chunks/toolbar/toolbar-component';
import { SearchBarComponent } from '../../chunks/search-bar/search-bar-component';

@Component({
  selector: 'app-incoming-internal-mail-list-impl-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ...SharedBackend,
    IncomingMailGridComponent
  ],
  templateUrl: './incoming-internal-mail-list-impl-component.html',
  styleUrl: './incoming-internal-mail-list-impl-component.scss'
})
export class IncomingInternalMailListImplComponent {
  public mailService = inject(IncomingInternalMailService);
  protected stateService = inject(StateService);

  constructor() {
    if (sessionStorage.getItem(this.mailService.key)) {
      this.mailService.tab = <string>sessionStorage.getItem(this.mailService.key);
    }
    this.stateService.setHeader(new Header('COURRIERS ENTRANTS INTERNES', 'Liste des correspondances internes reçues', 'flight_land'));
  }

  ngOnInit(): void {
    this.onSelectTab(this.mailService.tab);
  }

  onSearchChanged(criteria: Criteria) {
    Object.assign(this.mailService.criteria, criteria);
    this.onSelectTab(this.mailService.tab);
  }

  onSelectTab(tab: string, isNewTab = false) {
    this.mailService.selectTab(tab, isNewTab);
  }

  onActionButton(tab: string) {
    this.mailService.actionButton(tab);
  }

  onMenuSelected(event: ActionEvent<IncomingInternalMail>) {
    this.mailService.menuSelected(event);
  }

}
