import { IncomingExternalMailService } from '../../../core/services/incoming-external-mail-service';
import { StateService } from '../../../core/services/state.service';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { Header } from '../../../shared/models/header';
import { IncomingExternalMail } from '../../../shared/models/Incoming-external-mail';
import { SearchBarComponent } from '../../incoming-external-mail/chunks/search-bar/search-bar-component';
import { ToolbarComponent } from '../../incoming-external-mail/chunks/toolbar/toolbar-component';
import { IncomingMailGridComponent } from '../chunks/incoming-mail-grid/incoming-mail-grid-component';
import { IncomingMailComponent } from '../incoming-mail/incoming-mail-component';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-incoming-external-mail-list-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ...SharedBackend,
    IncomingMailGridComponent
  ],
  templateUrl: '../incoming-mail/incoming-mail-component.html',
  styleUrl: '../incoming-mail/incoming-mail-component.scss'
})
export class IncomingExternalMailListComponent extends IncomingMailComponent<IncomingExternalMail> {
  protected override mailService = inject(IncomingExternalMailService);
  protected state = inject(StateService);

  constructor() {
    super();
    this.state.setHeader(new Header('COURRIERS ENTRANTS EXTERNES', 'Liste des correspondances externes reçues', 'flight_land'));
  }
}
