# Object Context

This angular library project was generated with [Angular CLI](https://github.com/angular/angular-cli).

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
The demo project has a link to the locally built package.

> Note: Make sure to always update unit tests if necessary and check them by calling `ng test` 
>in the directory `projects/object-context`.

### Publish
#### 1. Unit Tests
Make sure all unit tests pass.
```bash
cd projects/object-context
ng test
```

#### 2. Update Readme and Demo
Update README.md if necessary and update the demo project if necessary.

#### 3. Commit to GIT and create pull-request to merge into 
* Commit your changes to the GIT repository.
* Create a pull request to merge your branch into the `main` branch.
> Use `git merge --squash` and write the merge commit message according to 
> [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to support a changelog automation.

#### 4. Publish to npm
If all previous steps are done, checkout the `main` branch and run following 
command in this project's root dir:
```bash
# (1) build project
cd ./projects/object-context
ng build --prod
cd ../..

# (2) login to npm.js with a user of the edorex organization (https://www.npmjs.com/org/edorex)
npm login

# (3) publish to npm.js
cd ./dist/object-context
npm publish --access public
```
