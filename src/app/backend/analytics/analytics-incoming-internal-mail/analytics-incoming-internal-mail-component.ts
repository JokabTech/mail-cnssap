import { Component, inject } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { StateService } from '../../../core/services/state.service';
import { HttpParamsService } from '../../../core/services/http-params-service';
import { finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { RequestOptions } from '../../../shared/models/request-options';
import { Header } from '../../../shared/models/header';
import { Criteria } from '../../../shared/models/criteria';
import { ActionEvent } from '../../../shared/models/action-event';
import { ReportToolbarComponent } from '../../report/report-toolbar/report-toolbar-component';
import { AnalyticsComponent } from '../analytics/analytics-component';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { Router } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';
import { InformationComponent } from "../../../shared/components/information/information-component";

@Component({
  selector: 'app-analytics-incoming-internal-mail-component',
  imports: [ReportToolbarComponent, AnalyticsComponent, ...SharedImports, InformationComponent],
  templateUrl: './analytics-incoming-internal-mail-component.html',
  styleUrl: './analytics-incoming-internal-mail-component.scss'
})
export class AnalyticsIncomingInternalMailComponent {
  private http = inject(HttpService);
  private stateService = inject(StateService);
  protected paramsService = inject(HttpParamsService);
  protected router = inject(Router);
  private message = inject(MessageService);

  private readonly destroy$ = new Subject<void>();
  private readonly searchTrigger$ = new Subject<RequestOptions>();

  public loading = false;
  public error = null;

  mailMetrics!: MailMetrics;
  isPieProcessed = true;
  isPiePending = true;

  url = 'incoming-internal-mails/analytics'
  tab = 'initital';
  key = 'analytics-incoming-internal';

  public criteria = new Criteria(1, 6);

  constructor() {
    this.stateService.setHeader(new Header('CHIFFRES CLÉS DES COURRIERS ENTRANTS INTERNES', `Statistiques des courriers entrants internes : offrent une vue d’ensemble sur le volume et le suivi des courriers internes reçus.`, 'event_seat'));
    if (sessionStorage.getItem(this.key)) {
      this.tab = <string>sessionStorage.getItem(this.key);
    }

    this.searchTrigger$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((options) => {
          this.loading = true;
          this.error = null;
          this.http.url = options.url;
          return this.http.get<MailMetrics>(options.params).pipe(finalize(() => (this.loading = false)));
        })
      )
      .subscribe({
        next: (data) => {
          this.mailMetrics = data;
          console.log(this.mailMetrics);
        },
        error: (err) => (this.error = err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

   searchChanged(criteria: Criteria) {
    if (criteria.startDate && criteria.endDate) {
      Object.assign(this.criteria, criteria);
      this.searchTrigger$.next(this.paramsService.build(this.url, this.criteria));
    } else {
      this.message.openSnackBar('Veuillez spécifier la plage de dates', 'Fermer', 7000);
    }

  }

  onActionButton(event: ActionEvent<Header>) {
    switch (event.action) {
      case 'print':
        //this.printRepoport(event ? event.data.title : '', event ? event.data.subTitle : '');
        break;
      case 'refresh':
        this.searchTrigger$.next(this.paramsService.build(this.url, this.criteria));
        break;
      case 'report':
        this.router.navigateByUrl(`/mails/incoming/internal/report`);
        break;
      case 'destined':
        this.router.navigateByUrl(`/mails/incoming/internal`);
        break;
      case 'export':
        //this.downloadExcel(this.paramsService.build('export', this.criteria))
        break;
      default:
    }
  }

  changePie(is_processed: boolean, state: boolean) {
    if (is_processed) {
      this.isPieProcessed = state
    } else {
      this.isPiePending = state
    }
  }
}
