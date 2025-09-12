import { Component, computed, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { IncomingExternalMail } from '../../../shared/models/Incoming-external-mail';
import { HttpService } from '../../../core/services/http.service';
import { StateService } from '../../../core/services/state.service';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { EditorComponent, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HttpEventType } from '@angular/common/http';
import { User } from '../../../shared/models/user';
import { PdfService } from '../../../core/services/pdf-service';
import { Roles } from '../../../shared/enums/roles-enum';

@Component({
  selector: 'app-add-comment-dialog-component',
  imports: [...DialogImports, SharedImports, EditorComponent],
  templateUrl: './add-comment-dialog-component.html',
  styleUrl: './add-comment-dialog-component.scss',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class AddCommentDialogComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<AddCommentDialogComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, mail: IncomingExternalMail, target: string } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);
  readonly stateService = inject(StateService);
  pdfService = inject(PdfService);

  disabled = false;

  supportedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
  errorMessage = '';
  public isDragging = false;

  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    height: 350,
  };

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  form!: FormGroup;

  private unsubscribeSA$ = new Subject<void>();
  private unsubscribeDir$ = new Subject<void>();
  private unsubscribeMail$ = new Subject<void>();

  seniorAssistants: User[] = [];
  directors: User[] = [];
  uploadProgress = 0;

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  mail!: IncomingExternalMail;

  roles = Roles;

  ngOnDestroy(): void {
    this.unsubscribeSA$.next();
    this.unsubscribeSA$.complete();

    this.unsubscribeDir$.next();
    this.unsubscribeDir$.complete();
  }

  ngOnInit(): void {
    if (this.data.target === Roles.ADMIN_ASSISTANT) {
      this.findSeniorAssistants();
    } else {
      this.findDirectors();
    }
    this.findMail();
    this.initForm();
  }



  private initForm(): void {
    this.form = new FormGroup({
      shouldSendDocument: new FormControl(false),
    });

    if (this.data.target === Roles.ADMIN_ASSISTANT) {
      this.form.addControl('admin_assistant_comment', new FormControl(this.data.mail ? this.data.mail.admin_assistant_comment : '', [Validators.required]))
      this.form.addControl('senior_assistant_id', new FormControl(this.data.mail.seniorAssistant ? this.data.mail.seniorAssistant.id : '', [Validators.required]))
    } else {
      this.form.addControl('senior_assistant_comment', new FormControl(this.data.mail && this.data.mail.senior_assistant_comment ? this.data.mail.senior_assistant_comment : this.data.mail.admin_assistant_comment, [Validators.required]))
      this.form.addControl('director_id', new FormControl(this.data.mail.director ? this.data.mail.director.id : '', [Validators.required]))
    }
  }

  findSeniorAssistants(): void {
    this.http.url = `users/by-role/SENIOR_ASSISTANT`;
    this.unsubscribeSA$.next();
    this.http.get<User[]>().pipe(takeUntil(this.unsubscribeSA$)).subscribe({
      next: (data) => {
        this.seniorAssistants = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
      },
    });
  }

  findDirectors(): void {
    this.http.url = `users/by-role/DIRECTOR`;
    this.unsubscribeDir$.next();
    this.http.get<User[]>().pipe(takeUntil(this.unsubscribeDir$)).subscribe({
      next: (data) => {
        this.directors = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
      },
    });
  }

  findMail() {
    let include = '';
    if (this.data.target === Roles.ADMIN_ASSISTANT) {
      include = 'includeSeniorAssistant=true';
    } else if (this.data.target === Roles.SENIOR_ASSISTANT) {
      include = 'includeDirector=true';
    }

    this.http.url = `incoming-external-mails/${this.data.mail.id}?${include}`;
    this.unsubscribeMail$.next();
    this.http.get<IncomingExternalMail>().pipe(takeUntil(this.unsubscribeMail$)).subscribe({
      next: (data) => {
        this.data.mail = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
        this.initForm();
      },
    });
  }


  getErrorComment(key: string): string {
    return this.form.get(key)!.hasError('required') ? 'Ce champ est requis' :
      this.form.get(key)!.hasError('minlength') ? `L'annotation doit contenir au moins 10 caractères.` : '';
  }

  getErrorSeriorAssistant(key: string): string {
    return this.form.get(key)!.hasError('required') ? 'Ce champ est requis' : '';
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
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File | null): void {
    if (!file || this.supportedTypes.includes(file.type)) {
      //this.selectedFile = file;
      this.pdfService.localPdf = file;
      this.errorMessage = '';

      if (!file || file.type === 'application/pdf') {
        //this.loadPdf(file);
      } else {
        console.log(`Le fichier image ${file.name} est valide.`);
        //this.pdfLoaded = false;
      }
    } else {
      this.errorMessage = `Le fichier "${file.name}" n'est pas un type supporté. Veuillez sélectionner un PDF, un PNG ou un JPG.`;

      //this.selectedFile = null;
      this.pdfService.localPdf = null;
      //this.pdfLoaded = false;
    }


    if (!file || file.type !== 'application/pdf') {
      console.warn('Le fichier n\'est pas un PDF.');
      //this.selectedFile = null;
      //this.pdfLoaded = false;
      return;
    }
    //this.selectedFile = file;
    this.pdfService.localPdf = file;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      //this.errorMessage = 'Veuillez sélectionner un fichier au format PDF ou image';
      this.message.openSnackBar('Veuillez corriger les erreurs du formulaire.', 'Fermer', 4000);
      return;
    }
    let target = '';
    if (this.data.target === Roles.ADMIN_ASSISTANT) {
      target = 'by-aa';
    } else {
      target = 'by-sa'
    }
    this.update(target);
  }

  onCheckboxChange(event: MatCheckboxChange) {
    this.disabled = event.checked;
  }

  update(target: string) {
    this.http.url = `incoming-external-mails/${target}/${this.data.mail.id}`;
    this.http.sendFormData(JSON.stringify(this.form.value), this.pdfService.localPdf, 'patch').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.message.openSnackBar(`Modification effectué avec succès !`, 'Fermer', 4000);
          this.dialogRef.close(event.body);
        }
      },
      error: (err) => {
        this.message.openSnackBar(`Une erreur est survenue, veuillez réessayer.`, 'Fermer', 4000);
        this.uploadProgress = 0;
      },
      complete: () => {
      },
    });
  }
}
