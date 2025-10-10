import { DocumentType } from './../../../shared/models/document_type';
import { Component, Input, OnInit } from '@angular/core';
import { OutgoingMail } from '../../../shared/models/outgoing-mail';
import { isOutgoingExternalMail } from '../../../shared/types/type-guards';
import { User } from '../../../shared/models/user';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { OutgoingInternalMail } from '../../../shared/models/outgoing-internal-mail';

@Component({
  selector: 'app-outgoing-report-list-view-component',
  imports: [...SharedBackend, ...SharedImports],
  templateUrl: './outgoing-report-list-view-component.html',
  styleUrl: './outgoing-report-list-view-component.scss'
})
export class OutgoingReportListViewComponent<T extends OutgoingMail> implements OnInit {
  @Input() mails: T[] = [];
  isExternal!: boolean;

  ngOnInit(): void {
    this.isExternal = isOutgoingExternalMail(this.mails[0]);
  }

  onFindSender(mail: T) {
    if (this.isExternal) {
      return mail.recipient;
    } else {
      const sender = mail.recipient as User;
      return sender.full_name;
    }
  }

  onFindDocumentType(mail: T): string | undefined {
    if (!this.isExternal) {
      const internalMail = mail as unknown as OutgoingInternalMail;
      return internalMail.documentType.designation;
    }
    return undefined;
  }
}
