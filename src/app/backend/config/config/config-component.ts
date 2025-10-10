import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { StateService } from '../../../core/services/state.service';
import { Header } from '../../../shared/models/header';
import { Subject, takeUntil } from 'rxjs';
import { Config } from '../../../shared/models/config';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { BackComponent } from '../../../shared/components/back/back-component';

@Component({
  selector: 'app-config-component',
  imports: [...SharedBackend, ...SharedImports, BackComponent],
  templateUrl: './config-component.html',
  styleUrl: './config-component.scss'
})
export class ConfigComponent implements OnInit, OnDestroy {
  private http = inject(HttpService);
  private message = inject(MessageService);
  private stateService = inject(StateService);

  private unsubscribe$ = new Subject<void>();

  loading = false;
  config!: Config;
  sended = false;

  form!: FormGroup;
  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  constructor() {
    this.stateService.setHeader(
      new Header(
        'CONFIGURATION DES COURRIERS',
        'Gérer les types de courriers et leurs propriétés.',
        'event_seat'
      )
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.loadConfig();
  }

  private initForm(): void {
    this.form = new FormGroup({
      incoming_external_delay: new FormControl(this.config.incoming_external_delay, [Validators.required, Validators.min(1), Validators.max(30)]),
      incoming_internal_delay: new FormControl(this.config.incoming_internal_delay, [Validators.required, Validators.min(1), Validators.max(30)]),
    });
  }

  loadConfig(): void {
    this.loading = true;
    this.http.url = `settings`;
    this.unsubscribe$.next();
    this.http
      .get<Config>().pipe(takeUntil(this.unsubscribe$)).subscribe({
        next: (data) => {
          this.config = data;
          console.log(data);
        },
        error: (err) => {
          this.loading = false;
          this.message.openSnackBar(err, 'Fermer', 800);
        },
        complete: () => {
          this.loading = false;
          this.initForm();
        },
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.openSnackBar('Veuillez corriger les erreurs.', 'Fermer', 4000);
      return;
    }
    this.add();
  }

  add() {
    this.sended = true;
    this.http.url = `settings`;
    this.http.save(this.form.value).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.sended = false;
        this.config = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 4000);
      },
      complete: () => {
        this.sended = false;
        this.message.openSnackBar('Opération effectuée avec succès', 'Fermer', 4000);
      },
    });
  }

}
