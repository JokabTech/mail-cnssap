import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OutgoingMail } from '../../../../shared/models/outgoing-mail';
import { ActionEvent } from '../../../../shared/models/action-event';
import { OutgoingExternalMail } from '../../../../shared/models/outgoing-external-mail';
import { SharedImports } from '../../../../shared/imports/shared-imports';
import { OutgoingMailMenuComponent } from "../outgoing-mail-menu/outgoing-mail-menu-component";

@Component({
  selector: 'app-outgoing-mail-grid-component',
  imports: [
    ...SharedImports,
    OutgoingMailMenuComponent
],
  templateUrl: './outgoing-mail-grid-component.html',
  styleUrl: './outgoing-mail-grid-component.scss'
})
export class OutgoingMailGridComponent<T extends OutgoingMail> {

  @Input() mails: T[] | undefined = undefined;
  @Output() menuSelected = new EventEmitter<ActionEvent<T>>();


  onActinSelected(action: ActionEvent<T>) {
    this.menuSelected.emit(action);
  }

  ngOnInit(): void {
  }

  onSend(mail: T) {
    this.menuSelected.emit(new ActionEvent('send', mail));
  }

  onAddComment(mail: T) {
    this.menuSelected.emit(new ActionEvent('add_comment', mail));
  }

  onAddProof(mail: T) {
    this.menuSelected.emit(new ActionEvent('treatment_proof', mail));
  }
}
