// shared/models/Incoming-internal-mail.ts
import { MailStatus } from '../enums/mail-status.enum';
import { Department } from './department';
import { DocumentType } from './document_type';
import { User } from './user';
import { IncomingMail } from './incoming-mail';

export class IncomingInternalMail implements IncomingMail {
  constructor(
    public id: number,
    public subject: string,
    public scanned_document: string,
    public mail_date: Date,
    public treatment_proof: string,
    public create_at: Date,
    public update_at: Date,
    public documentType: DocumentType,
    public sender: User,
    public department: Department,
    public director: User,
    public admin_assistant_comment: string,
    public annotated_by_aa: string,
    public annotated_by_sa: string,
    public senior_assistant_comment: string,
    public status: MailStatus,
    public adminAssistant: User,
    public seniorAssistant: User,
  ) {}
}
