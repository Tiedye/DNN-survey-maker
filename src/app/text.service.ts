import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TextService {

  private _focusedElement = new BehaviorSubject<{id: string, end?: boolean}>({id: null});
  private _insertTex = new Subject<string>();

  insert(text: string) {
    this._insertTex.next(text);
  }

  get toInsert(): Observable<string> {
    return this._insertTex.asObservable();
  }

  focus(element: string, end: boolean = false) {
    this._focusedElement.next({id: element, end: end});
  }

  get focusedElement(): Observable<{id: string, end?: boolean}> {
    return this._focusedElement.asObservable();
  }

  constructor() { }

}
