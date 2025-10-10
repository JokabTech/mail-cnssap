import { IncomingExternalMail } from "../models/incoming-external-mail";
import { IncomingInternalMail } from "../models/incoming-internal-mail";
import { OutgoingExternalMail } from "../models/outgoing-external-mail";
import { OutgoingInternalMail } from "../models/outgoing-internal-mail";

export type Mail = | IncomingExternalMail | IncomingInternalMail | OutgoingExternalMail | OutgoingInternalMail;
