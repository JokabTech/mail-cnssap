import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { IncomingMail } from '../../../shared/models/incoming-mail';
import { isIncomingExternalMail } from '../../../shared/types/type-guards';
import { User } from '../../../shared/models/user';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { IncomingMailMenuComponent } from "../../incoming-mail/chunks/incoming-mail-menu/incoming-mail-menu-component";
import { ActionEvent } from '../../../shared/models/action-event';
import { HttpService } from '../../../core/services/http.service';
import { Roles } from '../../../shared/enums/roles-enum';
import { MailStatus } from '../../../shared/enums/mail-status.enum';
import { Tabs } from '../../../shared/enums/tab-enum';

@Component({
  selector: 'app-incoming-report-list-view-component',
  imports: [...SharedBackend, ...SharedImports, IncomingMailMenuComponent],
  templateUrl: './incoming-report-list-view-component.html',
  styleUrl: './incoming-report-list-view-component.scss'
})
export class IncomingReportListViewComponent<T extends IncomingMail> implements OnInit {
  httpService = inject(HttpService);

  @Input() mails: T[] = [];
  @Input() forReport = true;

  @Output() menuSelected = new EventEmitter<ActionEvent<T>>();

  isExternal!: boolean;

  roles = Roles;
  status = MailStatus;
  tabs = Tabs;

  role = this.httpService.role;

  ngOnInit(): void {
    console.log(this.mails);
    this.isExternal = isIncomingExternalMail(this.mails[0]);
  }

  onFindSender(mail: T) {
    if (this.isExternal) {
      return mail.sender;
    } else {
      const sender = mail.sender as User;
      return sender.full_name;
    }
  }

  onActinSelected(action: ActionEvent<T>) {
    this.menuSelected.emit(action);
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
