import { Injectable, signal } from '@angular/core';
import { Header } from '../../shared/models/header';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  header = signal<Header>(new Header('', '', ''));

  constructor() { }

  setHeader(header: Header) {
    this.header.set(header);
  }
}
