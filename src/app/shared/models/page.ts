export class Page<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;

  constructor(items: T[], totalItems: number, currentPage: number, pageSize: number) {
    this.items = items;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(totalItems / pageSize);
  }
}
