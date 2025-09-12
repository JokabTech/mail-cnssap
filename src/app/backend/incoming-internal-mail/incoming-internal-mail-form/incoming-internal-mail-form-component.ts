import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PdfService } from '../../../core/services/pdf-service';
import { DocumentType } from '../../../shared/models/document_type';
import { HttpService } from '../../../core/services/http.service';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../../core/services/message.service';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { BackComponent } from '../../../shared/components/back/back-component';
import { User } from '../../../shared/models/user';
import { FormActionPayload } from '../../../shared/models/form-action-payload';
import { IncomingInternalMail } from '../../../shared/models/Incoming-internal-mail';
import { provideNativeDateAdapter } from '@angular/material/core';
import { StateService } from '../../../core/services/state.service';
import { Header } from '../../../shared/models/header';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Roles } from '../../../shared/enums/roles-enum';

@Component({
  selector: 'app-incoming-internal-mail-form-component',
  imports: [...SharedBackend, ...SharedImports, EditorComponent, BackComponent],
  templateUrl: './incoming-internal-mail-form-component.html',
  styleUrl: './incoming-internal-mail-form-component.scss',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    provideNativeDateAdapter()
  ]
})
export class IncomingInternalMailFormComponent implements OnInit, OnDestroy {
  private unsubscribeDir$ = new Subject<void>();
  private unsubscribeSender$ = new Subject<void>();
  private unsubscribeDoc$ = new Subject<void>();
  private unsubscribeMail$ = new Subject<void>();
  private unsubscribeAA$ = new Subject<void>();
  private unsubscribeSA$ = new Subject<void>();

  private http = inject(HttpService);
  private message = inject(MessageService);
  private stateService = inject(StateService);
  public pdfService = inject(PdfService);
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  form!: FormGroup;
  isDragging = false;
  end = false;
  uploadProgress = 0;
  statusMessage = '';

  supportedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  errorMessage = '';

  directors: User[] = [];
  senders: User[] = [];
  documentTypes: DocumentType[] = [];
  formActionPayload!: FormActionPayload<IncomingInternalMail>;
  mail!: IncomingInternalMail;

  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount'
  };

  role = this.http.role;
  roles = Roles;

  admin_assistants: User[] = [];
  senior_assistants: User[] = [];

  isFormReady = false;

  constructor() {
    this.formActionPayload = JSON.parse(<string>sessionStorage.getItem('formActionPayload'));
    //this.mail = this.formActionPayload.data;
    this.stateService.setHeader(new Header(`FORMULAIRE D'AJOUT DU COURRIER ENTRANT INTERNE`, 'Liste des correspondances internes reçues', 'flight_land'));
  }

  ngOnDestroy(): void {
    this.pdfService.localPdf = null;
    this.pdfService.onLinePdf = null;
    sessionStorage.removeItem('incomingExternalMail');

    this.unsubscribeDir$.next();
    this.unsubscribeDir$.complete();

    this.unsubscribeSender$.next();
    this.unsubscribeSender$.complete();

    this.unsubscribeDoc$.next();
    this.unsubscribeDoc$.complete();

    this.unsubscribeAA$.next();
    this.unsubscribeAA$.complete();

    this.unsubscribeSA$.next();
    this.unsubscribeSA$.complete();

    this.unsubscribeMail$.next();
    this.unsubscribeMail$.complete();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private initForm(): void {
    this.form = new FormGroup({
      subject: new FormControl(this.mail ? this.mail.subject : '', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]),

      mail_date: new FormControl(this.mail ? this.mail.mail_date : '', [Validators.required]),
      sender_id: new FormControl(this.mail && this.mail.sender ? this.mail.sender.id : '', [Validators.required]),

      director_id: new FormControl(this.mail && this.mail.director ? this.mail.director.id : '', [Validators.required]),
      document_type_id: new FormControl(this.mail && this.mail.documentType ? this.mail.documentType.id : '', [Validators.required]),
    });

    if (this.role === Roles.EXECUTIVE_SECRETARY) {
      this.form.addControl('admin_assistant_id', new FormControl(this.mail && this.mail.adminAssistant ? this.mail.adminAssistant.id : '', [Validators.required]));
    } else if (this.role === Roles.ADMIN_ASSISTANT) {
      this.form.addControl('admin_assistant_comment', new FormControl(this.mail ? this.mail.admin_assistant_comment : '', [Validators.minLength(10)]));
      this.form.addControl('senior_assistant_id', new FormControl(this.mail && this.mail.seniorAssistant ? this.mail.seniorAssistant.id : '', [Validators.required]));
      this.form.addControl('should_send_document', new FormControl(false, [Validators.required]));
    } else if (this.role === Roles.SENIOR_ASSISTANT) {
      this.form.addControl('senior_assistant_comment', new FormControl(this.mail ? this.mail.senior_assistant_comment : '', [Validators.minLength(10)]));
      this.form.addControl('should_send_document', new FormControl(false, [Validators.required]));
    }
  }

  getErrorSubject(): string {
    return this.form.get('subject')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('subject')!.hasError('minlength') ? `L'objet doit contenir au moins 3 caractères.` :
        this.form.get('subject')!.hasError('maxlength') ? `L'objet ne peut pas dépasser 200 caractères.` : '';
  }

  getErrorComment(): string {
    return this.form.get('comment')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('comment')!.hasError('minlength') ? `Le commentaire doit contenir au moins 3 caractères.` : '';
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

  add() {
    this.http.url = `incoming-internal-mails`;
    this.http.sendFormData<string>(JSON.stringify(this.form.value), this.pdfService.localPdf, 'post').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.message.openSnackBar(`Enregistrement effectué avec succès !`, 'Fermer', 4000);
          //this.isSubmitting = true;
          this.form.reset();
          this.pdfService.localPdf = null;
          this.end = true;
        }
      },
      error: (err) => {
        this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
        this.uploadProgress = 0;
      },
      complete: () => {
        this.router.navigateByUrl('/mails/incoming/internal');
      },
    });
  }

  update() {
    this.http.url = `incoming-internal-mails/${this.formActionPayload.data.id}`;
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
        this.router.navigateByUrl('/mails/incoming/internal');
      },
    });
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

  onDisplayOnlinePdf() {
    this.pdfService.displayOnlinePdf(this.mail.id, 'document', 'internal');
  }

  onDisplayLocalPdf() {
    this.pdfService.displayLocalPdf();
  }

  loadData(){
    const dataSources: { [key: string]: Observable<any> } = {
      directors: this.getDirectors(),
      documentTypes: this.getDocumentTypes(),
      senders: this.getSenders(),
    };

    if (this.role === Roles.EXECUTIVE_SECRETARY) {
      dataSources['admin_assistants'] = this.getAdminAssistant();
    } else if (this.role === Roles.ADMIN_ASSISTANT) {
      dataSources['senior_assistants'] = this.getSeniorAssistant();
    }

    if (this.formActionPayload.action === 'edit_mail') {
      dataSources['mail'] = this.getMail();
    }

    forkJoin(dataSources).subscribe({
      next: (results) => {
        this.directors = results['directors'];
        this.documentTypes = results['documentTypes'];
        this.senders = results['senders'];

        if (this.role === Roles.EXECUTIVE_SECRETARY) {
          this.admin_assistants = results['admin_assistants'];
        } else if (this.role === Roles.ADMIN_ASSISTANT) {
          this.senior_assistants = results['senior_assistants'];
        }

        if (this.formActionPayload.action === 'edit_mail') {
          this.mail = results['mail'];
        }

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

  private getDocumentTypes(): Observable<DocumentType[]> {
    this.http.url = `document-types`;
    return this.http.get<DocumentType[]>().pipe(takeUntil(this.unsubscribeDoc$));
  }

  private getSenders(): Observable<User[]> {
    this.http.url = `users/with-roles`;
    return this.http.get<User[]>().pipe(takeUntil(this.unsubscribeSender$));
  }

  private getAdminAssistant(): Observable<User[]> {
    this.http.url = `users/by-role/ADMIN_ASSISTANT`;
    return this.http.get<User[]>().pipe(takeUntil(this.unsubscribeAA$));
  }

  private getSeniorAssistant(): Observable<User[]> {
    this.http.url = `users/by-role/SENIOR_ASSISTANT`;
    return this.http.get<User[]>().pipe(takeUntil(this.unsubscribeSA$));
  }

  private getMail(): Observable<IncomingInternalMail> {
    this.http.url = `incoming-internal-mails/${this.formActionPayload.data.id}`;
    return this.http.get<IncomingInternalMail>().pipe(takeUntil(this.unsubscribeMail$));
  }
}
