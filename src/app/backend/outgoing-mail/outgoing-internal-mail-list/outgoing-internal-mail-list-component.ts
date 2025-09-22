import { Component, computed, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Roles } from '../../../shared/enums/roles-enum';
import { OutgoingInternalMailListImplComponent } from "./outgoing-internal-mail-list-impl-component/outgoing-internal-mail-list-impl-component";

@Component({
  selector: 'app-outgoing-internal-mail-list-component',
  imports: [OutgoingInternalMailListImplComponent],
  templateUrl: './outgoing-internal-mail-list-component.html',
  styleUrl: './outgoing-internal-mail-list-component.scss'
})
export class OutgoingInternalMailListComponent {
  private stateService = inject(StateService);

  role = computed(() => this.stateService.role());
  roles = Roles;
}
