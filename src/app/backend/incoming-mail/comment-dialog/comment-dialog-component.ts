import { Component, computed, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IncomingMail } from '../../../shared/models/incoming-mail';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { HttpService } from '../../../core/services/http.service';
import { StateService } from '../../../core/services/state.service';
import { PdfService } from '../../../core/services/pdf-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { Roles } from '../../../shared/enums/roles-enum';
import { HttpEventType } from '@angular/common/http';
import { User } from '../../../shared/models/user';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';

@Component({
  selector: 'app-comment-dialog-component',
  imports: [...SharedBackend, ...SharedImports, DialogImports, EditorComponent],
  templateUrl: './comment-dialog-component.html',
  styleUrl: './comment-dialog-component.scss'
})
export class CommentDialogComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<CommentDialogComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, mail: IncomingMail, endpoint: string } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);
  readonly stateService = inject(StateService);
  pdfService = inject(PdfService);

  disabled = false;
  errorMessage = '';
  public isDragging = false;
  isExternalMail = false;

  init: EditorComponent['init'] = {
    plugins: 'lists link image table code help wordcount',
    height: 350,
  };

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  form!: FormGroup;

  private unsubscribeSA$ = new Subject<void>();
  private unsubscribeDir$ = new Subject<void>();
  private unsubscribeMail$ = new Subject<void>();
  private unsubscribeAa$ = new Subject<void>();

  seniorAssistants: User[] = [];
  directors: User[] = [];
  uploadProgress = 0;

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  mail!: IncomingMail;

  roles = Roles;
  role = this.http.role;
  commentFormControlName!: string;
  assigneeFormControlName!: string;

  isFormReady = false;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribeSA$.next();
    this.unsubscribeSA$.complete();

    this.unsubscribeDir$.next();
    this.unsubscribeDir$.complete();

    this.unsubscribeAa$.next();
    this.unsubscribeAa$.complete();
  }

  private initForm(): void {
    let comment: string | undefined;

    if (this.role === Roles.ADMIN_ASSISTANT) {
      comment = this.data.mail.admin_assistant_comment;
    }else {
      comment = this.data.mail.senior_assistant_comment || this.data.mail.admin_assistant_comment;
    }


    this.commentFormControlName = this.role === Roles.ADMIN_ASSISTANT ? 'admin_assistant_comment' : 'senior_assistant_comment';
    this.assigneeFormControlName = this.role === Roles.ADMIN_ASSISTANT ? 'senior_assistant_id' : 'director_id';

    let asign: number | string = '';
    if (Roles.ADMIN_ASSISTANT) {
      asign = this.data.mail.seniorAssistant ? this.data.mail.seniorAssistant.id : '';
    } else {
      asign = this.data.mail.director ? this.data.mail.director.id : '';
    }


    const formGroupConfig: { [key: string]: any } = {
      should_send_document: new FormControl(false),

      [this.commentFormControlName]: new FormControl(comment, [Validators.required]),

      [this.assigneeFormControlName]: new FormControl(3, [Validators.required])
    };

    this.form = new FormGroup(formGroupConfig);
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
    this.pdfService.handleFile(file);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.openSnackBar('Veuillez corriger les erreurs du formulaire.', 'Fermer', 4000);
      return;
    }
    this.update();
  }

  update() {
    this.http.url = `${this.data.endpoint}/${this.data.mail.id}`;
    this.http.sendFormData(JSON.stringify(this.form.value), this.pdfService.localPdf, 'patch').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total || 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.message.openSnackBar(`Commentaire ajouté avec succès !`, 'Fermer', 4000);
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

  onCheckboxChange(event: MatCheckboxChange) {
    this.disabled = event.checked;
  }

  //------------------------

  loadData() {
    const dataSources: { [key: string]: Observable<any> } = {
      mail: this.getMail(),
    };

    if (this.role === Roles.ADMIN_ASSISTANT) {
      dataSources['senior_assistants'] = this.getSeniorAssistant();
    } else if (this.role === Roles.SENIOR_ASSISTANT) {
      dataSources['directors'] = this.getDirectors();
    }

    forkJoin(dataSources).subscribe({
      next: (results) => {
        this.data.mail = results['mail'];

        if (this.role === Roles.ADMIN_ASSISTANT) {
          this.seniorAssistants = results['senior_assistants'];
        } else if (this.role === Roles.SENIOR_ASSISTANT) {
          this.directors = results['directors'];
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

  private getSeniorAssistant(): Observable<User[]> {
    this.http.url = `users/by-role/SENIOR_ASSISTANT`;
    return this.http.get<User[]>().pipe(takeUntil(this.unsubscribeSA$));
  }

  private getMail(): Observable<IncomingMail> {
    this.http.url = `${this.data.endpoint}/${this.data.mail.id}`;
    return this.http.get<IncomingMail>().pipe(takeUntil(this.unsubscribeMail$));
  }
}
