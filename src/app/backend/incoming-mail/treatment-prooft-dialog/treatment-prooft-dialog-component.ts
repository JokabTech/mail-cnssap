import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { IncomingMail } from '../../../shared/models/incoming-mail';
import { HttpService } from '../../../core/services/http.service';
import { StateService } from '../../../core/services/state.service';
import { PdfService } from '../../../core/services/pdf-service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';

@Component({
  selector: 'app-treatment-prooft-dialog-component',
 imports: [...DialogImports, SharedImports],
  templateUrl: './treatment-prooft-dialog-component.html',
  styleUrl: './treatment-prooft-dialog-component.scss'
})
export class TreatmentProoftDialogComponent {
  readonly dialogRef = inject(MatDialogRef<TreatmentProoftDialogComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, mail: IncomingMail, endpoint: string } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);
  stateService = inject(StateService);
  dialog = inject(MatDialog);
  pdfService = inject(PdfService);
  router = inject(Router);

  disabled = false;
  errorMessage = '';
  public isDragging = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  uploadProgress = 0;

  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  onClose() {
    this.dialogRef.close();
  }

  triggerFileInput() {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.errorMessage = this.pdfService.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      this.errorMessage = this.pdfService.handleFile(files[0]);
    }
  }

  onSubmit() {
    if (!this.pdfService.localPdf) {
      this.message.openSnackBar('Veuillez sélectionner un fichier', 'Fermer', 4000);
      return;
    }
    this.sendTreatmentProof();
  }

  sendTreatmentProof() {
    // Use the dynamic endpoint from the dialog data
    this.http.url = `${this.data.endpoint}/treatment-proof`;
    this.http.sendFormData(JSON.stringify({ id: this.data.mail.id }), this.pdfService.localPdf, 'post').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.message.openSnackBar(`Preuve de traitement ajoutée avec succès !`, 'Fermer', 4000);
          this.dialogRef.close(event.body);
        }
      },
      error: (err) => {
        this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
        this.uploadProgress = 0;
      }
    });
  }

  public onPreviewDocument(): void {
    this.pdfService.displayLocalPdf();
  }
}
