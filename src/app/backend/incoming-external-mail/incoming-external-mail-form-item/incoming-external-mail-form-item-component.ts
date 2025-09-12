import { MatDialog } from '@angular/material/dialog';
import { Component, computed, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpEventType } from '@angular/common/http';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { Router } from '@angular/router';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { StateService } from '../../../core/services/state.service';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { PdfService } from '../../../core/services/pdf-service';
import { FormActionPayload } from '../../../shared/models/form-action-payload';
import { IncomingExternalMail } from '../../../shared/models/Incoming-external-mail';
import { User } from '../../../shared/models/user';
import { Roles } from '../../../shared/enums/roles-enum';

@Component({
  selector: 'app-incoming-external-mail-form-item-component',
  imports: [...SharedBackend, ...SharedImports, EditorComponent],
  templateUrl: './incoming-external-mail-form-item-component.html',
  styleUrl: './incoming-external-mail-form-item-component.scss',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    provideNativeDateAdapter()
  ]
})
export class IncomingExternalMailFormItemComponent implements OnInit, OnDestroy {
  private stateService = inject(StateService);
  private http = inject(HttpService);
  private message = inject(MessageService);
  private dialog = inject(MatDialog);
  public pdfService = inject(PdfService);
  private router = inject(Router);

  private unsubscribeDir$ = new Subject<void>();
  private unsubscribeMail$ = new Subject<void>();
  private unsubscribeAA$ = new Subject<void>();
  private unsubscribeSA$ = new Subject<void>();

  role = this.http.role;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  form!: FormGroup;

  public isDragging = false;

  supportedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  errorMessage = '';

  uploadProgress = 0;
  end = false;
  statusMessage = '';

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  directors: User[] = [];
  admin_assistants: User[] = [];
  senior_assistants: User[] = [];

  formActionPayload: FormActionPayload<IncomingExternalMail>;
  mail!: IncomingExternalMail;

  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount'
  };

  roles = Roles;
  isFormReady = false;

  constructor() {
    this.formActionPayload = JSON.parse(<string>sessionStorage.getItem('formActionPayload'));
    this.mail = this.formActionPayload.data;
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('incomingExternalMail');
    this.pdfService.localPdf = null;
    this.pdfService.onLinePdf = null;

    this.unsubscribeDir$.next();
    this.unsubscribeDir$.complete();

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
      sender: new FormControl(this.mail ? this.mail.sender : '', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]),
      director_id: new FormControl(this.mail && this.mail.director ? this.mail.director.id : '', [Validators.required]),
    });

    if (this.role === Roles.MAIL_ARCHIVES_AGENT) {
      this.form.addControl('admin_assistant_id', new FormControl(this.mail && this.mail.adminAssistant ? this.mail.adminAssistant.id : '', [Validators.required]));
    } else if (this.role === Roles.ADMIN_ASSISTANT) {
      this.form.addControl('admin_assistant_comment', new FormControl(this.mail ? this.mail.admin_assistant_comment : '', [Validators.minLength(10)]));
      this.form.addControl('senior_assistant_id', new FormControl(this.mail && this.mail.seniorAssistant ? this.mail.seniorAssistant.id : '', [Validators.required]));
      this.form.addControl('shouldSendDocument', new FormControl(false, [Validators.required]));
    } else if (this.role === Roles.SENIOR_ASSISTANT) {
      this.form.addControl('senior_assistant_comment', new FormControl(this.mail ? this.mail.senior_assistant_comment : '', [Validators.minLength(10)]));
      this.form.addControl('shouldSendDocument', new FormControl(false, [Validators.required]));
    }
  }

  getErrorSubject(): string {
    return this.form.get('subject')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('subject')!.hasError('minlength') ? `L'objet doit contenir au moins 5 caractères.` :
        this.form.get('subject')!.hasError('maxlength') ? `L'objet ne peut pas dépasser 255 caractères.` : '';
  }

  getErrorRequired(cible: string): string {
    return this.form.get(cible)!.hasError('required') ? 'Ce champ est requis' : '';
  }

  getErrorSender(): string {
    return this.form.get('sender')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('sender')!.hasError('minlength') ? `L'expéditeur doit contenir au moins 3 caractères.` :
        this.form.get('sender')!.hasError('maxlength') ? `L'expéditeur ne peut pas dépasser 150 caractères.` : '';
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

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.openSnackBar('Veuillez corriger les erreurs du formulaire.', 'Fermer', 4000);
      return;
    }

    let target = '';
    if (this.role === Roles.MAIL_ARCHIVES_AGENT) {
      target = 'by-maa';
    } else if (this.role === Roles.ADMIN_ASSISTANT) {
      target = 'by-aa';
    } else if (this.role === Roles.SENIOR_ASSISTANT) {
      target = 'by-sa';
    }

    if (this.formActionPayload.action === 'add') {
      this.add(target);
    } else {
      this.update(target);
    }
  }

  add(target: string) {
    this.http.url = `incoming-external-mails/${target}`;
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
        this.router.navigateByUrl('/mails/incoming/external');
      },
    });
  }

  update(target: string) {
    this.http.url = `incoming-external-mails/${target}/${this.formActionPayload.data.id}`;
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
        this.router.navigateByUrl('/mails/incoming/external');
      },
    });
  }

  onDisplayLocalPdf() {
    this.pdfService.displayLocalPdf();
  }

  onDisplayOnlinePdf() {
    this.pdfService.displayOnlinePdf(this.formActionPayload.data.id, 'document');
  }

  loadData() {
    const dataSources: { [key: string]: Observable<any> } = {
      directors: this.getDirectors(),
    };

    if (this.role === Roles.MAIL_ARCHIVES_AGENT) {
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

        if (this.role === Roles.MAIL_ARCHIVES_AGENT) {
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

  private getAdminAssistant(): Observable<User[]> {
    this.http.url = `users/by-role/ADMIN_ASSISTANT`;
    return this.http.get<User[]>().pipe(takeUntil(this.unsubscribeAA$));
  }

  private getSeniorAssistant(): Observable<User[]> {
    this.http.url = `users/by-role/SENIOR_ASSISTANT`;
    return this.http.get<User[]>().pipe(takeUntil(this.unsubscribeSA$));
  }

  private getMail(): Observable<IncomingExternalMail> {
    let include = '';
    if (this.role === Roles.MAIL_ARCHIVES_AGENT) {
      include = 'includeDirector=true&includeAdminAssistant=true';
    } else if (this.role === Roles.ADMIN_ASSISTANT) {
      include = 'includeDirector=true&includeSeniorAssistant=true';
    } else if (this.role === Roles.SENIOR_ASSISTANT) {
      include = 'includeDirector=true';
    }

    this.http.url = `incoming-external-mails/${this.formActionPayload.data.id}?${include}`;
    return this.http.get<IncomingExternalMail>().pipe(takeUntil(this.unsubscribeMail$));
  }

}
