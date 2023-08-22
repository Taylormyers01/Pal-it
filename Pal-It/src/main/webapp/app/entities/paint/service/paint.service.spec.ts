import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPaint } from '../paint.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../paint.test-samples';

import { PaintService } from './paint.service';

const requireRestSample: IPaint = {
  ...sampleWithRequiredData,
};

describe('Paint Service', () => {
  let service: PaintService;
  let httpMock: HttpTestingController;
  let expectedResult: IPaint | IPaint[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PaintService);
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

    it('should create a Paint', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const paint = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(paint).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Paint', () => {
      const paint = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(paint).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Paint', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Paint', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Paint', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPaintToCollectionIfMissing', () => {
      it('should add a Paint to an empty array', () => {
        const paint: IPaint = sampleWithRequiredData;
        expectedResult = service.addPaintToCollectionIfMissing([], paint);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paint);
      });

      it('should not add a Paint to an array that contains it', () => {
        const paint: IPaint = sampleWithRequiredData;
        const paintCollection: IPaint[] = [
          {
            ...paint,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPaintToCollectionIfMissing(paintCollection, paint);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Paint to an array that doesn't contain it", () => {
        const paint: IPaint = sampleWithRequiredData;
        const paintCollection: IPaint[] = [sampleWithPartialData];
        expectedResult = service.addPaintToCollectionIfMissing(paintCollection, paint);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paint);
      });

      it('should add only unique Paint to an array', () => {
        const paintArray: IPaint[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const paintCollection: IPaint[] = [sampleWithRequiredData];
        expectedResult = service.addPaintToCollectionIfMissing(paintCollection, ...paintArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paint: IPaint = sampleWithRequiredData;
        const paint2: IPaint = sampleWithPartialData;
        expectedResult = service.addPaintToCollectionIfMissing([], paint, paint2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paint);
        expect(expectedResult).toContain(paint2);
      });

      it('should accept null and undefined values', () => {
        const paint: IPaint = sampleWithRequiredData;
        expectedResult = service.addPaintToCollectionIfMissing([], null, paint, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paint);
      });

      it('should return initial array if no Paint is added', () => {
        const paintCollection: IPaint[] = [sampleWithRequiredData];
        expectedResult = service.addPaintToCollectionIfMissing(paintCollection, undefined, null);
        expect(expectedResult).toEqual(paintCollection);
      });
    });

    describe('comparePaint', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePaint(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePaint(entity1, entity2);
        const compareResult2 = service.comparePaint(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePaint(entity1, entity2);
        const compareResult2 = service.comparePaint(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePaint(entity1, entity2);
        const compareResult2 = service.comparePaint(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
