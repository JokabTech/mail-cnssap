import { Injectable } from '@angular/core';
import { OutgoingMail } from '../../shared/models/outgoing-mail';
import { ActionEvent } from '../../shared/models/action-event';
import { AbstractMailService } from './abstract-mail-service';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstractOutgoingMailService<T extends OutgoingMail> extends AbstractMailService<T> {
  protected constructor(endpoint: string, routePrefix: string, key: string) {
    super(endpoint, routePrefix, key);
  }

  public selectTab(tab: string, isNewTab = false) {
    if (isNewTab) {
      this.criteria.page = 1;
      this.criteria.pageSize = 6;
      this.pageIndex = 0;
    }

    const baseCriteria = { ...this.criteria };
    switch (tab) {
      case 'initial':
        this.search({ ...this.criteria, is_transmitted: false });
        break;
      case 'sent':
        this.search({ ...this.criteria, is_transmitted: true });
        break;
      default:
        this.search(baseCriteria);
    }
    this.tab = tab;
    sessionStorage.setItem(this.key, tab);
  }

  public actionButton(tab: string) {
    switch (tab) {
      case 'goToForm':
        this.goToForm('add');
        break;
      case 'refresh':
        this.selectTab('in-transit');
        break;
      case 'print':
        // Implement print logic
        break;
      default:
    }
  }

  public menuSelected(event: ActionEvent<T>) {
    switch (event.action) {
      case 'view_detail':
        this.gotToDetails(event.data);
        break;
      case 'display_document':
        this.displayOnline(event.data.id, 'document');
        break;
      case 'receipt':
        // Implement receipt logic
        break;
      case 'download_mail':
        this.downloadDocument(event.data.id, 'document');
        break;
      case 'share_mail':
        // Implement share logic
        break;
      case 'edit_mail':
        this.goToForm(event.action, event.data);
        break;
      case 'delete_mail':
        // Implement delete logic
        break;
      default:
        console.warn(`Action non gérée :`);
    }
  }
}
