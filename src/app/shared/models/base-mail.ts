import { Department } from './department';

export interface BaseMail {
  id: number;
  subject: string;
  mail_date: Date;
  scanned_document?: string;
  create_at: Date;
  update_at: Date;
  delete_at?: Date;
  department: Department;
}
