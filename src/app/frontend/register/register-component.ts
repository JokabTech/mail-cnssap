import { Component } from '@angular/core';
import { SharedImports } from '../../shared/imports/shared-imports';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../core/services/message.service';
import { Router } from '@angular/router';
import { HttpService } from '../../core/services/http.service';

@Component({
  selector: 'app-register-component',
  imports: [...SharedImports],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss'
})
export class RegisterComponent {
  hide = true;
  lock = false;
  form!: FormGroup;
  unsubscribe$ = new Subject<void>();
  loader = false;

  constructor(
    private message: MessageService,
    private router: Router,
    private http: HttpService,
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup({
      full_name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(120)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
      terms: new FormControl(false, [Validators.required]),
    });
  }

  getErrorFullName(): string {
    return this.form.get('full_name')!.hasError('required') ? 'Ce champ est requis' :
      this.form.get('full_name')!.hasError('minlength') ? "Assurez-vous d'entrer au moins 2 caractères ici." :
        this.form.get('full_name')!.hasError('maxlength') ? "Ne dépassez pas 30 caractères dans ce champ, s'il vous plaît." : '';
  }

  getErrorEmail(): string {
    return this.form.get('email')!.hasError('required') ? 'L\'adresse E-mail est requise' :
      this.form.get('email')!.hasError('minLength') ? "Assurez-vous d'entrer au moins 11 caractères ici." :
        this.form.get('email')!.hasError('maxLength') ? "Ne dépassez pas 120 caractères dans ce champ, s'il vous plaît." :
          this.form.get('email')!.hasError('email') ? "Adresse e-mail invalide" : "";
  }

  getErrorPassword(): string {
    return this.form.get('password')!.hasError('required') ? 'Le mot de passe est requis' :
      this.form.get('password')!.hasError('minlength') ? 'Le mot de passe doit contenir au moins 8 caractères' :
        this.form.get('password')!.hasError('maxlength') ? 'Le mot de passe ne doit pas dépasser 16 caractères' : '';
  }

  getErrorPassword2(): string {
    return this.form.get('password2')!.hasError('required') ? 'Le mot de passe est requis' :
      this.form.get('password2')!.hasError('minlength') ? 'Le mot de passe doit contenir au moins 8 caractères' :
        this.form.get('password2')!.hasError('maxlength') ? 'Le mot de passe ne doit pas dépasser 16 caractères' : '';
  }

  getErrorTerms(): string {
    return this.form.get('terms')!.hasError('required') ? `Veillez accepter ou ne créez pas de compte` : '';
  }

  onSubmit(): void {
    this.loader = true;
    this.http.url = 'auth/register';
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
        this.router.navigateByUrl('/auth/verification');
      }
    });
  }
}
