import { BaseMail } from "../models/base-mail";
import { IncomingExternalMail } from "../models/incoming-external-mail";
import { IncomingMail } from "../models/incoming-mail";
import { OutgoingExternalMail } from "../models/outgoing-external-mail";
import { OutgoingMail } from "../models/outgoing-mail";

export function isIncomingMail(mail: BaseMail): mail is IncomingMail {
  return 'status' in mail;
}

export function isIncomingExternalMail(mail: IncomingMail): mail is IncomingExternalMail {
  return typeof mail.sender === 'string';
}

export function isOutgoingExternalMail(mail: OutgoingMail): mail is OutgoingExternalMail {
  return typeof mail.recipient === 'string';
}
