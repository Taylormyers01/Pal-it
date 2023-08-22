import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFormula } from '../formula.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../formula.test-samples';

import { FormulaService } from './formula.service';

const requireRestSample: IFormula = {
  ...sampleWithRequiredData,
};

describe('Formula Service', () => {
  let service: FormulaService;
  let httpMock: HttpTestingController;
  let expectedResult: IFormula | IFormula[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FormulaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Formula', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const formula = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(formula).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Formula', () => {
      const formula = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(formula).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Formula', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Formula', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Formula', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFormulaToCollectionIfMissing', () => {
      it('should add a Formula to an empty array', () => {
        const formula: IFormula = sampleWithRequiredData;
        expectedResult = service.addFormulaToCollectionIfMissing([], formula);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formula);
      });

      it('should not add a Formula to an array that contains it', () => {
        const formula: IFormula = sampleWithRequiredData;
        const formulaCollection: IFormula[] = [
          {
            ...formula,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFormulaToCollectionIfMissing(formulaCollection, formula);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Formula to an array that doesn't contain it", () => {
        const formula: IFormula = sampleWithRequiredData;
        const formulaCollection: IFormula[] = [sampleWithPartialData];
        expectedResult = service.addFormulaToCollectionIfMissing(formulaCollection, formula);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formula);
      });

      it('should add only unique Formula to an array', () => {
        const formulaArray: IFormula[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const formulaCollection: IFormula[] = [sampleWithRequiredData];
        expectedResult = service.addFormulaToCollectionIfMissing(formulaCollection, ...formulaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const formula: IFormula = sampleWithRequiredData;
        const formula2: IFormula = sampleWithPartialData;
        expectedResult = service.addFormulaToCollectionIfMissing([], formula, formula2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(formula);
        expect(expectedResult).toContain(formula2);
      });

      it('should accept null and undefined values', () => {
        const formula: IFormula = sampleWithRequiredData;
        expectedResult = service.addFormulaToCollectionIfMissing([], null, formula, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(formula);
      });

      it('should return initial array if no Formula is added', () => {
        const formulaCollection: IFormula[] = [sampleWithRequiredData];
        expectedResult = service.addFormulaToCollectionIfMissing(formulaCollection, undefined, null);
        expect(expectedResult).toEqual(formulaCollection);
      });
    });

    describe('compareFormula', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFormula(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFormula(entity1, entity2);
        const compareResult2 = service.compareFormula(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFormula(entity1, entity2);
        const compareResult2 = service.compareFormula(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFormula(entity1, entity2);
        const compareResult2 = service.compareFormula(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
