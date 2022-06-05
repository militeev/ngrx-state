import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, Subject} from 'rxjs';
import {AppState} from '../app.component';
import {ListService, Record} from '../list.service';
import {NavigationService} from '../navigation.service';
import {
  selectAppQueryParams,
  selectPageSize,
  selectPageStartFrom,
  selectProject,
} from '../router-selectors';
import {ListPageStore} from './list-page.store';
import {PAGE_SIZE, PAGE_START_FROM} from '../query-params';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss'],
  providers: [ListPageStore],
})
export class ListPageComponent implements OnDestroy {
  selectPageStartFrom$ = this.store.select(selectPageStartFrom);
  selectPageSize$ = this.store.select(selectPageSize);
  selectAppQueryParams$ = this.store.select(selectAppQueryParams);
  selectProject$ = this.store.select(selectProject);

  private readonly destroy$ = new Subject();

  constructor(
    private readonly navigationService: NavigationService,
    private readonly store: Store<AppState>,
    readonly listPageStore: ListPageStore
  ) {
    combineLatest([
      this.selectProject$,
      this.selectPageStartFrom$,
      this.selectPageSize$,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([project, pageStartFrom, pageSize]) => {
        listPageStore.getRecords({
          project,
          pageStartFrom,
          pageSize,
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  updatePageSize(currentSize: number, increment: number) {
    if (currentSize + increment <= 0) return;
    this.navigationService.setQueryParams({
      [PAGE_SIZE]: '' + (currentSize + increment),
    });
  }

  updatePageStartFrom(currentPageStartFrom: number, increment: number) {
    if (currentPageStartFrom + increment < 0) return;
    this.navigationService.setQueryParams({
      [PAGE_START_FROM]: '' + (currentPageStartFrom + increment),
    });
  }
}
