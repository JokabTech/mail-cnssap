import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, from } from 'rxjs';
import { Authentication } from '../../shared/models/authentication';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private _url!: string;
  //private _baseUrl = 'http://localhost:3000/';
  //private _baseUrl = 'https://mail-cnssap-backend.onrender.com/';
  //private _baseUrl = 'https://backend.cnssapdoc.com/';
  private _baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + 3000 + '/';
  //private _baseUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/';

  isAuthentifier = false;
  private _authentication!: Authentication;
  private _roles!: string;
  private _role!: string;

  constructor(private http: HttpClient) { }


  get url() {
    return this._url;
  }

  set url(value: string) {
    this._url = this._baseUrl + value;
  }

  get roles() {
    return this._roles;
  }

  set roles(value: string) {
    this._roles = value;
  }

  get role() {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
  }


  get baseUrl() {
    return this._baseUrl;
  }

  public get<T>(params?: HttpParams): Observable<T> {
    return this.http.get<T>(this._url, { headers: this.getHeader(), params }).pipe(catchError(error => this.handleError(error)));
  }

  public save<T>(data: T, params?: HttpParams): Observable<T> {
    return this.http.post<T>(this._url, data, { headers: this.getHeader(), params }).pipe(catchError(error => this.handleError(error)));
  }

  public register<T>(data: T): Observable<T> {
    return this.http.post<T>(this._url, data).pipe(catchError(error => this.handleError(error)));
  }

  public update<T>(data: T, params?: HttpParams): Observable<T> {
    console.log(data);
    return this.http.patch<T>(this._url, data, { headers: this.getHeader(), params }).pipe(catchError(error => this.handleError(error)));
  }

  public delete<T>(params?: HttpParams): Observable<T> {
    return this.http.delete<T>(this._url, { headers: this.getHeader(), params }).pipe(catchError(error => this.handleError(error)));
  }

  private getHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this._authentication.authorization
    })
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(this._url, data);
  }

  private handleError(error: any) {
    let message = "";
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        message = "Aucune connexion internet. veillez réessayer plus tard"
      } else if (error.status === 401) {
        message = "impossible d'accèder aux ressources. veillez réessayer plus tard";
      } else if (error.status === 403) {
        message = "Vous n'avez pas le droit de faire cette action";
      } else {
        message = error.error.message;
      }
    } else if (error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      message = "Une erreur est survenue. Veillez réessayer plus tard."

    }
    return from(Promise.reject(message));
  }

  set authentication(value: Authentication) {
    this._authentication = value;
  }

  get authentication() {
    return this._authentication;
  }

  public savaAndFile<T>(files: File[], data: T): Observable<HttpEvent<{}>> {
    const formData: FormData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('contenu', JSON.stringify(data));
    const request = new HttpRequest('POST', this._url, formData, { headers: new HttpHeaders({ Authorization: this._authentication.authorization }), reportProgress: true, responseType: 'text' });
    return this.http.request(request);
  }

  public sendFormData<T>(formObject: T, file: File | null | undefined = null, method: 'post' | 'patch' = 'post'): Observable<any> {
    let jsonString: string;
    if (typeof formObject === 'string') {
      jsonString = formObject;
    } else {
      jsonString = JSON.stringify(formObject);
    }

    const formData = new FormData();
    formData.append('data', jsonString);
    if (file) {
      formData.append('file', file, file.name);
    }

    if (method === 'post') {
      return this.http.post(this._url, formData, {
        reportProgress: true,
        observe: 'events',
        headers: new HttpHeaders({
          Authorization: this._authentication.authorization
        }),
      });
    } else {
      return this.http.patch(this._url, formData, {
        reportProgress: true,
        observe: 'events',
        headers: new HttpHeaders({
          Authorization: this._authentication.authorization
        }),
      });
    }
  }

  getPdfDocument(params?: HttpParams): Observable<Blob> {
    return this.http.get(this._url, { responseType: 'blob', headers: this.getHeader(), params });
  }

  getFile(): Observable<ArrayBuffer> {
    return this.http.get(this._url, { responseType: 'arraybuffer', headers: this.getHeader() });
  }

}
