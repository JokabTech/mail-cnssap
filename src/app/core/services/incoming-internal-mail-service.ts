import { Injectable } from '@angular/core';
import { AbstractIncomingMailService } from './abstract-incoming-mail-service';
import { IncomingInternalMail } from '../../shared/models/incoming-internal-mail';

@Injectable({
  providedIn: 'root'
})
export class IncomingInternalMailService extends AbstractIncomingMailService<IncomingInternalMail> {
  constructor() {
    super('incoming-internal-mails', '/mails/incoming/internal', 'incoming-internal', 'incoming-internal-mails');
  }
}
