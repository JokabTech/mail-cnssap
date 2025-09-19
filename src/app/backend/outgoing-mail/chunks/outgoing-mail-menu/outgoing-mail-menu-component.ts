import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OutgoingMail } from '../../../../shared/models/outgoing-mail';
import { ActionEvent } from '../../../../shared/models/action-event';
import { SharedImports } from '../../../../shared/imports/shared-imports';

@Component({
  selector: 'app-outgoing-mail-menu-component',
  imports: [...SharedImports],
  templateUrl: './outgoing-mail-menu-component.html',
  styleUrl: './outgoing-mail-menu-component.scss'
})
export class OutgoingMailMenuComponent<T extends OutgoingMail> {
  @Input() item!: T;
  @Output() actionSelected = new EventEmitter<ActionEvent<T>>();

   onMenuItemClicked(action: string, data: T) {
      this.actionSelected.emit({ action, data });
    }
}
