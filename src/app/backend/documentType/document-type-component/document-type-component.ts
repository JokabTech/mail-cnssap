import { Component, computed, inject } from '@angular/core';
import { HttpService } from '../../../core/services/http.service';
import { MessageService } from '../../../core/services/message.service';
import { StateService } from '../../../core/services/state.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DocumentType } from '../../../shared/models/document_type';
import { FormControl } from '@angular/forms';
import { Header } from '../../../shared/models/header';
import { PageEvent } from '@angular/material/paginator';
import { DocumentTypeEditComponent } from '../document-type-edit-component/document-type-edit-component';
import { SharedBackend } from '../../../shared/imports/shared-backend-imports';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { BackComponent } from '../../../shared/components/back/back-component';

@Component({
  selector: 'app-document-type-component',
  imports: [...SharedBackend, ...SharedImports, BackComponent],
  templateUrl: './document-type-component.html',
  styleUrl: './document-type-component.scss'
})
export class DocumentTypeComponent {
  private http = inject(HttpService);
  private message = inject(MessageService);
  private stateService = inject(StateService);
  private dialog = inject(MatDialog);

  public xSmallOrSmall = computed(() => this.stateService.XSmallOrSmall());
  private unsubscribe$ = new Subject<void>();

  loading = false;
  allUDocymentTypes: DocumentType[] = [];
  filteredDocumentTypes: DocumentType[] = [];
  paginatedDocumentTypes: DocumentType[] = [];

  totalLength = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [6, 10, 15, 20];
  pageSize = this.pageSizeOptions[0];
  searchKeyword = new FormControl('');

  constructor() {
    this.stateService.setHeader(new Header('GESTION DES TYPE DE DOCUMENT', 'Liste des tous les documents', 'event_seat'));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.onGet();
    this.setupSearch();
  }

  onGet(): void {
    this.loading = true;
    this.http.url = `document-types`;
    this.unsubscribe$.next();
    this.http.get<DocumentType[]>().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (data) => {
        this.allUDocymentTypes = data;
        this.filteredDocumentTypes = data;
      },
      error: (err) => {
        this.loading = false;
        this.message.openSnackBar(err, 'Fermer', 800);
      },
      complete: () => {
        this.loading = false;
        this.totalLength = this.filteredDocumentTypes.length;
        this.updatePaginated();
      },
    });
  }

  setupSearch(): void {
    this.searchKeyword.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(value => {
        this.applyFilter(value);
      });
  }

  applyFilter(filterValue: string | null): void {
    const keyword = filterValue ? filterValue.toLowerCase().trim() : '';
    this.filteredDocumentTypes = this.allUDocymentTypes.filter(department =>
      department.designation.toLowerCase().includes(keyword)
    );

    this.totalLength = this.filteredDocumentTypes.length;
    this.currentPage = 0;
    this.updatePaginated();
  }

  updatePaginated() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDocumentTypes = this.filteredDocumentTypes.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginated();
  }

  onAddDialog(documentType?: DocumentType) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Ajouter un type de document`, documentType, target: 'add' };

    //conf.minWidth = this.xSmallOrSmall() ? '96vw' : '60vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(DocumentTypeEditComponent, conf);
    dialogRef.afterClosed().subscribe((documentType: DocumentType) => {
      if (documentType) {
        this.allUDocymentTypes.push(documentType);
        this.applyFilter(this.searchKeyword.value);
      }
    });
  }

  onUpdateDialog(documentType?: DocumentType) {
    const conf = new MatDialogConfig();
    conf.disableClose = true;
    conf.data = { title: `Modifier un type de document`, documentType, target: 'edit' };

    //conf.minWidth = this.xSmallOrSmall() ? '96vw' : '60vw';
    //conf.height = '80%';

    const dialogRef = this.dialog.open(DocumentTypeEditComponent, conf);
    dialogRef.afterClosed().subscribe((documentType: DocumentType) => {
      if (documentType) {
        const index = this.filteredDocumentTypes.findIndex(dep => dep.id === documentType.id);
        if (index !== -1) {
          this.filteredDocumentTypes[index] = documentType;
          this.updatePaginated();
        }
      }
    });
  }
}
