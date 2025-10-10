import { BaseMail } from './base-mail';
import { User } from './user';

export interface OutgoingMail extends BaseMail {
  reference: string;
  is_transmitted: boolean;
  sender: User;
  recipient: User | string;
  acknowledgement_receipt?: string;
}
