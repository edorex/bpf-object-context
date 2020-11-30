import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { ProjectApiModel } from '../api/model/project.api.model';
import { ProjectApiService } from '../api/services/project.api.service';
import { ProjectsModel } from '../models/domain/projects.model';
import { ObjectContext, ObjectState } from 'object-context';
import { ObjectContextName } from '../object-context-name.class';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  $projects: Observable<ObjectState<ProjectsModel>>;

  constructor(
    @Inject(ObjectContextName.projectCtx) private projectCtx: ObjectContext<ProjectsModel>,
    private projectApiService: ProjectApiService
  ) {
    this.$projects = this.projectCtx.current$;
  }

  updateProjects$(): Observable<ObjectState<ProjectsModel>> {
    return this.projectCtx.update$({
      execute: () => {
        return this.projectApiService.updateProjectsHTTP({name: 'New Project', value: 0}).pipe(
          map((apiResponse: ProjectApiModel[]) => {
            return ProjectsModel.from(apiResponse);
          })
        );
      }
    });
  }

  ensureProjects$(force: boolean = false, queue: boolean = false): Observable<ObjectState<ProjectsModel>> {
    return this.projectCtx.ensure$({
      execute: (current) => {
        return this.projectApiService.getAllProjectsHTTP().pipe(
          map((apiResponse: ProjectApiModel[]) => {
            return ProjectsModel.from(apiResponse);
          })
        );
      },
      force: () => force,
      clear: () => false,
      queue: () => queue,
    });
  }
}
