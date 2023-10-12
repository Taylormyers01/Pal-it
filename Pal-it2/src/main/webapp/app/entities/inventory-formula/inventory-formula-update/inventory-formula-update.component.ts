import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { InventoryFormulaFormService, FormulaFormGroup } from './inventory-formula-form.service';
import { IFormula} from "../../formula/formula.model";
import { FormulaService} from "../../formula/service/formula.service";
import { IPaint } from 'app/entities/paint/paint.model';
import { PaintService } from 'app/entities/paint/service/paint.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import {AccountService} from "../../../core/auth/account.service";
import {Account} from "../../../core/auth/account.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'jhi-formula-update',
  templateUrl: './inventory-formula-update.component.html',
})
export class InventoryFormulaUpdateComponent implements OnInit {
  isSaving = false;
  formula: IFormula | null = null;
  paintForm = new FormControl('');
  account: Account | null = null;
  paintsSharedCollection: IPaint[] = [];
  // applicationUsersSharedCollection: IApplicationUser[] = [];
  applicationUsersSharedCollection: IApplicationUser | null = null;
  editForm: FormulaFormGroup = this.formulaFormService.createFormulaFormGroup();

  constructor(
    protected formulaService: FormulaService,
    protected formulaFormService: InventoryFormulaFormService,
    protected paintService: PaintService,
    protected applicationUserService: ApplicationUserService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
  ) {

  }

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
    console.log(formula);
    formula.user = this.applicationUsersSharedCollection;
    if (formula.id !== null) {
      this.subscribeToSaveResponse(this.formulaService.update(formula));
    } else {
      this.subscribeToSaveResponse(this.formulaService.create(formula));
    }
  }
  onChange(paintId: number):void {
    let paintFormula = this.editForm.value.paintFormulas as IPaint[];
    console.log(paintFormula);
    const paint = this.applicationUsersSharedCollection?.ownedPaints?.filter(ownedPaint => ownedPaint.id===paintId)[0] as IPaint;
    if(!this.valueContained(paintId)) {
      console.log(`adding paint ${paintId}`);
      paintFormula.push(paint);
    }else{
      console.log('removing paint');
      paintFormula = paintFormula.filter(ownedPaint => ownedPaint.id !== paintId);

    }
    this.editForm.patchValue({paintFormulas: paintFormula});
    console.log(this.editForm.value.paintFormulas);
  }
  valueContained(paintOption: number):boolean {
    if(this.editForm.value.paintFormulas) {
      if (this.editForm.value.paintFormulas.filter(item => item.id === paintOption).length > 0) {
        return true;
      }
    }
    return false;
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
  }

  protected loadRelationshipsOptions(): void {
    this.accountService
      .getAuthenticationState()
      .subscribe(account => (this.account = account));
    if(this.account?.email){
      this.applicationUserService.findUserWithFormulas(this.account.email).subscribe(data => this.applicationUsersSharedCollection = (data.body));
      if(this.applicationUsersSharedCollection?.ownedPaints) {
        this.paintsSharedCollection = this.applicationUsersSharedCollection.ownedPaints;
      }
    }
  }

  protected readonly self = self;


  protected readonly length = length;


}
