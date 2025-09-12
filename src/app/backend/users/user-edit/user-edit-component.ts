import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../shared/models/user';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { DialogImports } from '../../../shared/imports/dialog-imports';

@Component({
  selector: 'app-user-edit-component',
  imports: [...DialogImports, SharedImports],
  templateUrl: './user-edit-component.html',
  styleUrl: './user-edit-component.scss'
})
export class UserEditComponent {
  readonly dialogRef = inject(MatDialogRef<UserEditComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, user: User, target: 'add' | 'edit' } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);

  private unsubscribe$ = new Subject<void>();

  form!: FormGroup;
  user!: User;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup({
      full_name: new FormControl(this.data.user ? this.data.user.full_name : '', [Validators.required, Validators.minLength(2), Validators.maxLength(90)]),
      phone: new FormControl(this.data.user ? this.data.user.phone : '', [Validators.maxLength(13)]),
      email: new FormControl(this.data.user ? this.data.user.email : '', [Validators.maxLength(90)]),
    });
  }

  getErrorFullName(): string {
    return this.form.get('full_name')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('full_name')!.hasError('minlength') ? `Le nom doit contenir au moins 2 caractères.` :
        this.form.get('full_name')!.hasError('maxlength') ? `Le nom ne peut pas dépasser 90 caractères.` : '';
  }

  getErrorPhone(): string {
    return this.form.get('phone')!.hasError('maxLength') ? 'Ce champ doit contenir au moins 13 caractères' : '';
  }

  getErrorEmail(): string {
    return this.form.get('email')!.hasError('maxLength') ? 'Ce champ doit contenir au moins 90 caractères' : '';
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
    this.http.url = `users`;
    this.http.save(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Direction ajoutée avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.user);
      },
    });
  }

  update() {
    this.http.url = `users/${this.data.user.id}`;
    this.http.update(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Utilisateur modifié avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.user);
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
