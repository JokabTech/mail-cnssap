import { Component, computed, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DialogImports } from '../../imports/dialog-imports';
import { SharedImports } from '../../imports/shared-imports';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { HttpService } from '../../../core/services/http.service';
import { StateService } from '../../../core/services/state.service';
import { PdfService } from '../../../core/services/pdf-service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { User } from '../../models/user';
import { Subject, takeUntil } from 'rxjs';
import { UserFilterComponent } from '../../../backend/user/user-filter/user-filter-component';

@Component({
  selector: 'app-add-file-component',
  imports: [...DialogImports, SharedImports],
  templateUrl: './add-file-component.html',
  styleUrl: './add-file-component.scss'
})
export class AddFileComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddFileComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, id: number, subject: string, endpoint: string, target: 'treatment-proof' | 'acknowledgement-receipt' } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);
  stateService = inject(StateService);
  dialog = inject(MatDialog);
  pdfService = inject(PdfService);
  router = inject(Router);

  private unsubscribe$ = new Subject<void>();

  disabled = false;
  errorMessage = '';
  public isDragging = false;
  loading = false;
  users: User[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  uploadProgress = 0;

  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  form = new FormControl<string[] | null>(null);

  ngOnInit(): void {
    if (this.data.target === 'treatment-proof') {
      this.onFindUsers();
    }
  }

  onFindUsers(): void {
    this.loading = true;
    this.http.url = `users/list`;
    this.unsubscribe$.next();
    this.http
      .get<User[]>()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (err) => {
          this.loading = false;
          this.message.openSnackBar(err, 'Fermer', 800);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

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
    this.sendFile();
  }

  sendFile() {
    this.http.url = `${this.data.endpoint}`;
    this.http.sendFormData(JSON.stringify({ id: this.data.id, cc: this.form.value === null ? [] : this.form.value }), this.pdfService.localPdf, 'post').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.message.openSnackBar(`Opération effectuée avec succès !`, 'Fermer', 4000);
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

  onSearchUser() {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Rechercher un utilisateur`, multiple: true };
    conf.minWidth = this.xSmallOrSmall() ? '96vw' : '57vw';
    const dialogRef = this.dialog.open(UserFilterComponent, conf);
    dialogRef.afterClosed().subscribe((users: User[]) => {
      if (users && users.length > 0) {
        const selectedEmails = users.map(user => user.email);
        this.form.setValue(selectedEmails);
      }
    });
  }

  test() {
    console.log(this.form.value);
  }

}
