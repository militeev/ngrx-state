import {Component, OnInit} from '@angular/core';
import {selectAppQueryParams} from '../router-selectors';
import {Store} from '@ngrx/store';
import {AppState} from '../app.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  selectAppQueryParams$ = this.store.select(selectAppQueryParams);

  constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {}
}
