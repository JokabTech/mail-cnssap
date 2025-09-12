import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharedImports } from '../../../../shared/imports/shared-imports';
import { MatMenu } from '@angular/material/menu';
import { ActionEvent } from '../../../../shared/models/action-event';
import { IncomingExternalMail } from '../../../../shared/models/Incoming-external-mail';
import { Roles } from '../../../../shared/enums/roles-enum';

@Component({
  selector: 'app-incoming-external-mail-menu-component',
  imports: [...SharedImports],
  templateUrl: './incoming-external-mail-menu-component.html',
  styleUrl: './incoming-external-mail-menu-component.scss'
})
export class IncomingExternalMailMenuComponent {
  @Input() role!: string;
  @Input() item!: IncomingExternalMail;

  @ViewChild(MatMenu) mailMenu!: MatMenu;
  @Output() actionSelected = new EventEmitter<ActionEvent<IncomingExternalMail>>();

  roles = Roles;

  onMenuItemClicked(action: string, data: IncomingExternalMail) {
    this.actionSelected.emit({ action, data });
  }
}
