import { ProjectApiModel } from '../../api/model/project.api.model';

export class ProjectModel {
  name = '';
  value = 0;

  public static from(apiModel: ProjectApiModel): ProjectModel {
    const model = new ProjectModel();
    if (apiModel) {
      model.name = apiModel.name;
      model.value = apiModel.value;
    }
    return model;
  }

}
