import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private readonly router: Router) {}

  setQueryParams(queryParams: Record<string, string>) {
    const urlTree = this.router.createUrlTree([], {
      queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
    this.router.navigateByUrl(urlTree);
  }
}
