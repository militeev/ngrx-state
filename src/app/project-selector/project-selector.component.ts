import {Component, OnInit} from '@angular/core';
import {NavigationService} from '../navigation.service';
import {PROJECT} from '../query-params';
import {Store} from '@ngrx/store';
import {selectProject} from '../router-selectors';

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss'],
})
export class ProjectSelectorComponent implements OnInit {
  readonly PROJECTS: Record<string, string> = {
    'project-a': 'Project A',
    'project-b': 'Project B',
    'project-c': 'Project C',
  };

  get projectIds() {
    return Object.keys(this.PROJECTS);
  }

  selectedProject$ = this.store.select(selectProject);

  constructor(
    private readonly navigationService: NavigationService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {}

  onChange(event: Event) {
    console.log(event);
    this.navigationService.setQueryParams({
      [PROJECT]: (event!.target as HTMLSelectElement)!.value,
    });
  }
}
