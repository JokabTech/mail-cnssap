import { SharedImports } from '../../../../shared/imports/shared-imports';
import { IncomingExternalMail } from './../../../../shared/models/Incoming-external-mail';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IncomingExternalMailMenuComponent } from '../incoming-external-mail-menu/incoming-external-mail-menu-component';
import { ActionEvent } from '../../../../shared/models/action-event';
import { Roles } from '../../../../shared/enums/roles-enum';
import { MailStatus } from '../../../../shared/enums/mail-status.enum';
import { Tabs } from '../../../../shared/enums/tab-enum';
import { HttpService } from '../../../../core/services/http.service';

@Component({
  selector: 'app-external-incoming-mails-grid-component',
  imports: [...SharedImports, IncomingExternalMailMenuComponent],
  templateUrl: './external-incoming-mails-grid-component.html',
  styleUrl: './external-incoming-mails-grid-component.scss'
})
export class ExternalIncomingMailsGridComponent implements OnInit {
  httpService = inject(HttpService);

  @Input() tab: string = 'initial';
  @Input() mails: IncomingExternalMail[] | undefined = undefined;
  @Output() menuSelected = new EventEmitter<ActionEvent<IncomingExternalMail>>();

  roles = Roles;
  status = MailStatus;
  tabs = Tabs;

  role = this.httpService.role;

  onActinSelected(action: ActionEvent<IncomingExternalMail>) {
    this.menuSelected.emit(action);
  }

  ngOnInit(): void {
  }

  onSend(mail: IncomingExternalMail) {
    this.menuSelected.emit(new ActionEvent('send', mail));
  }

  onAddComment(mail: IncomingExternalMail) {
    this.menuSelected.emit(new ActionEvent('add_comment', mail));
  }

  onAddProof(mail: IncomingExternalMail) {
    this.menuSelected.emit(new ActionEvent('treatment_proof', mail));
  }
}
