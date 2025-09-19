import { SharedImports } from '../../../../shared/imports/shared-imports';
import { IncomingMail } from '../../../../shared/models/incoming-mail';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActionEvent } from '../../../../shared/models/action-event';
import { Roles } from '../../../../shared/enums/roles-enum';
import { MailStatus } from '../../../../shared/enums/mail-status.enum';
import { Tabs } from '../../../../shared/enums/tab-enum';
import { HttpService } from '../../../../core/services/http.service'
import { IncomingMailMenuComponent } from "../incoming-mail-menu/incoming-mail-menu-component";
import { IncomingInternalMail } from '../../../../shared/models/incoming-internal-mail';
import { IncomingExternalMail } from '../../../../shared/models/incoming-external-mail';

@Component({
  selector: 'app-incoming-mail-grid-component',
  imports: [
    ...SharedImports,
    IncomingMailMenuComponent
  ],
  templateUrl: './incoming-mail-grid-component.html',
  styleUrl: './incoming-mail-grid-component.scss'
})
export class IncomingMailGridComponent<T extends IncomingMail> implements OnInit {
  httpService = inject(HttpService);

  @Input() tab: string = 'initial';
  @Input() mails: T[] | undefined = undefined;
  @Output() menuSelected = new EventEmitter<ActionEvent<T>>();

  roles = Roles;
  status = MailStatus;
  tabs = Tabs;

  role = this.httpService.role;

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

  getSenderForIncoming(item: IncomingMail): string {
    if ('documentType' in item) {
      const internalMail = item as IncomingInternalMail;
      return internalMail.sender.full_name;
    }

    if ('sender' in item) {
      const externalMail = item as IncomingExternalMail;
      return externalMail.sender;
    }
    return 'Inconnu';
  }
}
