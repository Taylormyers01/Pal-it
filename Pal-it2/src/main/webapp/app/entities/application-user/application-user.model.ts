import { IUser } from 'app/entities/user/user.model';
import { IPaint } from 'app/entities/paint/paint.model';

export interface IApplicationUser {
  id: number;
  applicationUserName?: string | null;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
  ownedPaints?: Pick<IPaint, 'id' | 'paintName'>[] | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
