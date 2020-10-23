import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectContextName } from './context/object-context-name.class';
import { ContextService } from './context/context.service';
import { ObjectContext } from './context/object-context.class';
import { ProjectModel } from './models/domain/project.model';
import { ApiModule } from './api/api.module';

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
