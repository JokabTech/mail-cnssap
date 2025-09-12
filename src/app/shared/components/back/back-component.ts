import { Component, inject } from '@angular/core';
import { DialogImports } from '../../imports/dialog-imports';
import { SharedImports } from '../../imports/shared-imports';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-component',
  imports: [...DialogImports, ...SharedImports],
  templateUrl: './back-component.html',
  styleUrl: './back-component.scss'
})
export class BackComponent {
  private localion = inject(Location);

  onGoBack(){
    this.localion.back();
  }
}
