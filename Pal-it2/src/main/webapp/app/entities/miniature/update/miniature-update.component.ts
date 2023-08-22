import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MiniatureFormService, MiniatureFormGroup } from './miniature-form.service';
import { IMiniature } from '../miniature.model';
import { MiniatureService } from '../service/miniature.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IPaint } from 'app/entities/paint/paint.model';
import { PaintService } from 'app/entities/paint/service/paint.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';

@Component({
  selector: 'jhi-miniature-update',
  templateUrl: './miniature-update.component.html',
})
export class MiniatureUpdateComponent implements OnInit {
  isSaving = false;
  miniature: IMiniature | null = null;

  paintsSharedCollection: IPaint[] = [];
  applicationUsersSharedCollection: IApplicationUser[] = [];

  editForm: MiniatureFormGroup = this.miniatureFormService.createMiniatureFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected miniatureService: MiniatureService,
    protected miniatureFormService: MiniatureFormService,
    protected paintService: PaintService,
    protected applicationUserService: ApplicationUserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePaint = (o1: IPaint | null, o2: IPaint | null): boolean => this.paintService.comparePaint(o1, o2);

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ miniature }) => {
      this.miniature = miniature;
      if (miniature) {
        this.updateForm(miniature);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('palItApp.error', { ...err, key: 'error.file.' + err.key })),
    });
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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const miniature = this.miniatureFormService.getMiniature(this.editForm);
    if (miniature.id !== null) {
      this.subscribeToSaveResponse(this.miniatureService.update(miniature));
    } else {
      this.subscribeToSaveResponse(this.miniatureService.create(miniature));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMiniature>>): void {
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

  protected updateForm(miniature: IMiniature): void {
    this.miniature = miniature;
    this.miniatureFormService.resetForm(this.editForm, miniature);

    this.paintsSharedCollection = this.paintService.addPaintToCollectionIfMissing<IPaint>(
      this.paintsSharedCollection,
      ...(miniature.miniatureFormulas ?? [])
    );
    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      miniature.user
    );
  }

  protected loadRelationshipsOptions(): void {
    this.paintService
      .query()
      .pipe(map((res: HttpResponse<IPaint[]>) => res.body ?? []))
      .pipe(
        map((paints: IPaint[]) =>
          this.paintService.addPaintToCollectionIfMissing<IPaint>(paints, ...(this.miniature?.miniatureFormulas ?? []))
        )
      )
      .subscribe((paints: IPaint[]) => (this.paintsSharedCollection = paints));

    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(applicationUsers, this.miniature?.user)
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));
  }
}
