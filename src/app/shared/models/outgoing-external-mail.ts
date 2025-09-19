import { OutgoingMail } from './outgoing-mail';

export interface OutgoingExternalMail extends OutgoingMail {
  recipient: string;
  acknowledgement_receipt?: string;
}
