import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { FormulaFormService, FormulaFormGroup } from './formula-form.service';
import { IFormula } from '../formula.model';
import { FormulaService } from '../service/formula.service';
import { IPaint } from 'app/entities/paint/paint.model';
import { PaintService } from 'app/entities/paint/service/paint.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

@Component({
  selector: 'jhi-formula-update',
  templateUrl: './formula-update.component.html',
})
export class FormulaUpdateComponent implements OnInit {
  isSaving = false;
  formula: IFormula | null = null;

  paintsSharedCollection: IPaint[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];

  editForm: FormulaFormGroup = this.formulaFormService.createFormulaFormGroup();

  constructor(
    protected formulaService: FormulaService,
    protected formulaFormService: FormulaFormService,
    protected paintService: PaintService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePaint = (o1: IPaint | null, o2: IPaint | null): boolean => this.paintService.comparePaint(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formula }) => {
      this.formula = formula;
      if (formula) {
        this.updateForm(formula);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formula = this.formulaFormService.getFormula(this.editForm);
    if (formula.id !== null) {
      this.subscribeToSaveResponse(this.formulaService.update(formula));
    } else {
      this.subscribeToSaveResponse(this.formulaService.create(formula));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormula>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(formula: IFormula): void {
    this.formula = formula;
    this.formulaFormService.resetForm(this.editForm, formula);

    this.paintsSharedCollection = this.paintService.addPaintToCollectionIfMissing<IPaint>(
      this.paintsSharedCollection,
      ...(formula.paintFormulas ?? [])
    );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      formula.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.paintService
      .query()
      .pipe(map((res: HttpResponse<IPaint[]>) => res.body ?? []))
      .pipe(
        map((paints: IPaint[]) => this.paintService.addPaintToCollectionIfMissing<IPaint>(paints, ...(this.formula?.paintFormulas ?? [])))
      )
      .subscribe((paints: IPaint[]) => (this.paintsSharedCollection = paints));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(applicationUsers, this.formula?.user)
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));
  }
}
