import { Component, Input } from '@angular/core';
import { IncomingExternalMail } from '../../../../shared/models/Incoming-external-mail';
import { IncomingExternalMailMenuComponent } from '../incoming-external-mail-menu/incoming-external-mail-menu-component';
import { SharedImports } from '../../../../shared/imports/shared-imports';

@Component({
  selector: 'app-external-incoming-mails-table-component',
  imports: [...SharedImports, IncomingExternalMailMenuComponent],
  templateUrl: './external-incoming-mails-table-component.html',
  styleUrl: './external-incoming-mails-table-component.scss'
})
export class ExternalIncomingMailsTableComponent {
  @Input() mails: IncomingExternalMail[] = [];
}
