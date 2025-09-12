import { HttpParams } from "@angular/common/http";

export class RequestOptions {
  constructor(
    public url: string,
    public params: HttpParams
  ) {}
}
