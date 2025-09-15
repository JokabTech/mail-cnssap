import { Component, computed, inject } from '@angular/core';
import { IncomingExternalMailListImplComponent } from "./incoming-external-mail-list-impl/incoming-external-mail-list-impl-component";
import { StateService } from '../../../core/services/state.service';
import { Roles } from '../../../shared/enums/roles-enum';

@Component({
  selector: 'app-incoming-external-mail-list-component',
  imports: [IncomingExternalMailListImplComponent],
  templateUrl: './incoming-external-mail-list-component.html',
  styleUrl: './incoming-external-mail-list-component.scss'
})
export class IncomingExternalMailListComponent {
  private stateService = inject(StateService);

  role = computed(() => this.stateService.role());
  roles = Roles;
}
