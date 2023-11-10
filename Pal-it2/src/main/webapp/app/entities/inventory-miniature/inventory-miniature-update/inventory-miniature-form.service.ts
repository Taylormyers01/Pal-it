import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMiniature, NewMiniature} from "../../miniature/miniature.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMiniature for edit and NewMiniatureFormGroupInput for create.
 */
type MiniatureFormGroupInput = IMiniature | PartialWithRequiredKeyOf<NewMiniature>;

type MiniatureFormDefaults = Pick<NewMiniature, 'id' | 'miniatureFormulas'>;

type MiniatureFormGroupContent = {
  id: FormControl<IMiniature['id'] | NewMiniature['id']>;
  miniatureName: FormControl<IMiniature['miniatureName']>;
  picture: FormControl<IMiniature['picture']>;
  pictureContentType: FormControl<IMiniature['pictureContentType']>;
  miniatureFormulas: FormControl<IMiniature['miniatureFormulas']>;
  user: FormControl<IMiniature['user']>;
  searchText: FormControl;
};

export type MiniatureFormGroup = FormGroup<MiniatureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InventoryMiniatureFormService {
  createMiniatureFormGroup(miniature: MiniatureFormGroupInput = { id: null }): MiniatureFormGroup {
    const miniatureRawValue = {
      ...this.getFormDefaults(),
      ...miniature,
    };
    return new FormGroup<MiniatureFormGroupContent>({
      id: new FormControl(
        { value: miniatureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      miniatureName: new FormControl(miniatureRawValue.miniatureName, {
        validators: [Validators.required],
      }),
      picture: new FormControl(
        {value: miniatureRawValue.picture, disabled: true}
      ),
      pictureContentType: new FormControl(miniatureRawValue.pictureContentType,
        {validators: [Validators.required], nonNullable: true}),
      miniatureFormulas: new FormControl(miniatureRawValue.miniatureFormulas ?? []),
      user: new FormControl(miniatureRawValue.user),
      searchText: new FormControl(''),
    });
  }

  getMiniature(form: MiniatureFormGroup): IMiniature | NewMiniature {
    return form.getRawValue() as IMiniature | NewMiniature;
  }

  resetForm(form: MiniatureFormGroup, miniature: MiniatureFormGroupInput): void {
    const miniatureRawValue = { ...this.getFormDefaults(), ...miniature };
    form.reset(
      {
        ...miniatureRawValue,
        id: { value: miniatureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MiniatureFormDefaults {
    return {
      id: null,
      miniatureFormulas: [],
    };
  }
}
