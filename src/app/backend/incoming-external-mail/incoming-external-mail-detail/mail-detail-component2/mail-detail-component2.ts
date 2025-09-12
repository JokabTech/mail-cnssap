import { Component, Input } from '@angular/core';
import { IncomingExternalMail } from '../../../../shared/models/Incoming-external-mail';

@Component({
  selector: 'app-mail-detail-component2',
  imports: [],
  templateUrl: './mail-detail-component2.html',
  styleUrl: './mail-detail-component2.scss'
})
export class MailDetailComponent2 {
  @Input() mail!: IncomingExternalMail;
}
