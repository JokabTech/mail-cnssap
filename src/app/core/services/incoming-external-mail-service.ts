import { Injectable } from '@angular/core';
import { IncomingExternalMail } from '../../shared/models/Incoming-external-mail';
import { MailBaseService } from './mail-base-service';

@Injectable({
  providedIn: 'root'
})
export class IncomingExternalMailService extends MailBaseService<IncomingExternalMail> {
  constructor() {
    super('incoming-external-mails', '/mails/incoming/external');
  }
}
