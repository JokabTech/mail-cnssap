// shared/models/Incoming-external-mail.ts
import { MailStatus } from '../enums/mail-status.enum';
import { Department } from './department';
import { User } from './user';
import { IncomingMail } from './incoming-mail';

export class IncomingExternalMail implements IncomingMail {
  constructor(
    public id: number,
    public subject: string,
    public scanned_document: string,
    public mail_date: Date,
    public create_at: Date,
    public update_at: Date,
    public treatment_proof: string,
    public sender: string,
    public admin_assistant_comment: string,
    public annotated_by_aa: string,
    public annotated_by_sa: string,
    public senior_assistant_comment: string,
    public status: MailStatus,
    public director: User,
    public adminAssistant: User,
    public seniorAssistant: User,
    public department: Department,
    public agent: User,
  ) {}
}
