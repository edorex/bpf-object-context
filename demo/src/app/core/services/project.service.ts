import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ProjectModel } from '../models/domain/project.model';
import { map } from 'rxjs/operators';
import { ProjectApiModel } from '../api/model/project.api.model';
import { ObjectState } from '../context/object-state.class';
import { ObjectContextName } from '../context/object-context-name.class';
import { ObjectContext } from '../context/object-context.class';
import { ProjectApiService } from '../api/services/project.api.service';
import { ProjectsModel } from '../models/domain/projects.model';

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
    })
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
