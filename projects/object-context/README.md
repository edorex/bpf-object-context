# object-context
Object Context manages the cache of domain models in your Angular Application.

## Object Context
The *Object Context* takes full control over the state of models sent and received via API and within the application cache.

### Install
```
npm i @edorex/object-context
```

### Get started
#### Register ObjectContext names
Add the name of your ObjectContext to the file `object-context-name.class.ts`. 
> If the file doesn't exist - create a new file to the core module dir (eg: `src/app/core/object-context-name.class.ts`)
```
export class ObjectContextName {
  public static readonly yourModelCtx = 'YourModelCtx';
}
```

#### Register Context provider
Register your own Object Context Services in the `CoreModule`.
```
@NgModule({
  // ...
  providers: [
    {
      provide: ObjectContextName.yourModelCtx,
      useFactory: (ctxService: ContextService) => new ObjectContext<YourModel>(ctxService),
      deps: [ContextService],
    }
  // ...
})
export class CoreModule { }
```

#### Create your service to access the ObjectContext
Create your service class and add public methods to call the ObjectContext ensure$ method like in the example below:
```
export class YourService {
  yourModel$: Observable<ObjectState<YourModel>>;

  constructor(
    @Inject(ObjectContextName.yourModelCtx) private yourModelCtx: ObjectContext<YourModel>,
    private yourModelApiService: YourModelApiService
  ) {
    this.yourModel$ = this.yourModelCtx.current$;
  }

  ensureYourModel$(): Observable<ObjectState<YourModel>> {
    return this.yourModelCtx.ensure$({
      execute: (current) => {
        return this.yourModelApiService.getAllHTTP().pipe(
          map((apiResponse: YourApiModel) => {
            return YourModel.from(apiResponse);
          })
        );
      },
      force: () => false,
      clear: () => false,
      queue: () => false,
    });
  }
}
```

#### Usage in Components
You just have to call `yourService.ensure$()` to get your `Observable<ObjectState<YourModel>>`. 
Checkout the source code in the demo project for more detail.

```
export class YourComponent implements OnInit {

  constructor(private yourService: YourService) { }

  ngOnInit(): void {
    this.yourService.ensureYourModel$().subscribe((state: ObjectState<YourModel>) => {
      if (state.isLoaded) {
        const model = state.object; // <-- Model received
      }
    });
  }
}
```
> Note: For easier reading the observables' unsubscribe call is missing in the example above. 
