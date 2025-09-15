import { Injectable } from '@angular/core';
import { MailBaseService } from './mail-base-service';
import { IncomingInternalMail } from '../../shared/models/Incoming-internal-mail';

@Injectable({
  providedIn: 'root'
})
export class IncomingInternalMailService extends MailBaseService<IncomingInternalMail> {
  constructor() {
    super('incoming-internal-mails', '/mails/incoming/internal', 'internal');
  }
}
