import { MailStatus } from '../enums/mail-status.enum';
import { User } from './user';
import { BaseMail } from './base-mail';

export interface IncomingMail extends BaseMail {
  status: MailStatus;
  sender: User | string;
  treatment_proof?: string;
  admin_assistant_comment?: string;
  annotated_by_aa: boolean;
  senior_assistant_comment?: string;
  annotated_by_sa: boolean;
  director?: User;
  adminAssistant?: User;
  seniorAssistant?: User;
  agent?: User;
  days: number;
}
