import {Component, ElementRef, OnInit} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PaintFormService, PaintFormGroup } from './paint-form.service';
import { IPaint } from '../paint.model';
import { PaintService } from '../service/paint.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import {EventWithContent, EventManager} from "../../../core/util/event-manager.service";
import {AlertError} from "../../../shared/alert/alert-error.model";

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
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: DataUtils,
    protected elementRef: ElementRef,
    protected eventManager: EventManager,

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


  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }
  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('palItApp.error', { ...err, key: 'error.file.' + err.key })),
    });
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
