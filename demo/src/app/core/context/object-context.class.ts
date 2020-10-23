import { Observable, ReplaySubject, Subscriber, PartialObserver, of, Subject } from 'rxjs';
import { ContextService } from './context.service';
import { share } from 'rxjs/operators';
import { State } from './state.enum';
import { ObjectState } from './object-state.class';

/**
 * Object states:
 * - empty
 * - loading
 * - loaded
 * - faulty
 */
export class ObjectContext<T extends any> {
  private errorSubject: Subject<any> = new Subject<any>();
  private currentSubject: ReplaySubject<ObjectState<T>> = new ReplaySubject<ObjectState<T>>(1);
  private currentState: ObjectState<T> = new ObjectState<T>();

  constructor(private readonly contextService: ContextService) {
    if (this.contextService) {
      this.contextService.track.subscribe(() => {
        this.clearCurrent();
      });
    }
  }

  /**
   * Returns the subject that signals changes on the context's current object
   */
  get current$(): Observable<ObjectState<T>> {
    return this.currentSubject.asObservable();
  }

  /**
   * Returns the context's error observable
   */
  get error$(): Observable<any> {
    return this.errorSubject.asObservable();
  }

  /**
   * update the current object (and state)
   * signals current$
   */
  public set current(currentObject: T) {
    this.currentState.setObject(currentObject);
    this.signalCurrent();
  }

  /**
   * signal the current object change
   */
  public signalCurrent() {
    this.currentSubject.next(this.currentState);
  }

  /**
   * Tries to ensures the ObjectState is loaded
   * @param handlers execute, error and force handlers
   */
  public ensure$(handlers: EnsureHandlers<T>): Observable<ObjectState<T>> {
    try {
      let queueOnLoading = false;
      if (this.currentState.object && handlers && handlers.queue) {
        queueOnLoading = handlers.queue(this.currentState);
      }
      if (this.currentState.state === State.loading) {
        if (queueOnLoading) {
          // queue request for subsequent execution
          // for now... just continue...
        } else {
          return this.current$;
        }
      }

      let force = false;
      if (this.currentState.object && handlers && handlers.force) {
        force = handlers.force(this.currentState);
      }
      let clear = true;
      if (this.currentState.object && handlers && handlers.clear) {
        clear = handlers.clear(this.currentState);
      }

      if (clear && this.currentState.object) {
        this.clearCurrent();
      }

      if (this.currentState.state === State.loaded && force === false) {
        if (handlers && handlers.completed) {
          handlers.completed(this.currentState);
        }
        return this.current$;
      }

      this.setLoading();

      handlers.execute(this.currentState).subscribe(this.observe(false, handlers, null));

      return this.current$;
    } catch (error) {
      this.handleError(error, handlers, null);
    }
  }

  /**
   * Wrap updates / modifications of "current"
   * - Executes the provided function
   * - Always Updates the current object (if any, otherwies a new current object is created)
   * - Signals the change of the current object
   * Returns a one time Observable that automatically completes after completion of subscription function.
   * @param execute execute the provided function
   */
  public update$(handlers: UpdateHandlers<T>): Observable<ObjectState<T>> {
    const result = new Observable<ObjectState<T>>((obs) => {
      try {
        this.currentState.setLoading();
        handlers.execute(this.currentState).subscribe(this.observe(false, handlers, obs));
      } catch (error) {
        this.handleError(error, handlers, obs);
      }
    });

    return result.pipe(share<ObjectState<T>>());
  }

  /**
   * - Executes the provided function
   * - Clears the current object
   * - Signals the change of the current object
   * Returns a one time Observable that automatically completes after completion of subscription function.
   * @param executeFunc execute the provided function
   */
  public clear$(handlers?: ClearHandlers<T>): Observable<any> {
    const result = new Observable<ObjectState<T>>((obs) => {
      try {
        if (handlers) {
          handlers.execute(this.currentState).subscribe(this.observe(true, handlers, obs));
        } else {
          of(this.currentState.object).subscribe(this.observe(true, null, obs));
        }
      } catch (error) {
        this.handleError(error, handlers, obs);
      }
    });

    return result.pipe(share<ObjectState<T>>());
  }

  private handleError(error: any, handlers: HandlersBase<T>, oneTime: Subscriber<ObjectState<T>>) {
    this.errorSubject.next(error);
    this.setFaulty(error);
    if (handlers) {
      if (handlers.error) {
        handlers.error(error, this.currentState);
      }
      if (handlers.completed) {
        handlers.completed(this.currentState);
      }
    }
    if (oneTime) {
      oneTime.error(error);
    }
  }

  private observe(clear: boolean, handlers: HandlersBase<T>, oneTime: Subscriber<ObjectState<T>>): PartialObserver<T> {
    return {
      next: (model) => {
        if (clear) {
          this.current = null;
        } else {
          this.current = model;
        }
        if (oneTime) {
          oneTime.next(this.currentState);
        }
      },
      error: (errorResponse) => {
        this.handleError(errorResponse, handlers, oneTime);
      },
      complete: () => {
        if (handlers && handlers.completed) {
          handlers.completed(this.currentState);
        }
        if (oneTime) {
          oneTime.complete();
        }
      },
    };
  }

  /**
   * clear the current object and signal
   */
  private clearCurrent() {
    this.currentState.object = null;
    this.currentState.state = State.empty;
    this.signalCurrent();
  }

  private setFaulty(error: any) {
    this.currentState.object = null;
    this.currentState.state = State.faulty;
    this.currentState.error = error;
    this.signalCurrent();
  }

  private setLoading() {
    this.currentState.error = null;
    this.currentState.state = State.loading;
    this.signalCurrent();
  }
}

export interface HandlersBase<T> {
  completed?: (current: ObjectState<T>) => void;
  error?: (error: any, current: ObjectState<T>) => void;
}

export interface ModifcationHandlers<T> extends HandlersBase<T> {
  execute: (current: ObjectState<T>) => Observable<T>;
}

export interface EnsureHandlers<T> extends ModifcationHandlers<T> {
  force?: (current: ObjectState<T>) => boolean;
  clear?: (current: ObjectState<T>) => boolean;
  queue?: (current: ObjectState<T>) => boolean;
}

export interface UpdateHandlers<T> extends ModifcationHandlers<T> {}

export interface ClearHandlers<T> extends ModifcationHandlers<T> {}

export interface CallHandlers<T> extends HandlersBase<T> {
  execute: () => Observable<ObjectState<T>>;
}
