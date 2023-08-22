import { IUser } from 'app/entities/user/user.model';
import { IPaint } from 'app/entities/paint/paint.model';

export interface IApplicationUser {
  id: number;
  internalUser?: Pick<IUser, 'id'> | null;
  ownedPaints?: Pick<IPaint, 'id'>[] | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
