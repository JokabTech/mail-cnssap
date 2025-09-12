import { Component } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { Header } from '../../shared/models/header';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss'
})
export class DashboardComponent {
  constructor(
    private stateService: StateService
  ) {
    this.stateService.setHeader(new Header('TABLEAU DE BORD', 'Sous-titre du tableau de bord', 'home'));
  }
}
