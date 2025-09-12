import { Component, computed, inject } from '@angular/core';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { HttpService } from '../../../core/services/http.service';
import { StateService } from '../../../core/services/state.service';
import { Header } from '../../../shared/models/header';
import { IncomingExternalMailFormItemComponent } from '../incoming-external-mail-form-item/incoming-external-mail-form-item-component';

@Component({
  selector: 'app-incoming-external-mail-form-component',
  imports: [...SharedBackend, ...SharedImports, IncomingExternalMailFormItemComponent],
  templateUrl: './incoming-external-mail-form-component.html',
  styleUrl: './incoming-external-mail-form-component.scss'
})
export class IncomingExternalMailFormComponent {
  private http = inject(HttpService);
  private stateService = inject(StateService);
  role = computed(() => this.stateService.role());

  constructor() {
    this.stateService.setHeader(new Header('NOUVEAU COURRIER ENTRANT EXTERNE', 'Enregistrer un nouveau courrier reçu', 'home'));
  }
}
