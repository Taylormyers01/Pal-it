import { IFormula, NewFormula } from './formula.model';

export const sampleWithRequiredData: IFormula = {
  id: 82237,
  formulaName: 'Analyst Fresh',
};

export const sampleWithPartialData: IFormula = {
  id: 64056,
  formulaName: 'invoice transmit silver',
};

export const sampleWithFullData: IFormula = {
  id: 18465,
  formulaName: 'connecting program black',
};

export const sampleWithNewData: NewFormula = {
  formulaName: 'Bouvet transmit',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
