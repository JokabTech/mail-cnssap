import { Component, computed, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Roles } from '../../../shared/enums/roles-enum';
import { OutgoingExternalMailListImplComponent } from "./outgoing-external-mail-list-impl-component/outgoing-external-mail-list-impl-component";

@Component({
  selector: 'app-outgoing-external-mail-list-component',
  imports: [OutgoingExternalMailListImplComponent],
  templateUrl: './outgoing-external-mail-list-component.html',
  styleUrl: './outgoing-external-mail-list-component.scss'
})
export class OutgoingExternalMailListComponent {
  private stateService = inject(StateService);

  role = computed(() => this.stateService.role());
  roles = Roles;
}
