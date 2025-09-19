import { Injectable } from '@angular/core';
import { AbstractOutgoingMailService } from './abstract-outgoing-mail-service';
import { OutgoingInternalMail } from '../../shared/models/outgoing-internal-mail';

@Injectable({
  providedIn: 'root'
})
export class OutgoingInternalMailService extends AbstractOutgoingMailService<OutgoingInternalMail> {
  constructor() {
    super('outgoing-internal-mails', '/mails/outgoing/internal', 'outgoing-internal');
  }
}
