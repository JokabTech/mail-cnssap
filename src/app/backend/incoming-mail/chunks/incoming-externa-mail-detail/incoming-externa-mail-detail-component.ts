import { IncomingExternalMail } from './../../../../shared/models/incoming-external-mail';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../core/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from '../../../../core/services/message.service';
import { StateService } from '../../../../core/services/state.service';
import { IncomingExternalMailService } from '../../../../core/services/incoming-external-mail-service';

@Component({
  selector: 'app-incoming-externa-mail-detail-component',
  imports: [],
  templateUrl: './incoming-externa-mail-detail-component.html',
  styleUrl: './incoming-externa-mail-detail-component.scss'
})
export class IncomingExternaMailDetailComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpService);
  private message = inject(MessageService);
  private stateService = inject(StateService);
  private mailService = inject(IncomingExternalMailService);

  private unsubscribe$ = new Subject<void>();

  id: string | null = null;
  loading = false;
  mail!: IncomingExternalMail

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.findMail(this.id);
    } else {
      const mail = JSON.parse(<string>sessionStorage.getItem(this.mailService.sessionKey));
      this.findMail(mail.id);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  findMail(id: string): void {
    this.loading = true;
    this.http.url = `incoming-external-mails${id}`;
    this.unsubscribe$.next();
    this.http
      .get<IncomingExternalMail>()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (data) => {
          this.mail = data;
        },
        error: (err) => {
          this.loading = false;
          this.message.openSnackBar(err, 'Fermer', 800);
        },
        complete: () => {
          console.log(this.mail);
        },
      });
  }
}
