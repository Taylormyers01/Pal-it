import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPaint, NewPaint } from '../paint.model';

export type PartialUpdatePaint = Partial<IPaint> & Pick<IPaint, 'id'>;

export type EntityResponseType = HttpResponse<IPaint>;
export type EntityArrayResponseType = HttpResponse<IPaint[]>;

@Injectable({ providedIn: 'root' })
export class PaintService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/paints');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(paint: NewPaint): Observable<EntityResponseType> {
    return this.http.post<IPaint>(this.resourceUrl, paint, { observe: 'response' });
  }

  update(paint: IPaint): Observable<EntityResponseType> {
    return this.http.put<IPaint>(`${this.resourceUrl}/${this.getPaintIdentifier(paint)}`, paint, { observe: 'response' });
  }

  partialUpdate(paint: PartialUpdatePaint): Observable<EntityResponseType> {
    return this.http.patch<IPaint>(`${this.resourceUrl}/${this.getPaintIdentifier(paint)}`, paint, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPaint>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPaint[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPaintIdentifier(paint: Pick<IPaint, 'id'>): number {
    return paint.id;
  }

  comparePaint(o1: Pick<IPaint, 'id'> | null, o2: Pick<IPaint, 'id'> | null): boolean {
    return o1 && o2 ? this.getPaintIdentifier(o1) === this.getPaintIdentifier(o2) : o1 === o2;
  }

  addPaintToCollectionIfMissing<Type extends Pick<IPaint, 'id'>>(
    paintCollection: Type[],
    ...paintsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const paints: Type[] = paintsToCheck.filter(isPresent);
    if (paints.length > 0) {
      const paintCollectionIdentifiers = paintCollection.map(paintItem => this.getPaintIdentifier(paintItem)!);
      const paintsToAdd = paints.filter(paintItem => {
        const paintIdentifier = this.getPaintIdentifier(paintItem);
        if (paintCollectionIdentifiers.includes(paintIdentifier)) {
          return false;
        }
        paintCollectionIdentifiers.push(paintIdentifier);
        return true;
      });
      return [...paintsToAdd, ...paintCollection];
    }
    return paintCollection;
  }
}
