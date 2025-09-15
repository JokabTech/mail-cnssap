import { Component, computed, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Roles } from '../../../shared/enums/roles-enum';
import { IncomingInternalMailListImplComponent } from "./incoming-internal-mail-list-impl/incoming-internal-mail-list-impl-component";

@Component({
  selector: 'app-incoming-internal-mail-list-component',
  imports: [IncomingInternalMailListImplComponent],
  templateUrl: './incoming-internal-mail-list-component.html',
  styleUrl: './incoming-internal-mail-list-component.scss'
})
export class IncomingInternalMailListComponent {
  private stateService = inject(StateService);

  role = computed(() => this.stateService.role());
  roles = Roles;
}
