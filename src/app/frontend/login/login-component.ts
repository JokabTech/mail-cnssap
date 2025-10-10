import { AuthService } from './../../core/services/auth-service';
import { Component } from '@angular/core';
import { SharedImports } from '../../shared/imports/shared-imports';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService } from '../../core/services/http.service';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-login-component',
  imports: [...SharedImports],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent {

  hide = true;
  lock = false;
  form!: FormGroup;
  unsubscribe$ = new Subject<void>();
  loader = false;
  url = '';

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private http: HttpService,
    private message: MessageService,
    private authService: AuthService
  ) { }

  private initForm(): void {
    this.form = this._formBuilder.group({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.http.url = 'auth/google';
    this.url = this.http.url;
    console.log(this.url);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onSubmit(): void {
    this.loader = true;
    this.http.url = 'auth/login';
    this.unsubscribe$.next();
    this.http.login(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: data => {
        sessionStorage.setItem('authentication', JSON.stringify(data));
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
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

}
