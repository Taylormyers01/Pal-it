import { IUser } from 'app/entities/user/user.model';
import { IPaint } from 'app/entities/paint/paint.model';
import {IFormula} from "../formula/formula.model";

export interface IApplicationUser {
  id: number;
  applicationUserName?: string | null;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
  ownedPaints?: IPaint[] | null; //Pick<IPaint, 'id' | 'paintName'>
  formulaNames?: IFormula[] | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
