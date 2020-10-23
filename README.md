# bpf-object-context
Object Context manages the cache of domain models in your Angular Application.

## Object Context
The *Object Context* takes full control over the state of models sent and received via API and within the application cache.

### How to
You just have to call `yourContextService.ensure$()` to get your `Observable<ObjectState<YourModel>>`. 
Checkout the source code in the demo project for more detail.

```
export class YourComponent implements OnInit {

  constructor(private yourService: YourService) { }

  ngOnInit(): void {
    this.yourService.ensureYourModels$().subscribe((state: ObjectState<YourModels>) => {
      if (state.isLoaded) {
        const models = state.object; // <-- Models received
      }
    });
  }
}
```
> Note: For easier reading the observables' unsubscribe call is missing in the example above. 


## Demo
Run the provided demo application by calling following commands within the `demo/` directory:
```
npm i
ng serve
```
