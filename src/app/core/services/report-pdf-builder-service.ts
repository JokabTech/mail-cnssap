import { inject, Injectable } from '@angular/core';
import { IncomingMail } from '../../shared/models/incoming-mail';
import { isIncomingExternalMail, isIncomingMail, isOutgoingExternalMail } from '../../shared/types/type-guards';
import { User } from '../../shared/models/user';
import { OutgoingMail } from '../../shared/models/outgoing-mail';
import { BaseMail } from '../../shared/models/base-mail';
import { IncomingInternalMail } from '../../shared/models/incoming-internal-mail';
import { OutgoingInternalMail } from '../../shared/models/outgoing-internal-mail';
import { PdfHeaderService } from './pdf-header-service';
import { PdfStylesService } from './pdf-styles-service';

const getSenderName = (mail: IncomingMail) => isIncomingExternalMail(mail) ? mail.sender : (mail.sender as User)?.full_name || 'Interne Inconnu';
const getRecipientName = (mail: OutgoingMail) => isOutgoingExternalMail(mail) ? mail.recipient : (mail.recipient as User)?.full_name || 'Interne Inconnu';


@Injectable({
  providedIn: 'root'
})
export class ReportPdfBuilderService {
  private pdfHeaderService = inject(PdfHeaderService);
  private pdfStylesService = inject(PdfStylesService);

  generateSingleAdaptedPdf(mails: BaseMail[], logo: string, title: string, subTitle: string) {
    if (mails.length === 0) {
      console.warn("La liste de mails est vide. Impossible de générer un rapport.");
      return;
    }

    const firstMail = mails[0];
    //let title: string = "Rapport Général des Courriers";
    let headers: any[] = [];
    let widths: any[] = [];
    let typeFilter: (mail: BaseMail) => boolean;

    // --- 1. DÉTERMINER LA STRUCTURE DU TABLEAU ---

    // Colonnes de base pour tous les mails
    const BASE_COLUMNS = [
      { header: { text: 'N°', bold: true }, key: 'id', width: 'auto', extractor: (mail: BaseMail) => mail.id.toString() },
      { header: { text: 'Sujet', bold: true }, key: 'subject', width: '*', extractor: (mail: BaseMail) => mail.subject },
      { header: { text: 'Direction', bold: true }, key: 'department', width: 'auto', extractor: (mail: BaseMail) => mail.department ? mail.department.acronym : '' },
      { header: { text: 'Date Courrier', bold: true }, key: 'mail_date', width: 'auto', extractor: (mail: BaseMail) => new Date(mail.mail_date).toLocaleDateString() },
      { header: { text: 'Date Création', bold: true }, key: 'create_at', width: 'auto', extractor: (mail: BaseMail) => new Date(mail.create_at).toLocaleDateString() },
      { header: { text: 'Doc', bold: true }, key: 'scanned_document', width: 'auto', extractor: (mail: BaseMail) => mail.scanned_document ? 'Oui' : 'Non' },
    ];

    // Colonnes spécifiques au flux Entrant
    const INCOMING_SPECIFIC = [
      { header: { text: 'Expéditeur', bold: true }, key: 'sender', width: 'auto', extractor: (mail: IncomingMail) => getSenderName(mail) },
      { header: { text: 'Destinataire', bold: true }, key: 'recipient', width: 'auto', extractor: (mail: IncomingMail) => mail.director ? mail.director.full_name : '' },
      { header: { text: 'Preuve', bold: true }, key: 'treatment_proof', width: 'auto', extractor: (mail: IncomingMail) => mail.treatment_proof ? 'Oui' : 'Non' },
    ];

    // Colonnes spécifiques au flux Sortant
    const OUTGOING_SPECIFIC = [
      { header: { text: 'Destinataire', bold: true }, key: 'recipient', width: 'auto', extractor: (mail: OutgoingMail) => getRecipientName(mail) },
      { header: { text: 'Référence', bold: true }, key: 'reference', width: 'auto', extractor: (mail: OutgoingMail) => mail.reference },
      { header: { text: 'Accusé', bold: true }, key: 'acknowledgement_receipt', width: 'auto', extractor: (mail: OutgoingMail) => mail.acknowledgement_receipt ? 'Oui' : 'Non' },
    ];

    // Colonne spécifique aux Mails Internes
    const INTERNAL_DOC_TYPE = { header: { text: 'Type', bold: true }, key: 'documentType', width: 'auto', extractor: (mail: IncomingInternalMail | OutgoingInternalMail) => mail.documentType ? mail.documentType.acronym : '' };


    // Détermination du type de structure
    if (isIncomingMail(firstMail)) {
      headers = [...BASE_COLUMNS, ...INCOMING_SPECIFIC];
      if (!isIncomingExternalMail(firstMail as IncomingMail)) {
        headers.push(INTERNAL_DOC_TYPE);
      }

    } else {
      headers = [...BASE_COLUMNS, ...OUTGOING_SPECIFIC];
      if (!isIncomingExternalMail(firstMail as IncomingMail)) {
        headers.push(INTERNAL_DOC_TYPE);
      }
    }


    // --- 2. GÉNÉRATION DU CORPS DU TABLEAU ---

    // Extraction des en-têtes et des largeurs
    const tableHeaders = headers.map(h => h.header);
    const tableWidths = headers.map(h => h.width);

    const tableBody = mails
      .map(mail => {
        return headers.map(column => {
          return column.extractor(mail as any) || '';
        });
      });


    // --- 3. DÉFINITION FINALE DU DOCUMENT PDF ---
    const documentDefinition = {
      pageOrientation: 'landscape',
      info: {
        title,
        author: 'CNSSAP'
      },
      content: [
        this.pdfHeaderService.getHear(logo, 'landscape'),
        {
          text: title.toUpperCase(),
          style: ['header', 'center', 'blue'],
          margin: [0, 0, 0, 3],
        },
        {
          text: subTitle,
          style: ['subHeader', 'center', 'blue'],
          margin: [0, 0, 0, 10],
        },
        {
          table: {
            headerRows: 0.5,
            widths: tableWidths,
            body: [
              tableHeaders,
              ...tableBody
            ]
          },
        }
      ],
      styles: this.pdfStylesService.getStyles(),
    };

    return documentDefinition;
  }
}
