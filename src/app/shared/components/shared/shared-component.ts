import { Component, inject, OnInit } from '@angular/core';
import { DialogImports } from '../../imports/dialog-imports';
import { SharedImports } from '../../imports/shared-imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { BaseMail } from '../../models/base-mail';

@Component({
  selector: 'app-shared-component',
  imports: [...DialogImports, SharedImports],
  templateUrl: './shared-component.html',
  styleUrl: './shared-component.scss'
})
export class SharedComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SharedComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, mail: BaseMail, endpoint: string } = inject(MAT_DIALOG_DATA);

  baseUrl = window.location.origin;
  shareUrl = ``;
  copy = false;

  isNativeShareSupported!: boolean;

  ngOnInit(): void {
    this.isNativeShareSupported = !!navigator.share;;
    this.shareUrl = `${this.baseUrl}/${this.data.endpoint}/detail/${this.data.mail.id}`
  }

  async shareNative(shareUrl: string, title: string) {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Je vous invite à consulter ce document : ${title}`,
          url: shareUrl,
        });
      } catch (error) {
        this.copyLink(shareUrl);
      }
    } else {
      this.message.openSnackBar('Impossible de partager', 'Fermer', 4000);
    }
  }

  async copyLink(shareUrl: string) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      this.copy = true;
      this.message.openSnackBar('Copié dans le presse-papiers', 'Fermer', 4000);
    } catch (err) {
      this.message.openSnackBar(`Désolé, la copie automatique a échoué. Veuillez copier l'URL manuellement.`, 'Fermer', 4000);
    }
  }

  shareByEmail(shareUrl: string, sub: string) {
    const subject = encodeURIComponent(`Partage de document : ${sub}`);
    const body = encodeURIComponent(
      `Bonjour,\n\n` +
      `Je viens de vous partager le document "${sub}".\n\n` +
      `Veuillez trouver le lien d'accès ci-dessous :\n\n` +
      `${shareUrl}\n\n` +
      `Cordialement,`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  onClose() {
    this.dialogRef.close();
  }
}
