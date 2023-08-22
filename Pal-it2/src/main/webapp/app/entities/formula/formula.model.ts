import { IPaint } from 'app/entities/paint/paint.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface IFormula {
  id: number;
  formulaName?: string | null;
  paintFormulas?: Pick<IPaint, 'id' | 'paintName'>[] | null;
  user?: Pick<IApplicationUser, 'id' | 'applicationUserName'> | null;
}

export type NewFormula = Omit<IFormula, 'id'> & { id: null };
