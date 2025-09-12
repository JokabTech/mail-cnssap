import { Component, inject } from '@angular/core';
import { IncomingInternalMail } from '../../../shared/models/Incoming-internal-mail';
import { IncomingMailComponent } from '../incoming-mail/incoming-mail-component';
import { IncomingInternalMailService } from '../../../core/services/incoming-internal-mail-service';
import { ToolbarComponent } from '../../incoming-external-mail/chunks/toolbar/toolbar-component';
import { SearchBarComponent } from '../../incoming-external-mail/chunks/search-bar/search-bar-component';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { IncomingMailGridComponent } from '../chunks/incoming-mail-grid/incoming-mail-grid-component';
import { StateService } from '../../../core/services/state.service';
import { Header } from '../../../shared/models/header';

@Component({
  selector: 'app-incoming-internal-mail-list-component',
  imports: [
    ToolbarComponent,
    SearchBarComponent,
    ...SharedBackend,
    IncomingMailGridComponent
  ],
  templateUrl: '../incoming-mail/incoming-mail-component.html',
  styleUrl: '../incoming-mail/incoming-mail-component.scss'
})
export class IncomingInternalMailListComponent extends IncomingMailComponent<IncomingInternalMail> {
  protected override mailService = inject(IncomingInternalMailService);

  protected state = inject(StateService);

  constructor() {
    super();
    this.state.setHeader(new Header('COURRIERS ENTRANTS INTERNES', 'Liste des correspondances internes reçues', 'flight_land'));
  }
}
