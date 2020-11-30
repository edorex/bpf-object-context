import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectModel } from './models/domain/project.model';
import { ApiModule } from './api/api.module';
import { ContextService, ObjectContext } from 'object-context';
import { ObjectContextName } from './object-context-name.class';

@NgModule({
  declarations: [],
  imports: [
    ApiModule,
    CommonModule
  ],
  providers: [
    {
      provide: ObjectContextName.projectCtx,
      useFactory: (ctxService: ContextService) => new ObjectContext<ProjectModel>(ctxService),
      deps: [ContextService],
    },
  ]
})
export class CoreModule { }
