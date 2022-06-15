import {Component, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, Subject} from 'rxjs';
import {AppState} from '../app.component';
import {NavigationService} from '../navigation.service';
import {
  selectAppQueryParams,
  selectPageSize,
  selectPageStartFrom,
  selectProject,
} from '../router-selectors';
import {ItemData, ListPageStore} from './list-page.store';
import {PAGE_SIZE, PAGE_START_FROM} from '../query-params';
import {takeUntil, tap} from 'rxjs/operators';
import {Item} from '../list.service';

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
      .pipe(
        takeUntil(this.destroy$),
        tap(values => {
          console.log(values);
        })
      )
      .subscribe(([project, pageStartFrom, pageSize]) => {
        listPageStore.getItems({
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

  expandItem(id: number) {
    this.listPageStore.getChildData(id);
  }

  collapseItem(id: number) {
    this.listPageStore.updateItemData({id, itemData: {isExpanded: false}});
  }
}
