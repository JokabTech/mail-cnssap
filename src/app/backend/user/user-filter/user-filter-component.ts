import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StateService } from '../../../core/services/state.service';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { FormControl, FormsModule } from '@angular/forms';
import { User } from '../../../shared/models/user';
import { RequestOptions } from '../../../shared/models/request-options';
import { HttpParamsService } from '../../../core/services/http-params-service';
import { Page } from '../../../shared/models/page';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { DialogImports } from '../../../shared/imports/dialog-imports';

@Component({
  selector: 'app-user-filter-component',
  imports: [...SharedBackend, ...SharedImports, FormsModule, DialogImports],
  templateUrl: './user-filter-component.html',
  styleUrl: './user-filter-component.scss'
})
export class UserFilterComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<UserFilterComponent>);
  readonly data: { title: string } = inject(MAT_DIALOG_DATA);
  private http = inject(HttpService);
  private message = inject(MessageService);
  protected paramsService = inject(HttpParamsService);

  private stateService = inject(StateService);
  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());

  private destroySearchKeywordSub$ = new Subject<void>();
  private readonly searchTrigger$ = new Subject<RequestOptions>();
  private readonly destroy$ = new Subject<void>();

  loading = false;
  page!: Page<User>

  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 100, 200, 300];
  pageSize = this.pageSizeOptions[0];
  searchKeyword = new FormControl();

  ngOnInit(): void {
    this.searchKeyword.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroySearchKeywordSub$)
      ).subscribe(
        keyword => this.search(keyword || '')
      );

    this.searchTrigger$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((options) => {
          this.loading = true;
          this.http.url = options.url;
          return this.http.get<Page<User>>(options.params).pipe(
            finalize(() => (this.loading = false))
          );
        })
      ).subscribe({
        next: (data) => {
          this.page = data;
          console.log(this.page);
        },
        error: (err) => {
          this.message.openSnackBar(err, 'Fermer', 800);
        },
      });

    this.searchTrigger$.next(this.paramsService.build('users', { page: this.currentPage, pageSize: this.pageSize }));
  }

  ngOnDestroy(): void {
    this.destroySearchKeywordSub$.next();
    this.destroySearchKeywordSub$.complete();

    this.destroy$.next();
    this.destroy$.complete();
  }

  search(keyword: string): void {
    const options: RequestOptions = this.paramsService.build('users', { page: this.currentPage, pageSize: this.pageSize, keyword });
    this.searchTrigger$.next(options);
  }

  onPageChange(event: any): void {
    const page = event.pageIndex + 1;
    const pageSize = event.pageSize;
    const options: RequestOptions = this.paramsService.build('users', { page, pageSize, keyword: this.searchKeyword.value });
    this.searchTrigger$.next(options);
  }

  onClose(){
    this.dialogRef.close();
  }

  onSelectUser(user: User){
    this.dialogRef.close(user);
  }

}
