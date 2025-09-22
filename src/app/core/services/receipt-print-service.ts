import { IncomingMail } from './../../shared/models/incoming-mail';
import { inject, Injectable } from '@angular/core';
import { ImageToBase64Service } from './image-to-base64-service';
import { PrinterService } from './printer-service';
import { HttpService } from './http.service';
import { RoleService } from './role-service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptPrintService {
  private imageToBase64Service = inject(ImageToBase64Service);
  private printerService = inject(PrinterService);
  private http = inject(HttpService);
  private roleService = inject(RoleService);

  print(incomingMail: IncomingMail): void {
    const imagePath = 'assets/images/logo.PNG';
    this.imageToBase64Service.getImageAsBase64(imagePath).subscribe({
      next: (logoBase64: string) => {
        this.printerService.printReceipt(logoBase64, incomingMail, this.http.authentication.full_name, this.roleService.build(this.http.role), this.http.baseUrl);
      },
      error: (err: any) => {
        console.error('Erreur lors de la conversion de l\'image en Base64 :', err);
      },
      complete: () => {
        console.log('Conversion de l\'image terminée.');
      }
    });
  }

}
