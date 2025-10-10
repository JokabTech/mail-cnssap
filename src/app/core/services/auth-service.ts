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
}
