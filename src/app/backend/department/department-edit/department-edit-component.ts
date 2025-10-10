import { Department } from './../../../shared/models/department';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import { HttpService } from '../../../core/services/http.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DialogImports } from '../../../shared/imports/dialog-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';

@Component({
  selector: 'app-department-edit-component',
  imports: [...DialogImports, SharedImports],
  templateUrl: './department-edit-component.html',
  styleUrl: './department-edit-component.scss'
})
export class DepartmentEditComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<DepartmentEditComponent>);
  readonly message = inject(MessageService);
  readonly data: { title: string, department: Department, target: 'add' | 'edit' } = inject(MAT_DIALOG_DATA);
  readonly http = inject(HttpService);

  private unsubscribe$ = new Subject<void>();

  form!: FormGroup;
  department!: Department;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup({
      designation: new FormControl(this.data.department ? this.data.department.designation : '', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      acronym: new FormControl(this.data.department ? this.data.department.acronym : '', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]),
    });
  }

  getErrorDesignation(): string {
    return this.form.get('designation')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('designation')!.hasError('minlength') ? `La désignation doit contenir au moins 10 caractères.` :
        this.form.get('designation')!.hasError('maxlength') ? `La désignation ne peut pas dépasser 100 caractères.` : '';
  }

  getErrorAcronym(): string {
    return this.form.get('acronym')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('acronym')!.hasError('minlength') ? `L'acronyme doit contenir au moins 2 caractères.` :
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
    this.http.url = `departments`;
    this.http.save(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.department = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Direction ajoutée avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.department);
      },
    });
  }

  update() {
    this.http.url = `departments/${this.data.department.id}`;
    this.http.update(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.department = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.message.openSnackBar('Direction modifiée avec succès', 'Fermer', 4000);
        this.dialogRef.close(this.department);
      },
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}
