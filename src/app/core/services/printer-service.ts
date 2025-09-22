import { IncomingMail } from './../../shared/models/incoming-mail';
import { PdfStylesService } from './pdf-styles-service';
import { inject, Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfHeaderService } from './pdf-header-service';
import { IncomingInternalMail } from '../../shared/models/incoming-internal-mail';
import { IncomingExternalMail } from '../../shared/models/incoming-external-mail';
import { formatDate } from '@angular/common';
//pdfMake.vfs = pdfFonts.vfs;

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  private pdfHeaderService = inject(PdfHeaderService);
  private pdfStylesService = inject(PdfStylesService);

  private print(documentDefinition: any, action: 'open' | 'print' | 'download', name = 'document') {
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition, undefined, undefined, pdfFonts.vfs).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(name + '.pdf'); break;
      default: pdfMake.createPdf(documentDefinition).open(); break;
    }
  }

  public printReceipt(logo: string, mail: IncomingMail, recipient: string, role: string, url: string) {
    const documentDefinition = this.buildReceipt(logo, mail, recipient, role, url);
    this.print(documentDefinition, 'open');
  }

  private buildReceipt(logo: string, mail: IncomingMail, recipient: string, role: string, url: string) {
    const sender = this.getSenderForIncoming(mail);
    return {
      info: {
        title: `Accusé de réception pour ${sender}`.toUpperCase(),
        author: 'CNSSAP'
      },
      content: [
        this.pdfHeaderService.getHear(logo),
        {
          text: 'ACCUSÉ DE RÉCEPTION',
          style: ['header', 'center', 'blue'],
          margin: [0, 0, 0, 10],
        },
        //-------------------------------------------------------------------------------------------------------------
        {
          text: '1. INFORMATIONS SUR LE COURRIER REÇU',
          style: ['subHeader', 'blue'],
          margin: [0, 0, 0, 8]
        },
        /*
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }],
          margin: [0, 0, 0, 10]
        },
        */
        {
          ul: [
            {
              text: [
                { text: 'Référence de l\'accusé : ', style: ['label'] },
                `AR-${formatDate(mail.create_at, 'yyyy', 'en')}-#${mail.id}`
              ],
              margin: [0, 0, 0, 1],
            },
            {
              text: [
                { text: 'Date de réception : ', style: 'label' },
                `${formatDate(mail.create_at, 'dd/MM/yyyy', 'en')}`
              ],
              margin: [0, 0, 0, 1]
            },
            {
              text: [
                { text: 'Heure de réception : ', style: 'label' },
                `${formatDate(mail.create_at, 'HH:ss', 'en')}`
              ],
              margin: [0, 0, 0, 1]
            },
            {
              text: [
                { text: 'Type de document : ', style: 'label' },
                'Lettre'
              ],
              margin: [0, 0, 0, 1]
            },
            {
              text: [
                { text: 'Objet du courrier : ', style: 'label' },
                `${mail.subject}`
              ],
              margin: [0, 0, 0, 1]
            },
            {
              text: [
                { text: 'Émetteur : ', style: 'label' },
                `${sender}`
              ],
            },

          ],
          margin: [15, 5, 0, 0]
        },

        //-------------------------------------------------------------------------------------------------------------
        {
          text: '2. MESSAGE DE CONFIRMATION',
          style: ['subHeader', 'blue'],
          margin: [0, 15, 0, 8]
        },
        /*
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }],
          margin: [0, 0, 0, 10]
        },
        */
        {
          text: [
            'Nous, la Caisse Nationale de Sécurité Sociale des Agents Publics de l\'État (CNSSAP), confirmons avoir reçu votre courrier tel que détaillé ci-dessus. Votre document a été enregistré sous la référence ',
            { text: 'AR-2025-#1', bold: true },
            ' et sera traité par la direction comptétente.',
            '\n\n',
            { text: 'Pour toute question ou suivi, veuillez vous munir de cette référence.', italics: true }
          ],
          alignment: 'justify'
        },
        //-------------------------------------------------------------------------------------------------------------
        {
          text: '3. VALIDATION PAR LA CNSSAP & SUIVI NUMÉRIQUE',
          style: ['subHeader', 'blue'],
          margin: [0, 20, 0, 8]
        },
        /*
        {
          canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }],
          margin: [0, 0, 0, 10]
        },
        */

        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                {
                  stack: [
                    { text: 'Validation Manuelle', bold: true, decoration: 'underline' },
                    {
                      text: 'Cachet du service réception :',
                      margin: [0, 10, 0, 5]
                    },
                    ///*
                    {
                      text: '',
                      margin: [0, 0, 0, 80]
                    },
                    //*/
                    /*
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 200, // Largeur de la zone, à ajuster si besoin
                          h: 80,  // Hauteur de la zone
                          lineWidth: 0.2,
                          lineColor: '#cccccc'
                        }
                      ],
                      margin: [0, 0, 0, 20]
                    },
                    */
                    {
                      text: 'Signature du réceptionnaire',
                      margin: [0, 0, 0, 5]
                    },
                    ///*
                    {
                      text: '',
                      margin: [0, 0, 0, 20]
                    },
                    //*/
                    /*
                    {
                      canvas: [
                        {
                          type: 'rect',
                          x: 0,
                          y: 0,
                          w: 200, // Largeur de la zone, à ajuster si besoin
                          h: 35,  // Hauteur de la zone
                          lineWidth: 0.2,
                          lineColor: '#cccccc'
                        }
                      ],
                      margin: [0, 0, 0, 10]
                    },
                    */
                    {
                      text: `Nom complet : ${recipient}`,
                      style: 'label'
                    },
                    {
                      text: `Fonction : ${role}`,
                      style: 'label'
                    }
                  ]
                },
                // Colonne de droite : Suivi Numérique
                {
                  stack: [
                    { text: 'Accès Rapide au Suivi', bold: true, decoration: 'underline', alignment: 'right' },
                    {
                      text: 'Scannez le QR Code pour le suivi',
                      alignment: 'right',
                      margin: [0, 10, 0, 15]
                    },
                    // Espace pour le QR Code
                    {
                      qr: `${url}/detai/1`,
                      fit: 140, // Taille du QR Code
                      alignment: 'right',
                      margin: [0, 0, 13, 20]
                    }
                  ]
                }
              ]
            ]
          },
          // La propriété layout: 'noBorders' rend les bordures du tableau invisibles.
          layout: 'noBorders',
          margin: [0, 10, 0, 0]
        },
        {
          columns: [
            {},
            {
              text: 'Fait à Kinshasa le 22/09/2025',
              alignment: 'right',
              margin: [0, 30, 0, 0],
              style: 'label',
            }
          ]
        },
        /*
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 5,
              x2: 515, y2: 5,
              lineWidth: 1,
              lineColor: '#007ac3'
            },

          ],
          margin: [0, 10, 0, 10]
        },
        [
          {
            text: 'Caisse Nationale de Sécurité Sociale des Agents Publics de l\'État (CNSSAP)',
            alignment: 'center',
            style: 'footer'
          },
          {
            text: '[Adresse postale de la CNSSAP]',
            alignment: 'center',
            style: 'footer'
          },
          {
            text: '[Numéro de téléphone de la CNSSAP] | [Site web ou adresse e-mail]',
            alignment: 'center',
            style: 'footer'
          }
        ]
        */
      ],
      footer: () => {
        return {
          stack: [
            {
              canvas: [{
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 595,
                y2: 0,
                lineWidth: 0.5,
                lineColor: '#007ac3'
              }],
            },
            // Ajout d'une marge supérieure pour l'espace entre la ligne et le texte
            [
              {
                text: 'Kinsha, commune de gombe, aveu de la plateau numéro 45',
                alignment: 'center',
                style: 'footer',
                margin: [0, 8, 0, 0]
              },
              {
                text: '+243896543987 | http://cnssap.cd',
                alignment: 'center',
                style: 'footer'
              }
            ]
          ],
        };
      },
      styles: this.pdfStylesService.getStyles(),
    }
  }

  private getSenderForIncoming(item: IncomingMail): string {
    if ('documentType' in item) {
      const internalMail = item as IncomingInternalMail;
      return internalMail.sender.full_name;
    }

    if ('sender' in item) {
      const externalMail = item as IncomingExternalMail;
      return externalMail.sender;
    }
    return 'Inconnu';
  }

}
