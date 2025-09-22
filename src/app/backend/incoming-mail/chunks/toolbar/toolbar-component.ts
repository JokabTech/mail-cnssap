import { Component, computed, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { SharedImports } from '../../../../shared/imports/shared-imports';
import { SharedBackend } from '../../../../shared/imports/shared-backend-imports';
import { StateService } from '../../../../core/services/state.service';
import { Location } from '@angular/common';
import { Roles } from '../../../../shared/enums/roles-enum';
import { HttpService } from '../../../../core/services/http.service';

export interface Tab {
  key: string;
  icon: string;
  tooltip?: string;
  tooltipMaa?: string;
  tooltipAaSa?: string;
  tooltipDir?: string;
  roles?: string[];
}

@Component({
  selector: 'app-toolbar-component',
  imports: [...SharedImports, ...SharedBackend],
  templateUrl: './toolbar-component.html',
  styleUrl: './toolbar-component.scss'
})
export class ToolbarComponent implements OnInit {
  private stateService = inject(StateService);
  private location = inject(Location);
  private httpService = inject(HttpService);

  @Input() selectedTab: string = 'initial';
  @Input() forOutgoingMail = false;

  @Output() tabSelected = new EventEmitter<string>();
  @Output() actionButton = new EventEmitter<string>();

  roles = Roles;
  role = this.httpService.role;

  tabsIncoming: Tab[] = [
    {
      key: 'initial',
      icon: 'toc',
      tooltipMaa: 'Tous les courriers',
      tooltipAaSa: 'Courriers à annoter',
      tooltipDir: 'Courriers à traiter',
      roles: [Roles.MAIL_ARCHIVES_AGENT, Roles.EXECUTIVE_SECRETARY, Roles.ADMIN_ASSISTANT, Roles.SENIOR_ASSISTANT, Roles.DIRECTOR]
    },
    { key: 'annotated', icon: 'receipt', tooltip: 'Courrier déjà annotés', roles: [Roles.ADMIN_ASSISTANT, Roles.SENIOR_ASSISTANT] },
    { key: 'all', icon: 'list', tooltip: 'Liste complète de courriers', roles: [Roles.ADMIN_ASSISTANT, Roles.SENIOR_ASSISTANT, Roles.DIRECTOR] },
    { key: 'treated', icon: 'assignment_turned_in', tooltip: 'Déjà traités', roles: [Roles.ADMIN_ASSISTANT, Roles.SENIOR_ASSISTANT, Roles.DIRECTOR] },
    { key: 'to-process', icon: 'translate', tooltip: 'Courriers à traiter', roles: [Roles.MAIL_ARCHIVES_AGENT, Roles.EXECUTIVE_SECRETARY, Roles.ADMIN_ASSISTANT, Roles.SENIOR_ASSISTANT] }
  ];

  tabsOutgoing: Tab[] = [
    { key: 'initial', icon: 'receipt', tooltip: 'Courriers en cours de transmission' },
    { key: 'sent', icon: 'list', tooltip: 'Courriers déjà transmis' },
    { key: 'all', icon: 'assignment_turned_in', tooltip: 'Liste complete de courriers' },
  ];

  title: string | undefined;
  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  constructor() { }

  ngOnInit(): void {
    if (this.forOutgoingMail) {
      for (let index in this.tabsOutgoing) {
        if (this.tabsOutgoing[index].key === this.selectedTab) {
          this.title = this.getTooltip(this.tabsOutgoing[index]);
        }
      }
    } else {
      for (let index in this.tabsIncoming) {
        if (this.tabsIncoming[index].key === this.selectedTab) {
          this.title = this.getTooltip(this.tabsIncoming[index]);

        }
      }
    }
  }

  onSelectTab(tab: Tab) {
    this.selectedTab = tab.key;
    this.title = this.getTooltip(tab);
    this.tabSelected.emit(tab.key);
  }

  onEmit(action: string) {
    this.selectedTab = action;
    this.actionButton.emit(action);
  }

  getTooltip(tab: Tab): string | undefined {
    if (this.forOutgoingMail) {
      return tab.tooltip;
    } else {
      if (tab.key === 'initial') {
        switch (this.role) {
          case Roles.MAIL_ARCHIVES_AGENT:
            return tab.tooltipMaa;
          case Roles.DIRECTOR:
            return tab.tooltipDir;
          default:
            return tab.tooltipAaSa;
        }
      }
    }

    return tab.tooltip;
  }

  onGoBack(): void {
    this.location.back();
  }

}
