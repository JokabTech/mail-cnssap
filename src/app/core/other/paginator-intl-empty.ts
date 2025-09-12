import { MatPaginatorIntl } from '@angular/material/paginator';

export function getEmptyPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = '';
  paginatorIntl.nextPageLabel = '';
  paginatorIntl.previousPageLabel = '';
  paginatorIntl.firstPageLabel = '';
  paginatorIntl.lastPageLabel = '';
  paginatorIntl.getRangeLabel = () => '';

  return paginatorIntl;
}
