import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContextService {
  private clearSubject: Subject<boolean>;
  private clearObservable: Observable<boolean>;

  constructor() {
    this.clearSubject = new Subject();
    this.clearObservable = this.clearSubject.asObservable();
  }

  public clear() {
    this.clearSubject.next(true);
  }

  public get track(): Observable<boolean> {
    return this.clearObservable;
  }
}
