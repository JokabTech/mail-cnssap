import { IncomingInternalMail } from './../../../../shared/models/Incoming-internal-mail';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionEvent } from '../../../../shared/models/action-event';
import { Roles } from '../../../../shared/enums/roles-enum';
import { SharedImports } from '../../../../shared/imports/shared-imports';

@Component({
  selector: 'app-incoming-internal-mails-grid-component',
  imports: [...SharedImports],
  templateUrl: './incoming-internal-mails-grid-component.html',
  styleUrl: './incoming-internal-mails-grid-component.scss'
})
export class IncomingInternalMailsGridComponent {
  @Input() role: string = Roles.EXECUTIVE_SECRETARY;
  @Input() mails: IncomingInternalMail[] | undefined = undefined;

  @Output() menuSelected = new EventEmitter<ActionEvent<IncomingInternalMail>>();


  onActinSelected(action: ActionEvent<IncomingInternalMail>) {
    this.menuSelected.emit(action);
  }

  onAddProof(mail: IncomingInternalMail) {
    this.menuSelected.emit(new ActionEvent('treatment_proof', mail));
  }

  onMenuItemClicked(action: string, mail: IncomingInternalMail) {
    this.menuSelected.emit(new ActionEvent(action, mail));
  }

}
