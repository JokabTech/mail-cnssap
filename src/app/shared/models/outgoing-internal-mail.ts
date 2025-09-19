// shared/models/outgoing-internal-mail.ts
import { DocumentType } from './document_type';
import { OutgoingMail } from './outgoing-mail';
import { User } from './user';

export interface OutgoingInternalMail extends OutgoingMail {
  recipient: User;
  documentType: DocumentType;
}
