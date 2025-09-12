import { Component } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

//import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
//(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

@Component({
  selector: 'app-pdf-viewer-component',
  imports: [],
  templateUrl: './pdf-viewer-component.html',
  styleUrl: './pdf-viewer-component.scss'
})
export class PdfViewerComponent {
  thumbnailSrc: string | null = null;

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);

      const loadingTask = (pdfjsLib as any).getDocument({ data: typedArray });
      const pdf = await loadingTask.promise;

      const page = await pdf.getPage(1); // première page

      const viewport = page.getViewport({ scale: 0.3 }); // scale pour miniature
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = { canvasContext: context, viewport: viewport };
      await page.render(renderContext).promise;

      // transformer le canvas en image
      this.thumbnailSrc = canvas.toDataURL('image/png');
    };

    fileReader.readAsArrayBuffer(file);
  }
}
