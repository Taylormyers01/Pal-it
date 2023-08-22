import { IPaint, NewPaint } from './paint.model';

export const sampleWithRequiredData: IPaint = {
  id: 84495,
};

export const sampleWithPartialData: IPaint = {
  id: 13691,
  brand: 'Cotton Bike',
  paintName: 'Home Director',
};

export const sampleWithFullData: IPaint = {
  id: 17954,
  brand: 'payment hacking',
  paintName: 'application Customer-focused',
};

export const sampleWithNewData: NewPaint = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
