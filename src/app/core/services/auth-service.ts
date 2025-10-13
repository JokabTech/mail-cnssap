import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpService);
  private router = inject(Router);
  private message = inject(MessageService);

  passwordStrength: string = '';
  strengthPercent: number = 0;
  strengthClass: string = 'bg-gray-300';

  loginWithGoogle() {
    this.http.url = 'auth/google';
    const googleAuthUrl = `${this.http.baseUrl}auth/google`;
    const popup = window.open(googleAuthUrl, 'googleAuth', 'width=500,height=600');

    const messageListener = (event: MessageEvent) => {
      if (event.origin + '/' !== this.http.baseUrl) {
        return;
      }

      const responseData = event.data;

      if (responseData && responseData.status === 'success' && responseData.data?.authorization) {
        sessionStorage.setItem('authentication', JSON.stringify(responseData.data));
        popup?.close();
        window.removeEventListener('message', messageListener);
        this.router.navigateByUrl('/dashboard');
      } else if (responseData && responseData.status === 'error' && responseData.message) {
        this.message.openSnackBar(responseData.message, 'Fermer', 9000);
        popup?.close();
        window.removeEventListener('message', messageListener);
      } else {
        this.message.openSnackBar('Impossible de se connecter', 'Fermer', 7000);
      }
    };
    window.addEventListener('message', messageListener);
  }

  evaluatePassword(password: string) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[\W_]/.test(password)) score++;

    this.strengthPercent = (score / 5) * 100;

    switch (score) {
      case 0:
      case 1:
        this.passwordStrength = 'Très faible';
        this.strengthClass = 'bg-red-600';
        break;
      case 2:
        this.passwordStrength = 'Faible';
        this.strengthClass = 'bg-orange-500';
        break;
      case 3:
        this.passwordStrength = 'Moyen';
        this.strengthClass = 'bg-yellow-400';
        break;
      case 4:
        this.passwordStrength = 'Fort';
        this.strengthClass = 'bg-green-500';
        break;
      case 5:
        this.passwordStrength = 'Très fort';
        this.strengthClass = 'bg-green-700';
        break;
    }
  }


}
