import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from '../../core/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../core/services/message.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-validation-component',
  imports: [FormsModule, MatProgressBarModule],
  templateUrl: './validation-component.html',
  styleUrl: './validation-component.scss'
})
export class ValidationComponent implements OnInit {
  codeDigits: number[] = new Array(5).fill(null);
  errorMessage = '';

  @ViewChildren('inputs') inputs!: QueryList<ElementRef>;
  unsubscribe$ = new Subject<void>();
  loader = false;

  constructor(
    private http: HttpService,
    private router: Router,
    private message: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      const code = params.get('code'); // Get the 'code' parameter from the URL
      if (code && /^\d{5}$/.test(code)) { // Check if code exists and is a 5-digit number
        this.codeDigits = code.split('').map(Number);
        this.errorMessage = '';
        this.validateToken();
      } else if (code) {
        this.errorMessage = 'Code invalide dans l\'URL. Le code doit être composé de 5 chiffres.';
      }
    });
  }

  moveToNext(index: number, event: any) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < this.codeDigits.length - 1) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }

    if (this.codeDigits.every(digit => digit !== null && digit !== undefined)) {
      this.validateToken();
    }
  }

  validateToken() {
    this.loader = true;
    const token = Number(this.codeDigits.join(''));
    this.http.url = 'auth/verification';
    this.unsubscribe$.next();
    this.http.login({ token }).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: data => {
        sessionStorage.setItem('authentication', JSON.stringify(data));
      },
      error: err => {
        this.loader = false;
        if (err.status === 0) {
          this.message.openSnackBar("Aucune connexion internet. veillez réessayer plus tard", 'Fermer', 6000);
        } else {
          this.errorMessage = err.error.message;
        }
      },
      complete: () => {
        this.loader = false;
        this.message.openSnackBar(`Votre compte vient d'être activer avec succès`, 'Fermer', 6000);
        this.router.navigateByUrl('/dashboard');
      }
    });
    console.log(token);
  }

  pasteCode(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';

    if (/^\d{5}$/.test(pastedData)) {
      this.codeDigits = pastedData.split('').map(Number);
      this.errorMessage = '';

      if (this.inputs.length === 6) {
        this.inputs.last.nativeElement.focus();
      }

      this.validateToken();
    } else {
      this.errorMessage = 'Code invalide. Copiez un code à 6 chiffres.';
    }
  }
}
