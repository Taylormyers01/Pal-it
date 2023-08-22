import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormula } from '../formula.model';

@Component({
  selector: 'jhi-formula-detail',
  templateUrl: './formula-detail.component.html',
})
export class FormulaDetailComponent implements OnInit {
  formula: IFormula | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formula }) => {
      this.formula = formula;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
