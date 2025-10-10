import { SharedImports } from '../../../../shared/imports/shared-imports';
import { IncomingMail } from '../../../../shared/models/incoming-mail';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ActionEvent } from '../../../../shared/models/action-event';
import { Roles } from '../../../../shared/enums/roles-enum';
import { MailStatus } from '../../../../shared/enums/mail-status.enum';
import { Tabs } from '../../../../shared/enums/tab-enum';
import { HttpService } from '../../../../core/services/http.service'
import { IncomingMailMenuComponent } from "../incoming-mail-menu/incoming-mail-menu-component";
import { isIncomingExternalMail } from '../../../../shared/types/type-guards';
import { User } from '../../../../shared/models/user';

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
  @Input() mails!: T[];
  @Output() menuSelected = new EventEmitter<ActionEvent<T>>();

  roles = Roles;
  status = MailStatus;
  tabs = Tabs;

  role = this.httpService.role;
  isExternal!: boolean;

  onActinSelected(action: ActionEvent<T>) {
    this.menuSelected.emit(action);
  }

  ngOnInit(): void {
    this.isExternal = isIncomingExternalMail(this.mails[0]);
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

  onFindSender(mail: T) {
    if (this.isExternal) {
      return mail.sender;
    } else {
      const sender = mail.sender as User;
      return sender ? sender.full_name : 'Aucun expéditeur';
    }
  }
}
