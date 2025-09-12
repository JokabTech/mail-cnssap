import { Component, computed, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Header } from '../../../shared/models/header';
import { IncomingExternalMailListComponent } from '../incoming-external-mail-list/incoming-external-mail-list-component';
import { Roles } from '../../../shared/enums/roles-enum';

@Component({
  selector: 'app-incoming-external-mail-component',
  imports: [
    IncomingExternalMailListComponent
  ],
  templateUrl: './incoming-external-mail-component.html',
  styleUrl: './incoming-external-mail-component.scss'
})
export class IncomingExternalMailComponent {
  private stateService = inject(StateService);
  role = computed(() => this.stateService.role());
  roles = Roles;

  constructor() {
    this.stateService.setHeader(new Header('COURRIERS ENTRANTS EXTERNES', 'Liste des correspondances externes reçues', 'flight_land'));
  }
}
