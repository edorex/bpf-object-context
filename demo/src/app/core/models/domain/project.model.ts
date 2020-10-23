import { ProjectApiModel } from '../../api/model/project.api.model';

export class ProjectModel {
  name: string;
  value: number;

  public static from(apiModel: ProjectApiModel): ProjectModel {
    if (apiModel) {
      const model = new ProjectModel();
      model.name = apiModel.name;
      model.value = apiModel.value;
      return model;
    }
    return null;
  }

}
