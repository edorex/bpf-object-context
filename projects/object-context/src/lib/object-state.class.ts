import { HttpErrorResponse } from '@angular/common/http';
import { State } from './state.enum';

export class ObjectState<T> {
  object?: T;
  state: State = State.empty;
  error: any = null;
  setObject(object: T): void {
    this.object = object;
    this.state = this.object ? State.loaded : State.empty;
  }
  setLoading(): void {
    this.state = State.loading;
  }
  setFaulty(): void {
    this.state = State.faulty;
  }
  get isEmpty(): boolean {
    return this.state === State.empty;
  }
  get isLoading(): boolean {
    return this.state === State.loading;
  }
  get isLoaded(): boolean {
    return this.state === State.loaded;
  }
  get isFaulty(): boolean {
    return this.state === State.faulty;
  }
  get errorMessage(): string {
    if (this.error instanceof HttpErrorResponse) {
      return this.error.message;
    } else {
      return this.error;
    }
  }
}
