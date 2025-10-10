import { Injectable } from '@angular/core';
import { IncomingExternalMail } from '../../shared/models/incoming-external-mail';
import { ActionEvent } from '../../shared/models/action-event';
import { AbstractIncomingMailService } from './abstract-incoming-mail-service';
import { Header } from '../../shared/models/header';

@Injectable({
  providedIn: 'root'
})
export class IncomingExternalMailReportService extends AbstractIncomingMailService<IncomingExternalMail> {
  constructor() {
    super('incoming-external-mails/report', '/mails/incoming/external', 'incoming-external-report', 'incoming-external-mails');
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
        this.search({ ...baseCriteria, processed: undefined });
        break;
      case 'processed':
        this.search({ ...baseCriteria, processed: true });
        break;
      case 'unprocessed':
        this.search({ ...baseCriteria, processed: false });
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
      case 'analytics':
        this.goToAnalytics()
        break;
      case 'export':
        this.downloadExcel(this.paramsService.build('export', this.criteria))
        break;

      default:
    }
  }

  public override menuSelected(event: ActionEvent<IncomingExternalMail>): void {
    super.menuSelected(event);
  }

}
