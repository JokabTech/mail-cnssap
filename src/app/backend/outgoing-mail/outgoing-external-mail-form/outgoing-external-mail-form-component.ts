import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PdfService } from '../../../core/services/pdf-service';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { FormActionPayload } from '../../../shared/models/form-action-payload';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user';
import { provideNativeDateAdapter } from '@angular/material/core';
import { OutgoingInternalMail } from '../../../shared/models/outgoing-internal-mail';
import { BackComponent } from "../../../shared/components/back/back-component";

@Component({
  selector: 'app-outgoing-external-mail-form-component',
  imports: [...SharedBackend, ...SharedImports, BackComponent],
  templateUrl: './outgoing-external-mail-form-component.html',
  styleUrl: './outgoing-external-mail-form-component.scss',
  providers: [
    provideNativeDateAdapter()
  ]
})
export class OutgoingExternalMailFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  public pdfService = inject(PdfService);
  private http = inject(HttpService);
  private message = inject(MessageService);
  private router = inject(Router);

  public isDragging = false;

  supportedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  errorMessage = '';

  uploadProgress = 0;
  statusMessage = '';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private unsubscribeDir$ = new Subject<void>();
  directors: User[] = [];
  isFormReady = false;
  formActionPayload: FormActionPayload<OutgoingInternalMail>;
  mail!: OutgoingInternalMail;

  constructor() {
    this.formActionPayload = JSON.parse(<string>sessionStorage.getItem('formActionPayload'));
    this.mail = this.formActionPayload.data;
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('incomingExternalMail');
    this.pdfService.localPdf = null;
    this.pdfService.onLinePdf = null;

    this.unsubscribeDir$.next();
    this.unsubscribeDir$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup({
      subject: new FormControl(this.mail ? this.mail.subject : '', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
      mail_date: new FormControl(this.mail ? this.mail.mail_date : '', [Validators.required]),
      reference: new FormControl(this.mail ? this.mail.reference : '', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      recipient: new FormControl(this.mail ? this.mail.recipient : '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
      sender_id: new FormControl(this.mail && this.mail.sender ? this.mail.sender.id :  '', [Validators.required]),
    });
  }

  getErrorSubject(): string {
    return this.form.get('subject')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('subject')!.hasError('minlength') ? `L'objet doit contenir au moins 5 caractères.` :
        this.form.get('subject')!.hasError('maxlength') ? `L'objet ne peut pas dépasser 200 caractères.` : '';
  }

  getErrorReference(): string {
    return this.form.get('reference')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('reference')!.hasError('minlength') ? `L doit contenir au moins 3 caractères.` :
        this.form.get('reference')!.hasError('maxlength') ? `La réference ne peut pas dépasser 30 caractères.` : '';
  }

  getErrorRecipient(): string {
    return this.form.get('recipient')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('recipient')!.hasError('minlength') ? `Le destinataire doit contenir au moins 5 caractères.` :
        this.form.get('recipient')!.hasError('maxlength') ? `Le destinataire ne peut pas dépasser 150 caractères.` : '';
  }

  getErrorRequired(cible: string): string {
    return this.form.get(cible)!.hasError('required') ? 'Ce champ est requis' : '';
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
      this.pdfService.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      this.pdfService.handleFile(files[0]);
    }
  }

  onDisplayLocalPdf() {
    this.pdfService.displayLocalPdf();
  }

  onDisplayOnlinePdf() {
    this.pdfService.displayOnlinePdf(this.formActionPayload.data.id, 'document', 'outgoing-external-mails');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.openSnackBar('Veuillez corriger les erreurs du formulaire.', 'Fermer', 4000);
      return;
    }

    if (this.formActionPayload.action === 'add') {
      this.add();
    } else {
      this.update();
    }
  }

  add() {
    this.http.url = `outgoing-external-mails`;
    this.http.sendFormData<string>(JSON.stringify(this.form.value), this.pdfService.localPdf, 'post').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.message.openSnackBar(`Enregistrement effectué avec succès !`, 'Fermer', 4000);
          //this.isSubmitting = true;
          this.form.reset();
          this.pdfService.localPdf = null;
        }
      },
      error: (err) => {
        this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
        this.uploadProgress = 0;
      },
      complete: () => {
        this.router.navigateByUrl('/mails/outgoing/external');
      },
    });
  }

  update() {
    this.http.url = `outgoing-external-mails/${this.formActionPayload.data.id}`;
    this.http.sendFormData<string>(JSON.stringify(this.form.value), this.pdfService.localPdf, 'patch').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.message.openSnackBar(`Modification effectué avec succès !`, 'Fermer', 4000);
          //this.isSubmitting = true;
          //this.form.reset();
          //this.pdfService.localPdf = null;
        }
      },
      error: (err) => {
        this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
        this.uploadProgress = 0;
      },
      complete: () => {
        this.router.navigateByUrl('/mails/outgoing/external');
      },
    });
  }

  loadData() {
    const dataSources: { [key: string]: Observable<any> } = {
      directors: this.getDirectors(),
    };

    forkJoin(dataSources).subscribe({
      next: (results) => {
        this.directors = results['directors'];
        this.initForm();
        this.isFormReady = true;
      },
      error: (err) => {
        this.message.openSnackBar('Une erreur est survenue lors du chargement des données. Veuillez réessayer.', 'Fermer', 800);
      },
    });
  }

  private getDirectors(): Observable<User[]> {
    this.http.url = `users/by-role/DIRECTOR`;
    return this.http.get<User[]>().pipe(takeUntil(this.unsubscribeDir$));
  }
}
