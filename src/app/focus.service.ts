import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FocusService {

  private _focusedElement = new BehaviorSubject<string>('');

  focus(element: string) {
    this._focusedElement.next(element);
  }

  get focusedElement(): Observable<string> {
    return this._focusedElement.asObservable();
  }

  constructor() { }

}
