import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { IncomingExternalMail } from '../../../shared/models/Incoming-external-mail';
import { Header } from '../../../shared/models/header';
import { HttpService } from '../../../core/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../../core/services/message.service';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { MailDetailComponent1 } from "./mail-detail-component1/mail-detail-component1";
import { MailDetailComponent2 } from './mail-detail-component2/mail-detail-component2';

@Component({
  selector: 'app-incoming-external-mail-detail-component',
  imports: [
    ...SharedBackend,
    ...SharedImports,
    MailDetailComponent1,
    MailDetailComponent2
  ],
  templateUrl: './incoming-external-mail-detail-component.html',
  styleUrl: './incoming-external-mail-detail-component.scss'
})
export class IncomingExternalMailDetailComponent implements OnInit, OnDestroy {
  private stateService = inject(StateService);
  private http = inject(HttpService);
  private message = inject(MessageService);

  private unsubscribeMail$ = new Subject<void>();

  incomingExternalMail!: IncomingExternalMail;
  @Input() roles: 'maa' | 'aa' | 'sa' | 'dir' | 'agent' = 'maa';

  render = true;

  constructor(
  ) {
    this.stateService.setHeader(new Header('DÉTAIL DU COURRIER', 'Détail du courrier entrant externe', 'home'));
    this.incomingExternalMail = JSON.parse(<string>sessionStorage.getItem('incomingExternalMail'))
  }

  ngOnInit(): void {
    this.findMail();
  }

  ngOnDestroy(): void {
    this.unsubscribeMail$.next();
    this.unsubscribeMail$.complete();
  }


  findMail() {
    let include = '';
    if (this.roles === 'maa') {
      include = 'includeDirector=true&includeAdminAssistant=true';
    } else {
      include = 'includeDirector=true&includeSeniorAssistant=true&includeAdminAssistant&includeAgent';
    }

    this.http.url = `incoming-external-mails/${this.incomingExternalMail.id}?${include}`;
    this.unsubscribeMail$.next();
    this.http.get<IncomingExternalMail>().pipe(takeUntil(this.unsubscribeMail$)).subscribe({
      next: (data) => {
        this.incomingExternalMail = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
      },
    });
  }
}
