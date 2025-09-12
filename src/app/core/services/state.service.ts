import { Header } from './../../shared/models/header';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  state = signal<boolean>(false);
  header = signal<Header>(new Header('', '', ''));
  XSmallOrSmall = signal<boolean>(false);

  role = signal<string>('maa');

  constructor() {
  }
  setState(state: boolean) {
    this.state.set(state);
  }

  setHeader(header: Header) {
    this.header.set(header);
  }

  setXSmallOrSmall(XSmallOrSmall: boolean) {
    this.XSmallOrSmall.set(XSmallOrSmall);
  }

  setRole(role: string){
    this.role.set(role);
  }
}
