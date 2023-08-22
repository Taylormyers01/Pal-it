import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../miniature.test-samples';

import { MiniatureFormService } from './miniature-form.service';

describe('Miniature Form Service', () => {
  let service: MiniatureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiniatureFormService);
  });

  describe('Service methods', () => {
    describe('createMiniatureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMiniatureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            miniatureName: expect.any(Object),
            picture: expect.any(Object),
            miniatureFormulas: expect.any(Object),
            applicationUser: expect.any(Object),
          })
        );
      });

      it('passing IMiniature should create a new form with FormGroup', () => {
        const formGroup = service.createMiniatureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            miniatureName: expect.any(Object),
            picture: expect.any(Object),
            miniatureFormulas: expect.any(Object),
            applicationUser: expect.any(Object),
          })
        );
      });
    });

    describe('getMiniature', () => {
      it('should return NewMiniature for default Miniature initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMiniatureFormGroup(sampleWithNewData);

        const miniature = service.getMiniature(formGroup) as any;

        expect(miniature).toMatchObject(sampleWithNewData);
      });

      it('should return NewMiniature for empty Miniature initial value', () => {
        const formGroup = service.createMiniatureFormGroup();

        const miniature = service.getMiniature(formGroup) as any;

        expect(miniature).toMatchObject({});
      });

      it('should return IMiniature', () => {
        const formGroup = service.createMiniatureFormGroup(sampleWithRequiredData);

        const miniature = service.getMiniature(formGroup) as any;

        expect(miniature).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMiniature should not enable id FormControl', () => {
        const formGroup = service.createMiniatureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMiniature should disable id FormControl', () => {
        const formGroup = service.createMiniatureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
