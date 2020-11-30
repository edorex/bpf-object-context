# Object Context

This angular library project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.2.

## Project Overview
```
> .
> dist                  Builded npm package after `ng build --prod` in object-context folder
> projects              
  -  demo               Demo angular project with a ng link to the object-context
  -  object-context     Object-Context Package Library
```
## How to develop, debug, test and deploy
### Develop
Navigate to `projects/object-context` and make your code changes.

### Test & Debug
You can test your changes in the demo project after `ng build --prod` in the directory 
`projects/object-context`.
The demo project has a link to the locally builded package.

> Note: Make sure to always update unit tests if necessary and check them by calling `ng test` 
>in the directory `projects/object-context`.

### Publish
#### 1. Make Prod Build
Create a prod build by `ng build --prod` in the `projects/object-context` directory.
> Note: Make sure all unit tests are successful and you updated the README.md in the 
>`object-context` directory if needed.

#### 2. Publish with `np`
> Info: `np` does several steps in a wizard-like way to ensure that nothing is 
> missed before publishing to npmjs.com. Install `np` by `npm install np -g`

Run the `np` command in this project root folder and follow the wizzard.
