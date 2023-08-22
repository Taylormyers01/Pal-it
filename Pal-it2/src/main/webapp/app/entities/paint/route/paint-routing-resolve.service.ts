import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPaint } from '../paint.model';
import { PaintService } from '../service/paint.service';

@Injectable({ providedIn: 'root' })
export class PaintRoutingResolveService implements Resolve<IPaint | null> {
  constructor(protected service: PaintService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPaint | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((paint: HttpResponse<IPaint>) => {
          if (paint.body) {
            return of(paint.body);
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
