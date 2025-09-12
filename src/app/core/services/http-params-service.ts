import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestOptions } from '../../shared/models/request-options';
import { Criteria } from '../../shared/models/criteria';

@Injectable({
  providedIn: 'root'
})
export class HttpParamsService {

  buildParams(criteria: Record<string, any>): HttpParams {
    let params = new HttpParams();
    for (const key in criteria) {
      const value = criteria[key];
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    }
    return params;
  }

  build(url: string, criteria: Criteria): RequestOptions {
    return new RequestOptions(url, this.buildParams(criteria));
  }
}

