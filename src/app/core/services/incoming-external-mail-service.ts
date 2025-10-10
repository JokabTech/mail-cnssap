import { Injectable } from '@angular/core';
import { AbstractIncomingMailService } from './abstract-incoming-mail-service';
import { IncomingExternalMail } from '../../shared/models/incoming-external-mail';

@Injectable({
  providedIn: 'root'
})
export class IncomingExternalMailService extends AbstractIncomingMailService<IncomingExternalMail> {
  constructor() {
    super('incoming-external-mails', '/mails/incoming/external', 'incoming-external', 'incoming-external-mails');
  }
}
