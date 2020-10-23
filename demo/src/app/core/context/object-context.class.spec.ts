import { TestBed } from '@angular/core/testing';
import { ContextService } from './context.service';
import { ObjectContext } from './object-context.class';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ObjectState } from './object-state.class';

export class TestModel {
  id: string;
  value: string;
}

describe('ObjectContext<T extends any>', () => {
  const ctxToken = new InjectionToken<ObjectContext<TestModel>>('ctx');
  let contextService: ContextService;
  let context: ObjectContext<TestModel>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        { provide: ContextService, useClass: ContextService },
        {
          provide: ctxToken,
          useFactory: (ctxService: ContextService) => new ObjectContext<TestModel>(contextService),
          deps: [ContextService],
        },
      ],
    });
    contextService = TestBed.inject(ContextService);
    context = TestBed.inject(ctxToken);
  });

  it('should create an ObjectContext<TestModel>', () => {
    expect(context).not.toBeNull();
  });

  it('current$ should return an Observable', () => {
    expect(context.current$).toBeInstanceOf(Observable);
  });

  it('should correctly signal initially assigned current object', (done) => {
    const testModel = new TestModel();

    context.current$.subscribe({
      next: (os: ObjectState<TestModel>) => {
        expect(os.object).toBe(testModel);
        done();
      },
    });
    context.current = testModel;
  });

  it('subscription pre execute should initially return null', (done) => {
    const testModel = new TestModel();
    let initialCall = true;

    context.current$.subscribe({
      next: (os: ObjectState<TestModel>) => {
        if (initialCall) {
          expect(os.object).toBeNull();
          done();
          initialCall = false;
        }
      },
    });

    context
      .ensure$({
        execute: (current) => {
          return of(testModel);
        },
      })
      .subscribe();
  });

  it('current$ subscription should receive "ensure$"d object', (done) => {
    const testModel = new TestModel();

    context.current$.pipe(filter((f) => !!f && !!f.object)).subscribe({
      next: (os: ObjectState<TestModel>) => {
        expect(os.object).toEqual(testModel);
        done();
      },
    });

    context
      .ensure$({
        execute: (current) => {
          return of(testModel);
        },
      })
      .subscribe();
  });

  it('multiple "ensure$" subscriptions only execute once', () => {
    const testModel = new TestModel();
    let callsCount = 0;
    context
      .ensure$({
        execute: (current) => {
          ++callsCount;
          return of(testModel);
        },
      })
      .subscribe();

    context
      .ensure$({
        execute: (current) => {
          ++callsCount;
          return of(testModel);
        },
      })
      .subscribe();

    expect(callsCount).toBe(1);
  });

  it('force "ensure$" does execute again (but only once)', () => {
    const testModel = new TestModel();
    let callsCount = 0;
    context
      .ensure$({
        execute: (current) => {
          ++callsCount;
          return of(testModel);
        },
      })
      .subscribe();

    context
      .ensure$({
        execute: (current) => {
          ++callsCount;
          return of(testModel);
        },
        force: () => true,
      })
      .subscribe();

    expect(callsCount).toBe(2);
  });

  it('error is propagated to ensure$ handlers and NOT to subscription (Observable keep alive)', (done) => {
    const testModel = new TestModel();
    const errorObject = new Error();

    context
      .ensure$({
        execute: (current) => {
          throw errorObject;
        },
        error: (error) => {
          expect(error).toEqual(errorObject);
          done();
        },
      })
      .subscribe({
        error: () => {},
      });
  });

  it('ensure$ Observable stays alive after exception is thrown', (done) => {
    const testModel = new TestModel();
    const errorObject = new Error();

    context
      .ensure$({
        execute: (current) => {
          throw errorObject;
        },
        error: (error) => {
          expect(error).toEqual(errorObject);
        },
      })
      .subscribe();

    context
      .ensure$({
        execute: (current) => {
          return of(testModel);
        },
      })
      .subscribe({
        next: (os) => {
          if (os && os.object) {
            expect(os.object).toEqual(testModel);
            done();
          }
        },
      });
  });

  it('context error$ observable must be called on execute error', (done) => {
    const testModel = new TestModel();
    const errorObject = new Error();

    context.error$.subscribe({
      next: (error) => {
        expect(error).toEqual(errorObject);
        done();
      },
    });

    context
      .ensure$({
        execute: (current) => {
          throw errorObject;
        },
      })
      .subscribe();
  });
});
