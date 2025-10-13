import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-information-component',
  imports: [],
  templateUrl: './information-component.html',
  styleUrl: './information-component.scss'
})
export class InformationComponent {
  private localion = inject(Location);

  onGoBack(){
    this.localion.back();
  }
}
