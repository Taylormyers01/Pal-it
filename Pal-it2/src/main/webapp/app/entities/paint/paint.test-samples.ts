import { IPaint, NewPaint } from './paint.model';

export const sampleWithRequiredData: IPaint = {
  id: 84495,
  brand: 'Liaison Cotton Bike',
  paintName: 'Home Director',
};

export const sampleWithPartialData: IPaint = {
  id: 17954,
  brand: 'payment hacking',
  paintName: 'application Customer-focused',
};

export const sampleWithFullData: IPaint = {
  id: 79993,
  brand: 'connect',
  paintName: 'morph capacitor encoding',
};

export const sampleWithNewData: NewPaint = {
  brand: 'Handcrafted card uniform',
  paintName: 'Taka Clothing robust',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
