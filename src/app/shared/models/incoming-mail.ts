import { MailStatus } from '../enums/mail-status.enum';
import { User } from './user';
import { Department } from './department';

export interface IncomingMail {
  id: number;
  subject: string;
  scanned_document: string;
  mail_date: Date;
  create_at: Date;
  update_at: Date;
  treatment_proof: string;
  admin_assistant_comment: string;
  annotated_by_aa: string;
  annotated_by_sa: string;
  senior_assistant_comment: string;
  status: MailStatus;
  director: User;
  adminAssistant: User;
  seniorAssistant: User;
  department: Department;
  sender: string | User;
}
