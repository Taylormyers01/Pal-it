import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../paint.test-samples';

import { PaintFormService } from './paint-form.service';

describe('Paint Form Service', () => {
  let service: PaintFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaintFormService);
  });

  describe('Service methods', () => {
    describe('createPaintFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPaintFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            brand: expect.any(Object),
            paintName: expect.any(Object),
            users: expect.any(Object),
            formulas: expect.any(Object),
            minautures: expect.any(Object),
          })
        );
      });

      it('passing IPaint should create a new form with FormGroup', () => {
        const formGroup = service.createPaintFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            brand: expect.any(Object),
            paintName: expect.any(Object),
            users: expect.any(Object),
            formulas: expect.any(Object),
            minautures: expect.any(Object),
          })
        );
      });
    });

    describe('getPaint', () => {
      it('should return NewPaint for default Paint initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPaintFormGroup(sampleWithNewData);

        const paint = service.getPaint(formGroup) as any;

        expect(paint).toMatchObject(sampleWithNewData);
      });

      it('should return NewPaint for empty Paint initial value', () => {
        const formGroup = service.createPaintFormGroup();

        const paint = service.getPaint(formGroup) as any;

        expect(paint).toMatchObject({});
      });

      it('should return IPaint', () => {
        const formGroup = service.createPaintFormGroup(sampleWithRequiredData);

        const paint = service.getPaint(formGroup) as any;

        expect(paint).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPaint should not enable id FormControl', () => {
        const formGroup = service.createPaintFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPaint should disable id FormControl', () => {
        const formGroup = service.createPaintFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
