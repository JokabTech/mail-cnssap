import { Injectable } from '@angular/core';
import { Route, PreloadingStrategy } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NetworkService } from './network-service';

@Injectable({
  providedIn: 'root'
})
export class SmartPreloadingStrategy implements PreloadingStrategy {

  constructor(private networkService: NetworkService) { }

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    const shouldPreload = route.data?.['preload'];
    if (!shouldPreload) return of(null);

    if (!this.networkService.isGoodConnection()) {
      return of(null);
    }

    const delay = route.data?.['preloadDelay'] ?? 5000;
    return timer(delay).pipe(
      mergeMap(() => {
        return load();
      })
    );
  }
}
