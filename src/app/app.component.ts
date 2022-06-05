import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {selectAppQueryParams, selectCurrentRoute} from './router-selectors';

export interface AppState {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ngrx-state';

  routerState$ = this.store
    .select(selectCurrentRoute)
    .pipe(map(state => JSON.stringify(state)));

  appQueryParams$ = this.store
    .select(selectAppQueryParams)
    .pipe(map(value => JSON.stringify(value)));

  constructor(private readonly store: Store<AppState>) {}
}
