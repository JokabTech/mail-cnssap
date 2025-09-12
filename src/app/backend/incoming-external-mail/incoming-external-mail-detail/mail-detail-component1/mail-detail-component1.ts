import { PdfService } from './../../../../core/services/pdf-service';
import { Component, inject, Input } from '@angular/core';
import { IncomingExternalMail } from '../../../../shared/models/Incoming-external-mail';
import { DatePipe } from '@angular/common';
import { SharedImports } from '../../../../shared/imports/shared-imports';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html-pipe';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-mail-detail-component1',
  imports: [DatePipe, ...SharedImports, SafeHtmlPipe],
  templateUrl: './mail-detail-component1.html',
  styleUrl: './mail-detail-component1.scss'
})
export class MailDetailComponent1 {
  private pdfService = inject(PdfService);
  private message = inject(MessageService);

  @Input() mail!: IncomingExternalMail;
  render = true;

  onDisplayPdf() {
    if (this.mail && this.mail.scanned_document) {
      this.pdfService.displayOnlinePdf(this.mail.id, 'document');
    } else {
      this.message.openSnackBar('Aucun fichier à afficher', 'Fermer', 4000);
    }
  }
}
