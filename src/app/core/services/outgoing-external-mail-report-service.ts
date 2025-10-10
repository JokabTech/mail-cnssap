import { Injectable } from '@angular/core';
import { OutgoingExternalMail } from '../../shared/models/outgoing-external-mail';
import { AbstractOutgoingMailService } from './abstract-outgoing-mail-service';
import { ActionEvent } from '../../shared/models/action-event';
import { Header } from '../../shared/models/header';

@Injectable({
  providedIn: 'root'
})
export class OutgoingExternalMailReportService extends AbstractOutgoingMailService<OutgoingExternalMail> {
  constructor() {
    super('outgoing-external-mails', '/mails/outgoing/external', 'outgoing-external-report', 'outgoing-external-mails');
  }

  public override selectTab(tab: string, isNewTab = false) {
    if (isNewTab) {
      this.criteria.page = 1;
      this.criteria.pageSize = 6;
      this.pageIndex = 0;
    }
    const baseCriteria = { ...this.criteria };
    switch (tab) {
      case 'initial':
        this.search({ ...baseCriteria, is_transmitted: undefined });
        break;
      case 'processed':
        this.search({ ...baseCriteria, is_transmitted: true });
        break;
      case 'unprocessed':
        this.search({ ...baseCriteria, is_transmitted: false });
        break;
      default:
    }
    this.tab = tab;
    sessionStorage.setItem(this.key, tab);
  }

  public override actionButton(action: string, event?: ActionEvent<Header>): void {
    switch (action) {
      case 'print':
        this.printRepoport(event ? event.data.title : '', event ? event.data.subTitle : '');
        break;
      case 'refresh':
        break;
      case 'report':
        this.goToReport()
        break;
      case 'destined':
        this.GoToDestined()
        break;
      case 'export':
        this.downloadExcel(this.paramsService.build('export', this.criteria))
        break;
      default:
    }
  }

  public override menuSelected(event: ActionEvent<OutgoingExternalMail>): void {
    throw new Error('Method not implemented.');
  }
}
