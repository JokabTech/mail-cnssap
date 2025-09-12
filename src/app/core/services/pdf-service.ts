import { computed, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { StateService } from './state.service';
import { HttpService } from './http.service';
import { MessageService } from './message.service';
import { DocumentPreviewcomponent } from '../../backend/incoming-external-mail/document-previewcomponent/document-previewcomponent';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  private supportedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  localPdf!: File | null;
  onLinePdf!: string | null;
  current_mail!: number;
  current_target!: string;

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  constructor(
    public stateService: StateService,
    private http: HttpService,
    private message: MessageService,
    private dialog: MatDialog
  ) {
  }

  private displayPdf(file: File | string | null) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { file, title: 'Aperçu du courrier' };

    conf.minWidth = this.xSmallOrSmall() ? '96vw' : '68vw';
    this.dialog.open(DocumentPreviewcomponent, conf);

  }

  public displayLocalPdf(): void {
    this.displayPdf(this.localPdf);
  }

  public displayOnlinePdf(mail_id: number, target: string, dir = 'external'): void {
    if (this.onLinePdf && this.current_mail === mail_id && this.current_target === target) {
      this.displayPdf(this.onLinePdf);
    } else {
      if (this.onLinePdf) {
        URL.revokeObjectURL(this.onLinePdf);
      }

      this.http.url = `incoming-${dir}-mails/${target}/${mail_id}`;
      this.http.getPdfDocument().subscribe({
        next: (pdfBlob: Blob) => {
          this.onLinePdf = URL.createObjectURL(pdfBlob);
        },
        error: (err) => {
          this.message.openSnackBar('Une erreur est survenue', 'Fermer', 4000);
        },
        complete: () => {
          this.displayPdf(this.onLinePdf);
          this.current_mail = mail_id;
          this.current_target = target;
        }
      });
    }
  }

  handleFile(file: File | null): string {
    let errorMessage = '';
    if (!file || this.supportedTypes.includes(file.type)) {
      this.localPdf = file;
      errorMessage = '';
    } else {
      errorMessage = `Le fichier "${file.name}" n'est pas un type supporté. Veuillez sélectionner un PDF, un PNG ou un JPG.`;
      this.localPdf = null;
    }
    return errorMessage;
  }


}
