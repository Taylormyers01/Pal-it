import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFormula, NewFormula } from '../formula.model';

export type PartialUpdateFormula = Partial<IFormula> & Pick<IFormula, 'id'>;

export type EntityResponseType = HttpResponse<IFormula>;
export type EntityArrayResponseType = HttpResponse<IFormula[]>;

@Injectable({ providedIn: 'root' })
export class FormulaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/formulas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(formula: NewFormula): Observable<EntityResponseType> {
    return this.http.post<IFormula>(this.resourceUrl, formula, { observe: 'response' });
  }

  update(formula: IFormula): Observable<EntityResponseType> {
    return this.http.put<IFormula>(`${this.resourceUrl}/${this.getFormulaIdentifier(formula)}`, formula, { observe: 'response' });
  }

  partialUpdate(formula: PartialUpdateFormula): Observable<EntityResponseType> {
    return this.http.patch<IFormula>(`${this.resourceUrl}/${this.getFormulaIdentifier(formula)}`, formula, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFormula>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormula[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFormulaIdentifier(formula: Pick<IFormula, 'id'>): number {
    return formula.id;
  }

  compareFormula(o1: Pick<IFormula, 'id'> | null, o2: Pick<IFormula, 'id'> | null): boolean {
    return o1 && o2 ? this.getFormulaIdentifier(o1) === this.getFormulaIdentifier(o2) : o1 === o2;
  }

  addFormulaToCollectionIfMissing<Type extends Pick<IFormula, 'id'>>(
    formulaCollection: Type[],
    ...formulasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const formulas: Type[] = formulasToCheck.filter(isPresent);
    if (formulas.length > 0) {
      const formulaCollectionIdentifiers = formulaCollection.map(formulaItem => this.getFormulaIdentifier(formulaItem)!);
      const formulasToAdd = formulas.filter(formulaItem => {
        const formulaIdentifier = this.getFormulaIdentifier(formulaItem);
        if (formulaCollectionIdentifiers.includes(formulaIdentifier)) {
          return false;
        }
        formulaCollectionIdentifiers.push(formulaIdentifier);
        return true;
      });
      return [...formulasToAdd, ...formulaCollection];
    }
    return formulaCollection;
  }
}
