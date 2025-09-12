import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { Function } from '../../../shared/models/function';
import { HttpService } from '../../../core/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';

@Component({
  selector: 'app-function-edit-component',
  imports: [...DialogImports, SharedImports],
  templateUrl: './function-edit-component.html',
  styleUrl: './function-edit-component.scss'
})
export class FunctionEditComponent {

  readonly dialogRef = inject(MatDialogRef<FunctionEditComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, function: Function, target: 'add' | 'edit' } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);

  private unsubscribe$ = new Subject<void>();

  form!: FormGroup;
  function!: Function;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup({
      designation: new FormControl(this.data.function ? this.data.function.designation : '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      acronym: new FormControl(this.data.function ? this.data.function.acronym : '', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]),
    });
  }

  getErrorDesignation(): string {
    return this.form.get('designation')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('designation')!.hasError('minlength') ? `La désignation doit contenir au moins 2 caractères.` :
        this.form.get('designation')!.hasError('maxlength') ? `La désignation ne peut pas dépasser 100 caractères.` : '';
  }

  getErrorAcronym(): string {
    return this.form.get('acronym')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('acronym')!.hasError('minlength') ? `L'acronyme doit contenir au moins 1 caractères.` :
        this.form.get('acronym')!.hasError('maxlength') ? `L'acronyme ne peut pas dépasser 10 caractères.` : '';
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.openSnackBar('Veuillez corriger les erreurs du formulaire.', 'Fermer', 4000);
      return;
    }

    if (this.data.target === 'add') {
      this.add();
    } else {
      this.update();
    }
  }

  add() {
    this.http.url = `functions`;
    this.http.save(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.function = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Fonction ajoutée avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.function);
      },
    });
  }

  update() {
    this.http.url = `functions/${this.data.function.id}`;
    this.http.update(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.function = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Fonction modifiée avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.function);
      },
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}
