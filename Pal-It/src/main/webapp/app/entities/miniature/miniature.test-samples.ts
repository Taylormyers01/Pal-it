import { IMiniature, NewMiniature } from './miniature.model';

export const sampleWithRequiredData: IMiniature = {
  id: 5852,
};

export const sampleWithPartialData: IMiniature = {
  id: 65541,
  miniatureName: 'client-server Money quantify',
};

export const sampleWithFullData: IMiniature = {
  id: 74926,
  miniatureName: 'compressing',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithNewData: NewMiniature = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
