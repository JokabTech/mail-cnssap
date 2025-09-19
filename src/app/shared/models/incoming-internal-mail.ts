// shared/models/incoming-internal-mail.ts
import { DocumentType } from './document_type';
import { IncomingMail } from './incoming-mail';
import { User } from './user';

export interface IncomingInternalMail extends IncomingMail {
  sender: User;
  documentType: DocumentType;
}
