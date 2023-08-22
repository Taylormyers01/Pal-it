import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPaint, NewPaint } from '../paint.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPaint for edit and NewPaintFormGroupInput for create.
 */
type PaintFormGroupInput = IPaint | PartialWithRequiredKeyOf<NewPaint>;

type PaintFormDefaults = Pick<NewPaint, 'id' | 'users' | 'formulas' | 'minautures'>;

type PaintFormGroupContent = {
  id: FormControl<IPaint['id'] | NewPaint['id']>;
  brand: FormControl<IPaint['brand']>;
  paintName: FormControl<IPaint['paintName']>;
  users: FormControl<IPaint['users']>;
  formulas: FormControl<IPaint['formulas']>;
  minautures: FormControl<IPaint['minautures']>;
};

export type PaintFormGroup = FormGroup<PaintFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PaintFormService {
  createPaintFormGroup(paint: PaintFormGroupInput = { id: null }): PaintFormGroup {
    const paintRawValue = {
      ...this.getFormDefaults(),
      ...paint,
    };
    return new FormGroup<PaintFormGroupContent>({
      id: new FormControl(
        { value: paintRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      brand: new FormControl(paintRawValue.brand),
      paintName: new FormControl(paintRawValue.paintName),
      users: new FormControl(paintRawValue.users ?? []),
      formulas: new FormControl(paintRawValue.formulas ?? []),
      minautures: new FormControl(paintRawValue.minautures ?? []),
    });
  }

  getPaint(form: PaintFormGroup): IPaint | NewPaint {
    return form.getRawValue() as IPaint | NewPaint;
  }

  resetForm(form: PaintFormGroup, paint: PaintFormGroupInput): void {
    const paintRawValue = { ...this.getFormDefaults(), ...paint };
    form.reset(
      {
        ...paintRawValue,
        id: { value: paintRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PaintFormDefaults {
    return {
      id: null,
      users: [],
      formulas: [],
      minautures: [],
    };
  }
}
