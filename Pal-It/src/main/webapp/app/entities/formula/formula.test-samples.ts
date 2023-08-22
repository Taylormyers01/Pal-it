import { IFormula, NewFormula } from './formula.model';

export const sampleWithRequiredData: IFormula = {
  id: 82237,
};

export const sampleWithPartialData: IFormula = {
  id: 99521,
  formulaName: 'hack Generic',
};

export const sampleWithFullData: IFormula = {
  id: 65277,
  formulaName: 'Handmade Fall Estates',
};

export const sampleWithNewData: NewFormula = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
