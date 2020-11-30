import { Observable, of } from 'rxjs';
import { ProjectApiModel } from '../model/project.api.model';
import { delay } from 'rxjs/operators';

export class ProjectApiService {
  // THIS IS ONLY A FAKE API HTTP SERVICE !
  constructor() {
  }

  // THIS IS ONLY A FAKE HTTP RESPONSE (HTTP MOCK)
  public getAllProjectsHTTP(): Observable<ProjectApiModel[]> {
    console.log('HTTP GET API Call');
    return of([
      {name: 'Project A', value: 1000},
      {name: 'Project B', value: 2000},
      {name: 'Project C', value: 3000},
    ]).pipe(delay(1500));
  }

  // THIS IS ONLY A FAKE HTTP RESPONSE (HTTP MOCK)
  public updateProjectsHTTP(postApiModel: {name: string, value: number}): Observable<ProjectApiModel[]> {
    console.log('HTTP POST API Call');
    return of([
      {name: 'Project A', value: 1000},
      {name: 'Project B', value: 2000},
      {name: 'Project C', value: 3000},
      postApiModel
    ]).pipe(delay(800));
  }
}
