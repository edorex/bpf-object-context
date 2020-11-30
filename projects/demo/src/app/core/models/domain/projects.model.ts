import { ProjectApiModel } from '../../api/model/project.api.model';
import { ProjectModel } from './project.model';

export class ProjectsModel {
  projects: ProjectModel[] = [];

  public static from(apiModels: ProjectApiModel[]): ProjectsModel {
    const model = new ProjectsModel();
    if (apiModels) {
      model.projects = [];
      for (const apiModel of apiModels) {
        model.projects.push(ProjectModel.from(apiModel));
      }
    }
    return model;
  }
}
