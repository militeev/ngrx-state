import {Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {Observable, of} from 'rxjs';
import {
  debounceTime,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {ListService, Item} from '../list.service';

export interface ItemData {
  isExpanded: boolean;
  isLoading: boolean;
  childData?: string;
}

const EMPTY_ITEM_DATA: ItemData = {
  isExpanded: false,
  isLoading: false,
};

export interface ListPageState {
  isLoading: boolean;
  errorMessage?: string;
  items?: Item[];
  itemDataById: Record<number, ItemData>;
}

@Injectable()
export class ListPageStore extends ComponentStore<ListPageState> {
  constructor(private readonly listService: ListService) {
    super({isLoading: false, items: [], itemDataById: {}});
  }

  readonly items$ = this.select(state => state.items);

  readonly isLoading$ = this.select(state => state.isLoading);

  readonly errorMessage$ = this.select(state => state.errorMessage);

  readonly itemDataById$ = this.select(state => state.itemDataById);

  getItemData$(id: number): Observable<ItemData> {
    return this.select(state => state.itemDataById).pipe(
      map(itemDataById => itemDataById[id] || EMPTY_ITEM_DATA)
    );
  }

  readonly setItems = this.updater((state, records: Item[]) => ({
    ...state,
    isLoading: false,
    errorMessage: undefined,
    items: records,
  }));

  readonly setIsLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    errorMessage: undefined,
    isLoading,
  }));

  readonly setErrorMessage = this.updater((state, errorMessage: string) => ({
    ...state,
    isLoading: false,
    items: [],
    errorMessage,
  }));

  readonly updateItemData = this.updater(
    (state, value: {id: number; itemData: Partial<ItemData>}) => ({
      ...state,
      itemDataById: {
        ...state.itemDataById,
        [value.id]: {
          ...state.itemDataById[value.id],
          ...value.itemData,
        },
      },
    })
  );

  readonly getItems = this.effect(
    (
      origin$: Observable<{
        project?: string;
        pageStartFrom: number;
        pageSize: number;
      }>
    ) =>
      origin$.pipe(
        debounceTime(0),
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
                items => this.setItems(items),
                error => this.setErrorMessage(error as string)
              )
            )
        )
      )
  );

  readonly getChildData = this.effect((id$: Observable<number>) => {
    return id$.pipe(
      withLatestFrom(this.itemDataById$),
      tap(([id]) => {
        this.updateItemData({
          id,
          itemData: {isExpanded: true, isLoading: true},
        });
      }),
      // mergeMap since we want to concurrently fetch the data for multiple items
      mergeMap(([id, itemDataById]) =>
        (itemDataById[id]?.childData
          ? of(itemDataById[id]?.childData)
          : this.listService.getChildData(id)
        ).pipe(
          tapResponse(
            childData =>
              this.updateItemData({
                id,
                itemData: {isLoading: false, childData},
              }),
            error => console.log(error)
          )
        )
      )
    );
  });
}
