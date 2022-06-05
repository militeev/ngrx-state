import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';

export interface Record {
  id: number;
  project?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListService {
  constructor() {}

  getData(
    project: string | undefined,
    startFrom: number,
    pageSize: number
  ): Observable<Record[]> {
    const result: Record[] = [];
    for (let i = startFrom; i < startFrom + pageSize; i++) {
      result.push({id: i, project});
    }
    return of(result).pipe(delay(pageSize * 100));
  }
}
