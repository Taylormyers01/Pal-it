import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { IFormula } from 'app/entities/formula/formula.model';
import { IMiniature } from 'app/entities/miniature/miniature.model';

export interface IPaint {
  id: number;
  brand?: string | null;
  paintName?: string | null;
  picture?: string | null;
  pictureContentType?: string | null;
  users?: Pick<IApplicationUser, 'id' | 'applicationUserName'>[] | null;
  formulas?: Pick<IFormula, 'id' | 'formulaName'>[] | null;
  minautures?: Pick<IMiniature, 'id' | 'miniatureName'>[] | null;
}

export type NewPaint = Omit<IPaint, 'id'> & { id: null };
