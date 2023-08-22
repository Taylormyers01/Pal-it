import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMiniature } from '../miniature.model';
import { MiniatureService } from '../service/miniature.service';

@Injectable({ providedIn: 'root' })
export class MiniatureRoutingResolveService implements Resolve<IMiniature | null> {
  constructor(protected service: MiniatureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMiniature | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((miniature: HttpResponse<IMiniature>) => {
          if (miniature.body) {
            return of(miniature.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
