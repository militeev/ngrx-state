import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {delay} from 'rxjs/operators';

export interface Item {
  id: number;
  project?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private getDataCounter = 1;

  constructor() {}

  getData(
    project: string | undefined,
    startFrom: number,
    pageSize: number
  ): Observable<Item[]> {
    console.log(`getData(${project}, ${startFrom}, ${pageSize})`);
    const result: Item[] = [];
    if (this.getDataCounter++ % 3 === 0)
      return throwError('sad face :(').pipe(delay(300));
    for (let i = startFrom; i < startFrom + pageSize; i++) {
      result.push({id: i, project});
    }
    return of(result).pipe(delay(pageSize * 100));
  }

  getChildData(id: number): Observable<string> {
    return of(`Child data for item ${id}`).pipe(delay(1000));
  }
}
