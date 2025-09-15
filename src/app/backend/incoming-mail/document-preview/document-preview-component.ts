import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-document-preview-component',
  imports: [NgxExtendedPdfViewerModule, CommonModule, ...DialogImports, ...SharedImports],
  templateUrl: './document-preview-component.html',
  styleUrl: './document-preview-component.scss'
})
export class DocumentPreviewComponent {
  pdfSrc: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<NgxExtendedPdfViewerModule>,
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
