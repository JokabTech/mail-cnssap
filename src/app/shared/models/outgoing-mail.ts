import { BaseMail } from './base-mail';
import { User } from './user';

export interface OutgoingMail extends BaseMail {
  reference: string;
  is_transmitted: boolean;
  sender: User;
  acknowledgement_receipt?: string;
}
