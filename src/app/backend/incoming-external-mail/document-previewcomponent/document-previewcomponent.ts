import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-document-previewcomponent',
  imports: [NgxExtendedPdfViewerModule, CommonModule, ...DialogImports, ...SharedImports],
  templateUrl: './document-previewcomponent.html',
  styleUrl: './document-previewcomponent.scss'
})
export class DocumentPreviewcomponent {
  pdfSrc: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<DocumentPreviewcomponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data.file && this.data.file instanceof File) {
      this.pdfSrc = URL.createObjectURL(data.file);
    } else {
      this.pdfSrc = this.data.file;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
