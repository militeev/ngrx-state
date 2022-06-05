import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {Observable} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {ListService, Record} from '../list.service';

export interface ListPageState {
  isLoading: boolean;
  records?: Record[];
}

@Injectable()
export class ListPageStore extends ComponentStore<ListPageState> {
  constructor(private readonly listService: ListService) {
    super({isLoading: false, records: []});
  }

  readonly records$ = this.select(state => state.records);

  readonly isLoading$ = this.select(state => state.isLoading);

  readonly setRecords = this.updater((state, records: Record[]) => ({
    isLoading: false,
    records,
  }));

  readonly setIsLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading,
  }));

  readonly getRecords = this.effect(
    (
      origin$: Observable<{
        project?: string;
        pageStartFrom: number;
        pageSize: number;
      }>
    ) => {
      return origin$.pipe(
        tap(() => {
          this.setIsLoading(true);
        }),
        switchMap(params =>
          this.listService
            .getData(params.project, params.pageStartFrom, params.pageSize)
            .pipe(
              tap(data => {
                console.log(data);
              }),
              tapResponse(
                records => this.setRecords(records),
                error => console.error(error)
              )
            )
        )
      );
    }
  );
}
