import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from './core/services/project.service';
import { ProjectsModel } from './core/models/domain/projects.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ObjectState } from './core/context/object-state.class';
import { State } from './core/context/state.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  title = 'bpf-object-context';
  projects: ProjectsModel;
  state: ObjectState<ProjectsModel>;
  State = State;

  constructor(private projectService: ProjectService) {

  }

  ngOnInit(): void {
    this.ensureProjects();
  }

  public ensureProjects(force: boolean = false) {
    this.projectService.ensureProjects$(force).pipe(
      takeUntil(this.destroy$)
    ).subscribe((state: ObjectState<ProjectsModel>) => {
      console.log('State', state);
      this.state = state;

      if (state.isLoaded) {
        this.projects = state.object;
        console.log('Projects', this.projects);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateProjects() {
    this.projectService.updateProjects$().pipe(
      takeUntil(this.destroy$)
    ).subscribe((state: ObjectState<ProjectsModel>) => {
      console.log('State', state);
      this.state = state;

      if (state.isLoaded) {
        this.projects = state.object;
        console.log('Projects', this.projects);
      }
    });
  }
}
