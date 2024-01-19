import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMiniature, NewMiniature } from '../miniature.model';

export type PartialUpdateMiniature = Partial<IMiniature> & Pick<IMiniature, 'id'>;

export type EntityResponseType = HttpResponse<IMiniature>;
export type EntityArrayResponseType = HttpResponse<IMiniature[]>;

@Injectable({ providedIn: 'root' })
export class MiniatureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/miniatures');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(miniature: NewMiniature): Observable<EntityResponseType> {
    return this.http.post<IMiniature>(this.resourceUrl, miniature, { observe: 'response' });
  }

  update(miniature: IMiniature): Observable<EntityResponseType> {
    return this.http.put<IMiniature>(`${this.resourceUrl}/${this.getMiniatureIdentifier(miniature)}`, miniature, { observe: 'response' });
  }

  partialUpdate(miniature: PartialUpdateMiniature): Observable<EntityResponseType> {
    return this.http.patch<IMiniature>(`${this.resourceUrl}/${this.getMiniatureIdentifier(miniature)}`, miniature, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMiniature>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMiniature[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMiniatureIdentifier(miniature: Pick<IMiniature, 'id'>): number {
    return miniature.id;
  }

  compareMiniature(o1: Pick<IMiniature, 'id'> | null, o2: Pick<IMiniature, 'id'> | null): boolean {
    return o1 && o2 ? this.getMiniatureIdentifier(o1) === this.getMiniatureIdentifier(o2) : o1 === o2;
  }

  addMiniatureToCollectionIfMissing<Type extends Pick<IMiniature, 'id'>>(
    miniatureCollection: Type[],
    ...miniaturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const miniatures: Type[] = miniaturesToCheck.filter(isPresent);
    if (miniatures.length > 0) {
      const miniatureCollectionIdentifiers = miniatureCollection.map(miniatureItem => this.getMiniatureIdentifier(miniatureItem)!);
      const miniaturesToAdd = miniatures.filter(miniatureItem => {
        const miniatureIdentifier = this.getMiniatureIdentifier(miniatureItem);
        if (miniatureCollectionIdentifiers.includes(miniatureIdentifier)) {
          return false;
        }
        miniatureCollectionIdentifiers.push(miniatureIdentifier);
        return true;
      });
      return [...miniaturesToAdd, ...miniatureCollection];
    }
    return miniatureCollection;
  }

  findAllByUserId(id: number):Observable<EntityArrayResponseType>{
    return this.http.get<IMiniature[]>(`${this.resourceUrl}/user/${id}`, {  observe: 'response' });
  }
}
