// shared/models/incoming-external-mail.ts
import { IncomingMail } from './incoming-mail';

export interface IncomingExternalMail extends IncomingMail {
  sender: string;
}
