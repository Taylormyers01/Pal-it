import { IMiniature, NewMiniature } from './miniature.model';

export const sampleWithRequiredData: IMiniature = {
  id: 5852,
  miniatureName: 'Profound client-server Money',
};

export const sampleWithPartialData: IMiniature = {
  id: 58579,
  miniatureName: 'up moratorium workforce',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithFullData: IMiniature = {
  id: 64252,
  miniatureName: 'Rubber innovate withdrawal',
  picture: '../fake-data/blob/hipster.png',
  pictureContentType: 'unknown',
};

export const sampleWithNewData: NewMiniature = {
  miniatureName: 'front-end platforms South',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
