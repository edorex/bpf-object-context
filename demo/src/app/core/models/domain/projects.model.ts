import { ProjectApiModel } from '../../api/model/project.api.model';
import { ProjectModel } from './project.model';

export class ProjectsModel {
  projects: ProjectModel[];

  public static from(apiModels: ProjectApiModel[]): ProjectsModel {
    if (apiModels) {
      const model = new ProjectsModel();
      model.projects = [];
      for (let apiModel of apiModels) {
        model.projects.push(ProjectModel.from(apiModel));
      }
      return model;
    }
    return null;
  }
}
