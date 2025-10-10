import { MessageService } from './../../../../core/services/message.service';
import { Component, computed, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { StateService } from '../../../../core/services/state.service';
import { SharedImports } from '../../../../shared/imports/shared-imports';
import { SharedBackend } from '../../../../shared/imports/shared-backend-imports';
import { Department } from '../../../../shared/models/department';
import { HttpService } from '../../../../core/services/http.service';
import { Criteria } from '../../../../shared/models/criteria';

@Component({
  selector: 'app-search-bar-component',
  imports: [...SharedImports, ...SharedBackend],
  templateUrl: './search-bar-component.html',
  styleUrl: './search-bar-component.scss'
})
export class SearchBarComponent implements OnDestroy {
  private http = inject(HttpService);
  private stateService = inject(StateService);
  private message = inject(MessageService);

  private destroySearchKeywordSub$ = new Subject<void>();
  private destroyFormSub$ = new Subject<void>();

  @Output() searchChanged = new EventEmitter<Criteria>();
  @Output() viewChanged = new EventEmitter<string>();

  searchKeyword = new FormControl('');
  withDate = false;
  form!: FormGroup;

  xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  private unsubscribe$ = new Subject<void>();

  departements: Department[] = [];

  constructor() {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroySearchKeywordSub$.next();
    this.destroySearchKeywordSub$.complete();

    this.destroyFormSub$.next();
    this.destroyFormSub$.complete();
  }

  private initForm(): void {
    this.findDepartments();
    this.form = new FormGroup(
      {
        startDate: new FormControl(''),
        endDate: new FormControl(''),
        department_id: new FormControl(''),
      },
      {
        validators: this.dateRangeValidator
      }
    );

    this.searchKeyword.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroySearchKeywordSub$)
      ).subscribe(
        keyword => this.emitSearch(keyword || '')
      );
    /*
    this.form.valueChanges
      .pipe(
        takeUntil(this.destroyFormSub$)
      ).subscribe(
        () => this.emitSearch('', this.searchKeyword.value || '')
      );
    */
  }

  toggleDateSelector(withDate: boolean) {
    this.withDate = withDate;
    this.emitSearch(this.searchKeyword.value || '');
  }

  private emitSearch(keyword: string) {
    this.searchChanged.emit({ keyword, startDate: this.form.value.startDate, endDate: this.form.value.endDate, department_id: this.form.value.department_id });
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
      this.form.reset();
      this.emitSearch('');
    }
    this.withDate = withDate;

  }

  onViewChanged(view: string){
    this.viewChanged.emit(view);
  }


  private findDepartments(): void {
    this.unsubscribe$.next();
    this.http.url = 'departments';
    this.http.get<Department[]>().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.departements = data;
      },
      error: (err) => {
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
      },
    });
  }
}
