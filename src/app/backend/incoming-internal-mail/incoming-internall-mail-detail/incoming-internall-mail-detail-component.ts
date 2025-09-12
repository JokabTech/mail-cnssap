import { Component, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { Subject, takeUntil } from 'rxjs';
import { IncomingInternalMail } from '../../../shared/models/Incoming-internal-mail';
import { Header } from '../../../shared/models/header';
import { DatePipe } from '@angular/common';
import { SharedImports } from '../../../shared/imports/shared-imports';

@Component({
  selector: 'app-incoming-internall-mail-detail-component',
  imports: [DatePipe, ...SharedImports],
  templateUrl: './incoming-internall-mail-detail-component.html',
  styleUrl: './incoming-internall-mail-detail-component.scss'
})
export class IncomingInternallMailDetailComponent {
  private stateService = inject(StateService);
  private http = inject(HttpService);
  private message = inject(MessageService);

  private unsubscribeMail$ = new Subject<void>();

  incomingInternalMail!: IncomingInternalMail;

  render = true;

  constructor(
  ) {
    this.stateService.setHeader(new Header('DÉTAIL DU COURRIER ENTRANT INTERNE', 'Détail du courrier entrant externe interne', 'home'));
    this.incomingInternalMail = JSON.parse(<string>sessionStorage.getItem('incomingInternalMail'))
    console.log(this.incomingInternalMail);
  }

  ngOnInit(): void {
    this.findMail();
  }

  ngOnDestroy(): void {
    this.unsubscribeMail$.next();
    this.unsubscribeMail$.complete();
  }


  findMail() {
    this.http.url = `incoming-internal-mails/${this.incomingInternalMail.id}`;
    this.unsubscribeMail$.next();
    this.http.get<IncomingInternalMail>().pipe(takeUntil(this.unsubscribeMail$)).subscribe({
      next: (data) => {
        this.incomingInternalMail = data;
        console.log(data);
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
        console.log(this.incomingInternalMail);
      },
    });
  }

  onDisplayPdf(){}
}
