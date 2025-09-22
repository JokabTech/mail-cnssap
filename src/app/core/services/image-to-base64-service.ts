import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageToBase64Service {
  private http = inject(HttpClient);

  private imageCache = new Map<string, string>();

  getImageAsBase64(imageUrl: string): Observable<string> {
    const cachedImage = this.imageCache.get(imageUrl);
    if (cachedImage) {
      return of(cachedImage);
    }

    return this.http.get(imageUrl, { responseType: 'blob' }).pipe(
      switchMap(blob => {
        return new Observable<string>(observer => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            this.imageCache.set(imageUrl, base64data);
            observer.next(base64data);
            observer.complete();
          };
          reader.onerror = (error) => {
            observer.error(error);
          };
          reader.readAsDataURL(blob);
        });
      })
    );
  }

}
