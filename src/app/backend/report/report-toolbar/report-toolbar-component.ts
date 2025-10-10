import { Department } from '../../../shared/models/department';
import { Component, computed, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Tab } from '../../../shared/models/tab';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { StateService } from '../../../core/services/state.service';
import { BackComponent } from "../../../shared/components/back/back-component";
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { Criteria } from '../../../shared/models/criteria';
import { debounceTime, distinctUntilChanged, forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DocumentType } from '../../../shared/models/document_type';
import { intervalToDuration, Duration, format } from 'date-fns';
import { Header } from '../../../shared/models/header';
import { ActionEvent } from '../../../shared/models/action-event';

@Component({
  selector: 'app-report-toolbar-component',
  imports: [...SharedImports, ...SharedBackend, BackComponent],
  templateUrl: './report-toolbar-component.html',
  styleUrl: './report-toolbar-component.scss'
})
export class ReportToolbarComponent implements OnInit, OnDestroy {

  private stateService = inject(StateService);
  private http = inject(HttpService);
  private message = inject(MessageService);

  private destroySearchKeywordSub$ = new Subject<void>();
  private unsubscribe$ = new Subject<void>();
  private destroyFormSub$ = new Subject<void>();

  private baseTitle: string = '';

  @Input() selectedTab: string = 'all';
  @Input() isInternal = false;
  @Input() isOutgoing = false;
  @Input() isAnalytics = false;

  @Output() searchChanged = new EventEmitter<Criteria>();
  @Output() tabSelected = new EventEmitter<string>();
  @Output() actionButton = new EventEmitter<ActionEvent<Header>>();

  title: string = '';
  subTitle: string = '';
  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  searchKeyword = new FormControl('');
  withDate = true;
  withSearch = false;
  form!: FormGroup;
  departements: Department[] = [];
  department!: Department | null;

  documentTypes: DocumentType[] = [];
  documentType!: DocumentType | null;
  isFormReady = false;

  tabs!: Tab[];

  constructor() {
  }

  ngOnInit(): void {
    if (this.isAnalytics) {
      this.baseTitle = `Chiffres clés des courriers entrants ${this.isInternal ? 'internes' : 'externes'}`
      this.title = this.baseTitle;
    } else {
      if (this.isOutgoing) {
        this.tabs = [
          { key: 'initial', icon: 'receipt', tooltip: `Rapport de tous les courriers sortant ${this.isInternal ? 'internes' : 'externes'}` },
          { key: 'processed', icon: 'list', tooltip: `Rapport de tous les Courriers sortant ${this.isInternal ? 'internes' : 'externes'} avec accusé de réception` },
          { key: 'unprocessed', icon: 'assignment_turned_in', tooltip: `Rapport de tous les courriers sortant ${this.isInternal ? 'internes' : 'externes'} sans accusé de réception` },
        ]
      } else {
        this.tabs = [
          { key: 'initial', icon: 'receipt', tooltip: `Rapport de tous les courriers entrants ${this.isInternal ? 'internes' : 'externes'}` },
          { key: 'processed', icon: 'list', tooltip: `Rapport de tous les Courriers entrants ${this.isInternal ? 'internes' : 'externes'} traités` },
          { key: 'unprocessed', icon: 'assignment_turned_in', tooltip: `Rapport de tous les courriers entrants ${this.isInternal ? 'internes' : 'externes'} non traités` },
        ]
      }
      const initialTab = this.tabs.find(t => t.key === this.selectedTab) || this.tabs[0];
      this.baseTitle = initialTab.tooltip || '';
      this.title = this.baseTitle;
    }

    this.loadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.destroySearchKeywordSub$.next();
    this.destroySearchKeywordSub$.complete();

    this.destroyFormSub$.next();
    this.destroyFormSub$.complete();
  }

  private initForm(): void {
    this.form = new FormGroup(
      {
        startDate: new FormControl(''),
        endDate: new FormControl(''),
        department_id: new FormControl(''),
        document_type_id: new FormControl(''),
      },
      {
        validators: this.dateRangeValidator
      }
    );
  }

  private startFormListeners(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(100),
        takeUntil(this.destroyFormSub$)
      )
      .subscribe(() => {
        this.onBuildTitle();
        this.onBuildSubTitle();
      });

    this.searchKeyword.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroySearchKeywordSub$)
      ).subscribe(
        keyword => this.emitSearch(keyword || '')
      );
  }

  private findItemById(id: any, sourceArray: any[]): any | undefined {
    if (!id) return undefined;
    return sourceArray.find(item => item.id == id);
  }

  onBuildTitle(): void {
    this.title = this.baseTitle;
    const { department_id, document_type_id } = this.form.value;

    const selectedDepartment = this.findItemById(department_id, this.departements);

    if (selectedDepartment) {
      this.department = selectedDepartment;
      this.title += ` - ${this.department?.designation}`;
    } else {
      this.department = null;
    }

    const selectedDocumentType = this.findItemById(document_type_id, this.documentTypes);

    if (selectedDocumentType) {
      this.documentType = selectedDocumentType;
      this.title += ` - ${this.documentType?.designation}`;
    } else {
      this.documentType = null;
    }
  }

  onBuildSubTitle() {
    const { startDate, endDate } = this.form.value;
    if (startDate && endDate) {
      const duration = this.calculateDuration(startDate, endDate);
      this.subTitle = `Du ${this._formatDate(startDate)} au ${this._formatDate(endDate)} ${duration}`;
    } else if (startDate) {
      this.subTitle = `Du ${this._formatDate(startDate)}`;
    } else if (endDate) {
      this.subTitle = `Jusqu'au ${this._formatDate(endDate)}`;
    }
  }

  toggleDateSelector(withDate: boolean) {
    this.withDate = withDate;
    this.emitSearch(this.searchKeyword.value || '');
  }

  private emitSearch(keyword: string) {
    this.searchChanged.emit({
      keyword,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      department_id: this.form.value.department_id,
      document_type_id: this.form.value.document_type_id,
      tab: this.selectedTab
    });
  }

  onEmitActionButton(action: string) {
    this.actionButton.emit(new ActionEvent(action, new Header(this.title, this.subTitle, '')));
  }

  onSelectTab(tab: Tab) {
    this.selectedTab = tab.key;
    this.baseTitle = tab.tooltip || '';
    this.onBuildTitle();
    this.tabSelected.emit(tab.key);
  }

  private dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('startDate')?.value;
    const end = control.get('endDate')?.value;

    if (start && end && new Date(start) > new Date(end)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit() {
    this.emitSearch(this.searchKeyword.value || '');
  }

  onToogleDateSelector(withDate: boolean) {
    if (this.withDate !== withDate) {
      this.form.patchValue({ startDate: null, endDate: null });
      this.onBuildSubTitle();
      this.emitSearch('');
    }
    this.withDate = withDate;
  }

  loadData() {
    this.unsubscribe$.next();

    const dataSources: { [key: string]: Observable<any> } = {
      department: this.getDepartments(),
    };

    if (this.isInternal) {
      dataSources['documentType'] = this.getDocumentTypes()
    }

    forkJoin(dataSources).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (results) => {
        this.departements = results['department'];
        if (this.isInternal) {
          this.documentTypes = results['documentType'];
        }

        this.isFormReady = true;
        this.initForm();
        this.startFormListeners();
      },
      error: (err) => {
        this.message.openSnackBar('Une erreur est survenue lors du chargement des données. Veuillez réessayer.', 'Fermer', 800);
      },
    });
  }

  private getDepartments(): Observable<Department[]> {
    this.http.url = `departments`;
    return this.http.get<Department[]>();
  }

  private getDocumentTypes(): Observable<DocumentType[]> {
    this.http.url = `document-types`;
    return this.http.get<DocumentType[]>();
  }

  private calculateDuration(startDate: string, endDate: string): string {

    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      return '';
    }

    const duration: Duration = intervalToDuration({ start: new Date(startDate), end: new Date(endDate) });

    const parts: string[] = [];

    if (duration.years && duration.years > 0) {
      parts.push(`${duration.years} ${duration.years > 1 ? 'années' : 'année'}`);
    }

    if (duration.months && duration.months > 0) {
      parts.push(`${duration.months} ${duration.months > 1 ? 'mois' : 'mois'}`);
    }

    if (duration.days && duration.days > 0) {
      parts.push(`${duration.days} ${duration.days > 1 ? 'jours' : 'jour'}`);
    }

    const isShortDuration = !(duration.years || duration.months);

    if (isShortDuration && duration.hours && duration.hours > 0) {
      parts.push(`${duration.hours} ${duration.hours > 1 ? 'heures' : 'heure'}`);
    }


    if (parts.length === 0) {
      return '';
    }

    let durationString = 'soit une période de ';

    if (parts.length === 1) {
      durationString += parts[0];
    } else if (parts.length === 2) {
      durationString += `${parts[0]} et ${parts[1]}`;
    } else {
      const last = parts.pop();
      durationString += `${parts.join(', ')} et ${last}`;
    }

    return ` (${durationString})`;
  }

  private _formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return dateString;
    }
  }
}
