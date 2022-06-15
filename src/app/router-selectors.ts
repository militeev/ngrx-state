import {getSelectors, RouterReducerState} from '@ngrx/router-store';
import {createSelector} from '@ngrx/store';
import {
  APP_QUERY_PARAMS,
  PAGE_SIZE,
  PAGE_START_FROM,
  PROJECT,
} from './query-params';
import {Params} from '@angular/router';

export const {
  selectCurrentRoute, // select the current route
  selectFragment, // select the current route fragment
  selectQueryParams, // select the current route query params
  selectQueryParam, // factory function to select a query param
  selectRouteParams, // select the current route params
  selectRouteParam, // factory function to select a route param
  selectRouteData, // select the current route data
  selectUrl, // select the current url
} = getSelectors();

export const selectPageStartFrom = createSelector(
  selectQueryParam(PAGE_START_FROM),
  value => (value ? parseInt(value) : 0)
);

export const selectPageSize = createSelector(
  selectQueryParam(PAGE_SIZE),
  value => (value ? parseInt(value) : 10)
);

export const selectProject = selectQueryParam(PROJECT);

export const selectAppQueryParams = createSelector(
  selectQueryParams,
  queryParams =>
    queryParams
      ? APP_QUERY_PARAMS.reduce(
          (result, param) => ({
            ...result,
            [param]: queryParams[param],
          }),
          {} as Params
        )
      : {}
);
