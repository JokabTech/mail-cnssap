import { Injectable } from '@angular/core';
import { AbstractOutgoingMailService } from './abstract-outgoing-mail-service';
import { OutgoingExternalMail } from '../../shared/models/outgoing-external-mail';

@Injectable({
  providedIn: 'root'
})
export class OutgoingExternalMailService extends AbstractOutgoingMailService<OutgoingExternalMail> {
  constructor() {
    super('outgoing-external-mails', '/mails/outgoing/external', 'outgoing-external');
  }
}
