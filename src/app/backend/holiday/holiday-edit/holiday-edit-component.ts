import { LocalisationService } from './../../../core/services/localisation-service';
import { Holiday } from './../../../shared/models/holiday';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { HttpService } from '../../../core/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';

@Component({
  selector: 'app-holiday-edit-component',
  imports: [...DialogImports, SharedImports],
  templateUrl: './holiday-edit-component.html',
  styleUrl: './holiday-edit-component.scss'
})
export class HolidayEditComponent {
  readonly dialogRef = inject(MatDialogRef<HolidayEditComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, holiday: Holiday, target: 'add' | 'edit' } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);
  readonly localisationService = inject(LocalisationService);


  private unsubscribe$ = new Subject<void>();

  form!: FormGroup;
  holiday!: Holiday;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(this.data.holiday ? this.data.holiday.name : '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      day: new FormControl(this.data.holiday ? this.data.holiday.day : '', [Validators.required, Validators.min(1), Validators.max(31)]),
      month: new FormControl(this.data.holiday ? this.data.holiday.month : '', [Validators.required, Validators.min(0), Validators.max(11)]),
      year: new FormControl(this.data.holiday ? this.data.holiday.year : '', [Validators.min(4)]),
      is_fixed: new FormControl(this.data.holiday ? this.data.holiday.is_fixed : '', [Validators.required]),
    });
  }

  getErrorDesignation(): string {
    const control = this.form.get('name');

    if (!control) return '';

    return control.hasError('required') ? 'La désignation (nom) du jour férié est requise.' :
      control.hasError('minlength') ? `La désignation doit contenir au moins 3 caractères.` :
        control.hasError('maxlength') ? `La désignation ne peut pas dépasser 100 caractères.` : '';
  }

  getErrorDay(): string {
    const control = this.form.get('day');
    if (!control) return '';
    return control.hasError('required') ? 'Le jour (1-31) est requis.' :
      control.hasError('min') ? `Le jour ne peut pas être inférieur à 1.` :
        control.hasError('max') ? `Le jour ne peut pas dépasser 31.` : '';
  }

  getErrorYear(): string {
    const control = this.form.get('year');
    if (!control) return '';
    return control.hasError('year') ? `Le jour ne peut pas être inférieur à 1.` : ''
  }

  getErrorMonth(): string {
    const control = this.form.get('month');
    if (!control) return '';
    return control.hasError('required') ? 'Le mois (0-11) est requis.' :
      control.hasError('min') ? `Le numéro du mois ne peut pas être inférieur à 0 (Janvier).` :
        control.hasError('max') ? `Le numéro du mois ne peut pas dépasser 11 (Décembre).` : '';
  }

  getErrorBoolean(controlName: 'is_fixed' | 'is_active'): string {
    const control = this.form.get(controlName);
    if (!control) return '';
    return control.hasError('required') ? `Ce champ est requis.` : '';
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
    this.http.url = `holidays`;
    this.http.save(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.holiday = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Jour ferier ajouté avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.holiday);
      },
    });
  }

  update() {
    this.http.url = `holidays/${this.data.holiday.id}`;
    this.http.update(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.holiday = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Jour ferier modifié avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.holiday);
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
