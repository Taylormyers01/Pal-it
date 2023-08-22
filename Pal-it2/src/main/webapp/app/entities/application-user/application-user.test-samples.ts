import { IApplicationUser, NewApplicationUser } from './application-user.model';

export const sampleWithRequiredData: IApplicationUser = {
  id: 60827,
  applicationUserName: 'Creative',
};

export const sampleWithPartialData: IApplicationUser = {
  id: 55912,
  applicationUserName: 'withdrawal',
};

export const sampleWithFullData: IApplicationUser = {
  id: 77799,
  applicationUserName: 'enable optical Electronics',
};

export const sampleWithNewData: NewApplicationUser = {
  applicationUserName: 'multi-byte next-generation eyeballs',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
