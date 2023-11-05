import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import{ IFormula, NewFormula} from "../../formula/formula.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFormula for edit and NewFormulaFormGroupInput for create.
 */
type FormulaFormGroupInput = IFormula | PartialWithRequiredKeyOf<NewFormula>;

type FormulaFormDefaults = Pick<NewFormula, 'id' | 'paintFormulas'>;

type FormulaFormGroupContent = {
  id: FormControl<IFormula['id'] | NewFormula['id']>;
  formulaName: FormControl<IFormula['formulaName']>;
  paintFormulas: FormControl<IFormula['paintFormulas']>;
  user: FormControl<IFormula['user']>;
  searchText: FormControl;
};

export type FormulaFormGroup = FormGroup<FormulaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InventoryFormulaFormService {
  createFormulaFormGroup(formula: FormulaFormGroupInput = { id: null }): FormulaFormGroup {
    const formulaRawValue = {
      ...this.getFormDefaults(),
      ...formula,
    };
    return new FormGroup<FormulaFormGroupContent>({
      id: new FormControl(
        { value: formulaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      formulaName: new FormControl(formulaRawValue.formulaName, {
        validators: [Validators.required],
      }),
      paintFormulas: new FormControl(formulaRawValue.paintFormulas ?? []),
      user: new FormControl(formulaRawValue.user),
      searchText: new FormControl('')
    });
  }

  getFormula(form: FormulaFormGroup): IFormula | NewFormula {
    return form.getRawValue() as IFormula | NewFormula;
  }

  resetForm(form: FormulaFormGroup, formula: FormulaFormGroupInput): void {
    const formulaRawValue = { ...this.getFormDefaults(), ...formula };
    form.reset(
      {
        ...formulaRawValue,
        id: { value: formulaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FormulaFormDefaults {
    return {
      id: null,
      paintFormulas: [],
    };
  }
}
