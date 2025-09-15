import { Component, computed, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { Roles } from '../../../shared/enums/roles-enum';
import { IncomingInternalMailFormImplComponent } from "./incoming-internal-mail-form-impl/incoming-internal-mail-form-impl-component";

@Component({
  selector: 'app-incoming-internal-mail-form-component',
  imports: [IncomingInternalMailFormImplComponent],
  templateUrl: './incoming-internal-mail-form-component.html',
  styleUrl: './incoming-internal-mail-form-component.scss'
})
export class IncomingInternalMailFormComponent {
  private stateService = inject(StateService);

  role = computed(() => this.stateService.role());
  roles = Roles;
}
