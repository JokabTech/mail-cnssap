import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalisationService {
  public readonly MONTH_NAMES_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  public readonly DAY_NAMES_FR = [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
    'Jeudi', 'Vendredi', 'Samedi'
  ];

  public readonly DAY_NUMBER_FR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  getMonthName(monthNumber: number): string {
    if (monthNumber < 0 || monthNumber > 11) {
      return 'Mois Inconnu';
    }
    return this.MONTH_NAMES_FR[monthNumber];
  }

  getDayName(dayOfWeek: number): string {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return 'Jour Inconnu';
    }
    return this.DAY_NAMES_FR[dayOfWeek];
  }
}
