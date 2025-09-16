import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IncomingMail } from '../../../../shared/models/incoming-mail';
import { ActionEvent } from '../../../../shared/models/action-event';
import { Roles } from '../../../../shared/enums/roles-enum';
import { SharedImports } from '../../../../shared/imports/shared-imports';

@Component({
  selector: 'app-incoming-mail-menu-component',
  imports: [...SharedImports],
  templateUrl: './incoming-mail-menu-component.html',
  styleUrl: './incoming-mail-menu-component.scss'
})
export class IncomingMailMenuComponent<T extends IncomingMail> implements OnInit {

  @Input() role!: string;
  @Input() item!: T;

  @Output() actionSelected = new EventEmitter<ActionEvent<T>>();

  roles = Roles;
  isExternalMail = false;

  ngOnInit(): void {
    this.isExternalMail = 'sender' in this.item && typeof this.item.sender === 'string';
    console.log(this.isExternalMail);
  }


  onMenuItemClicked(action: string, data: T) {
    this.actionSelected.emit({ action, data });
  }
}
