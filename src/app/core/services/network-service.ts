import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  isGoodConnection(): boolean {
    const connection = (navigator as any).connection;

    if (!connection) {
      return true;
    }

    const effectiveType = connection.effectiveType;
    const saveData = connection.saveData;
    return !saveData && ['wifi', '4g', 'ethernet'].includes(effectiveType);
  }

  getConnectionType(): string {
    const connection = (navigator as any).connection;
    return connection?.effectiveType || 'unknown';
  }
}
