import { IPaint } from 'app/entities/paint/paint.model';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';

export interface IMiniature {
  id: number;
  miniatureName?: string | null;
  picture?: string | null;
  pictureContentType?: string | null;
  miniatureFormulas?: Pick<IPaint, 'id' | 'paintName'>[] | null;
  user?: Pick<IApplicationUser, 'id' | 'applicationUserName'> | null;
}

export type NewMiniature = Omit<IMiniature, 'id'> & { id: null };
