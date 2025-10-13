import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SharedImports } from '../../shared/imports/shared-imports';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService } from '../../core/services/http.service';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-forgot-password-component',
  imports: [...SharedImports],
  templateUrl: './forgot-password-component.html',
  styleUrl: './forgot-password-component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private message = inject(MessageService)
  private _formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpService)
  private authService = inject(AuthService);

  hide = true;
  lock = false;
  form!: FormGroup;
  unsubscribe$ = new Subject<void>();
  loader = false;
  resp = '';

  constructor() { }

  private initForm(): void {
    this.form = this._formBuilder.group({
      email: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    this.loader = true;
    this.http.url = 'auth/forgot-password';
    this.unsubscribe$.next();
    this.http.save(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: data => {
        this.resp = data.message;
      },
      error: err => {
        this.loader = false;
        if (err.status === 0) {
          this.message.openSnackBar("Aucune connexion internet", 'Fermer', 6000);
        } else {
          this.message.openSnackBar("E-mail ou mot de passe incorrect", 'Fermer', 6000);
        }
      },
      complete: () => {
        this.message.openSnackBarFixed(this.resp, 'Fermer');
      }
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}
