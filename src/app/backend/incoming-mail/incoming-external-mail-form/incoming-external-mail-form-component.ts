import { Component, computed, inject } from '@angular/core';
import { IncomingExternalMailImplFormComponent } from "./incoming-external-mail-impl-form/incoming-external-mail-impl-form-component";
import { StateService } from '../../../core/services/state.service';
import { Roles } from '../../../shared/enums/roles-enum';

@Component({
  selector: 'app-incoming-external-mail-form-component',
  imports: [IncomingExternalMailImplFormComponent],
  templateUrl: './incoming-external-mail-form-component.html',
  styleUrl: './incoming-external-mail-form-component.scss'
})
export class IncomingExternalMailFormComponent {
  private stateService = inject(StateService);

  role = computed(() => this.stateService.role());
  roles = Roles;
}
