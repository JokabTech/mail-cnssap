import { AuthService } from './../../core/services/auth-service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { HttpService } from '../../core/services/http.service';
import { SharedImports } from '../../shared/imports/shared-imports';

@Component({
  selector: 'app-reset-password-component',
  imports: [...SharedImports],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private message = inject(MessageService)
  private router = inject(Router);
  private http = inject(HttpService);
  public authService = inject(AuthService);

  token!: string;

  hide = true;
  lock = false;
  form!: FormGroup;
  unsubscribe$ = new Subject<void>();
  loader = false;
  resp = '';




  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.initForm();
    this.token = this.route.snapshot.paramMap.get('token')!;
    console.log(this.token);
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
      terms: new FormControl(false, [Validators.required]),
    }, { validators: this.passwordMatchValidator });

    this.form.get('newPassword')?.valueChanges.subscribe(value => {
      this.authService.evaluatePassword(value);
    });
  }

  getErrorNewPassword(): string {
    return this.form.get('newPassword')!.hasError('required') ? 'Le mot de passe est requis' :
      this.form.get('newPassword')!.hasError('minlength') ? 'Le mot de passe doit contenir au moins 8 caractères' :
        this.form.get('newPassword')!.hasError('maxlength') ? 'Le mot de passe ne doit pas dépasser 16 caractères' :
          this.form.get('newPassword')!.hasError('pattern') ? 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.' : '';

  }

  getErrorConfirmPassword(): string {
    return this.form.get('confirmPassword')!.hasError('required') ? 'Le mot de passe est requis' :
      this.form.get('confirmPassword')!.hasError('minlength') ? 'Le mot de passe doit contenir au moins 8 caractères' :
        this.form.get('confirmPassword')!.hasError('maxlength') ? 'Le mot de passe ne doit pas dépasser 16 caractères' : '';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      //this.message.openSnackBar('Veuillez corriger les erreurs du formulaire.', 'Fermer', 4000);
      return;
    }


    this.loader = true;
    this.http.url = 'auth/reset-password';
    this.unsubscribe$.next();
    this.form.value.token = this.token;
    this.http.login(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: data => {
        this.resp = data.message;
      },
      error: err => {
        this.loader = false;
        if (err.status === 0) {
          this.message.openSnackBar("Aucune connexion internet", 'Fermer', 6000);
        } else {
          this.message.openSnackBar('Oups ! Une erreur est survenue. Veuillez réessayer plus tard.', 'Fermer', 6000);
        }
      },
      complete: () => {
        this.message.openSnackBarFixed(this.resp, 'Fermer');
        this.router.navigateByUrl('/auth/login');
      }
    });
  }

  private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  };
}
