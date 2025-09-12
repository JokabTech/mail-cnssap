import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  openSnackBar(message: string, action: string, time: number): void {
    this.snackBar.open(message, action, {
      duration: time,
    });
  }

  openSnackBarFixed(message: string, action: string): void {
    this.snackBar.open(message, action);
  }
}
