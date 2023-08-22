import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PaintFormService, PaintFormGroup } from './paint-form.service';
import { IPaint } from '../paint.model';
import { PaintService } from '../service/paint.service';

@Component({
  selector: 'jhi-paint-update',
  templateUrl: './paint-update.component.html',
})
export class PaintUpdateComponent implements OnInit {
  isSaving = false;
  paint: IPaint | null = null;

  editForm: PaintFormGroup = this.paintFormService.createPaintFormGroup();

  constructor(
    protected paintService: PaintService,
    protected paintFormService: PaintFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paint }) => {
      this.paint = paint;
      if (paint) {
        this.updateForm(paint);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paint = this.paintFormService.getPaint(this.editForm);
    if (paint.id !== null) {
      this.subscribeToSaveResponse(this.paintService.update(paint));
    } else {
      this.subscribeToSaveResponse(this.paintService.create(paint));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPaint>>): void {
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

  protected updateForm(paint: IPaint): void {
    this.paint = paint;
    this.paintFormService.resetForm(this.editForm, paint);
  }
}
