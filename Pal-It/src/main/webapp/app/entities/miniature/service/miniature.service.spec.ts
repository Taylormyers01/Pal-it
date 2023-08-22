import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMiniature } from '../miniature.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../miniature.test-samples';

import { MiniatureService } from './miniature.service';

const requireRestSample: IMiniature = {
  ...sampleWithRequiredData,
};

describe('Miniature Service', () => {
  let service: MiniatureService;
  let httpMock: HttpTestingController;
  let expectedResult: IMiniature | IMiniature[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MiniatureService);
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

    it('should create a Miniature', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const miniature = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(miniature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Miniature', () => {
      const miniature = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(miniature).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Miniature', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Miniature', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Miniature', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMiniatureToCollectionIfMissing', () => {
      it('should add a Miniature to an empty array', () => {
        const miniature: IMiniature = sampleWithRequiredData;
        expectedResult = service.addMiniatureToCollectionIfMissing([], miniature);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(miniature);
      });

      it('should not add a Miniature to an array that contains it', () => {
        const miniature: IMiniature = sampleWithRequiredData;
        const miniatureCollection: IMiniature[] = [
          {
            ...miniature,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMiniatureToCollectionIfMissing(miniatureCollection, miniature);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Miniature to an array that doesn't contain it", () => {
        const miniature: IMiniature = sampleWithRequiredData;
        const miniatureCollection: IMiniature[] = [sampleWithPartialData];
        expectedResult = service.addMiniatureToCollectionIfMissing(miniatureCollection, miniature);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(miniature);
      });

      it('should add only unique Miniature to an array', () => {
        const miniatureArray: IMiniature[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const miniatureCollection: IMiniature[] = [sampleWithRequiredData];
        expectedResult = service.addMiniatureToCollectionIfMissing(miniatureCollection, ...miniatureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const miniature: IMiniature = sampleWithRequiredData;
        const miniature2: IMiniature = sampleWithPartialData;
        expectedResult = service.addMiniatureToCollectionIfMissing([], miniature, miniature2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(miniature);
        expect(expectedResult).toContain(miniature2);
      });

      it('should accept null and undefined values', () => {
        const miniature: IMiniature = sampleWithRequiredData;
        expectedResult = service.addMiniatureToCollectionIfMissing([], null, miniature, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(miniature);
      });

      it('should return initial array if no Miniature is added', () => {
        const miniatureCollection: IMiniature[] = [sampleWithRequiredData];
        expectedResult = service.addMiniatureToCollectionIfMissing(miniatureCollection, undefined, null);
        expect(expectedResult).toEqual(miniatureCollection);
      });
    });

    describe('compareMiniature', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMiniature(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMiniature(entity1, entity2);
        const compareResult2 = service.compareMiniature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMiniature(entity1, entity2);
        const compareResult2 = service.compareMiniature(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMiniature(entity1, entity2);
        const compareResult2 = service.compareMiniature(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
